import os
from dotenv import load_dotenv

load_dotenv()  # no-op on Vercel, where env vars come from the dashboard instead

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
MONGO_URI = os.environ["MONGO_URI"]
CLOUDINARY_CLOUD_NAME = os.environ["CLOUDINARY_CLOUD_NAME"]
CLOUDINARY_API_KEY = os.environ["CLOUDINARY_API_KEY"]
CLOUDINARY_API_SECRET = os.environ["CLOUDINARY_API_SECRET"]