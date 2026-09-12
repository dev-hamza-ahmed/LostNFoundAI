import streamlit as st
from services.embedding_service import embed_text
from services.matching_service import find_matches
from services.mongo_service import insert_lost_item, get_all_found_items

def render():
    st.subheader("💼 Report a Lost Item")
    description = st.text_area("Item Description *", max_chars=1000)
    if st.button("📨 Submit Lost Item"):
        if not description.strip():
            st.error("Please describe the item.")
            return
        vector = embed_text(description)
        lost_id = insert_lost_item({"description": description, "embedding": vector})
        results = find_matches(description, get_all_found_items(), top_k=5)
        st.session_state.lost_item_id = lost_id
        st.session_state.match_results = results
        st.session_state.page = "Possible Matches"
        st.rerun()