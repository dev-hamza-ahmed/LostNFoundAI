/* =========================================================
   CampusFind — backend API layer.
   Same-origin on Vercel (empty base). If you ever run the
   frontend and backend on different local ports, set API_BASE
   to e.g. "http://127.0.0.1:8000".
   ========================================================= */
const API_BASE = "";

const CACHE = { found: [], lost: [], lastMatches: [], activeLostId: null, stats: {lost:0,found:0,total:0} };

async function apiStats(){
  const res = await fetch(`${API_BASE}/api/stats`);
  CACHE.stats = await res.json();
  return CACHE.stats;
}
async function apiListFound(){
  const res = await fetch(`${API_BASE}/api/found`);
  CACHE.found = await res.json();
  return CACHE.found;
}
async function apiListLost(){
  const res = await fetch(`${API_BASE}/api/lost`);
  CACHE.lost = await res.json();
  return CACHE.lost;
}
async function apiReportFound(file, location, contact, extra){
  const fd = new FormData();
  fd.append("image", file);
  fd.append("location", location);
  fd.append("contact", contact);
  fd.append("extra", extra);
  const res = await fetch(`${API_BASE}/api/found`, { method:"POST", body: fd });
  if(!res.ok) throw new Error(await res.text());
  return res.json(); // { id, features, image_url }
}
async function apiReportLost(description, location, date, time){
  const fd = new FormData();
  fd.append("description", description);
  fd.append("location", location);
  fd.append("date", date);
  fd.append("time", time);
  const res = await fetch(`${API_BASE}/api/lost`, { method:"POST", body: fd });
  if(!res.ok) throw new Error(await res.text());
  return res.json(); // { id, matches }
}
async function apiClaim(foundId){
  const res = await fetch(`${API_BASE}/api/found/${foundId}`, { method:"DELETE" });
  return res.json();
}
async function apiMarkRecovered(lostId){
  const res = await fetch(`${API_BASE}/api/lost/${lostId}/recover`, { method:"POST" });
  return res.json();
}
function findCached(id){
  return CACHE.lastMatches.find(i=>i._id===id) ||
         CACHE.found.find(i=>i._id===id) ||
         CACHE.lost.find(i=>i._id===id) ||
         null;
}