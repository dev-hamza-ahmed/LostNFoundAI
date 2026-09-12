import streamlit as st
from gemini_helper import extract_features
from matcher import embed, features_to_text, find_matches
from db_helper import (
    insert_found_item, insert_lost_item, get_all_found_items,
    delete_found_item, count_lost_items, count_found_items,
)

st.set_page_config(page_title="Campus Lost n Found AI", page_icon="🎒", layout="wide")

st.markdown("""
<style>
.stApp { background: linear-gradient(180deg, #F0F6FF 0%, #FFFFFF 100%); }
.hero {
    background: linear-gradient(135deg, #1E3A8A, #3B82F6);
    color: white; border-radius: 16px; padding: 28px 32px; margin-bottom: 20px;
}
.hero h1 { margin: 0; font-size: 28px; }
.hero p { margin: 6px 0 0; opacity: 0.9; }
div[data-testid="stMetric"] {
    background: white; border-radius: 12px; padding: 12px 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.match-card {
    background: white; border-radius: 12px; padding: 16px; margin-bottom: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08); border-left: 4px solid #3B82F6;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <h1>🎒 Campus Lost n Found AI</h1>
    <p>Upload, describe, and let AI find the match for you.</p>
</div>
""", unsafe_allow_html=True)

@st.cache_data(ttl=5)
def get_stats():
    return count_lost_items(), count_found_items()

lost_count, found_count = get_stats()
c1, c2, c3 = st.columns(3)
c1.metric("🔴 Lost Items", lost_count)
c2.metric("🟢 Found Items", found_count)
c3.metric("🔵 Total", lost_count + found_count)

st.divider()
col_found, col_lost = st.columns(2)

with col_found:
    st.subheader("📦 Report a Found Item")
    f_image = st.file_uploader("Upload item photo *", type=["png", "jpg", "jpeg"], key="f_img")
    f_desc = st.text_area("Description (optional)", key="f_desc", placeholder="Any extra detail not obvious from the photo")
    f_loc = st.text_input("Where did you find it? (optional)", key="f_loc", placeholder="e.g., Library, Cafeteria")
    f_contact = st.text_input("Your contact number *", key="f_contact")

    if st.button("💾 Save to Database", use_container_width=True, key="save_found"):
        if not f_image or not f_contact:
            st.error("Photo and contact number are required.")
        else:
            with st.spinner("Extracting features with AI..."):
                features = extract_features(f_image.getvalue(), f_image.type, f_desc)
            # location included here so lost-item descriptions mentioning
            # a place have something to semantically match against
            embed_text = f"{features_to_text(features)} {f_desc} {f_loc}"
            vector = embed(embed_text)
            insert_found_item({
                "features": features,
                "description": f_desc,
                "found_location": f_loc,
                "finder_contact": f_contact,
                "embedding": vector,
            })
            st.success("Saved to database.")
            st.json(features)
            get_stats.clear()

with col_lost:
    st.subheader("💼 Report a Lost Item")
    l_desc = st.text_area(
        "Describe what you lost *", key="l_desc", height=180,
        placeholder="e.g., Black backpack with Lenovo logo, lost near the library yesterday afternoon."
    )

    if st.button("🔍 Find Matches", use_container_width=True, key="find_matches"):
        if not l_desc.strip():
            st.error("Please describe the item.")
        else:
            vector = embed(l_desc)
            insert_lost_item({"description": l_desc, "embedding": vector})
            get_stats.clear()
            st.session_state.matches = find_matches(l_desc, get_all_found_items(), top_k=5)

st.divider()
st.subheader("✨ Possible Matches")
matches = st.session_state.get("matches")

if matches is None:
    st.caption("Submit a lost item above to see matches here.")
elif not matches:
    st.info("No matches found yet.")
else:
    for item in matches:
        item_id = str(item["_id"])
        st.markdown('<div class="match-card">', unsafe_allow_html=True)
        c1, c2 = st.columns([4, 1])
        with c1:
            st.write(f"**{item['score']}% match**")
            st.json(item.get("features", {}))
            if item.get("description"):
                st.caption(item["description"])
            st.caption(f"📍 {item.get('found_location') or 'Location not specified'}")
        with c2:
            if st.button("✅ This is mine", key=f"claim_{item_id}"):
                delete_found_item(item_id)
                st.session_state.matches = [m for m in matches if str(m["_id"]) != item_id]
                get_stats.clear()
                st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)