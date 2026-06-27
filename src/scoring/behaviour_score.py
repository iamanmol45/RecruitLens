from datetime import datetime


def calculate_behavior_score(candidate):

    signals = candidate.get("redrob_signals", {})

    score = 0

    if signals.get("open_to_work_flag"):
        score += 20

    score += signals.get(
        "recruiter_response_rate",
        0
    ) * 20

    score += signals.get(
        "interview_completion_rate",
        0
    ) * 20

    score += signals.get(
        "github_activity_score",
        0
    ) / 5

    score += min(
        signals.get(
            "profile_completeness_score",
            0
        ) / 5,
        20
    )

    return round(score, 2)