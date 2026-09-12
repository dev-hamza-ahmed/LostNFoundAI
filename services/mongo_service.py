from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from utils.config import MONGO_URI

_client = MongoClient(MONGO_URI)
_db = _client["lost_n_found"]
lost_items = _db["lost_items"]
found_items = _db["found_items"]

def insert_lost_item(doc: dict) -> str:
    doc["created_at"] = datetime.utcnow()
    return str(lost_items.insert_one(doc).inserted_id)

def insert_found_item(doc: dict) -> str:
    doc["created_at"] = datetime.utcnow()
    return str(found_items.insert_one(doc).inserted_id)

def get_all_found_items() -> list[dict]:
    return list(found_items.find())

def get_recent_items(limit: int = 4) -> list[dict]:
    lost = [("Lost", d) for d in lost_items.find().sort("created_at", -1).limit(limit)]
    found = [("Found", d) for d in found_items.find().sort("created_at", -1).limit(limit)]
    combined = lost + found
    combined.sort(key=lambda x: x[1].get("created_at", datetime.min), reverse=True)
    return combined[:limit]

def count_lost_items() -> int:
    return lost_items.count_documents({})

def count_found_items() -> int:
    return found_items.count_documents({})

def delete_found_item(item_id: str):
    found_items.delete_one({"_id": ObjectId(item_id)})

def delete_lost_item(item_id: str):
    lost_items.delete_one({"_id": ObjectId(item_id)})

def resolve_match(lost_item_id, found_item_id: str):
    """Called when the user confirms 'this is mine' — removes the found item
    (and the lost report too, if this came from a formal Lost Item submission)."""
    delete_found_item(found_item_id)
    if lost_item_id:
        delete_lost_item(lost_item_id)