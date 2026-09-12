import numpy as np
from services.embedding_service import embed_text

def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / denom) if denom else 0.0

def find_matches(query_text: str, candidates: list[dict], top_k: int = 5) -> list[dict]:
    query_vec = embed_text(query_text)
    scored = []
    for item in candidates:
        if "embedding" not in item:
            continue
        sim = cosine_similarity(query_vec, item["embedding"])
        scored.append({**item, "score": round(max(sim, 0) * 100)})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]