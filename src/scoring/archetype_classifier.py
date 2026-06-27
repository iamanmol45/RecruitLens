def classify_archetype(candidate):

    title = (
        candidate.get("profile", {})
        .get("current_title", "")
        .lower()
    )

    skills = [
        s.get("name", "").lower()
        for s in candidate.get("skills", [])
    ]

    career_text = ""

    for job in candidate.get("career_history", []):
        career_text += (
            " " +
            job.get("title", "").lower() +
            " " +
            job.get("description", "").lower()
        )

    if (
        "lead" in title or
        "manager" in title or
        "director" in title
    ):
        return "Leader"

    if (
        "research" in title or
        "research" in career_text
    ):
        return "Researcher"

    if (
        "production" in career_text or
        "deployed" in career_text or
        "real users" in career_text
    ):
        return "Builder"

    if len(skills) >= 15:
        return "Generalist"

    return "Specialist"