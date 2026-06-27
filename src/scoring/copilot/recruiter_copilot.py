def explain_candidate(candidate):
    
    explanation = []

    # Match

    if candidate["match_score"] >= 80:
        explanation.append(
            "Strong alignment with the job requirements."
        )

    # Behavior

    if candidate["behavior_score"] >= 80:
        explanation.append(
            "Excellent recruiter engagement signals."
        )

    # Trajectory

    if candidate["trajectory_score"] >= 80:
        explanation.append(
            "Strong career growth trajectory."
        )

    # Leadership

    if candidate["leadership_growth"]:
        explanation.append(
            "Demonstrates leadership progression."
        )

    # Archetype

    explanation.append(
        f"Candidate archetype: {candidate['archetype']}."
    )

    # Risk

    if candidate["risk_level"] == "Low":
        explanation.append(
            "Low hiring risk."
        )

    elif candidate["risk_level"] == "High":
        explanation.append(
            "Requires careful evaluation due to hiring risks."
        )

    if candidate.get("hidden_gem"):
        explanation.append(
            "Potential hidden gem candidate."
        )

    return " ".join(explanation)

def why_selected(candidate):

    reasons = []

    if candidate["match_score"] >= 90:
        reasons.append(
            "Excellent JD fit"
        )

    if candidate["behavior_score"] >= 80:
        reasons.append(
            "Strong recruiter engagement"
        )

    if candidate["trajectory_score"] >= 80:
        reasons.append(
            "Strong career growth"
        )

    if candidate["upskilling_effort"] == "Low":
        reasons.append(
            "Minimal skill gaps"
        )

    return reasons

def why_not_selected(candidate):

    concerns = []

    if candidate["risk_level"] == "High":
        concerns.extend(
            candidate["risks"]
        )

    if candidate["upskilling_effort"] == "High":
        concerns.append(
            "Significant skill gaps"
        )

    if candidate["behavior_score"] < 60:
        concerns.append(
            "Weak engagement signals"
        )

    return concerns
    