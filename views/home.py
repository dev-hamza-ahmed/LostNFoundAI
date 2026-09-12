"""Landing view. Replace the hardcoded recent_items list with a
mongo_service.get_recent_items() call once the DB layer is wired in."""
import streamlit as st
from utils.components import render_item_card

def render():
    st.markdown("""
    <div class="banner">
        <span style="color:#2563EB; font-weight:600;">WELCOME TO</span>
        <h1 style="margin:4px 0;">Campus Lost n Found <span style="color:#2563EB;">AI</span></h1>
        <p style="color:#475569;">An intelligent Lost & Found system that helps you find lost items
        and reunite with your belongings using the power of AI.</p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    for col, icon, label in zip(
        [c1, c2, c3, c4],
        ["📷", "🧠", "🔍", "🛡️"],
        ["Upload\nItem Details", "AI Analyzes\nFeatures", "Finds Best\nMatches", "Connects\nOwners"],
    ):
        with col:
            st.markdown(f"<div style='text-align:center;'>{icon}<br><b>{label}</b></div>", unsafe_allow_html=True)

    st.subheader("Recent Items")
    # TODO: swap for mongo_service.get_recent_items(limit=4)
    recent_items = [
        ("Lost", "Backpack", "Black backpack with Lenovo logo", "Library", "Apr 25, 2025"),
        ("Found", "iPhone 14", "Blue iPhone with clear case", "Cafeteria", "Apr 24, 2025"),
        ("Lost", "Keys", "Car keys with a blue keychain", "Engineering Block", "Apr 23, 2025"),
        ("Found", "Laptop", "Dell laptop, black color", "Student Center", "Apr 22, 2025"),
    ]
    cols = st.columns(4)
    for col, (badge, title, sub, loc, when) in zip(cols, recent_items):
        with col:
            render_item_card("https://placehold.co/300x200", badge, title, sub, loc, when)

    st.markdown('<div class="banner">', unsafe_allow_html=True)
    left, right = st.columns([3, 1])
    with left:
        st.markdown("**🧠 AI-Powered Matching**")
        st.caption("Our AI analyzes images and descriptions to find the best matches between lost and found items.")
    with right:
        if st.button("Start Searching →", use_container_width=True):
            st.session_state.page = "Possible Matches"
            st.rerun()
    st.markdown('</div>', unsafe_allow_html=True)