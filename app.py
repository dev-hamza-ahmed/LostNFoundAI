import streamlit as st
from utils.styles import inject_css
from utils.components import render_search_bar, render_stats_panel
from services.mongo_service import count_lost_items, count_found_items, get_all_found_items
from services.matching_service import find_matches
from views import home, report_lost, report_found, possible_matches

st.set_page_config(page_title="Campus Lost n Found AI", page_icon="🎒", layout="wide")

if "theme" not in st.session_state: st.session_state.theme = "light"
if "page" not in st.session_state: st.session_state.page = "Home"

inject_css()

with st.sidebar:
    st.markdown("### 🎒 Campus\nLost n Found **AI**")
    for label, icon in [("Home", "🏠"), ("Lost Items", "💼"), ("Found Items", "📦"), ("Settings", "⚙️")]:
        if st.button(f"{icon}  {label}", key=f"nav_{label}", use_container_width=True):
            st.session_state.page = label
    st.markdown("---")
    st.caption("Lost something? Found something? We help bring them back.")

query, searched = render_search_bar()
if searched and query.strip():
    results = find_matches(query, get_all_found_items(), top_k=5)
    st.session_state.match_results = results
    st.session_state.lost_item_id = None
    st.session_state.page = "Possible Matches"
    st.rerun()

left, right = st.columns([3, 1])
with left:
    page = st.session_state.page
    if page == "Home": home.render()
    elif page == "Lost Items": report_lost.render()
    elif page == "Found Items": report_found.render()
    elif page == "Possible Matches": possible_matches.render()
    elif page == "Settings":
        st.subheader("⚙️ Settings")
        dark = st.toggle("🌙 Dark mode", value=(st.session_state.theme == "dark"))
        new_theme = "dark" if dark else "light"
        if new_theme != st.session_state.theme:
            st.session_state.theme = new_theme
            st.rerun()
with right:
    render_stats_panel(total_lost=count_lost_items(), total_found=count_found_items())