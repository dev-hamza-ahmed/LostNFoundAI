import streamlit as st
from services.gemini_service import extract_features
from services.embedding_service import embed_text
from services.mongo_service import insert_found_item

def render():
    st.subheader("📦 Report a Found Item")
    uploaded = st.file_uploader("Upload Item Image *", type=["png", "jpg", "jpeg"])
    description = st.text_area("Item Description (Optional)", max_chars=500)
    col1, col2 = st.columns(2)
    with col1: found_date = st.date_input("When was it found?")
    with col2: found_time = st.time_input("Time")
    location = st.text_input("Where was it found?")
    contact = st.text_input("Contact Details *")

    if st.button("📨 Submit Found Item", use_container_width=True):
        if not uploaded or not contact:
            st.error("Image and contact details are required.")
            return
        with st.spinner("Analyzing image with AI..."):
            features = extract_features(uploaded.getvalue(), uploaded.type, description)

        summary = f"{features.item_type} {features.primary_color} {features.brand or ''} " \
                  f"{' '.join(features.distinguishing_features)} {description}"
        vector = embed_text(summary)

        insert_found_item({
            "features": features.model_dump(),
            "description": description,
            "found_location": location,
            "found_time": f"{found_date} {found_time}",
            "finder_contact": contact,
            "embedding": vector,
        })
        st.success(f"Saved! {features.item_type.title()} ({features.primary_color}) added to Found Items.")