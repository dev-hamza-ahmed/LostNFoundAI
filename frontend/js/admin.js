/* =========================================================
   CampusFind — Admin dashboard (multi-view, vanilla JS).
   Uses ic(), art(), DB, MATCHES, STATS from art.js/data.js.
   ========================================================= */

const stMap = { "Searching":"st-searching","Possible Match":"st-match","Under Verification":"st-verify","Recovered":"st-recovered" };
const $$ = s => document.querySelector(s);
let adminQ = "";

function typePill(t){ return `<span class="tag" style="background:${t==='lost'?'var(--beige-bg)':'var(--success-bg)'};color:${t==='lost'?'#9c6d33':'var(--success)'}">${t==='lost'?'Lost':'Found'}</span>`; }
function stBadge(st){ return `<span class="status-badge ${stMap[st]||'st-searching'}"><span class="dot"></span>${st}</span>`; }
function thumb(i){ return `<div class="art-wrap" style="width:36px;height:36px;border-radius:9px">${photo(i)}</div>`; }

function itemTable(items, opts={}){
  if(!items.length) return `<div class="empty" style="padding:40px"><div class="ei">${ic("search")}</div><h3>Nothing here</h3><p>No items match your search.</p></div>`;
  return `<div style="overflow-x:auto"><table class="tbl">
    <thead><tr><th>Item</th><th>Type</th><th>Location</th><th>Reported</th><th>Status</th>${opts.actions?'<th></th>':''}</tr></thead>
    <tbody>${items.map(i=>`<tr>
      <td><div class="t-item">${thumb(i)}${i.name}</div></td>
      <td>${typePill(i.type)}</td>
      <td class="muted">${i.location}</td>
      <td class="muted">${i.time}</td>
      <td>${stBadge(i.status)}</td>
      ${opts.actions?`<td style="text-align:right"><button class="btn sm ghost" onclick="toastA('Opened ${i.name}')">View</button></td>`:''}
    </tr>`).join("")}</tbody></table></div>`;
}
function filt(items){ return items.filter(i => !adminQ || (i.name+i.location+i.cat+i.type).toLowerCase().includes(adminQ)); }

const VIEWS = {
  dashboard:{ title:"Dashboard", sub:"Overview of campus lost & found activity.", search:false, render(){
    const stats=[
      ["Total Lost Items", STATS.lost, "tag", "var(--beige-bg)","var(--beige)"],
      ["Total Found Items", STATS.found, "box", "var(--success-bg)","var(--success)"],
      ["Possible Matches", STATS.matches, "sparkle", "var(--sage-light)","var(--sage)"],
      ["Recovered Items", STATS.recovered, "trophy", "var(--success-bg)","var(--success)"]
    ];
    return `
      <div class="admin-stats">${stats.map(([l,n,icn,bg,fg])=>`
        <div class="admin-stat"><div class="ic-b" style="background:${bg};color:${fg}">${ic(icn)}</div><div class="n">${n}</div><div class="l">${l}</div></div>`).join("")}</div>
      <div class="admin-grid">
        <div class="card pad">
          <div class="spread" style="margin-bottom:14px"><h2 style="font-size:17px">Recent Reports</h2><a class="tag" style="cursor:pointer;background:var(--sage-light);color:var(--sage-700)" onclick="goAdmin('reports')">View all</a></div>
          ${itemTable(DB.all().slice(0,7))}
        </div>
        <div>
          <div class="card pad" style="margin-bottom:20px">
            <div class="spread" style="margin-bottom:12px"><h2 style="font-size:17px">Recent Matches</h2><a class="tag" style="cursor:pointer" onclick="goAdmin('matches')">All</a></div>
            ${matchMini()}
          </div>
          <div class="card pad">
            <div class="spread" style="margin-bottom:12px"><h2 style="font-size:17px">Verification Requests</h2></div>
            ${verifyMini()}
          </div>
        </div>
      </div>`;
  }},

  lost:{ title:"Lost Items", sub:"All items reported missing on campus.", search:true, render(){
    return `<div class="card pad">${itemTable(filt(DB.lost()), {actions:true})}</div>`;
  }},

  found:{ title:"Found Items", sub:"All items reported found on campus.", search:true, render(){
    return `<div class="card pad">${itemTable(filt(DB.found()), {actions:true})}</div>`;
  }},

  reports:{ title:"All Reports", sub:"Every lost and found report.", search:true, render(){
    return `<div class="card pad">${itemTable(filt(DB.all()), {actions:true})}</div>`;
  }},

  matches:{ title:"Possible Matches", sub:"AI-generated matches ranked by similarity.", search:false, render(){
    return `<div class="card pad"><div style="overflow-x:auto"><table class="tbl">
      <thead><tr><th>Lost Item</th><th>Matched Found Item</th><th>Score</th><th>Status</th><th></th></tr></thead>
      <tbody>${MATCHES.map(m=>{ const l=DB.get(m.lostId), f=DB.get(m.foundId); const strong=m.score>=80;
        return `<tr>
          <td><div class="t-item">${thumb(l)}${l.name}</div></td>
          <td><div class="t-item">${thumb(f)}${f.name}</div></td>
          <td><b style="color:var(--sage);font-family:var(--f-head)">${m.score}%</b></td>
          <td><span class="status-badge ${strong?'st-match':'st-searching'}"><span class="dot"></span>${strong?'Strong':'Weak'}</span></td>
          <td style="text-align:right"><button class="btn sm ghost" onclick="toastA('Match reviewed')">Review</button></td>
        </tr>`; }).join("")}</tbody></table></div></div>`;
  }},

  verification:{ title:"Verification Requests", sub:"Owners verifying identifying details.", search:false, render(){
    let items=DB.all().filter(i=>i.status==="Under Verification");
    if(!items.length) items=[DB.get("L-05")].filter(Boolean);
    return `<div class="card pad"><div style="overflow-x:auto"><table class="tbl">
      <thead><tr><th>Item</th><th>Requested by</th><th>Location</th><th>Status</th><th></th></tr></thead>
      <tbody>${items.map(i=>`<tr>
        <td><div class="t-item">${thumb(i)}${i.name}</div></td>
        <td class="muted">${i.reporter}</td>
        <td class="muted">${i.location}</td>
        <td><span class="status-badge st-verify"><span class="dot"></span>Under Review</span></td>
        <td style="text-align:right;white-space:nowrap">
          <button class="btn sm" onclick="toastA('Approved ${i.name}')">Approve</button>
          <button class="btn sm ghost" style="margin-left:6px" onclick="toastA('Rejected')">Reject</button>
        </td>
      </tr>`).join("")}</tbody></table></div></div>`;
  }},

  settings:{ title:"Settings", sub:"Configure the CampusFind system.", search:false, render(){
    return `<div class="admin-grid">
      <div class="card pad">
        <h2 style="font-size:16px;margin-bottom:16px">General</h2>
        <div class="field"><label>App name</label><input class="input" value="CampusFind"></div>
        <div class="field"><label>Support email</label><input class="input" value="help@campusfind.edu"></div>
        <div class="field"><label>Match confidence threshold</label><input class="input" value="70%"></div>
        <button class="btn" onclick="toastA('Settings saved')">${ic("check")}Save changes</button>
      </div>
      <div class="card pad">
        <h2 style="font-size:16px;margin-bottom:16px">Item Categories</h2>
        <div class="chips" style="flex-wrap:wrap;margin:0">
          ${["Bags","Electronics","Wallets","Keys","Documents","Accessories","Clothing","Other"].map(c=>`<span class="chip active" style="cursor:default">${c}</span>`).join("")}
        </div>
        <h2 style="font-size:16px;margin:22px 0 12px">Notifications</h2>
        <label class="row" style="justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:10px">Email on new match <input type="checkbox" checked></label>
        <label class="row" style="justify-content:space-between;font-size:14px;font-weight:600">Alert on verification request <input type="checkbox" checked></label>
      </div>
    </div>`;
  }}
};

