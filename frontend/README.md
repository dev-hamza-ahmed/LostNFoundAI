# CampusFind — AI Campus Lost & Found

> Smarter Matching. Faster Recovery.

A production-style, **mobile-first** frontend for a campus lost & found app. Report lost/found
items, let (mock) AI extract features and suggest **possible** matches, then verify ownership
and recover. Built with **plain HTML, CSS and vanilla JavaScript** — no frameworks.

The core UX principle is visible throughout: **AI suggests possible matches; a human verifies
ownership.** AI never decides ownership.

---

## Run it

No build step. Just open **`index.html`** in a browser.

For clean relative paths (images, scripts) some browsers prefer a local server:

```bash
# from the CampusFind/ folder — any static server works
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000`. The **admin dashboard** is `admin.html` (best on a wide screen).

---

## Project structure

```
CampusFind/
├── index.html        # Mobile app shell (splash, onboarding, all screens)
├── admin.html        # Desktop admin dashboard shell
├── css/
│   └── styles.css    # Single design system (sage/cream theme, all components)
├── js/
│   ├── art.js        # Outline icons (ic) + item illustrations (art) + photo() helper
│   ├── data.js       # Mock data + localStorage layer (DB.*) — swap for a real API
│   ├── app.js        # Mobile SPA: router (go), screen registry, components, interactions
│   └── admin.js      # Admin dashboard: view router + tables
└── images/           # Item photos (.webp). SVG illustrations are used as fallback.
```

## Screens

Splash · Onboarding (×3) · Home · Report Lost · Report Found · AI Analysis · Lost Items ·
Found Items · Possible Matches · Match Details · Verification · Recovery · My Reports ·
Notifications · Profile · **Admin Dashboard** (Dashboard, Lost, Found, Matches, Verification,
Reports, Settings).

## Design system

| Token | Value | Use |
|-------|-------|-----|
| Sage green | `#3F6B5B` | Primary buttons, active nav, AI highlights |
| Cream | `#F7F4ED` | App background |
| Beige | `#C49A6C` | Secondary accent |
| Charcoal | `#1F2925` | Headings & text |
| Success / Warning / Error | `#4F8A68` / `#C58A45` / `#B85C5C` | Status |

Fonts: **Manrope** (headings) + **Inter** (body). All components live in one stylesheet so
every screen shares the same look.

---

## Connecting a backend (PHP / MySQL / API)

All data access goes through the `DB` object in `js/data.js`. To go live, replace those
localStorage methods with API calls and keep the rest of the app unchanged:

```js
const DB = {
  async all()   { return (await fetch('/api/items')).json(); },
  async add(i)  { return (await fetch('/api/items', {method:'POST', body:JSON.stringify(i)})).json(); },
  async get(id) { return (await fetch(`/api/items/${id}`)).json(); },
  // ...setStatus, lost(), found()
};
```

The AI steps (feature extraction, match scoring) are simulated in the frontend
(`runAnalysis` in `app.js`, `MATCHES` in `data.js`); wire them to your Computer-Vision /
LLM endpoints when ready.

## Notes

- **Images:** sample product photos are placeholders from the free [DummyJSON](https://dummyjson.com)
  catalog, stored locally in `images/`. If a photo is missing, the app falls back to a built-in
  SVG illustration automatically — nothing breaks offline.
- **State:** reports you create are saved in `localStorage` (key `campusfind_items`). Clear it to
  reset to the seed data.
