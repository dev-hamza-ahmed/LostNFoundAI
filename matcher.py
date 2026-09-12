import streamlit as st
import numpy as np
from sentence_transformers import SentenceTransformer

@st.cache_resource
def get_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

def features_to_text(features: dict) -> str:
    return " ".join(str(v) for v in features.values() if v)

def embed(text: str):
    return get_model().encode(text).tolist()

def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / denom) if denom else 0.0

def location_boost(lost_text: str, found_location: str) -> float:
    """Small score bump if a word from the found item's location appears
    directly in the lost description — catches exact place-name matches
    that semantic similarity alone tends to miss."""
    if not found_location:
        return 0.0
    lost_text_lower = lost_text.lower()
    words = [w.strip(".,") for w in found_location.lower().split() if len(w) > 3]
    return 8.0 if any(w in lost_text_lower for w in words) else 0.0

def find_matches(query_text: str, candidates: list, top_k: int = 5) -> list:
    query_vec = embed(query_text)
    scored = []
    for item in candidates:
        if "embedding" not in item:
            continue
        sim = cosine_similarity(query_vec, item["embedding"]) * 100
        sim += location_boost(query_text, item.get("found_location", ""))
        scored.append({**item, "score": round(min(sim, 100))})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]