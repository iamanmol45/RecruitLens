def detect_honeypot(candidate, match_score, skill_gap_score, risk_level):

    score = 0
    reasons = []

    profile = candidate.get("profile", {})

    years = profile.get(
        "years_of_experience",
        0
    )

    title = profile.get(
        "current_title",
        ""
    ).lower()

    skills = candidate.get(
        "skills",
        []
    )

    senior_titles = [
        "senior",
        "lead",
        "staff",
        "principal",
        "director",
        "head"
    ]

    # Rule 1: Senior title with low experience
    if years < 3:
        for word in senior_titles:
            if word in title:
                score += 3
                reasons.append(
                    "Senior title with low experience."
                )
                break

    # Rule 2: More than 25 skills
    if len(skills) > 25:
        score += 2
        reasons.append(
            "Too many listed skills."
        )

    # Rule 3: High risk candidate
    if risk_level == "High":
        score += 2
        reasons.append(
            "High risk profile."
        )

    # Rule 4: Very low skill gap
    if skill_gap_score < 25:
        score += 2
        reasons.append(
            "Very low skill gap."
        )

    # Rule 5: Match score of 100 with poor skill coverage
    if match_score == 100 and skill_gap_score < 30:
        score += 3
        reasons.append(
            "Match score of 100 with poor skill coverage."
        )

    # Rule 6: Advanced AI stack with low experience
    suspicious_skills = [
        "blockchain",
        "quantum computing",
        "cybersecurity",
        "devops",
        "computer vision",
        "llm",
        "rag",
        "mlops"
    ]

    count = 0
    for skill in skills:
        skill_name = skill.get("name", "") if isinstance(skill, dict) else str(skill)
        if skill_name.lower() in suspicious_skills:
            count += 1

    if years < 3 and count >= 4:
        score += 2
        reasons.append(
            "Advanced AI stack with low experience."
        )

    if score >= 7:
        status = "High Risk"
    elif score >= 4:
        status = "Needs Review"
    else:
        status = "Verified"

    return {
        "honeypot": score >= 7,
        "honeypot_status": status,
        "honeypot_score": score,
        "honeypot_reasons": reasons
    }