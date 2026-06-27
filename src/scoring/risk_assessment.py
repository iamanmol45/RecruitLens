def assess_candidate_risk(candidate):

    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})
    jobs = candidate.get("career_history", [])

    risks = []

    # -----------------
    # Job Hopping Risk
    # -----------------

    if len(jobs) >= 6:
        risks.append("Job hopping risk")

    # -----------------
    # Long Notice Period
    # -----------------

    notice = signals.get(
        "notice_period_days",
        0
    )

    if notice >= 90:
        risks.append(
            "Long notice period"
        )

    # -----------------
    # Availability Risk
    # -----------------

    response_rate = signals.get(
        "recruiter_response_rate",
        0
    )

    if (
        response_rate >= 0 and
        response_rate < 0.3
    ):
        risks.append(
            "Low recruiter response rate"
        )

    # -----------------
    # Inactive Candidate
    # -----------------

    open_to_work = signals.get(
        "open_to_work_flag",
        False
    )

    if not open_to_work:
        risks.append(
            "Not actively seeking opportunities"
        )

    # -----------------
    # Overqualification
    # -----------------

    experience = profile.get(
        "years_of_experience",
        0
    )

    if experience >= 15:
        risks.append(
            "Possible overqualification"
        )

    # -----------------
    # Interview Risk
    # -----------------

    completion = signals.get(
        "interview_completion_rate",
        1
    )

    if (
        completion >= 0 and
        completion < 0.5
    ):
        risks.append(
            "Low interview completion rate"
        )

    # -----------------
    # Risk Level
    # -----------------

    if len(risks) == 0:
        risk_level = "Low"

    elif len(risks) <= 2:
        risk_level = "Medium"

    else:
        risk_level = "High"

    return {
        "risk_level": risk_level,
        "risks": risks
    }