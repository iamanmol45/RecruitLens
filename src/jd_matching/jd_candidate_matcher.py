def safe_str(val):
    return str(val) if val is not None else ""

def match_candidate_to_jd(candidate, parsed_jd):
    score = 0
    reasons = []

    profile = candidate.get("profile", {})
    title = safe_str(profile.get("current_title")).lower()
    summary = safe_str(profile.get("summary")).lower()

    skills = [
        safe_str(skill.get("name")).lower()
        for skill in candidate.get("skills", [])
    ]
    skills_text = " ".join(skills)

    career_titles = []
    career_descriptions = ""

    for job in candidate.get("career_history", []):
        t = safe_str(job.get("title")).lower()
        career_titles.append(t)
        career_descriptions += " " + safe_str(job.get("description")).lower()

    # Base experience points
    years_exp = profile.get("years_of_experience", 0)
    if years_exp:
        base_exp = min(years_exp / 15.0, 1.0) * 15
        score += base_exp
        if base_exp >= 5:
            reasons.append(f"Base experience: {years_exp} years")

    # -----------------------
    # Unrelated Role Penalties
    # -----------------------
    unrelated_titles = [
        "hr", "human resources", "sales", "marketing", "operations",
        "accountant", "customer support", "graphic designer", "mechanical", "recruiter"
    ]

    is_unrelated_current = any(u in title for u in unrelated_titles)
    if is_unrelated_current:
        score -= 50
        reasons.append(f"Penalty: Unrelated current title '{profile.get('current_title')}'")

    unrelated_count = sum(1 for t in career_titles if any(u in t for u in unrelated_titles))
    if unrelated_count > 0:
        score -= 15 * unrelated_count
        reasons.append(f"Penalty: {unrelated_count} unrelated past roles")

    # -----------------------
    # Required Skills
    # -----------------------

    HIGH_VALUE_SKILLS = {
        "retrieval",
        "ranking",
        "embeddings",
        "pinecone",
        "weaviate",
        "qdrant",
        "milvus",
        "faiss",
        "recommendation systems",
        "sentence-transformers",
        "learning-to-rank",
        "vector databases"
    }

    skills_matched = 0

    for req_skill in parsed_jd.get("required_skills", []):

        req_skill = req_skill.lower()

        if req_skill in skills_text or req_skill in career_descriptions:

            if req_skill in HIGH_VALUE_SKILLS:

                if req_skill in career_descriptions:
                    score += 20
                    reasons.append(
                        f"Demonstrated skill in past work: {req_skill}"
                    )
                else:
                    score += 10
                    reasons.append(
                        f"Lists skill: {req_skill}"
                    )

            else:

                if req_skill in career_descriptions:
                    score += 5
                    reasons.append(
                        f"Demonstrated skill in past work: {req_skill}"
                    )
                else:
                    score += 2
                    reasons.append(
                        f"Lists skill: {req_skill}"
                    )

            skills_matched += 1

            if skills_matched >= 10:
                break

    # -----------------------
    # Required Experience
    # -----------------------
    for exp in parsed_jd.get("required_experience", []):
        if exp.lower() in career_descriptions:
            score += 15
            reasons.append(f"Production experience: '{exp}'")

    # -----------------------
    # Role Family
    # -----------------------
    GOOD_TITLES = [
        "ml engineer",
        "machine learning engineer",
        "ai engineer",
        "ai research engineer",
        "recommendation systems engineer",
        "data scientist",
        "data engineer",
        "ai specialist"
    ]

    for good_title in GOOD_TITLES:

        if good_title in title:
            score += 40
            reasons.append(
                f"Relevant title: {good_title}"
            )
            break

    # -----------------------
    # Negative Signals
    # -----------------------
    for signal in parsed_jd.get("negative_signals", []):
        if signal.lower() in summary or signal.lower() in career_descriptions:
            score -= 10
            reasons.append(f"Negative signal: {signal}")

    score = max(0, min(score, 100))

    # Deduplicate reasons
    seen = set()
    deduped_reasons = []
    for r in reasons:
        if r not in seen:
            seen.add(r)
            deduped_reasons.append(r)

    return {
        "match_score": round(score, 2),
        "reasons": deduped_reasons
    }