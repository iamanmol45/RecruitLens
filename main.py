import time
import psutil
import os
import json
import pprint

from src.utils.benchmark import BenchmarkCollector

collector = BenchmarkCollector()

start_time = time.perf_counter()
process = psutil.Process(os.getpid())

print("Starting...")
from src.scoring.rank_candidates import rank_candidates
from src.preprocessing.feature_extractor import extract_features
from src.scoring.candidate_ranker import rank_candidate
from src.scoring.final_ranker import calculate_final_score
from src.scoring.behaviour_score import calculate_behavior_score
from src.ingestion.file_loader import load_jsonl
from src.validation.schema_validator import validate_candidates
from src.reporting.profile_report import generate_profile_report
import json
from src.scoring.copilot.recruiter_copilot import (
    explain_candidate,
    why_selected,
    why_not_selected
)

print("Loading candidates...")

candidates = load_jsonl(
    "data/raw/candidates.jsonl"
)
collector.increment("Candidates Loaded", len(candidates))

print(f"Loaded {len(candidates)} candidates")

# -----------------------
# Schema Validation
# -----------------------

sample_candidates = candidates[:100]

print("Validating candidates...")

collector.start("Schema Validation")
validation_report = validate_candidates(
    sample_candidates,
    "config/candidate_schema.json"
)
collector.stop("Schema Validation")
collector.increment("Schema Valid", validation_report.get("valid_profiles", 0))
collector.increment("Schema Invalid", validation_report.get("invalid_profiles", 0))

print("Validation complete")
print(validation_report)

# -----------------------
# Dataset Profiling
# -----------------------

print("Generating profile report...")

profile_report = generate_profile_report(candidates)

import pprint
pprint.pprint(profile_report)

with open(
    "outputs/profile_report.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        profile_report,
        f,
        indent=4
    )

print("Profile report saved!")
import pprint

# -----------------------
# Single Candidate Test
# -----------------------

print("\nTesting Single Candidate...")

from src.preprocessing.jd_parser import parse_jd
from src.jd_matching.jd_candidate_matcher import match_candidate_to_jd


import os

if os.path.exists("docs/job_description.txt"):
    with open("docs/job_description.txt", "r", encoding="utf-8") as f:
        jd_text = f.read()
else:
    from docx import Document
    doc = Document("docs/job_description.docx")
    jd_text = "\n".join(
        p.text for p in doc.paragraphs
    )

parsed_jd = parse_jd(jd_text)

for i in range(5):

    candidate = candidates[i]

    print(
        f"Candidate: {candidate['profile'].get('anonymized_name')}"
    )

    print(
        f"Role: {candidate['profile'].get('current_title')}"
    )

    features = extract_features(candidate)

    score = rank_candidate(features)

    print("\nCandidate Score:")
    print(score)
    
    match_result = match_candidate_to_jd(candidate, parsed_jd)
    match_score = match_result.get("match_score", 0)
    reasons = match_result.get("reasons", [])
    
    print("\nMatch Score:")
    print(match_score)

    behavior_score = calculate_behavior_score(candidate)
    print("\nBehavior Score:")
    print(behavior_score)

    final_score = calculate_final_score(score, match_score, behavior_score)

    print("\nFinal Score:")
    print(final_score)
    
    print("\nReasons:")
    for r in reasons:
        print(f" - {r}")
        
    print("-" * 30)

print("\nRanking Candidates...")

ranked = rank_candidates(
    candidates,
    jd_text,
    collector
)
collector.increment("Candidates Proceeding to Ranking", len(ranked))

from src.scoring.semantic_matcher import (
    build_candidate_text,
    calculate_similarity,
    model
)

print("\nRunning semantic reranking...\n")

top_100 = ranked[:100]
collector.increment("Top-100 Selected", len(top_100))

raw_candidates = {
    c["candidate_id"]: c
    for c in candidates
}

candidate_texts = []

