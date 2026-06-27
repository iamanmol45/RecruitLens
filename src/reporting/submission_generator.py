import pandas as pd


def generate_submission(ranked_candidates):

    rows = []

    for rank, candidate in enumerate(ranked_candidates, start=1):

        score = round(
            candidate["final_score"] / 100,
            4
        )

        ai_skills = 0
        production_signals = 0

        for reason in candidate.get("reasons", []):

            if any(
                x in reason.lower()
                for x in [
                    "retrieval",
                    "ranking",
                    "embeddings",
                    "pinecone",
                    "weaviate",
                    "qdrant",
                    "milvus",
                    "faiss",
                    "llm",
                    "fine-tuning",
                    "sentence-transformers",
                    "xgboost"
                ]
            ):
                ai_skills += 1

            if any(
                x in reason.lower()
                for x in [
                    "production",
                    "deployed",
                    "evaluation",
                    "ndcg",
                    "mrr",
                    "a/b testing"
                ]
            ):
                production_signals += 1

        title = candidate.get('title', '')
        years = float(candidate.get('years_experience', 0))
        match = candidate.get('match_score', 0)
        risk = candidate.get('risk_level', 'Medium')
        potential = candidate.get('future_potential', 'Medium')
        archetype = candidate.get('archetype', '')
        hidden_gem = candidate.get('hidden_gem', False)

        if hidden_gem:
            trait = "Hidden Gem"
        elif archetype == "Specialist":
            trait = "Specialist Archetype"
        else:
            trait = f"{potential} Potential"
            
        top_skills = []
        for r in candidate.get("reasons", []):
            if "skill" in r.lower() and ":" in r:
                skill = r.split(":")[-1].strip().title()
                if skill not in top_skills:
                    top_skills.append(skill)
        
        if top_skills:
            if len(top_skills) >= 3:
                top_strength = f"Expertise in {', '.join(top_skills[:2])}, and {top_skills[2]}"
            elif len(top_skills) == 2:
                top_strength = f"Expertise in {top_skills[0]} and {top_skills[1]}"
            else:
                top_strength = f"Strong {top_skills[0]} experience"
        else:
            top_strength = "Strong core engineering background"
            
        reasoning = (
            f"{title} | "
            f"{years:.1f} yrs exp | "
            f"Match: {match} | "
            f"{risk} Risk | "
            f"{trait} | "
            f"{top_strength}"
        )

        rows.append({
            "candidate_id": candidate["candidate_id"],
            "rank": rank,
            "score": score,
            "reasoning": reasoning
        })

    submission = pd.DataFrame(rows)

    submission.to_csv(
        "outputs/submission.csv",
        index=False
    )

    return submission