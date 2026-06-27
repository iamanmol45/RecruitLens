def safe_str(val):
    return str(val) if val is not None else ""

def calculate_role_fit(candidate, parsed_jd):
    score = 0
    reasons = []

    profile = candidate.get("profile", {})
    current_title = safe_str(profile.get("current_title")).lower()
    
    required_skills = parsed_jd.get("required_skills", [])
    role_family = parsed_jd.get("role_family", "").lower()

    unrelated_titles = [
        "hr", "human resources", "sales", "marketing", "operations",
        "accountant", "customer support", "graphic designer", "mechanical", "recruiter"
    ]

    is_unrelated_current = any(u in current_title for u in unrelated_titles)
    if is_unrelated_current:
        score -= 50
        reasons.append(f"Penalty: Unrelated current title '{profile.get('current_title')}'")

    if role_family and role_family != "unknown" and role_family in current_title:
        score += 30
        reasons.append(f"Exact current role match: '{profile.get('current_title')}'")

    # Career history analysis for role fit
    career_titles = []
    career_descriptions = ""
    for job in candidate.get("career_history", []):
        t = safe_str(job.get("title")).lower()
        career_titles.append(t)
        career_descriptions += " " + safe_str(job.get("description")).lower()
        
        # Add points if previous roles match role_family
        if role_family and role_family != "unknown" and role_family in t:
            score += 15
            reasons.append(f"Past role match: '{job.get('title')}'")

    # Check for unrelated history
    unrelated_count = sum(1 for t in career_titles if any(u in t for u in unrelated_titles))
    if unrelated_count > 0:
        penalty = 15 * unrelated_count
        score -= penalty
        reasons.append(f"Penalty: {unrelated_count} unrelated past roles")

    # Skills check (capped to prevent keyword stuffing)
    skills_text = " ".join(safe_str(skill.get("name")).lower() for skill in candidate.get("skills", []))
    skills_matched = 0
    for req_skill in required_skills:
        if req_skill in skills_text or req_skill in career_descriptions:
            if req_skill in career_descriptions:
                score += 8
                reasons.append(f"Demonstrated skill in past work: '{req_skill}'")
            else:
                score += 2
                reasons.append(f"Lists skill: '{req_skill}'")
            skills_matched += 1
            if skills_matched >= 5: # Cap at 5 matched skills
                break

    # Bonus for strong signals if no penalty was applied
    if score >= 0 and not is_unrelated_current:
        score += 10
        
    final_score = max(min(score, 100), 0)

    # Deduplicate reasons
    seen = set()
    deduped_reasons = []
    for r in reasons:
        if r not in seen:
            seen.add(r)
            deduped_reasons.append(r)

    return round(final_score, 2), deduped_reasons