for candidate in top_100:

    raw_candidate = raw_candidates[
        candidate["candidate_id"]
    ]

    candidate_texts.append(
        build_candidate_text(
            raw_candidate
        )
    )

collector.start("Semantic Embedding Generation")
jd_embedding = model.encode(
    [jd_text]
)

candidate_embeddings = model.encode(
    candidate_texts
)
collector.stop("Semantic Embedding Generation")

collector.start("Cosine Similarity")
for i, candidate in enumerate(top_100):

    similarity = calculate_similarity(
        jd_embedding,
        [candidate_embeddings[i]]
    )

    candidate["semantic_score"] = similarity
    collector.record("Semantic Score", similarity)
collector.stop("Cosine Similarity")
collector.increment("Semantic Re-ranked", len(top_100))

collector.start("Semantic Re-ranking")
for candidate in top_100:
    candidate["final_score"] = (
        candidate["final_score"] * 0.85
        +
        candidate["semantic_score"] * 0.15
    )

ranked.sort(
    key=lambda x: (-round(x["final_score"] / 100, 4), x["candidate_id"])
)
collector.stop("Semantic Re-ranking")

print("\nRunning Honeypot Audit on Top 100...")
from src.scoring.honeypot_detector import detect_honeypot

audit_results = []
suspicious_count = 0
needs_review_count = 0

collector.start("Honeypot Audit")
for candidate in ranked[:100]:
    raw_candidate = raw_candidates[candidate["candidate_id"]]
    honeypot = detect_honeypot(
        raw_candidate,
        candidate["match_score"],
        candidate["skill_gap_score"],
        candidate["risk_level"]
    )
    
    candidate["honeypot"] = honeypot["honeypot"]
    candidate["honeypot_status"] = honeypot["honeypot_status"]
    candidate["honeypot_score"] = honeypot["honeypot_score"]
    candidate["honeypot_reasons"] = honeypot["honeypot_reasons"]
    
    # Stage 1: Penalty
    if honeypot["honeypot_score"] >= 7:
        candidate["final_score"] -= 15
        suspicious_count += 1
        collector.increment("Honeypot Flagged")
    elif honeypot["honeypot_score"] >= 4:
        needs_review_count += 1

collector.increment("Honeypot Audited", 100)

# Stage 2: Re-sort Top 100
ranked.sort(
    key=lambda x: (-round(x["final_score"] / 100, 4), x["candidate_id"])
)
collector.stop("Honeypot Audit")

# Stage 3: Replace candidates if STILL High Risk AND honeypot_score >= 8
collector.start("Dynamic Replacement")
final_top_100 = []
rejected_candidates = []
candidate_pool = ranked.copy()

while len(final_top_100) < 100 and len(candidate_pool) > 0:
    c = candidate_pool.pop(0)
    
    # If the candidate hasn't been audited yet (i.e. they were pulled up from > 100)
    # Give them a quick audit just in case
    if c.get("honeypot_status", "Verified") == "Verified" and c.get("honeypot_score", 0) == 0:
        raw_candidate = raw_candidates[c["candidate_id"]]
        hp = detect_honeypot(
            raw_candidate, c["match_score"], c["skill_gap_score"], c["risk_level"]
        )
        c["honeypot"] = hp["honeypot"]
        c["honeypot_status"] = hp["honeypot_status"]
        c["honeypot_score"] = hp["honeypot_score"]
        c["honeypot_reasons"] = hp["honeypot_reasons"]

    # Replacement Rule
    if c.get("honeypot_score", 0) >= 8 and c.get("risk_level") == "High":
        rejected_candidates.append(c["candidate_id"])
        collector.increment("Candidates Rejected")
        collector.increment("Candidates Replaced")
        continue
        
    final_top_100.append(c)
collector.stop("Dynamic Replacement")

