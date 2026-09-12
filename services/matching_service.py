"""
Weighted similarity scoring between a lost item and candidate found items.
Pure math, runs locally — no external calls, safe to re-run as often as needed.

score = 0.6 * feature/text similarity
      + 0.25 * image similarity (if both have photos)
      + 0.15 * location/time proximity
"""


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    # TODO: standard cosine similarity (or use numpy/scipy)
    raise NotImplementedError


def find_matches(lost_item: dict, found_items: list[dict], top_k: int = 5) -> list[dict]:
    """Return found_items ranked by combined similarity score, highest first."""
    # TODO: for each found_item, compute weighted score, sort, return top_k
    raise NotImplementedError
