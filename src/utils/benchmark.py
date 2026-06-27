import time
import os
import psutil
import statistics

class BenchmarkCollector:
    def __init__(self):
        self.timers = {}
        self.starts = {}
        self.counters = {}
        self.records = {}
        self.process = psutil.Process(os.getpid())
        self.peak_memory = 0
        self.start_time = time.perf_counter()

    def start(self, name):
        self.starts[name] = time.perf_counter()

    def stop(self, name):
        if name in self.starts:
            elapsed = time.perf_counter() - self.starts[name]
            self.timers[name] = self.timers.get(name, 0.0) + elapsed
            del self.starts[name]

    def increment(self, name, value=1):
        self.counters[name] = self.counters.get(name, 0) + value

    def record(self, name, value):
        if name not in self.records:
            self.records[name] = []
        self.records[name].append(value)

    def update_memory(self):
        mem = self.process.memory_info().rss / (1024 * 1024)
        if mem > self.peak_memory:
            self.peak_memory = mem

    def _generate_candidate_funnel(self):
        loaded = self.counters.get("Candidates Loaded", 0)
        valid = self.counters.get("Schema Valid", 0)
        invalid = self.counters.get("Schema Invalid", 0)
        filtered = self.counters.get("Candidates Filtered", 0)
        proceeding = loaded - filtered
        top100 = self.counters.get("Top-100 Selected", 0)
        semantic = self.counters.get("Semantic Re-ranked", 0)
        audited = self.counters.get("Honeypot Audited", 0)
        replaced = self.counters.get("Candidates Replaced", 0)
        final = self.counters.get("Final Submission Count", 0)

        return f"""==================================================
1. CANDIDATE FUNNEL
==================================================

Candidates Loaded             : {loaded:,}
Schema Valid                  : {valid:,}
Schema Invalid                : {invalid:,}
Candidates Filtered           : {filtered:,}
Candidates Proceeding         : {proceeding:,}
Top-100 Selected              : {top100:,}
Semantic Re-ranked            : {semantic:,}
Honeypot Audited              : {audited:,}
Candidates Replaced           : {replaced:,}
Final Submission Count        : {final:,}
"""

    def _generate_performance_benchmarks(self):
        total_time = time.perf_counter() - self.start_time
        processed = self.counters.get("Candidates Loaded", 0)
        cps = processed / total_time if total_time > 0 else 0
        avg_time = total_time / processed if processed > 0 else 0

        report = f"""==================================================
2. PERFORMANCE BENCHMARKS
==================================================

Total Runtime                 : {total_time:.4f} sec
Peak Memory                   : {self.peak_memory:.2f} MB
Average Time per Candidate    : {avg_time:.4f} sec
Candidates / Second           : {cps:,.0f}

---

"""
        order = [
            "Schema Validation",
            "JD Parsing",
            "Feature Extraction",
            "Candidate Scoring",
            "JD Matching",
            "Behavior Analysis",
            "Career Trajectory Analysis",
            "Risk Assessment",
            "Skill Gap Analysis",
            "Potential Prediction",
            "Weighted Ranking",
            "Initial Sorting",
            "Semantic Embedding Generation",
            "Cosine Similarity",
            "Semantic Re-ranking",
            "Honeypot Audit",
            "Dynamic Replacement",
            "CSV Generation"
        ]

        for name in order:
            t = self.timers.get(name, 0.0)
            report += f"{name:<30}: {t:.4f} sec\n"

        return report

    def _generate_score_distribution(self):
        final_scores = self.records.get("Final Score", [])
        if not final_scores:
            return "No scores recorded."

        highest = max(final_scores)
        lowest = min(final_scores)
        mean_score = statistics.mean(final_scores)
        median_score = statistics.median(final_scores)
        stdev = statistics.stdev(final_scores) if len(final_scores) > 1 else 0

        sorted_scores = sorted(final_scores, reverse=True)
        top10_avg = statistics.mean(sorted_scores[:10]) if len(sorted_scores) >= 10 else 0
        top50_avg = statistics.mean(sorted_scores[:50]) if len(sorted_scores) >= 50 else 0
        top100_avg = statistics.mean(sorted_scores[:100]) if len(sorted_scores) >= 100 else 0

        semantic_avg = statistics.mean(self.records.get("Semantic Score", [0]))
        match_avg = statistics.mean(self.records.get("Match Score", [0]))
        behavior_avg = statistics.mean(self.records.get("Behavior Score", [0]))
        trajectory_avg = statistics.mean(self.records.get("Trajectory Score", [0]))
        potential_avg = statistics.mean(self.records.get("Potential Score", [0]))

        return f"""==================================================
3. SCORE DISTRIBUTION
==================================================

Highest Score                 : {highest:.2f}
Lowest Score                  : {lowest:.2f}
Mean Score                    : {mean_score:.2f}
Median Score                  : {median_score:.2f}
Standard Deviation            : {stdev:.2f}

Top-10 Average                : {top10_avg:.2f}
Top-50 Average                : {top50_avg:.2f}
Top-100 Average               : {top100_avg:.2f}

Semantic Score Average        : {semantic_avg:.2f}
Match Score Average           : {match_avg:.2f}
Behavior Score Average        : {behavior_avg:.2f}
Trajectory Score Average      : {trajectory_avg:.2f}
Potential Score Average       : {potential_avg:.2f}
"""

    def _generate_risk_report(self):
        low = self.counters.get("Risk Low", 0)
        med = self.counters.get("Risk Medium", 0)
        high = self.counters.get("Risk High", 0)
        gems = self.counters.get("Hidden Gems", 0)
        flagged = self.counters.get("Honeypot Flagged", 0)
        rejected = self.counters.get("Candidates Rejected", 0)
        replaced = self.counters.get("Candidates Replaced", 0)

        skill_avg = statistics.mean(self.records.get("Skill Gap", [0]))
        match_avg = statistics.mean(self.records.get("Match Score", [0]))
        semantic_avg = statistics.mean(self.records.get("Semantic Score", [0]))

        return f"""==================================================
4. RISK & QUALITY REPORT
==================================================

Low Risk                      : {low:,}
Medium Risk                   : {med:,}
High Risk                     : {high:,}

Hidden Gems                   : {gems:,}
Honeypot Flagged              : {flagged:,}
Candidates Rejected           : {rejected:,}
Candidates Replaced           : {replaced:,}

Average Skill Gap             : {skill_avg:.2f}
Average Match Score           : {match_avg:.2f}
Average Semantic Score        : {semantic_avg:.2f}
"""

    def _generate_ranking_statistics(self):
        highest_match = max(self.records.get("Match Score", [0]))
        highest_semantic = max(self.records.get("Semantic Score", [0]))
        avg_candidate = statistics.mean(self.records.get("Candidate Score", [0]))
        avg_behavior = statistics.mean(self.records.get("Behavior Score", [0]))
        avg_trajectory = statistics.mean(self.records.get("Trajectory Score", [0]))
        avg_potential = statistics.mean(self.records.get("Potential Score", [0]))
        final_scores = self.records.get("Final Score", [0])
        highest_final = max(final_scores)
        lowest_final = min(final_scores)

        return f"""==================================================
        RANKING STATISTICS
==================================================

Highest Match Score           : {highest_match:.2f}
Highest Semantic Score        : {highest_semantic:.2f}
Average Candidate Score       : {avg_candidate:.2f}
Average Behavior Score        : {avg_behavior:.2f}
Average Trajectory Score      : {avg_trajectory:.2f}
Average Potential Score       : {avg_potential:.2f}
Highest Final Score           : {highest_final:.2f}
Lowest Final Score            : {lowest_final:.2f}
"""

    def _generate_system_config(self):
        loaded = self.counters.get("Candidates Loaded", 0)
        return f"""==================================================
      SYSTEM CONFIGURATION
==================================================

Dataset Size                  : {loaded:,}
Embedding Model               : all-MiniLM-L6-v2
Similarity Metric             : Cosine Similarity
Ranking Algorithm             : Hybrid Weighted Ranking
Programming Language          : Python
Execution Mode                : CPU
External APIs                 : None
"""

    def generate_reports(self, output_dir):
        os.makedirs(output_dir, exist_ok=True)

        reports = [
            ("candidate_funnel.txt", self._generate_candidate_funnel()),
            ("performance_benchmarks.txt", self._generate_performance_benchmarks()),
            ("score_distribution.txt", self._generate_score_distribution()),
            ("risk_analysis.txt", self._generate_risk_report()),
            ("ranking_statistics.txt", self._generate_ranking_statistics()),
            ("system_configuration.txt", self._generate_system_config()),
        ]

        for filename, content in reports:
            path = os.path.join(output_dir, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

        return reports

