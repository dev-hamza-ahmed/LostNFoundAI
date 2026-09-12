"""Renders ranked matches from matching_service.find_matches(). Hardcoded
sample data below — replace with the real call once matching_service is done."""
import streamlit as st

def _badge_class(score):
    if score >= 85: return "badge-match-high", "✔ High Match"
    if score >= 70: return "badge-match-mid", "✔ Good Match"
    return "badge-match-low", "Possible Match"

def render():
    st.markdown("""
    <div class="banner">
        <b>✨ AI Found Possible Matches</b>
        <p style="color:#475569; margin-top:6px;">
        Here are the most relevant matches based on your report.</p>
    </div>
    """, unsafe_allow_html=True)

    # TODO: matches = matching_service.find_matches(lost_item)
    matches = [
        ("Black Backpack", 92, "Library", "Apr 25, 2025 · 10:30 AM", "Black backpack with Lenovo logo. Multiple compartments and a red keychain attached."),
        ("iPhone 14", 78, "Cafeteria", "Apr 24, 2025 · 02:15 PM", "Blue iPhone with clear case. Apple logo visible on the back. In good condition."),
        ("Keys", 65, "Engineering Block", "Apr 23, 2025 · 11:45 AM", "Car keys with a blue keychain. Includes 3-4 keys."),
    ]
    for title, score, loc, when, desc in matches:
        cls, label = _badge_class(score)
        st.markdown('<div class="item-card">', unsafe_allow_html=True)
        c1, c2 = st.columns([4, 1])
        with c1:
            st.markdown(f"**{title}** <span class='{cls}'>{label}</span>", unsafe_allow_html=True)
            st.caption(f"📍 {loc}    🕐 {when}")
            st.write(desc)
        with c2:
            st.markdown(f"<h3 style='text-align:right;'>{score}%</h3>", unsafe_allow_html=True)
            st.button("View Details →", key=f"view_{title}")
        st.markdown('</div>', unsafe_allow_html=True)