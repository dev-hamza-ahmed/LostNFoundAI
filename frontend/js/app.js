/* =========================================================
   CampusFind — SPA controller (vanilla JS).
   Screen registry + router + components + interactions.
   Data now comes from the real backend (see api.js) instead
   of localStorage.
   ========================================================= */

const state = { screen:"home", params:{}, stack:[], lost:{q:"",chip:"all"}, found:{q:"",chip:"all"}, reports:"lost" };
const $ = s => document.querySelector(s);

/* ---------------- Router ---------------- */
function go(name, params={}, opts={}){
  const s = SCREENS[name]; if(!s) return;
  if(!opts.back && state.screen) state.stack.push({ name:state.screen, params:state.params });
  state.screen = name; state.params = params;

  renderHeader(s, params);
  const el = $("#screen");
  el.className = "screen screen-anim" + (s.tabbar===false ? " no-tab" : "");
  el.innerHTML = s.render(params);
  hydrate(el);
  s.after && s.after(params, el);

  $("#tabbar").classList.toggle("hidden", s.tabbar === false);
  $("#fab").style.display = s.tabbar === false ? "none" : "grid";
  renderTabs(s.tab);
  el.scrollTop = 0;
}
function back(){
  const prev = state.stack.pop();
  if(prev) go(prev.name, prev.params, {back:true});
  else go("home", {}, {back:true});
}

/* ---------------- Header ---------------- */
function renderHeader(s, params){
  const bar = $("#appbar");
  bar.className = "appbar" + (s.solid ? " solid" : "");
  const actions = `<div class="ab-actions"><button class="ab-btn" onclick="go('settings')">${ic("settings")}</button></div>`;
  if(s.header === "logo"){
    bar.innerHTML = `<div class="ab-logo"><span class="mk">${ic("compass")}</span><b>Lost n Found AI</b></div>${actions}`;
  } else if(s.header === "back"){
    bar.innerHTML = `<button class="ab-back" onclick="back()">${ic("chevleft")}</button>
      <div><div class="ab-title">${typeof s.title==="function"?s.title(params):s.title}</div></div>`;
  } else {
    bar.innerHTML = `<div><div class="ab-title">${typeof s.title==="function"?s.title(params):s.title}</div></div>${actions}`;
  }
}

/* ---------------- Tab bar ---------------- */
function renderTabs(active){
  $("#tabbar").innerHTML = `
    ${tab("home","Home","home",active)}
    ${tab("lost","Lost","tag",active)}
    <div class="tab report-slot"><button class="fab-inline" style="display:none"></button><span>Report</span></div>
    ${tab("found","Found","box",active)}
    ${tab("notifications","Notifications","bell",active)}`;
}
function tab(name,label,icon,active){
  return `<button class="tab ${active===name?"active":""}" onclick="go('${name}')">${ic(icon)}<span>${label}</span></button>`;
}

/* ---------------- Reusable components ---------------- */
function displayTitle(i){
  if(i.features && i.features.item_type) return i.features.item_type;
  if(i.description) return i.description.length>40 ? i.description.slice(0,40)+"…" : i.description;
  return "Item";
}
function whenText(i){ return [i.date, i.time].filter(Boolean).join(" ") || ""; }

/* Found items: real image from Cloudinary */
function itemCard(i){
  return `<div class="item-card" onclick="go('item',{id:'${i._id}'})">
    <div class="art-wrap"><span class="badge found">Found</span><img class="art" src="${i.image_url}" alt="" loading="lazy"></div>
    <div class="body"><b>${displayTitle(i)}</b><div class="meta">${ic("mappin")}${i.location||"—"}</div></div>
  </div>`;
}
function recCard(i){
  return `<div class="rec-card" onclick="go('item',{id:'${i._id}'})">
    <div class="art-wrap"><span class="badge found">Found</span><img class="art" src="${i.image_url}" alt="" loading="lazy"></div>
    <div class="body"><b>${displayTitle(i)}</b><div class="meta">${ic("mappin")}${i.location||"—"}</div></div>
  </div>`;
}

/* Lost items: text-only, no image ever */
function lostItemCard(i){
  return `<div class="item-card lost-text-card" onclick="go('item',{id:'${i._id}'})">
    <span class="badge lost">Lost</span>
    <p class="lost-desc">${i.description||"No description provided."}</p>
    <div class="meta">${ic("mappin")}${i.location||"—"} · ${whenText(i)}</div>
    <div style="margin-top:8px">${statusBadge(i.status)}</div>
  </div>`;
}
function lostRecCard(i){
  return `<div class="rec-card lost-text-card" onclick="go('item',{id:'${i._id}'})">
    <span class="badge lost">Lost</span>
    <p class="lost-desc">${i.description||"No description provided."}</p>
    <div class="meta">${ic("mappin")}${i.location||"—"}</div>
  </div>`;
}

