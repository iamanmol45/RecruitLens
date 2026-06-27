def rank_candidate(features):

    score = 0

    score += min(
        features["years_experience"] / 15,
        1
    ) * 25

    score += min(
        features["num_skills"] / 20,
        1
    ) * 20

    score += (
        features["profile_completeness"] / 100
    ) * 15

    score += (
        features["response_rate"]
    ) * 10

    score += (
        features["interview_completion"]
    ) * 10

    score += (
        features["open_to_work"]
    ) * 10

    score += (
        features["verified_email"]
    ) * 5

    score += (
        features["verified_phone"]
    ) * 5

    return round(score, 2)
