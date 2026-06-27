import re


def parse_jd(jd_text):

    jd_text_lower = jd_text.lower()

    technical_skills = [
        "python",
        "retrieval",
        "ranking",
        "embeddings",
        "vector databases",
        "pinecone",
        "weaviate",
        "qdrant",
        "milvus",
        "elasticsearch",
        "opensearch",
        "faiss",
        "llm",
        "fine-tuning",
        "sentence-transformers",
        "bge",
        "e5",
        "recommendation systems",
        "learning-to-rank",
        "xgboost"
    ]

    production_signals = [
        "deployed",
        "real users",
        "a/b testing",
        "evaluation framework",
        "ndcg",
        "mrr",
        "map",
        "offline benchmarks",
        "online benchmarks",
        "hybrid retrieval",
        "candidate matching",
        "ranking system",
        "search system"
    ]

    behavior_signals = [
        "open to work",
        "response rate",
        "active",
        "recruiter engagement",
        "offer acceptance"
    ]

    negative_signals = [
        "langchain",
        "research only",
        "academic lab",
        "consulting only",
        "computer vision",
        "speech",
        "robotics"
    ]

    extracted = {
        "required_skills": [],
        "required_experience": [],
        "behavior_signals": [],
        "negative_signals": [],
        "experience_min": None,
        "experience_max": None,
        "role_family": "Unknown"
    }

    for skill in technical_skills:
        if skill in jd_text_lower:
            extracted["required_skills"].append(skill)

    for signal in production_signals:
        if signal in jd_text_lower:
            extracted["required_experience"].append(signal)

    for signal in behavior_signals:
        if signal in jd_text_lower:
            extracted["behavior_signals"].append(signal)

    for signal in negative_signals:
        if signal in jd_text_lower:
            extracted["negative_signals"].append(signal)

    # Find experience range
    exp_match = re.search(
        r'(\d+)\s*-\s*(\d+)\s*years',
        jd_text_lower
    )

    if exp_match:
        extracted["experience_min"] = int(exp_match.group(1))
        extracted["experience_max"] = int(exp_match.group(2))

    # Detect role family
    if "ai engineer" in jd_text_lower:
        extracted["role_family"] = "AI Engineer"

    elif "backend engineer" in jd_text_lower:
        extracted["role_family"] = "Backend Engineer"

    elif "data scientist" in jd_text_lower:
        extracted["role_family"] = "Data Scientist"

    return extracted