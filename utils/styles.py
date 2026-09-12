"""Custom CSS to get the card/badge look the plain Streamlit theme can't give us."""
import streamlit as st

def inject_css():
    st.markdown("""
    <style>
    .stat-card {
        background: white; border-radius: 12px; padding: 16px 20px;
        display: flex; align-items: center; gap: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 12px;
    }
    .stat-icon {
        width: 44px; height: 44px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
    }
    .stat-number { font-size: 22px; font-weight: 700; color: #0B2E52; }
    .stat-label { font-size: 13px; color: #64748B; }

    .item-card {
        background: white; border-radius: 12px; padding: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 14px;
    }
    .badge-lost { background: #FEE2E2; color: #DC2626; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-found { background: #D1FAE5; color: #059669; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-match-high { background: #D1FAE5; color: #059669; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-match-mid { background: #DBEAFE; color: #2563EB; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-match-low { background: #EDE9FE; color: #7C3AED; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

    .tips-box { background: white; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .banner {
        background: linear-gradient(135deg, #DBEAFE, #EFF6FF);
        border-radius: 16px; padding: 24px; margin-bottom: 20px;
    }
    </style>
    """, unsafe_allow_html=True)