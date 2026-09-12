import streamlit as st

LIGHT = {"bg": "#F4F8FC", "card": "#FFFFFF", "text": "#0B2E52", "muted": "#64748B", "border": "rgba(0,0,0,0.08)"}
DARK  = {"bg": "#0F172A", "card": "#1E293B", "text": "#E2E8F0", "muted": "#94A3B8", "border": "rgba(255,255,255,0.08)"}

def inject_css():
    t = DARK if st.session_state.get("theme") == "dark" else LIGHT
    st.markdown(f"""
    <style>
    .stApp {{ background-color: {t['bg']}; color: {t['text']}; }}
    section[data-testid="stSidebar"] {{ background-color: {"#020617" if t is DARK else "#0B2E52"}; }}
    .stat-card, .item-card, .tips-box {{
        background: {t['card']}; border-radius: 12px; padding: 16px 20px;
        box-shadow: 0 1px 3px {t['border']}; margin-bottom: 12px; color: {t['text']};
    }}
    .stat-icon {{ width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }}
    .stat-number {{ font-size: 22px; font-weight: 700; }}
    .stat-label {{ font-size: 13px; color: {t['muted']}; }}
    .badge-lost {{ background: #FEE2E2; color: #DC2626; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
    .badge-found {{ background: #D1FAE5; color: #059669; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
    .badge-match-high {{ background: #D1FAE5; color: #059669; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
    .badge-match-mid {{ background: #DBEAFE; color: #2563EB; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
    .badge-match-low {{ background: #EDE9FE; color: #7C3AED; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
    .banner {{ background: linear-gradient(135deg, #1E3A8A22, #3B82F622); border-radius: 16px; padding: 24px; margin-bottom: 20px; }}
    </style>
    """, unsafe_allow_html=True)