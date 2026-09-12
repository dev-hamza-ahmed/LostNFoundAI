import streamlit as st
from streamlit_option_menu import option_menu
from utils.styles import inject_css
from utils.components import render_search_bar, render_stats_panel
from views import home, report_lost, report_found, possible_matches

st.set_page_config(page_title="Campus Lost n Found AI", page_icon="🎒", layout="wide")
inject_css()

if "page" not in st.session_state:
    st.session_state.page = "Home"

with st.sidebar:
    st.markdown("### 🎒 Campus\nLost n Found **AI**")
    nav_options = ["Home", "Lost Items", "Found Items", "Settings"]
    default_idx = nav_options.index(st.session_state.page) if st.session_state.page in nav_options else 0
    selected = option_menu(
        menu_title=None,
        options=nav_options,
        icons=["house", "briefcase", "clipboard-check", "gear"],
        default_index=default_idx,
    )
    if selected != st.session_state.page:
        st.session_state.page = selected
    st.markdown("---")
    st.caption("Lost something? Found something? We help bring them back.")

render_search_bar()

left, right = st.columns([3, 1])
with left:
    page = st.session_state.page
    if page == "Home":
        home.render()
    elif page == "Lost Items":
        report_lost.render()
    elif page == "Found Items":
        report_found.render()
    elif page == "Possible Matches":
        possible_matches.render()
    elif page == "Settings":
        st.subheader("⚙️ Settings")
        st.caption("Placeholder — theme, notification, account settings go here.")
with right:
    render_stats_panel(total_lost=124, total_found=186)