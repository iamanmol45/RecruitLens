def detect_hidden_gem(
    candidate,
    match_score,
    behavior_score,
    trajectory_score,
    future_potential,
    risk_level
):

    title = (
        candidate.get("profile", {})
        .get("current_title", "")
        .lower()
    )

    good_titles = [
        "search engineer",
        "recommendation engineer",
        "recommendation systems engineer",
        "relevance engineer",
        "applied scientist",
        "ml engineer",
        "machine learning engineer",
        "ai engineer",
        "data scientist",
        "nlp engineer"
    ]

    title_match = any(
        t in title
        for t in good_titles
    )

    hidden_score = 0

    if title_match:
        hidden_score += 20

    if behavior_score >= 80:
        hidden_score += 20

    if trajectory_score >= 80:
        hidden_score += 20

    if future_potential in [
        "High",
        "Very High"
    ]:
        hidden_score += 20

    if risk_level == "Low":
        hidden_score += 20

    hidden_gem = (
        hidden_score >= 70
        and 50 <= match_score <= 90
    )

    reason = ""

    if hidden_gem:
        reason = (
            "High growth potential despite lower JD match."
        )

    return {
        "hidden_gem": hidden_gem,
        "hidden_gem_score": hidden_score,
        "reason": reason
    }