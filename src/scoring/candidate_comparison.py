def compare_candidates(candidate_a, candidate_b):

    advantages_a = []
    advantages_b = []

    # Final Score

    if candidate_a["final_score"] > candidate_b["final_score"]:
        advantages_a.append(
            "Higher overall ranking score"
        )
    else:
        advantages_b.append(
            "Higher overall ranking score"
        )

    # Match Score

    if candidate_a["match_score"] > candidate_b["match_score"]:
        advantages_a.append(
            "Stronger JD match"
        )
    elif candidate_b["match_score"] > candidate_a["match_score"]:
        advantages_b.append(
            "Stronger JD match"
        )

    # Behavior Score

    if candidate_a["behavior_score"] > candidate_b["behavior_score"]:
        advantages_a.append(
            "Better recruiter engagement"
        )
    elif candidate_b["behavior_score"] > candidate_a["behavior_score"]:
        advantages_b.append(
            "Better recruiter engagement"
        )

    # Experience

    if candidate_a["years_experience"] > candidate_b["years_experience"]:
        advantages_a.append(
            "More experience"
        )
    elif candidate_b["years_experience"] > candidate_a["years_experience"]:
        advantages_b.append(
            "More experience"
        )

    # Career Growth

    if candidate_a["trajectory_score"] > candidate_b["trajectory_score"]:
        advantages_a.append(
            "Stronger career growth"
        )
    elif candidate_b["trajectory_score"] > candidate_a["trajectory_score"]:
        advantages_b.append(
            "Stronger career growth"
        )

    # Skill Gap

    if candidate_a["skill_gap_score"] > candidate_b["skill_gap_score"]:
        advantages_a.append(
            "Closer skill alignment"
        )
    elif candidate_b["skill_gap_score"] > candidate_a["skill_gap_score"]:
        advantages_b.append(
            "Closer skill alignment"
        )

    return {
        "candidate_a": candidate_a["candidate_id"],
        "candidate_b": candidate_b["candidate_id"],
        "advantages_a": advantages_a,
        "advantages_b": advantages_b
    }