import streamlit as st
import numpy as np
from sentence_transformers import SentenceTransformer

@st.cache_resource
def get_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

def features_to_text(features: dict) -> str:
    """Flattens whatever fields Gemini returned into one string — works
    regardless of which keys exist, since we never assume a fixed shape."""
    return " ".join(str(v) for v in features.values() if v)

def embed(text: str):
    return get_model().encode(text).tolist()

def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / denom) if denom else 0.0

def find_matches(query_text: str, candidates: list, top_k: int = 5) -> list:
    query_vec = embed(query_text)
    scored = []
    for item in candidates:
        if "embedding" not in item:
            continue
        sim = cosine_similarity(query_vec, item["embedding"])
        scored.append({**item, "score": round(max(sim, 0) * 100)})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]