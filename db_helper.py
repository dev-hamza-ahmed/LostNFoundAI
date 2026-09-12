import streamlit as st
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient

@st.cache_resource
def get_db():
    client = MongoClient(st.secrets["MONGO_URI"], serverSelectionTimeoutMS=5000)
    return client["lost_n_found"]

def insert_found_item(doc: dict) -> str:
    doc["created_at"] = datetime.utcnow()
    return str(get_db()["found_items"].insert_one(doc).inserted_id)

def insert_lost_item(doc: dict) -> str:
    doc["created_at"] = datetime.utcnow()
    return str(get_db()["lost_items"].insert_one(doc).inserted_id)

def get_all_found_items() -> list:
    return list(get_db()["found_items"].find())

def delete_found_item(item_id: str):
    get_db()["found_items"].delete_one({"_id": ObjectId(item_id)})

def count_lost_items() -> int:
    return get_db()["lost_items"].count_documents({})

def count_found_items() -> int:
    return get_db()["found_items"].count_documents({})