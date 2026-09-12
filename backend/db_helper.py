from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from config import MONGO_URI

_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
_db = _client["campusfind"]
lost_items = _db["lost_items"]
found_items = _db["found_items"]


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def insert_found_item(doc: dict) -> str:
    doc["status"] = "Searching"
    doc["created_at"] = datetime.utcnow()
    return str(found_items.insert_one(doc).inserted_id)


def insert_lost_item(doc: dict) -> str:
    doc["status"] = "Searching"
    doc["created_at"] = datetime.utcnow()
    return str(lost_items.insert_one(doc).inserted_id)


def get_all_found_items() -> list:
    return [_serialize(d) for d in found_items.find()]


def get_unresolved_lost_items() -> list:
    return [_serialize(d) for d in lost_items.find({"status": {"$ne": "Recovered"}})]


def get_found_item(item_id: str) -> dict:
    doc = found_items.find_one({"_id": ObjectId(item_id)})
    return _serialize(doc) if doc else None


def get_lost_item(item_id: str) -> dict:
    doc = lost_items.find_one({"_id": ObjectId(item_id)})
    return _serialize(doc) if doc else None


def delete_found_item(item_id: str):
    found_items.delete_one({"_id": ObjectId(item_id)})


def set_lost_status(item_id: str, status: str):
    lost_items.update_one({"_id": ObjectId(item_id)}, {"$set": {"status": status}})


def count_lost_items() -> int:
    return lost_items.count_documents({"status": {"$ne": "Recovered"}})


def count_found_items() -> int:
    return found_items.count_documents({})