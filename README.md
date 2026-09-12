# Lost n Found AI

AI-powered campus Lost & Found — report items, extract features from photos with
Gemini, embed + match with local models, verify and recover.

## Data flow
1. `pages/1_Report_Lost.py` / `pages/2_Report_Found.py` collect photo + description.
2. `services/gemini_service.py` sends the photo to Gemini and gets back structured
   JSON (type, color, brand, distinguishing features).
3. `services/embedding_service.py` turns those features (+ description) into a
   vector locally (no API call, no rate limit).
4. `services/mongo_service.py` stores the document (raw features, embedding,
   location, time) in MongoDB Atlas — one collection for lost, one for found.
5. `services/matching_service.py` compares a lost item's vector against all found
   items (or vice versa) and returns a ranked list with match %.
6. `pages/3_Possible_Matches.py` shows the ranked list.
7. `pages/4_Verify_Recovery.py` handles the verification step before revealing
   contact/recovery info.

## Setup
1. `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` (local) or fill `.streamlit/secrets.toml` (Streamlit Cloud)
   with `GEMINI_API_KEY` and `MONGO_URI`.
3. `streamlit run app.py`
