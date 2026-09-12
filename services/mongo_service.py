"""
MongoDB Atlas connection + CRUD. Two collections: 'lost_items', 'found_items'.
Flexible schema is the point here — different item types carry different
feature fields, so we don't force a fixed set of columns.
"""
from pymongo import MongoClient
from utils.config import MONGO_URI

_client = MongoClient(MONGO_URI)
_db = _client["lost_n_found"]
lost_items = _db["lost_items"]
found_items = _db["found_items"]


def insert_lost_item(doc: dict) -> str:
    # TODO: insert doc (features, embedding, location, time, reporter info)
    raise NotImplementedError


def insert_found_item(doc: dict) -> str:
    # TODO: same shape as insert_lost_item, for the found_items collection
    raise NotImplementedError


def get_all_found_items() -> list[dict]:
    # TODO: return list(found_items.find())
    raise NotImplementedError
