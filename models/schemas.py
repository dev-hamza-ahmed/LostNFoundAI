"""
Pydantic models. ItemFeatures matches the response_schema you already tested
against Gemini in Colab — keep this as the single source of truth for that shape.
"""
from typing import List, Optional
from pydantic import BaseModel


class ItemFeatures(BaseModel):
    item_type: str
    primary_color: str
    secondary_colors: Optional[List[str]] = None
    brand: Optional[str] = None
    material: Optional[str] = None
    distinguishing_features: List[str]
    condition: Optional[str] = None


class LostItem(BaseModel):
    features: ItemFeatures
    description: str
    last_seen_location: str
    last_seen_time: str
    reporter_contact: str


class FoundItem(BaseModel):
    features: ItemFeatures
    description: str
    found_location: str
    found_time: str
    finder_contact: str
