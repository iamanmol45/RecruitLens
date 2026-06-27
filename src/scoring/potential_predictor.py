def predict_potential(candidate):

    score = 0

    # Career Growth

    if candidate["trajectory_score"] >= 90:
        score += 30

    elif candidate["trajectory_score"] >= 70:
        score += 20

    # Leadership

    if candidate["leadership_growth"]:
        score += 20

    # Behavior

    if candidate["behavior_score"] >= 80:
        score += 20

    elif candidate["behavior_score"] >= 60:
        score += 10

    # Skill Gap

    if candidate["skill_gap_score"] >= 70:
        score += 20

    elif candidate["skill_gap_score"] >= 50:
        score += 10

    # Risk

    if candidate["risk_level"] == "Low":
        score += 10

    if score >= 80:
        potential = "Very High"

    elif score >= 60:
        potential = "High"

    elif score >= 40:
        potential = "Medium"

    else:
        potential = "Low"

    return {
        "future_potential": potential,
        "potential_score": score
    }