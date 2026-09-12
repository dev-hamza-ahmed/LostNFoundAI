"""Report Found flow — plugs into the Gemini extraction you already validated."""
import streamlit as st
from services.gemini_service import extract_features
# from services.embedding_service import embed_text
# from services.mongo_service import insert_found_item

def render():
    st.subheader("📦 Report a Found Item")
    st.caption("Found something on campus? Help its owner get it back.")

    uploaded = st.file_uploader("Upload Item Image *", type=["png", "jpg", "jpeg"])
    description = st.text_area("Item Description (Optional)", max_chars=500,
                                placeholder="e.g., Black backpack, Nike brand, 15-inch, has a red keychain, etc...")
    col1, col2 = st.columns(2)
    with col1:
        found_date = st.date_input("When was it found?")
    with col2:
        found_time = st.time_input("Time")
    location = st.text_input("Where was it found?", placeholder="e.g., Library, Cafeteria, Block A")
    contact = st.text_input("Contact Details *", placeholder="+92 300 1234567")

    c1, c2 = st.columns([1, 1])
    with c1:
        st.button("🔄 Reset")
    with c2:
        if st.button("📨 Submit Found Item", use_container_width=True):
            if not uploaded or not contact:
                st.error("Image and contact details are required.")
                return
            with st.spinner("Analyzing image with AI..."):
                features = extract_features(uploaded.getvalue(), uploaded.type, description)
            st.success("Item analyzed and ready to save:")
            st.json(features.model_dump())
            # TODO: embed_text(...) + insert_found_item({...})