"""
Reads secrets from Streamlit's st.secrets when deployed on Streamlit Cloud,
falling back to environment variables for local/Colab runs.
"""
import os

try:
    import streamlit as st
    GEMINI_API_KEY = st.secrets["GEMINI_API_KEY"]
    MONGO_URI = st.secrets["MONGO_URI"]
except Exception:
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    MONGO_URI = os.environ.get("MONGO_URI", "")
