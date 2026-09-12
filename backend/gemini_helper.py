import json
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

_client = genai.Client(api_key=GEMINI_API_KEY)


def extract_features(image_bytes: bytes, mime_type: str, extra_context: str = "") -> dict:
    """Image -> flexible JSON dict. No fixed schema, so a backpack and a phone
    can end up with different keys — whatever Gemini decides genuinely applies."""
    prompt = (
        "Analyze this lost-and-found item photo. Return ONLY a JSON object "
        "(no markdown, no extra text) describing the item. Include whatever "
        "fields genuinely apply — e.g. item_type, color, brand, material, "
        "distinguishing_features, size, condition. Skip fields that don't apply. "
        f"Additional context from the finder: {extra_context or 'none provided'}"
    )
    img_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    response = _client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[img_part, prompt],
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return json.loads(response.text)


def embed_text(text: str) -> list:
    """Text -> embedding vector, via Gemini's embedding API (no local model,
    keeps the deployment small enough for Vercel's serverless size limit)."""
    result = _client.models.embed_content(model="gemini-embedding-001", contents=text)
    return result.embeddings[0].values


def features_to_text(features: dict) -> str:
    return " ".join(str(v) for v in features.values() if v)