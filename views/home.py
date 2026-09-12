import streamlit as st
from utils.components import render_item_card
from services.mongo_service import get_recent_items

def render():
    st.markdown("""<div class="banner"><span style="color:#2563EB;font-weight:600;">WELCOME TO</span>
    <h1>Campus Lost n Found <span style="color:#2563EB;">AI</span></h1></div>""", unsafe_allow_html=True)

    st.subheader("Recent Items")
    recent = get_recent_items(limit=4)
    if not recent:
        st.caption("No items reported yet.")
    else:
        cols = st.columns(len(recent))
        for col, (badge, doc) in zip(cols, recent):
            with col:
                title = doc.get("features", {}).get("item_type", "Item").title() if badge == "Found" else "Lost Item"
                render_item_card("https://placehold.co/300x200", badge, title,
                                  doc.get("description", ""),
                                  doc.get("found_location", "—"),
                                  str(doc.get("found_time") or doc.get("created_at", ""))[:16])