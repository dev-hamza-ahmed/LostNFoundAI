import streamlit as st
from gemini_helper import extract_features
from matcher import embed, features_to_text, find_matches
from db_helper import (
    insert_found_item, insert_lost_item, get_all_found_items,
    delete_found_item, count_lost_items, count_found_items,
)

st.set_page_config(page_title="Campus Lost n Found AI", page_icon="🎒", layout="wide")
st.title("🎒 Campus Lost n Found AI")

@st.cache_data(ttl=5)
def get_stats():
    return count_lost_items(), count_found_items()

lost_count, found_count = get_stats()
c1, c2, c3 = st.columns(3)
c1.metric("Lost Items", lost_count)
c2.metric("Found Items", found_count)
c3.metric("Total", lost_count + found_count)

st.divider()
col_found, col_lost = st.columns(2)

with col_found:
    st.subheader("📦 Report a Found Item")
    f_image = st.file_uploader("Photo *", type=["png", "jpg", "jpeg"], key="f_img")
    f_desc = st.text_area("Description (optional)", key="f_desc")
    f_loc = st.text_input("Where found?", key="f_loc")
    f_contact = st.text_input("Your contact *", key="f_contact")

    if st.button("Submit Found Item", use_container_width=True):
        if not f_image or not f_contact:
            st.error("Photo and contact required.")
        else:
            with st.spinner("Extracting features with AI..."):
                features = extract_features(f_image.getvalue(), f_image.type, f_desc)
            vector = embed(features_to_text(features) + " " + f_desc)
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
    l_image = st.file_uploader("Photo (optional)", type=["png", "jpg", "jpeg"], key="l_img")
    l_desc = st.text_area("Description *", key="l_desc")
    l_contact = st.text_input("Your contact *", key="l_contact")

    if st.button("Submit & Find Matches", use_container_width=True):
        if not l_desc.strip() and not l_image:
            st.error("Provide a description or photo.")
        elif not l_contact:
            st.error("Contact required.")
        else:
            search_text = l_desc
            if l_image:
                with st.spinner("Extracting features from your photo..."):
                    features = extract_features(l_image.getvalue(), l_image.type, l_desc)
                search_text += " " + features_to_text(features)

            vector = embed(search_text)
            insert_lost_item({"description": l_desc, "contact": l_contact, "embedding": vector})
            get_stats.clear()
            st.session_state.matches = find_matches(search_text, get_all_found_items(), top_k=5)

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
        with st.container(border=True):
            c1, c2 = st.columns([4, 1])
            with c1:
                st.write(f"**{item['score']}% match**")
                st.json(item.get("features", {}))
                st.caption(item.get("description", ""))
                st.caption(f"📍 {item.get('found_location', 'Unknown')}")
            with c2:
                if st.button("✅ This is mine", key=f"claim_{item_id}"):
                    delete_found_item(item_id)
                    st.session_state.matches = [m for m in matches if str(m["_id"]) != item_id]
                    get_stats.clear()
                    st.rerun()