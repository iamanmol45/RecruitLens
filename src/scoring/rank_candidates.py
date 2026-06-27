from src.preprocessing.feature_extractor import extract_features
from src.scoring.candidate_ranker import rank_candidate
from src.scoring.final_ranker import calculate_final_score
from src.preprocessing.jd_parser import parse_jd
from src.jd_matching.jd_candidate_matcher import match_candidate_to_jd
# pyrefly: ignore [missing-import]
from src.scoring.behaviour_score import calculate_behavior_score
from src.scoring.archetype_classifier import classify_archetype
from src.scoring.skill_gap_analyzer import analyze_skill_gap
from src.scoring.hidden_gem_detector import detect_hidden_gem
from src.scoring.career_trajectory import (
    analyze_career_trajectory
)
# pyrefly: ignore [missing-import]
from src.scoring.risk_assessment import (
    assess_candidate_risk
)
from src.scoring.potential_predictor import (
    predict_potential
)

class DummyCollector:
    def __getattr__(self, name):
        return lambda *args, **kwargs: None


def rank_candidates(candidates, jd_text, collector=None):
    if collector is None:
        collector = DummyCollector()

    collector.start("JD Parsing")
    parsed_jd = parse_jd(jd_text)
    collector.stop("JD Parsing")

    ranked = []

    for candidate in candidates:
        collector.start("Feature Extraction")
        features = extract_features(candidate)
        collector.stop("Feature Extraction")

        collector.start("Candidate Scoring")
        candidate_score = rank_candidate(features)
        collector.stop("Candidate Scoring")
        collector.record("Candidate Score", candidate_score)

        collector.start("JD Matching")
        match_result = match_candidate_to_jd(candidate, parsed_jd)
        match_score = match_result.get("match_score", 0)
        reasons = match_result.get("reasons", [])
        collector.stop("JD Matching")
        collector.record("Match Score", match_score)

        collector.start("Career Trajectory Analysis")
        trajectory = analyze_career_trajectory(candidate)
        collector.stop("Career Trajectory Analysis")
        collector.record("Trajectory Score", trajectory["trajectory_score"])

        collector.start("Risk Assessment")
        risk = assess_candidate_risk(candidate)
        collector.stop("Risk Assessment")
        collector.increment(f"Risk {risk['risk_level']}")

        # Reject obvious mismatches
        if match_score < 15:
            collector.increment("Candidates Filtered")
            continue

        collector.start("Behavior Analysis")
        behavior_score = calculate_behavior_score(candidate)
        collector.stop("Behavior Analysis")
        collector.record("Behavior Score", behavior_score)

        archetype = classify_archetype(candidate)
        
        collector.start("Skill Gap Analysis")
        skill_gap = analyze_skill_gap(
            candidate,
            parsed_jd
        )
        collector.stop("Skill Gap Analysis")
        collector.record("Skill Gap", skill_gap["skill_gap_score"])

        collector.start("Potential Prediction")
        potential = predict_potential({
            "trajectory_score": trajectory["trajectory_score"],
            "leadership_growth": trajectory["leadership_growth"],
            "behavior_score": behavior_score,
            "skill_gap_score": skill_gap["skill_gap_score"],
            "risk_level": risk["risk_level"]
        })
        collector.stop("Potential Prediction")
        collector.record("Potential Score", potential["potential_score"])

        hidden_gem = detect_hidden_gem(
            candidate,
            match_score,
            behavior_score,
            trajectory["trajectory_score"],
            potential["future_potential"],
            risk["risk_level"]
        )
        if hidden_gem["hidden_gem"]:
            collector.increment("Hidden Gems")

        collector.start("Weighted Ranking")
        final_score = calculate_final_score(
            candidate_score,
            match_score,
            behavior_score
        )
        final_score += trajectory["trajectory_score"] * 0.05
        final_score += potential["potential_score"] * 0.03
        if hidden_gem["hidden_gem"]:
            final_score += 5
            reasons.append(
                "Hidden Gem: strong signals beyond keyword matching"
            )
        if risk["risk_level"] == "High":
            final_score -= 5
        elif risk["risk_level"] == "Medium":
            final_score -= 2
        collector.stop("Weighted Ranking")
        
        collector.record("Final Score", final_score)

        ranked.append({
            "hidden_gem": hidden_gem["hidden_gem"],
            "hidden_gem_reason": hidden_gem["reason"],
            "candidate_id": candidate.get("candidate_id"),
            "title": candidate.get("profile", {}).get("current_title", ""),
            "years_experience": candidate.get("profile", {}).get(
                "years_of_experience",
                0
            ),
            "candidate_score": candidate_score,
            "match_score": match_score,
            "behavior_score": behavior_score,
            "archetype": archetype,
            "skill_gap_score": skill_gap["skill_gap_score"],
            "missing_skills": skill_gap["missing_skills"],
            "upskilling_effort": skill_gap["upskilling_effort"],
            "final_score": final_score,
            "reasons": reasons,
            "trajectory_score": trajectory["trajectory_score"],
            "growth_type": trajectory["growth_type"],
            "leadership_growth": trajectory["leadership_growth"],
            "risk_level": risk["risk_level"],
            "risks": risk["risks"],
            "future_potential": potential["future_potential"],
            "potential_score": potential["potential_score"],
            "honeypot": False,
            "honeypot_status": "Verified",
            "honeypot_score": 0,
            "honeypot_reasons": [],
        })

    collector.start("Initial Sorting")
    ranked.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )
    collector.stop("Initial Sorting")

    return ranked