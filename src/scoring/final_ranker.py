def calculate_final_score(
    candidate_score,
    match_score,
    behavior_score
):

    final_score = (
        match_score * 0.60 +
        candidate_score * 0.20 +
        behavior_score * 0.20
    )

    return round(final_score, 2)