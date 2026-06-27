def calculate_experience_score(candidate, parsed_jd):

    score = 0
    reasons = []

    # Base experience points
    profile = candidate.get("profile", {})
    years_exp = profile.get("years_of_experience", 0)
    if years_exp:
        base_exp = min(years_exp / 15.0, 1.0) * 15  # Cap at 15 points
        score += base_exp
        if base_exp >= 5:
            reasons.append(f"Base experience: {years_exp} years")

    required_exp_keywords = parsed_jd.get("required_experience", [])
    required_skills = parsed_jd.get("required_skills", [])
    role_family = parsed_jd.get("role_family", "").lower()

    unrelated_titles = [
        "hr", "human resources", "sales", "marketing", "operations",
        "accountant", "customer support", "graphic designer", "mechanical", "recruiter"
    ]

    for job in candidate.get("career_history", []):

        title = (job.get("title") or "").lower()
        description = (job.get("description") or "").lower()

        is_unrelated = any(u in title for u in unrelated_titles)

        if not is_unrelated:
            # Relevant title
            if role_family and role_family != "unknown" and role_family in title:
                score += 15
                reasons.append(f"Relevant past title: {job.get('title')}")
            
            # Heavy reward for production signals / required experience
            for req_exp in required_exp_keywords:
                if req_exp in description:
                    score += 15  # High weight for production experience
                    reasons.append(f"Production experience: '{req_exp}'")

            # Reward for applying required skills
            for req_skill in required_skills:
                if req_skill in description:
                    score += 5
                    reasons.append(f"Applied skill: '{req_skill}'")

    final_score = min(score, 100)
    # Deduplicate reasons while preserving some order
    seen = set()
    deduped_reasons = []
    for r in reasons:
        if r not in seen:
            seen.add(r)
            deduped_reasons.append(r)

    return round(final_score, 2), deduped_reasons