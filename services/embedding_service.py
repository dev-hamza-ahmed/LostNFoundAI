"""
Local, free, unlimited embeddings — no API calls, so no rate limits while
you're testing the matching logic repeatedly.

Text features -> sentence-transformers (e.g. 'all-MiniLM-L6-v2').
Optional: image -> CLIP embedding, if you want visual similarity too.
"""
# from sentence_transformers import SentenceTransformer
# _text_model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(text: str) -> list[float]:
    """Turn a feature summary string into a vector."""
    # TODO: return _text_model.encode(text).tolist()
    raise NotImplementedError


def embed_image(image_bytes: bytes) -> list[float]:
    """Optional: CLIP image embedding for visual similarity."""
    # TODO: load a CLIP model (open_clip or sentence-transformers CLIP wrapper)
    raise NotImplementedError
