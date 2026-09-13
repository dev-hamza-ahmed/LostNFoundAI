import numpy as np
from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from gemini_helper import extract_features, embed_text, features_to_text
from cloudinary_helper import upload_image
from db_helper import (
    insert_found_item, insert_lost_item, get_all_found_items,
    get_unresolved_lost_items, get_found_item, get_lost_item,
    delete_found_item, set_lost_status, count_lost_items, count_found_items,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / denom) if denom else 0.0


def location_boost(lost_text: str, found_location: str) -> float:
    if not found_location:
        return 0.0
    lost_lower = lost_text.lower()
    words = [w.strip(".,") for w in found_location.lower().split() if len(w) > 3]
    return 8.0 if any(w in lost_lower for w in words) else 0.0


def find_matches(query_text: str, candidates: list, top_k: int = 5) -> list:
    query_vec = embed_text(query_text)
    scored = []
    for item in candidates:
        if "embedding" not in item:
            continue
        sim = cosine_similarity(query_vec, item["embedding"]) * 100
        sim += location_boost(query_text, item.get("location", ""))
        scored.append({**item, "score": round(min(sim, 100))})
    scored = [item for item in scored if item["score"] >= 75]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]


@app.get("/api/stats")
def stats():
    lost = count_lost_items()
    found = count_found_items()
    return {"lost": lost, "found": found, "total": lost + found}


@app.post("/api/found")
async def report_found(
    image: UploadFile = File(...),
    location: str = Form(""),
    contact: str = Form(...),
    extra: str = Form(""),
):
    image_bytes = await image.read()
    features = extract_features(image_bytes, image.content_type, extra)
    image_url = upload_image(image_bytes)
    vector = embed_text(f"{features_to_text(features)} {extra} {location}")

    item_id = insert_found_item({
        "features": features,
        "location": location,
        "contact": contact,
        "extra": extra,
        "image_url": image_url,
        "embedding": vector,
    })
    return {"id": item_id, "features": features, "image_url": image_url}


@app.get("/api/found")
def list_found():
    return get_all_found_items()


@app.delete("/api/found/{item_id}")
def claim_found(item_id: str):
    item = get_found_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    delete_found_item(item_id)
    return {"deleted": True}


@app.post("/api/lost")
def report_lost(
    description: str = Form(...),
    location: str = Form(...),
    date: str = Form(""),
    time: str = Form(""),
):
    search_text = f"{description} {location}"
    vector = embed_text(search_text)
    item_id = insert_lost_item({
        "description": description,
        "location": location,
        "date": date,
        "time": time,
        "embedding": vector,
    })
            matches = find_matches(search_text, get_all_found_items(), top_k=5)
    return {"id": item_id, "matches": matches}


@app.get("/api/lost")
def list_lost():
    return get_unresolved_lost_items()


@app.post("/api/lost/{item_id}/recover")
def mark_recovered(item_id: str):
    item = get_lost_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    set_lost_status(item_id, "Recovered")
    return {"recovered": True}