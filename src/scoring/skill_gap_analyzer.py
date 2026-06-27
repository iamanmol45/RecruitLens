def analyze_skill_gap(candidate, parsed_jd):

    candidate_text = ""
    candidate_skills = []

    for skill in candidate.get("skills", []):
        skill_name = skill.get("name", "").lower().strip()
        if skill_name:
            candidate_skills.append(skill_name)
            candidate_text += " " + skill_name

    for job in candidate.get("career_history", []):
        candidate_text += " " + job.get("title", "").lower()
        candidate_text += " " + job.get("description", "").lower()

    required_skills = [
        s.lower()
        for s in parsed_jd.get(
            "required_skills",
            []
        )
    ]

    matched_skills = []
    missing_skills = []

    for skill in required_skills:
        if (skill in candidate_skills) or (skill in candidate_text):
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    if len(required_skills) == 0:
        score = 100
    else:
        score = (
            len(matched_skills)
            / len(required_skills)
        ) * 100

    if score >= 80:
        effort = "Low"
    elif score >= 50:
        effort = "Medium"
    else:
        effort = "High"

    return {
        "skill_gap_score": round(score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "upskilling_effort": effort
    }