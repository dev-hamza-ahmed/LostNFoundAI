import streamlit as st

def render_search_bar():
    with st.form("search_form"):
        c1, c2 = st.columns([6, 1])
        with c1:
            query = st.text_input("search", placeholder="🔍 Search for lost items... (e.g., laptop, wallet, keys)",
                                   label_visibility="collapsed")
        with c2:
            submitted = st.form_submit_button("Search")
    return query, submitted

def render_stats_panel(total_lost: int, total_found: int):
    st.markdown(f"""
    <div class="stat-card"><div class="stat-icon" style="background:#FEE2E2;">🔴</div>
        <div><div class="stat-label">Total Lost Items</div><div class="stat-number">{total_lost}</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:#D1FAE5;">🟢</div>
        <div><div class="stat-label">Total Found Items</div><div class="stat-number">{total_found}</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:#EDE9FE;">🟣</div>
        <div><div class="stat-label">Total Items</div><div class="stat-number">{total_lost + total_found}</div></div></div>
    <div class="tips-box"><b>💡 Tips</b><br><br>
        ✅ Upload clear images for better matches<br>✅ Include detailed descriptions<br>
        ✅ Verify before contacting the finder</div>
    """, unsafe_allow_html=True)

def render_item_card(image_url, badge_type, title, subtitle, location, when):
    cls = "badge-lost" if badge_type == "Lost" else "badge-found"
    st.markdown('<div class="item-card">', unsafe_allow_html=True)
    st.image(image_url, use_container_width=True)
    st.markdown(f'<span class="{cls}">{badge_type}</span>', unsafe_allow_html=True)
    st.markdown(f"**{title}**")
    st.caption(subtitle)
    st.caption(f"📍 {location}    🗓 {when}")
    st.markdown('</div>', unsafe_allow_html=True)