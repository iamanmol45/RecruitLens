def analyze_career_trajectory(candidate):

    jobs = candidate.get("career_history", [])

    if len(jobs) <= 1:
        return {
            "trajectory_score": 50,
            "growth_type": "Unknown",
            "leadership_growth": False
        }

    score = 50

    leadership = False

    senior_words = [
        "senior",
        "lead",
        "staff",
        "principal",
        "manager",
        "director",
        "head"
    ]

    ai_words = [
        "ml",
        "machine learning",
        "ai",
        "data scientist",
        "recommendation",
        "search",
        "nlp"
    ]

    titles = []

    for job in jobs:
        title = job.get(
            "title",
            ""
        ).lower()

        titles.append(title)

    # Leadership growth

    for title in titles:

        if any(
            word in title
            for word in senior_words
        ):
            leadership = True
            score += 15
            break

    # AI progression

    ai_count = 0

    for title in titles:

        if any(
            word in title
            for word in ai_words
        ):
            ai_count += 1

    if ai_count >= 2:
        score += 20

    # Multiple promotions

    promotion_count = 0

    for title in titles:

        if (
            "senior" in title or
            "lead" in title or
            "staff" in title or
            "principal" in title
        ):
            promotion_count += 1

    score += min(
        promotion_count * 5,
        15
    )

    # Job hopping penalty

    if len(jobs) >= 6:
        score -= 10

    score = max(
        0,
        min(score, 100)
    )

    if score >= 80:
        growth = "Strong"

    elif score >= 60:
        growth = "Moderate"

    else:
        growth = "Flat"

    return {
        "trajectory_score": score,
        "growth_type": growth,
        "leadership_growth": leadership
    }