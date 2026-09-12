"""Report Lost flow — description-only (no required photo, since the person
lost the item and may not have a picture of it)."""
import streamlit as st

def render():
    st.subheader("💼 Report a Lost Item")
    st.caption("Tell us about the item you lost. Include as many details as you can.")

    description = st.text_area(
        "Item Description *", max_chars=1000,
        placeholder="e.g., Black backpack with Lenovo logo, multiple compartments, red keychain attached. "
                    "Lost near the library on Apr 25, 2025 around 10:30 AM."
    )
    if st.button("📨 Submit Lost Item", use_container_width=False):
        if not description.strip():
            st.error("Please describe the item.")
            return
        # TODO: embed_text(description) -> matching_service.find_matches(...) -> mongo_service.insert_lost_item(...)
        st.success("Lost item reported. Check Possible Matches for AI suggestions.")
        st.session_state.page = "Possible Matches"
        st.rerun()