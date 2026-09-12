"""
Image -> structured JSON feature extraction, via Gemini (google-genai SDK).
This is the piece you already validated in the Colab test — move that working
client.models.generate_content(...) call here, reading the API key from
utils.config instead of a text_input.
"""
from google import genai
from google.genai import types
from models.schemas import ItemFeatures
from utils.config import GEMINI_API_KEY

_client = genai.Client(api_key=GEMINI_API_KEY)
_MODEL = "gemini-3.5-flash-lite"


def extract_features(image_bytes: bytes, mime_type: str, description: str = "") -> ItemFeatures:
    """Send a photo (+ optional description) to Gemini and return parsed features."""
    img_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    prompt = (
        "Analyze this lost-and-found item photo. Extract its type, colors, "
        "brand if visible, material, and any distinguishing features. "
        f"Additional context: {description or 'none provided'}"
    )
    response = _client.models.generate_content(
        model=_MODEL,
        contents=[img_part, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ItemFeatures,
        ),
    )
    return ItemFeatures.model_validate_json(response.text)