function matchMini(){
  return MATCHES.map(m=>{ const f=DB.get(m.foundId), l=DB.get(m.lostId);
    return `<div class="row" style="gap:11px;padding:10px 0;border-bottom:1px solid var(--line)">
      ${thumb(f)}<div style="flex:1;font-size:13px"><b>${l.name}</b> ↔ ${f.name}</div>
      <b style="color:var(--sage);font-family:var(--f-head)">${m.score}%</b></div>`; }).join("");
}
function verifyMini(){
  let items=DB.all().filter(i=>i.status==="Under Verification"); if(!items.length) items=[DB.get("L-05")].filter(Boolean);
  return items.map(i=>`<div class="row" style="gap:11px;padding:10px 0;border-bottom:1px solid var(--line)">
    ${thumb(i)}<div style="flex:1;font-size:13px"><b>${i.name}</b><div class="muted" style="font-size:11.5px">${i.reporter} · ${i.location}</div></div>
    <span class="status-badge st-verify"><span class="dot"></span>Review</span></div>`).join("");
}

function goAdmin(name){
  const v = VIEWS[name] || VIEWS.dashboard;
  adminQ = "";
  document.querySelectorAll(".admin-side a[data-view]").forEach(a=>a.classList.toggle("active", a.dataset.view===name));
  $$("#adminTop").innerHTML = `
    <div><h1>${v.title}</h1><p class="muted" style="font-size:13.5px">${v.sub}</p></div>
    ${v.search ? `<div class="search" style="max-width:300px;margin-left:auto">${ic("search")}<input placeholder="Search..." oninput="adminSearch(this.value)"></div>` : ""}`;
  $$("#adminMain").innerHTML = v.render();
  window.__view = name;
}
function adminSearch(v){ adminQ = v.toLowerCase(); $$("#adminMain").innerHTML = VIEWS[window.__view].render(); }

function toastA(msg){
  let w=$$(".toast-wrap"); if(!w){ w=document.createElement("div"); w.className="toast-wrap"; w.style.cssText="position:fixed;bottom:24px;right:24px;left:auto;z-index:70"; document.body.appendChild(w); }
  const t=document.createElement("div"); t.className="toast"; t.innerHTML=ic("check")+`<span>${msg}</span>`;
  w.appendChild(t); setTimeout(()=>{ t.style.opacity="0"; t.style.transition="opacity .3s"; },2200); setTimeout(()=>t.remove(),2600);
}

document.addEventListener("DOMContentLoaded",()=>{
  // sidebar icons
  document.querySelectorAll("[data-ic-nav]").forEach(a=>a.insertAdjacentHTML("afterbegin", ic(a.dataset.icNav)));
  goAdmin("dashboard");
});