function statusBadge(st){
  const map={ "Searching":"st-searching","Possible Match":"st-match","Under Verification":"st-verify","Recovered":"st-recovered" };
  return `<span class="status-badge ${map[st]||"st-searching"}"><span class="dot"></span>${st||"Searching"}</span>`;
}
function skCards(n=4){
  return Array.from({length:n}).map(()=>`<div class="sk-card"><div class="sk sk-img"></div><div class="sk-body"><div class="sk sk-line" style="width:80%"></div><div class="sk sk-line" style="width:55%;margin:0"></div></div></div>`).join("");
}
function emptyState(icon,title,body,btn){
  return `<div class="empty"><div class="ei">${ic(icon)}</div><h3>${title}</h3><p>${body}</p>${btn||""}</div>`;
}

/* ---------------- Screens ---------------- */
const SCREENS = {

  /* ---- HOME ---- */
  home:{ header:"logo", tab:"home", after(){ loadHome(); },
    render(){
      return `
      <div class="greet">Welcome 👋</div>
      <div class="greet-h">Find what you've lost.</div>

      <div class="hero">
        <span class="tagpill">${ic("sparkle")}AI-powered matching</span>
        <h2>Lost something?</h2>
        <p>Let AI help you find it by matching your report with found items.</p>
        <div class="h-actions">
          <button class="btn" onclick="go('report',{mode:'lost'})">${ic("tag")}Report Lost</button>
          <button class="btn secondary" onclick="go('report',{mode:'found'})">${ic("box")}Report Found</button>
        </div>
      </div>

      <div class="stat-row" id="homeStats">
        <div class="stat"><div class="ic-b" style="background:var(--beige-bg);color:var(--beige)">${ic("tag")}</div><div class="n">–</div><div class="l">Lost Items</div></div>
        <div class="stat"><div class="ic-b" style="background:var(--success-bg);color:var(--success)">${ic("box")}</div><div class="n">–</div><div class="l">Found Items</div></div>
        <div class="stat"><div class="ic-b" style="background:var(--sage-light);color:var(--sage)">${ic("sparkle")}</div><div class="n">–</div><div class="l">Total</div></div>
      </div>

      <div class="sec"><h2>Recent Reports</h2><a class="link" onclick="go('found')">See all ${ic("chevright")}</a></div>
      <div class="h-scroll" id="homeRecent">${skCards(3)}</div>

      <div class="sec"><h2>How Lost n Found Works</h2></div>
      <div class="hiw">
        <div class="step"><div class="n">${ic("camera")}</div><span class="idx">01</span><b>Report</b><p>Add a photo &amp; details of the item.</p></div>
        <div class="step"><div class="n">${ic("sparkle")}</div><span class="idx">02</span><b>AI Matches</b><p>AI finds visually similar items.</p></div>
        <div class="step"><div class="n">${ic("shieldcheck")}</div><span class="idx">03</span><b>Verify</b><p>Confirm details only you would know.</p></div>
        <div class="step"><div class="n">${ic("handshake")}</div><span class="idx">04</span><b>Recover</b><p>Safely connect and get it back.</p></div>
      </div>
      <p class="muted" style="font-size:12px;margin-top:10px;padding:0 2px">AI suggests <b>possible</b> matches — it never decides ownership. You confirm identifying details before recovery.</p>
    `;}},

  /* ---- LOST ITEMS ---- */
  lost:{ header:"title", title:"Lost Items", tab:"lost", after(){ loadList("lost"); },
    render(){ return `<p class="muted" style="font-size:13px;margin:2px 0 -2px">Your unresolved lost item reports.</p>` +
      listMarkup("lost","Search your reports...",["All"]); } },

  /* ---- FOUND ITEMS ---- */
  found:{ header:"title", title:"Found Items", tab:"found", after(){ loadList("found"); },
    render(){ return `<p class="muted" style="font-size:13px;margin:2px 0 -2px">Items reported found on campus.</p>` +
      listMarkup("found","Search found items...",["All"]); } },

  /* ---- NOTIFICATIONS (found items only) ---- */
  notifications:{ header:"title", title:"Notifications", tab:"notifications", after(){ loadNotifications(); },
    render(){ return `<div id="notifList">${skCards(3)}</div>`; }},

  /* ---- MATCHES (reached only right after submitting a lost report) ---- */
  matches:{ header:"back", title:"Possible Matches", tabbar:false, after(){ animateBars(); },
    render(){
      const ms = CACHE.lastMatches;
      if(!ms.length){
        return emptyState("sparkle","No possible matches yet",
          "Report a lost item to see AI-suggested matches here.",
          `<button class="btn" onclick="go('report',{mode:'lost'})">Report a lost item</button>`);
      }
      return `
        <p class="muted" style="font-size:13px;margin:2px 0 14px">We found ${ms.length} possible matches for your lost item.</p>
        ${ms.map(matchCard).join("")}
        <div class="alert info" style="margin-top:6px">${ic("info")}<div><b>These are possible matches, not confirmed.</b> Verify identifying details before contacting the finder.</div></div>
      `;
    }},

  /* ---- MATCH DETAILS ---- */
  matchDetails:{ header:"back", title:"Match Details", tabbar:false,
    render({id}){
      const f = findCached(id);
      if(!f) return emptyState("sparkle","Match not available","This match could no longer be found.");
      return `
        <div class="ai-stage" style="aspect-ratio:4/3;margin-top:6px"><img class="art" src="${f.image_url}" alt=""><span class="badge found">Found</span></div>
        <div class="row" style="align-items:flex-start;gap:12px">
          <div><span class="poss-tag">${ic("sparkle")}Possible Match</span>
            <h2 style="font-size:20px;margin:8px 0 6px">${displayTitle(f)}</h2>
            <div class="meta muted" style="font-size:13px;display:flex;gap:6px;align-items:center">${ic("mappin")}Found at: ${f.location||"—"}</div>
          </div>
          <div style="margin-left:auto;text-align:center"><div style="font-family:var(--f-head);font-size:30px;font-weight:800;color:var(--sage)">${f.score}%</div><div style="font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase">Match</div></div>
        </div>

        <div class="sec"><h2>AI Understanding</h2><span class="tag ai" style="margin-left:auto">${ic("cpu")}Computer Vision</span></div>
        <div class="card pad"><div class="understand">
          ${Object.entries(f.features||{}).map(([k,v])=>`<div class="u-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
        </div></div>

        <div class="alert warn" style="margin-top:16px">${ic("warn")}<div><b>Don't contact the finder yet.</b> Verify additional identifying details before proceeding.</div></div>
        <div class="sticky-actions"><button class="btn block lg" onclick="go('verify',{id:'${f._id}'})">${ic("shieldcheck")}Verify Ownership</button></div>
      `;
    }},

  /* ---- ITEM DETAIL ---- */
  item:{ header:"back", title:i=>{ const it=findCached(i.id); return it && it.description ? "Lost Item" : "Found Item"; }, tabbar:false,
    render({id}){
      const i = findCached(id);
      if(!i) return emptyState("box","Item not found","Go back and try again — it may have loaded after you navigated here.");

      if(i.description !== undefined){ // lost item
        return `
          <div class="spread" style="margin-top:6px"><h2 style="font-size:21px">Lost Item</h2>${statusBadge(i.status)}</div>
          <p class="muted" style="font-size:13.5px;margin-top:8px">${i.description}</p>
          <div class="card pad" style="margin-top:16px;display:grid;gap:11px">
            <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("mappin")}</span>${i.location||"—"}</div>
            <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("clock")}</span>${whenText(i)}</div>
          </div>
        `;
      }
      return `
        <div class="ai-stage" style="aspect-ratio:4/3;margin-top:6px"><img class="art" src="${i.image_url}" alt=""><span class="badge found">Found</span></div>
        <div class="spread"><h2 style="font-size:21px">${displayTitle(i)}</h2>${statusBadge(i.status)}</div>
        <p class="muted" style="font-size:13.5px;margin-top:8px">${i.extra||"No additional details provided."}</p>
        <div class="card pad" style="margin-top:16px;display:grid;gap:11px">
          <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("mappin")}</span>${i.location||"—"}</div>
          <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("user")}</span>Contact: ${i.contact||"—"}</div>
        </div>
        <div class="sec"><h2>AI Understanding</h2><span class="tag ai" style="margin-left:auto">${ic("cpu")}AI</span></div>
        <div class="card pad"><div class="understand">
          ${Object.entries(i.features||{}).map(([k,v])=>`<div class="u-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
        </div></div>
      `;
    }},

  /* ---- REPORT (lost/found) ---- */
  report:{ header:"back", title:p=>p.mode==="found"?"Report Found Item":"Report Lost Item", tabbar:false,
    after(p){ wireReport(p.mode||"lost"); },
    render({mode="lost"}){
      if(mode==="found"){
        return `
          <div class="field">
            <label>Item Photo <span class="req">*</span></label>
            <label class="upload" id="upload" for="file">
              <div class="prompt"><div class="u-ic">${ic("camera")}</div><b>Upload Item Image</b><span>Take a photo or choose from gallery</span></div>
              <div class="preview" id="preview"></div>
              <span class="change">Change</span>
            </label>
            <input type="file" id="file" accept="image/*" hidden>
            <div class="err-msg" id="e_photo">Please upload a photo of the item.</div>
          </div>
          <div class="field"><label>Found Location</label>
            <div class="with-ic">${ic("mappin")}<input class="input" id="f_loc" placeholder="e.g. Main Library"></div></div>
          <div class="field"><label>Your Contact Info <span class="req">*</span></label>
            <input class="input" id="f_contact" placeholder="Phone number or email"><div class="err-msg" id="e_contact">Please enter a way to reach you.</div></div>
          <div class="field"><label>Additional Information</label>
            <textarea class="textarea" id="f_extra" placeholder="Add details only if the item's photo isn't clear enough to identify it"></textarea></div>
          <div class="sticky-actions"><button class="btn block lg" id="submitBtn">${ic("check")}Submit Found Item</button></div>
        `;
      }
      return `
        <div class="field"><label>Description <span class="req">*</span></label>
          <textarea class="textarea" id="f_desc" placeholder="Describe what you lost — type, color, brand, distinguishing features..."></textarea>
          <div class="err-msg" id="e_desc">Please describe the item.</div></div>
        <div class="field"><label>Last Seen Location <span class="req">*</span></label>
          <div class="with-ic">${ic("mappin")}<input class="input" id="f_loc" placeholder="Main Library"></div><div class="err-msg" id="e_loc">Please enter a location.</div></div>
        <div class="two">
          <div class="field"><label>Date</label><div class="with-ic">${ic("clock")}<input class="input" type="date" id="f_date"></div></div>
          <div class="field"><label>Approx. Time</label><input class="input" type="time" id="f_time" value="10:30"></div>
        </div>
        <div class="sticky-actions"><button class="btn block lg" id="submitBtn">${ic("check")}Submit Lost Report</button></div>
      `;
    }},

  /* ---- AI ANALYSIS (now waits on the REAL backend call) ---- */
  analysis:{ header:"back", title:"AI Analysis", tabbar:false,
    render({mode="lost"}){
      return `
        <div class="ai-title"><span class="tag ai" style="margin-bottom:6px">${ic("cpu")}${mode==="found"?"Computer Vision + AI":"AI Matching"}</span></div>
        <div class="card pad" style="text-align:center;padding:32px 20px">
          <div class="ic-b" style="margin:0 auto 10px"><span class="spin"></span></div>
          <h2 style="font-size:19px" id="aiHead">${mode==="found" ? "Uploading and analyzing your photo…" : "Saving and searching for matches…"}</h2>
          <p class="muted" style="font-size:13px;margin-top:6px">This calls Gemini, Cloudinary, and MongoDB — may take a few seconds.</p>
        </div>
        <div id="aiResult"></div>
      `;
    }},

  /* ---- VERIFICATION ---- */
  verify:{ header:"back", title:"Verify Your Item", tabbar:false, after(p){ wireVerify(p); },
    render({id}){
      return `
        <div class="verify-hero"><div class="shield">${ic("shieldcheck")}</div>
          <h2 style="font-size:20px">Verify Your Item</h2>
          <p>Before connecting you with the finder, verify details only the true owner should know.</p></div>
        <div style="margin-top:20px" id="vform">
          <div class="field"><div class="q-label">1. What is inside the pocket? (if any)</div><input class="input" id="v1" placeholder="e.g. charger, notebook, pen..."></div>
          <div class="field"><div class="q-label">2. What unique mark does the item have?</div><input class="input" id="v2" placeholder="e.g. scratch, sticker, initials..."></div>
          <div class="field"><div class="q-label">3. Describe another identifying detail.</div><input class="input" id="v3" placeholder="e.g. zipper colour, brand tag..."></div>
        </div>
        <div class="sticky-actions"><button class="btn block lg" id="vbtn">${ic("shieldcheck")}Submit Verification</button></div>
      `;
    }},

  /* ---- RECOVERY ---- */
  recovery:{ header:"back", title:"Recovery", tabbar:false,
    render({id}){
      const f = findCached(id);
      if(!f) return emptyState("box","Item not found","This item is no longer available.");
      return `
        <div class="verified" style="margin-top:6px"><div class="vc">${ic("check")}</div>
          <h2>Match Verified</h2><p>Your lost item appears to match this found item.</p></div>
        <div class="card pad" style="margin:16px 0"><div class="row" style="gap:13px">
          <img src="${f.image_url}" style="width:64px;height:64px;border-radius:14px;object-fit:cover">
          <div><b style="font-size:15px">${displayTitle(f)}</b><div class="meta muted" style="font-size:12.5px;margin-top:4px">Found at: ${f.location||"—"}</div></div>
        </div></div>
        <div class="alert ok" style="margin-top:16px">${ic("info")}<div><b>Recovery Details</b><br>Contact: ${f.contact||"—"}</div></div>
        <div class="sticky-actions"><button class="btn success block lg" onclick="finishRecovery('${f._id}')">${ic("check")}Continue</button></div>
      `;
    }},

  /* ---- MY REPORTS ---- */
  myReports:{ header:"title", title:"My Reports", tab:null, after(){ wireReports(); },
    render(){
      return `<div class="seg" id="seg">
          <button data-t="lost" class="active">Lost</button>
          <button data-t="found">Found</button>
        </div><div id="reportsList">${skCards(3)}</div>`;
    }},

  settings:{ header:"back", title:"Settings", tabbar:false, after(){ wireThemeToggle(); },
    render(){
      const row=(icn,label,go)=>`<div class="menu-row" onclick="${go}"><div class="mi">${ic(icn)}</div><b>${label}</b><span class="chev">${ic("chevright")}</span></div>`;
      const current = document.documentElement.getAttribute("data-theme") || "light";
      return `
        <div class="menu-list" style="margin-bottom:16px;padding:16px">
          <b>Appearance</b>
          <div class="seg" id="themeSeg" style="margin-top:10px">
            <button data-theme-choice="light" class="${current==='light'?'active':''}">${ic('sun')}<span>Light</span></button>
            <button data-theme-choice="dark" class="${current==='dark'?'active':''}">${ic('moon')}<span>Dark</span></button>
          </div>
        </div>
        <div class="menu-list" style="margin-bottom:16px">
          ${row("help","Help &amp; Support","toast('Support: help@lostnfoundai.edu')")}
          ${row("lock","Privacy","toast('Your data stays private')")}
          ${row("info","About Lost n Found AI","openAbout()")}
        </div>
        <p class="muted center" style="font-size:11.5px;margin-top:18px">Lost n Found AI v1.0 · Smarter Matching. Faster Recovery.</p>
      `;
    }}
};

