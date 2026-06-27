from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def build_candidate_text(candidate):
    candidate_text = ""

    # Skills
    for skill in candidate.get("skills", []):
        candidate_text += " " + skill.get("name", "")

    # Career history
    for job in candidate.get("career_history", []):
        candidate_text += " " + job.get("title", "")
        candidate_text += " " + job.get("description", "")

    return candidate_text

def calculate_similarity(jd_embedding, candidate_embedding):
    similarity = cosine_similarity(
        jd_embedding,
        candidate_embedding
    )[0][0]

    scaled_similarity = ((similarity + 1) / 2) * 100

    return round(
        scaled_similarity,
        2
    )

def semantic_match(jd_text, candidate):
    jd_embedding = model.encode([jd_text])
    candidate_text = build_candidate_text(candidate)
    candidate_embedding = model.encode([candidate_text])
    return calculate_similarity(jd_embedding, candidate_embedding)