# Save audit results for the final top 100
for c in final_top_100:
    if c.get("honeypot_score", 0) > 0:
        audit_results.append({
            "candidate_id": c["candidate_id"],
            "honeypot_score": c["honeypot_score"],
            "honeypot_status": c["honeypot_status"],
            "reasons": c["honeypot_reasons"]
        })

with open("outputs/top100_audit.json", "w", encoding="utf-8") as f:
    json.dump(audit_results, f, indent=4)

print("\nTOP 100 HONEYPOT AUDIT")
print(f"Needs Review (Score 4-6): {needs_review_count}")
print(f"High Risk / Suspicious (Score 7+): {suspicious_count}")
if rejected_candidates:
    print(f"Automatically Rejected: {len(rejected_candidates)} candidates")

# Ensure ranked list reflects the safe top 100 at the top
ranked = final_top_100 + candidate_pool

for candidate in ranked[:10]:

    print(
        candidate["candidate_id"],
        candidate["semantic_score"]
    )

from src.reporting.submission_generator import generate_submission

print("Total Ranked Candidates:", len(ranked))
print("\nTOP CANDIDATE:\n")
pprint.pprint(ranked[0])

top_id = ranked[0]["candidate_id"]

for c in candidates:
    if c["candidate_id"] == top_id:
        print("\nREDROB SIGNALS:\n")
        pprint.pprint(c["redrob_signals"])
        break
        
from src.scoring.candidate_comparison import compare_candidates

for candidate in ranked[:20]:
    pprint.pprint(candidate)

print("\nCandidate Comparison\n")

comparison = compare_candidates(
    ranked[0],
    ranked[1]
)
print("\nWhy Candidate A ranked above Candidate B:\n")

for advantage in comparison["advantages_a"]:
    print("+", advantage)

print()

for advantage in comparison["advantages_b"]:
    print("-", advantage)
pprint.pprint(comparison)

print("\nGenerating Submission CSV...")

collector.start("CSV Generation")
submission = generate_submission(ranked[:100])

with open(
    "outputs/ranked_candidates.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        ranked[:100],
        f,
        indent=4
    )
collector.stop("CSV Generation")
collector.increment("Final Submission Count", min(100, len(ranked)))

print("\nTOP 5 CANDIDATES:\n")
print("\nRECRUITER COPILOT\n")

candidate = ranked[0]

print("Candidate:")
print(candidate["candidate_id"])

print("\nExplanation:")
print(
    explain_candidate(candidate)
)

print("\nWhy Selected:")
for r in why_selected(candidate):
    print("-", r)

print("\nRisks:")
for r in why_not_selected(candidate):
    print("-", r)

for i, c in enumerate(ranked[:5]):

    print("Candidate", i + 1)

    print("Final Score:", c["final_score"])
    print("Match Score:", c["match_score"])
    print("Behavior Score:", c["behavior_score"])
    print("Trajectory Score:", c["trajectory_score"])

    print("\nReasons:")
    for r in c["reasons"]:
        print(f"  - {r}")

    print("\n" + "-" * 50)

print("\nSubmission CSV generated!")

print("\nTop 20 Candidates\n")

for candidate in ranked[:20]:
    pprint.pprint(candidate)

print("\nHIDDEN GEMS\n")

for candidate in ranked:

    if candidate["hidden_gem"]:

        print(
            candidate["candidate_id"],
            candidate["title"]
        )

        print(
            candidate["hidden_gem_reason"]
        )

        print("-" * 40)
        import json

with open(
    "outputs/ranked_candidates.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        ranked[:100],
        f,
        indent=4
    )

end_time = time.perf_counter()
collector.update_memory()

print("\nGenerating Benchmarks...")
reports = collector.generate_reports("outputs/benchmarks")

print("\nBenchmarks generated in outputs/benchmarks/")
for filename, content in reports:
    print("\n" + "=" * 50)
    print(content)
    input("Press Enter to view next report...")

print("\nDone!")