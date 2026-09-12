import streamlit as st
from google import genai
from google.genai import types
import json

def get_client():
    return genai.Client(api_key=st.secrets["GEMINI_API_KEY"])

def extract_features(image_bytes, mime_type, description=""):
    """Returns a plain dict — whatever fields Gemini decides fit the item.
    No fixed schema, so a backpack and a phone can have different keys."""
    client = get_client()
    prompt = (
        "Analyze this lost-and-found item photo. Return ONLY a JSON object "
        "(no markdown, no extra text) describing the item. Include whatever "
        "fields genuinely apply — e.g. item_type, color, brand, material, "
        "distinguishing_features, size, condition. Skip fields that don't apply. "
        f"Additional context from the user: {description or 'none provided'}"
    )
    img_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[img_part, prompt],
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return json.loads(response.text)