/* ---------------- Data loaders (async, patch DOM after fetch) ---------------- */
async function loadHome(){
  const [stats, found, lost] = await Promise.all([apiStats(), apiListFound(), apiListLost()]);
  const statsEl = $("#homeStats");
  if(statsEl) statsEl.innerHTML = `
    <div class="stat"><div class="ic-b" style="background:var(--beige-bg);color:var(--beige)">${ic("tag")}</div><div class="n">${stats.lost}</div><div class="l">Lost Items</div></div>
    <div class="stat"><div class="ic-b" style="background:var(--success-bg);color:var(--success)">${ic("box")}</div><div class="n">${stats.found}</div><div class="l">Found Items</div></div>
    <div class="stat"><div class="ic-b" style="background:var(--sage-light);color:var(--sage)">${ic("sparkle")}</div><div class="n">${stats.total}</div><div class="l">Total</div></div>`;
  const recent = [...lost.map(i=>({...i,_type:"lost"})), ...found.map(i=>({...i,_type:"found"}))].slice(0,6);
  const recEl = $("#homeRecent");
  if(recEl) recEl.innerHTML = recent.length
    ? recent.map(i=>i._type==="lost"?lostRecCard(i):recCard(i)).join("")
    : `<p class="muted" style="font-size:13px;padding:4px 2px">No reports yet.</p>`;
}
async function loadNotifications(){
  const found = await apiListFound();
  const el = $("#notifList"); if(!el) return;
  if(!found.length){ el.innerHTML = emptyState("bell","No notifications yet","You'll see an update here whenever a new item is reported found."); return; }
  el.innerHTML = found.slice(0,15).map(f => `
    <div class="card notif" onclick="go('item',{id:'${f._id}'})">
      <div class="ni" style="background:var(--success-bg);color:var(--success)">${ic("box")}</div>
      <div style="flex:1"><b>New item found</b><p>${displayTitle(f)} — reported near ${f.location||"campus"}.</p></div>
    </div>`).join("");
  hydrate(el);
}
async function loadList(kind){
  const grid = $("#grid");
  const items = kind==="lost" ? await apiListLost() : await apiListFound();
  if(!grid) return; // user navigated away before fetch resolved
  if(!items.length){
    grid.className = "list-plain";
    grid.innerHTML = kind==="lost"
      ? emptyState("search","No unresolved lost reports","Report a lost item to start AI matching.",`<button class="btn" onclick="go('report',{mode:'lost'})">Report Lost Item</button>`)
      : emptyState("box","No found items yet","Check back soon or report an item you found.",`<button class="btn" onclick="go('report',{mode:'found'})">Report Found Item</button>`);
  } else if(kind==="lost"){
    grid.className = "list-plain";
    grid.innerHTML = items.map(lostItemCard).join("");
  } else {
    grid.className = "grid";
    grid.innerHTML = items.map(itemCard).join("");
  }
  hydrate(grid);
}
function listMarkup(kind, ph, chips){
  return `
    <div class="searchbar"><div class="search">${ic("search")}<input placeholder="${ph}" disabled></div></div>
    <div class="grid" id="grid">${skCards(4)}</div>`;
}

