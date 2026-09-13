# Lost n Found AI

Lost n Found AI is an AI-powered Lost and Found system designed to help users report lost or found items and discover potential matches more efficiently. The system uses Gemini AI to analyze found-item images and generate semantic representations that can be compared with lost-item descriptions.

## Problem Statement

Traditional Lost and Found systems mainly depend on manually searching through item descriptions or images. This makes it difficult and time-consuming to identify whether a reported lost item matches an item that has already been found.

## Problem Solution

Lost n Found AI uses Gemini AI to analyze found-item images and extract meaningful item information. Lost-item descriptions and found-item details are converted into embeddings and compared using semantic similarity, with location relevance also considered. The system presents the most relevant potential matches to the user, who can then verify ownership before recovery.

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- FastAPI
- NumPy
- MongoDB

### AI & External Services
- Google Gemini API for image analysis and embeddings
- MongoDB Atlas for database storage
- Cloudinary for image storage
- Vercel for deployment

## Project Structure

```text
LostNFoundAI/
│
├── backend/
│   ├── api/
│   │   └── index.py
│   ├── cloudinary_helper.py
│   ├── config.py
│   ├── db_helper.py
│   ├── gemini_helper.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   └── logo.png
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   └── art.js
│   ├── index.html
│   └── README.md
│
├── .gitignore
├── README.md
└── vercel.json