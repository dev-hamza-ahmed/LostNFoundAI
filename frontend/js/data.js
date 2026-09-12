/* =========================================================
   CampusFind — data layer.
   No mock data — everything starts empty and is filled by
   real reports (and later, the backend). Each item may have
   `img` (photo, found items only) and `art` (SVG fallback).
   ========================================================= */

const SEED_ITEMS = [];   // no assumed items — starts empty
const MATCHES = [];      // populated per-report once backend matching is wired in

const STATS = { lost: 0, found: 0, matches: 0, recovered: 0 }; // placeholder until backend provides real counts

/* ---- storage layer (swap for API calls later) ---- */
const DB = {
  KEY: "campusfind_items",
  init(){ if(!localStorage.getItem(this.KEY)) this.reset(); },
  all(){ try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  lost(){ return this.all().filter(i=>i.type==="lost"); },
  found(){ return this.all().filter(i=>i.type==="found"); },
  unresolvedLost(){ return this.all().filter(i=>i.type==="lost" && i.status!=="Recovered"); },
  get(id){ return this.all().find(i=>i.id===id); },
  add(item){ const a=this.all(); a.unshift(item); this._save(a); return item; },
  setStatus(id, status){ const a=this.all(); const it=a.find(i=>i.id===id); if(it){ it.status=status; this._save(a); } },
  reset(){ this._save(SEED_ITEMS); },
  _save(a){ localStorage.setItem(this.KEY, JSON.stringify(a)); }
};
DB.init();

function matchesFor(lostId){ return MATCHES.filter(m=>m.lostId===lostId).sort((a,b)=>b.score-a.score); }

/* live stat counts — no more hardcoded numbers */
function liveStats(){
  return {
    lost: DB.unresolvedLost().length,
    found: DB.found().length,
    matches: ACTIVE_LOST_ID ? matchesFor(ACTIVE_LOST_ID).length : 0
  };
}

/* tracks the most recently submitted lost report — matches screen
   only shows content tied to this, never a hardcoded item */
let ACTIVE_LOST_ID = localStorage.getItem("campusfind_active_lost_id") || null;
function setActiveLostId(id){ ACTIVE_LOST_ID = id; localStorage.setItem("campusfind_active_lost_id", id); }