from collections import Counter


def generate_profile_report(candidates):

    total_candidates = len(candidates)

    total_experience = 0
    total_skills = 0
    open_to_work_count = 0

    github_scores = []

    skill_counter = Counter()
    industry_counter = Counter()
    location_counter = Counter()

    for candidate in candidates:

        profile = candidate["profile"]
        skills = candidate["skills"]
        signals = candidate["redrob_signals"]

        # Experience
        total_experience += profile["years_of_experience"]

        # Skills
        total_skills += len(skills)

        for skill in skills:
            skill_counter[skill["name"]] += 1

        # Industry
        industry_counter[profile["current_industry"]] += 1

        # Location
        location_counter[profile["location"]] += 1

        # Open To Work
        if signals["open_to_work_flag"]:
            open_to_work_count += 1

        # Github Score
        github_score = signals["github_activity_score"]

        if github_score != -1:
            github_scores.append(github_score)

    report = {
        "total_candidates": total_candidates,

        "avg_experience": round(
            total_experience / total_candidates,
            2
        ),

        "avg_skills_per_candidate": round(
            total_skills / total_candidates,
            2
        ),

        "open_to_work_percentage": round(
            (open_to_work_count / total_candidates) * 100,
            2
        ),

        "avg_github_score": round(
            sum(github_scores) / len(github_scores),
            2
        ),

        "top_10_skills":
            skill_counter.most_common(10),

        "top_10_industries":
            industry_counter.most_common(10),

        "top_10_locations":
            location_counter.most_common(10)
    }

    return report