/* ---------------- Match card ---------------- */
function matchCard(m){
  return `<div class="card match-card">
    <div class="top">
      <div class="art-wrap"><img class="art" src="${m.image_url}" alt=""></div>
      <div><span class="poss-tag">${ic("sparkle")}Possible Match</span><div style="font-weight:700;font-size:15px;margin-top:6px">${displayTitle(m)}</div>
        <div class="meta muted" style="font-size:12px;display:flex;gap:5px;align-items:center;margin-top:3px">${ic("mappin")}${m.location||"—"}</div></div>
      <div class="score"><div class="pct">${m.score}%</div><div class="lbl">Match</div></div>
    </div>
    <div class="score-bar"><i data-w="${m.score}" style="width:0"></i></div>
    <div class="cta"><button class="btn block" onclick="go('matchDetails',{id:'${m._id}'})">View Match</button></div>
  </div>`;
}
function animateBars(){ setTimeout(()=>document.querySelectorAll(".score-bar i").forEach(el=>el.style.width=el.dataset.w+"%"),120); }

/* ---------------- Report wiring (now calls the REAL backend) ---------------- */
function wireReport(mode){
  if(mode==="found"){
    const up=$("#upload"), file=$("#file");
    file.addEventListener("change",()=>{ const f=file.files[0]; if(!f) return;
      const url=URL.createObjectURL(f);
      $("#preview").innerHTML=`<div class="art-wrap"><img src="${url}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`;
      up.classList.add("has");
    });
    $("#submitBtn").addEventListener("click", async ()=>{
  const contact = $("#f_contact");
  const location = $("#f_loc").value.trim();
  const extra = $("#f_extra").value.trim();
  const selectedFile = file.files[0];

  let ok = true;

  if(!selectedFile){
    up.classList.add("err");
    $("#e_photo").classList.add("show");
    ok = false;
  }

  if(!contact.value.trim()){
    contact.classList.add("err");
    $("#e_contact").classList.add("show");
    ok = false;
  }

  if(!ok){
    toast("Please fill the required fields", true);
    return;
  }

  // Save everything BEFORE changing the screen
  const contactValue = contact.value.trim();

  go("analysis",{mode:"found"});

  try{
    const result = await apiReportFound(
      selectedFile,
      location,
      contactValue,
      extra
    );

    $("#aiHead").textContent = "Done!";

    $("#aiResult").innerHTML = `
      <div class="card pad">
        <div class="understand">
          ${Object.entries(result.features).map(([k,v])=>`
            <div class="u-row">
              <span class="k">${k}</span>
              <span class="v">${v}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="alert ok" style="margin-top:16px">
        ${ic("check")}
        <div>
          <b>Saved to database.</b>
          Thanks for helping reunite it with its owner.
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn success block lg" onclick="go('found')">
          ${ic("check")}Done
        </button>
      </div>
    `;

    hydrate($("#aiResult"));

  } catch(err){
    $("#aiResult").innerHTML = `
      <div class="alert warn">
        ${ic("warn")}
        <div>
          <b>Something went wrong.</b> ${err.message}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn block lg" onclick="back()">Try again</button>
      </div>
    `;
  }
});
  } else {
  $("#submitBtn").addEventListener("click", async ()=>{
    const desc = $("#f_desc");
    const loc = $("#f_loc");

    let ok = true;

    if(!desc.value.trim()){
      desc.classList.add("err");
      $("#e_desc").classList.add("show");
      ok = false;
    }

    if(!loc.value.trim()){
      loc.classList.add("err");
      $("#e_loc").classList.add("show");
      ok = false;
    }

    if(!ok){
      toast("Please fill the required fields", true);
      return;
    }

    // Capture values BEFORE changing the screen
    const description = desc.value.trim();
    const location = loc.value.trim();
    const date = $("#f_date").value;
    const time = $("#f_time").value;

    // Now it is safe to change the screen
    go("analysis",{mode:"lost"});

    try{
      const result = await apiReportLost(
        description,
        location,
        date,
        time
      );

      CACHE.activeLostId = result.id;
      CACHE.lastMatches = result.matches;

      $("#aiHead").textContent = "Done!";

      $("#aiResult").innerHTML = `
        <div class="alert ok">
          ${ic("check")}
          <div>
            <b>Report saved.</b>
            Found ${result.matches.length} possible match(es).
          </div>
        </div>

        <div class="sticky-actions">
          <button class="btn block lg" onclick="go('matches')">
            ${ic("sparkle")}View Possible Matches
          </button>
        </div>
      `;

    } catch(err){
      $("#aiResult").innerHTML = `
        <div class="alert warn">
          ${ic("warn")}
          <div>
            <b>Something went wrong.</b> ${err.message}
          </div>
        </div>

        <div class="sticky-actions">
          <button class="btn block lg" onclick="back()">Try again</button>
        </div>
      `;
    }
  });
}
}

/* ---------------- Verification / recovery ---------------- */
function wireVerify({id}){
  $("#vbtn").addEventListener("click",()=>{
    const vals=["v1","v2","v3"].map(x=>$("#"+x).value.trim());
    if(vals.filter(Boolean).length<2){ toast("Please answer at least 2 questions", true); return; }
    go("recovery",{id});
  });
}
async function finishRecovery(foundId){
  try{
    await apiClaim(foundId);
    if(CACHE.activeLostId) await apiMarkRecovered(CACHE.activeLostId);
    toast("Recovery complete 🎉");
  } catch(e){ toast("Something went wrong marking this recovered", true); }
  go("home");
}

/* ---------------- My Reports ---------------- */
async function wireReports(){
  const draw = async ()=>{
    const t = state.reports;
    const el = $("#reportsList");
    const items = t==="lost" ? await apiListLost() : await apiListFound();
    if(!items.length){ el.innerHTML = emptyState("clipboard","Nothing here yet","Your "+t+" reports will appear here."); return; }
    el.innerHTML = items.map(i => t==="lost"
      ? `<div class="card report-item lost-text-card" onclick="go('item',{id:'${i._id}'})">
           <div style="flex:1"><p class="lost-desc">${i.description}</p><div class="meta">${i.location||"—"}</div><div style="margin-top:7px">${statusBadge(i.status)}</div></div>${ic("chevright")}
         </div>`
      : `<div class="card report-item" onclick="go('item',{id:'${i._id}'})">
           <div class="art-wrap"><img class="art" src="${i.image_url}"></div>
           <div style="flex:1"><b>${displayTitle(i)}</b><div class="meta">${i.location||"—"}</div><div style="margin-top:7px">${statusBadge(i.status)}</div></div>${ic("chevright")}
         </div>`
    ).join("");
    hydrate(el);
  };
  $("#seg").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    $("#seg").querySelectorAll("button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    state.reports=b.dataset.t; draw();
  }));
  draw();
}

/* ---------------- Sheets / modals / toast ---------------- */
function openSheet(html){ const b=$("#backdrop"); b.innerHTML=`<div class="sheet"><div class="grab"></div>${html}</div>`; b.className="backdrop open"; b.onclick=e=>{ if(e.target===b) closeSheet(); }; hydrate(b); }
function closeSheet(){ const b=$("#backdrop"); b.className="backdrop"; setTimeout(()=>b.innerHTML="",200); }
function openReportSheet(){
  openSheet(`<h3>Report an item</h3><p class="muted" style="font-size:13px;margin-bottom:16px">What would you like to report?</p>
    <div style="display:grid;gap:11px">
      <button class="btn beige block lg" onclick="closeSheet();go('report',{mode:'lost'})">${ic("tag")}I Lost an Item</button>
      <button class="btn block lg" onclick="closeSheet();go('report',{mode:'found'})">${ic("box")}I Found an Item</button>
      <button class="btn ghost block" onclick="closeSheet()">Cancel</button>
    </div>`);
}
function openAbout(){
  openSheet(`<h3>About Lost n Found AI</h3><p class="muted" style="font-size:13.5px;line-height:1.6;margin:8px 0 16px">Lost n Found AI uses computer vision and AI to match lost and found items on campus. AI only suggests <b>possible</b> matches — students verify identifying details before recovery, so ownership is always human-confirmed.</p><button class="btn block" onclick="closeSheet()">Got it</button>`);
}
function confirmLogout(){
  const b=$("#backdrop");
  b.innerHTML=`<div class="modal"><div class="mic" style="background:var(--error-bg);color:var(--error)">${ic("logout")}</div>
    <h3>Log out?</h3><p>You can log back in anytime.</p>
    <div class="m-actions"><button class="btn ghost" onclick="closeSheet()">Cancel</button><button class="btn" style="background:var(--error)" onclick="closeSheet();toast('Logged out')">Log out</button></div></div>`;
  b.className="backdrop open modal-center"; b.onclick=e=>{ if(e.target===b) closeSheet(); }; hydrate(b);
}
function toast(msg, err){
  let w=$(".toast-wrap"); if(!w){ w=document.createElement("div"); w.className="toast-wrap"; $(".app").appendChild(w); }
  const t=document.createElement("div"); t.className="toast"+(err?" err":""); t.innerHTML=ic(err?"warn":"check")+`<span>${msg}</span>`;
  w.appendChild(t); setTimeout(()=>{ t.style.opacity="0"; t.style.transition="opacity .3s"; },2400); setTimeout(()=>t.remove(),2800);
}

/* ---------------- Theme (dark / light) ---------------- */
function initTheme(){
  const saved = localStorage.getItem("lnf_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
}
function setTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("lnf_theme", mode);
}
function wireThemeToggle(){
  const seg = $("#themeSeg"); if(!seg) return;
  seg.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setTheme(btn.dataset.themeChoice);
      seg.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

/* ---------------- Splash + onboarding ---------------- */
function bootSplash(){
  const splash=$("#splash");
  setTimeout(()=>{
    if(localStorage.getItem("campusfind_onboarded")){ splash.classList.add("hide"); startApp(); }
    else { splash.classList.add("hide"); showOnboarding(); }
  },1700);
}
const ONB=[
  { art:ONB_ART.s1, h:"Lost something on campus?", p:"Report it in seconds. Add a photo and a few details — we'll take it from there." },
  { art:ONB_ART.s2, h:"AI finds possible matches", p:"Computer vision compares your item with found reports and ranks the closest matches." },
  { art:ONB_ART.s3, h:"Verify. Recover. Done.", p:"Confirm details only the owner knows, then safely connect and get your item back." }
];
function showOnboarding(){
  let i=0; const o=$("#onboarding"); o.style.display="flex";
  const draw=()=>{
    o.innerHTML=`<div class="onb">
        <div class="skip" onclick="finishOnb()">${i<2?"Skip":"&nbsp;"}</div>
        <div class="slides"><div class="slide"><div class="illo">${ONB[i].art}</div><h2>${ONB[i].h}</h2><p>${ONB[i].p}</p></div></div>
        <div class="dots">${ONB.map((_,x)=>`<i class="${x===i?"on":""}"></i>`).join("")}</div>
        <div class="foot">${ i<2 ? `<button class="btn block lg" onclick="nextOnb()">Next</button>` : `<button class="btn block lg" onclick="finishOnb()">Get Started</button>` }</div>
      </div>`;
  };
  window.nextOnb=()=>{ if(i<ONB.length-1){ i++; draw(); } };
  window.finishOnb=()=>{ localStorage.setItem("campusfind_onboarded","1"); o.style.display="none"; startApp(); };
  draw();
}
function startApp(){ go("home",{},{back:true}); }

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded",()=>{
  initTheme();
  $("#fab").addEventListener("click", openReportSheet);
  renderTabs("home");
  bootSplash();
});