"""
Vercel's Python runtime doesn't run ASGI apps (FastAPI/Starlette) directly —
it expects a WSGI-style app. a2wsgi bridges that gap so main.py's FastAPI
app can run as a Vercel serverless function without any other changes.
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from a2wsgi import ASGIMiddleware
from main import app as fastapi_app

app = ASGIMiddleware(fastapi_app)