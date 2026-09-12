/* =========================================================
   CampusFind — SPA controller (vanilla JS).
   Screen registry + router + components + interactions.
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
  const actions = `
    <div class="ab-actions">
      <button class="ab-btn" onclick="go('profile')">${ic("user")}</button>
    </div>`;
  if(s.header === "logo"){
    bar.innerHTML = `<div class="ab-logo"><span class="mk">${ic("compass")}</span><b>CampusFind</b></div>${actions}`;
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
  if(i.name) return i.name;
  if(i.type === "found") return (i.features && i.features.item_type) ? i.features.item_type : "Found Item";
  return i.desc ? (i.desc.length>40 ? i.desc.slice(0,40)+"…" : i.desc) : "Lost Item";
}

/* Found items: image-based cards */
function itemCard(i){
  return `<div class="item-card" onclick="go('item',{id:'${i.id}'})">
    <div class="art-wrap"><span class="badge ${i.type}">Found</span>${photo(i)}</div>
    <div class="body"><b>${displayTitle(i)}</b><div class="meta">${ic("mappin")}${i.location||"—"} · ${i.time||""}</div></div>
  </div>`;
}
function recCard(i){
  return `<div class="rec-card" onclick="go('item',{id:'${i.id}'})">
    <div class="art-wrap"><span class="badge ${i.type}">Found</span>${photo(i)}</div>
    <div class="body"><b>${displayTitle(i)}</b><div class="meta">${ic("mappin")}${i.location||"—"}</div><div class="meta">${ic("clock")}${i.time||""}</div></div>
  </div>`;
}

/* Lost items: text-only cards, no image/art of any kind */
function lostItemCard(i){
  return `<div class="item-card lost-text-card" onclick="go('item',{id:'${i.id}'})">
    <span class="badge lost">Lost</span>
    <p class="lost-desc">${i.desc||"No description provided."}</p>
    <div class="meta">${ic("mappin")}${i.location||"—"} · ${i.time||""}</div>
    <div style="margin-top:8px">${statusBadge(i.status)}</div>
  </div>`;
}
function lostRecCard(i){
  return `<div class="rec-card lost-text-card" onclick="go('item',{id:'${i.id}'})">
    <span class="badge lost">Lost</span>
    <p class="lost-desc">${i.desc||"No description provided."}</p>
    <div class="meta">${ic("mappin")}${i.location||"—"}</div>
    <div class="meta">${ic("clock")}${i.time||""}</div>
  </div>`;
}

function statusBadge(st){
  const map={ "Searching":"st-searching","Possible Match":"st-match","Under Verification":"st-verify","Recovered":"st-recovered" };
  return `<span class="status-badge ${map[st]||"st-searching"}"><span class="dot"></span>${st}</span>`;
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
  home:{ header:"logo", tab:"home", render(){
    const stats = liveStats();
    const recent = DB.all().slice(0,6);
    return `
      <div class="greet">Good morning 👋</div>
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

      <div class="stat-row">
        <div class="stat"><div class="ic-b" style="background:var(--beige-bg);color:var(--beige)">${ic("tag")}</div><div class="n">${stats.lost}</div><div class="l">Lost Items</div></div>
        <div class="stat"><div class="ic-b" style="background:var(--success-bg);color:var(--success)">${ic("box")}</div><div class="n">${stats.found}</div><div class="l">Found Items</div></div>
        <div class="stat"><div class="ic-b" style="background:var(--sage-light);color:var(--sage)">${ic("sparkle")}</div><div class="n">${stats.matches}</div><div class="l">Matches</div></div>
      </div>

      <div class="sec"><h2>Recent Reports</h2><a class="link" onclick="go('lost')">See all ${ic("chevright")}</a></div>
      <div class="h-scroll">${recent.length ? recent.map(i=>i.type==="lost"?lostRecCard(i):recCard(i)).join("") : `<p class="muted" style="font-size:13px;padding:4px 2px">No reports yet.</p>`}</div>

      <div class="sec"><h2>How CampusFind Works</h2></div>
      <div class="hiw">
        <div class="step"><div class="n">${ic("camera")}</div><span class="idx">01</span><b>Report</b><p>Add a photo &amp; details of the item.</p></div>
        <div class="step"><div class="n">${ic("sparkle")}</div><span class="idx">02</span><b>AI Matches</b><p>AI finds visually similar items.</p></div>
        <div class="step"><div class="n">${ic("shieldcheck")}</div><span class="idx">03</span><b>Verify</b><p>Confirm details only you would know.</p></div>
        <div class="step"><div class="n">${ic("handshake")}</div><span class="idx">04</span><b>Recover</b><p>Safely connect and get it back.</p></div>
      </div>

      <div class="sec"><h2>How the AI helps</h2></div>
      <div class="ai-flow">
        <span class="node">Image</span><span class="arr">→</span>
        <span class="node">Features</span><span class="arr">→</span>
        <span class="node">Similarity</span><span class="arr">→</span>
        <span class="node">Match score</span><span class="arr">→</span>
        <span class="node human">You verify</span>
      </div>
      <p class="muted" style="font-size:12px;margin-top:10px;padding:0 2px">AI suggests <b>possible</b> matches — it never decides ownership. You confirm identifying details before recovery.</p>
    `;
  }},

  /* ---- LOST ITEMS (your own unresolved reports only, text-only) ---- */
  lost:{ header:"title", title:"Lost Items", tab:"lost", after(){ loadList("lost"); },
    render(){ return `<p class="muted" style="font-size:13px;margin:2px 0 -2px">Your unresolved lost item reports.</p>` +
      listMarkup("lost","Search your reports...",["All","Today","This Week"]); } },

  /* ---- FOUND ITEMS ---- */
  found:{ header:"title", title:"Found Items", tab:"found", after(){ loadList("found"); },
    render(){ return `<p class="muted" style="font-size:13px;margin:2px 0 -2px">Items reported found on campus.</p>` +
      listMarkup("found","Search found items...",["All","Today","This Week","Library","Cafeteria","Sports"]); } },

  /* ---- NOTIFICATIONS (found items only) ---- */
  notifications:{ header:"title", title:"Notifications", tab:"notifications",
    render(){
      const found = DB.found().slice(0,15);
      if(!found.length) return emptyState("bell","No notifications yet","You'll see an update here whenever a new item is reported found.");
      return found.map(f => `
        <div class="card notif" onclick="go('item',{id:'${f.id}'})">
          <div class="ni" style="background:var(--success-bg);color:var(--success)">${ic("box")}</div>
          <div style="flex:1"><b>New item found</b><p>${displayTitle(f)} — reported near ${f.location||"campus"}.</p><div class="t">${f.time||""}</div></div>
        </div>`).join("");
    }},

  /* ---- MATCHES (reached only right after submitting a lost report — not a tab) ---- */
  matches:{ header:"back", title:"Possible Matches", tabbar:false, after(){ animateBars(); },
    render(){
      const lost = ACTIVE_LOST_ID ? DB.get(ACTIVE_LOST_ID) : null;
      const ms = ACTIVE_LOST_ID ? matchesFor(ACTIVE_LOST_ID) : [];
      if(!lost || !ms.length){
        return emptyState("sparkle","No possible matches yet",
          lost ? "Your item is still being compared with found reports." : "Report a lost item to see AI-suggested matches here.",
          `<button class="btn" onclick="go('report',{mode:'lost'})">Report a lost item</button>`);
      }
      return `
        <p class="muted" style="font-size:13px;margin:2px 0 14px">We found ${ms.length} possible matches for your lost item.</p>
        <div class="card your-item lost-text-card" style="margin-bottom:14px">
          <div class="k">Your Lost Item</div>
          <p class="lost-desc">${lost.desc}</p>
          <div class="meta" style="font-size:12px;color:var(--muted)">${lost.location} · ${lost.time}</div>
        </div>
        ${ms.map(matchCard).join("")}
        <div class="alert info" style="margin-top:6px">${ic("info")}<div><b>These are possible matches, not confirmed.</b> Verify identifying details before contacting the finder.</div></div>
      `;
    }},

  /* ---- MATCH DETAILS ---- */
  matchDetails:{ header:"back", title:"Match Details", tabbar:false, after(){ animateBars(); },
    render({id}){
      const m = MATCHES.find(x=>x.foundId===id);
      if(!m) return emptyState("sparkle","Match not available","This match could no longer be found.");
      const f = DB.get(m.foundId);
      return `
        <div class="ai-stage" style="aspect-ratio:4/3;margin-top:6px">${photo(f)}<span class="badge found">Found</span></div>
        <div class="row" style="align-items:flex-start;gap:12px">
          <div><span class="poss-tag">${ic("sparkle")}Possible Match</span>
            <h2 style="font-size:20px;margin:8px 0 6px">${displayTitle(f)}</h2>
            <div class="meta muted" style="font-size:13px;display:flex;gap:6px;align-items:center">${ic("mappin")}Found at: ${f.location}</div>
            <div class="meta muted" style="font-size:13px;display:flex;gap:6px;align-items:center;margin-top:4px">${ic("clock")}${f.when||f.time||""}</div>
          </div>
          <div style="margin-left:auto;text-align:center"><div style="font-family:var(--f-head);font-size:30px;font-weight:800;color:var(--sage)">${m.score}%</div><div style="font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase">Match</div></div>
        </div>

        <div class="sec"><h2>AI Match Analysis</h2><span class="tag ai" style="margin-left:auto">${ic("cpu")}Computer Vision</span></div>
        <div class="card pad"><div class="analysis">
          ${m.analysis.map(([k,v])=>`<div class="an-row"><span class="k">${k}</span><span class="v">${v}<span class="ic-b">${ic("check")}</span></span></div>`).join("")}
        </div></div>

        <div class="alert warn" style="margin-top:16px">${ic("warn")}<div><b>Don't contact the finder yet.</b> Verify additional identifying details before proceeding.</div></div>

        <div class="sticky-actions"><button class="btn block lg" onclick="go('verify',{id:'${f.id}'})">${ic("shieldcheck")}Verify Ownership</button></div>
      `;
    }},

  /* ---- ITEM DETAIL ---- */
  item:{ header:"back", title:i=>DB.get(i.id)?.type==="lost"?"Lost Item":"Found Item", tabbar:false,
    render({id}){
      const i = DB.get(id) || DB.all()[0];
      if(!i) return emptyState("box","Item not found","This report is no longer available.");
      const hasMatch = i.type==="lost" && matchesFor(i.id).length;

      if(i.type==="lost"){
        return `
          <div class="spread" style="margin-top:6px"><h2 style="font-size:21px">Lost Item</h2>${statusBadge(i.status)}</div>
          <p class="muted" style="font-size:13.5px;margin-top:8px">${i.desc}</p>
          <div class="card pad" style="margin-top:16px;display:grid;gap:11px">
            <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("mappin")}</span>${i.location||"—"}</div>
            <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("clock")}</span>${i.when||i.time||""}</div>
          </div>
          <div class="sticky-actions">
            ${hasMatch ? `<button class="btn block lg" onclick="go('matches')">${ic("sparkle")}View Possible Matches</button>`
                       : `<button class="btn secondary block lg" onclick="toast('You will be notified about matches')">${ic("bell")}Notify me about matches</button>`}
          </div>
        `;
      }

      return `
        <div class="ai-stage" style="aspect-ratio:4/3;margin-top:6px">${photo(i)}<span class="badge found">Found</span></div>
        <div class="spread"><h2 style="font-size:21px">${displayTitle(i)}</h2>${statusBadge(i.status)}</div>
        <p class="muted" style="font-size:13.5px;margin-top:8px">${i.extra||"No additional details provided."}</p>
        <div class="card pad" style="margin-top:16px;display:grid;gap:11px">
          <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("mappin")}</span>${i.location||"—"}</div>
          <div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("clock")}</span>${i.when||i.time||""}</div>
          ${i.contact ? `<div class="row" style="font-size:13.5px;gap:9px"><span style="color:var(--sage)">${ic("user")}</span>Contact: ${i.contact}</div>` : ""}
        </div>
        ${i.features ? `<div class="sec"><h2>AI Understanding</h2><span class="tag ai" style="margin-left:auto">${ic("cpu")}AI</span></div>
        <div class="card pad"><div class="understand">
          ${Object.entries(i.features).map(([k,v])=>`<div class="u-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
        </div></div>` : ""}
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

  /* ---- AI ANALYSIS ---- */
  analysis:{ header:"back", title:"AI Analysis", tabbar:false, after(p){ runAnalysis(p); },
    render({mode="lost", art:artKind="item", img}){
      const stage = mode==="found"
        ? `<div class="ai-stage">${photo({img, art:artKind})}<span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span><div class="scan-glow"></div><div class="scan"></div></div>`
        : `<div class="card pad" style="text-align:center;padding:32px 20px"><div class="ic-b" style="margin:0 auto 10px">${ic("tag")}</div><p class="muted" style="font-size:13px">Saving your description...</p></div>`;
      return `
        <div class="ai-title"><span class="tag ai" style="margin-bottom:6px">${ic("cpu")}${mode==="found"?"Computer Vision + AI":"AI Matching"}</span></div>
        ${stage}
        <h2 style="text-align:center;font-size:19px" id="aiHead">${mode==="found" ? "AI is analyzing your photo…" : "Saving your report…"}</h2>
        <p class="muted" style="text-align:center;font-size:13px;margin-top:6px" id="aiSub">Please wait a moment.</p>
        <div class="card pad" style="margin-top:18px"><div class="progress-steps" id="steps"></div></div>
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
          <div class="field"><div class="q-label">1. What is inside the front pocket?</div><input class="input" id="v1" placeholder="e.g. charger, notebook, pen..."></div>
          <div class="field"><div class="q-label">2. What unique mark does the item have?</div><input class="input" id="v2" placeholder="e.g. scratch, sticker, initials..."></div>
          <div class="field"><div class="q-label">3. Describe another identifying detail.</div><input class="input" id="v3" placeholder="e.g. zipper colour, brand tag..."></div>
          <div class="alert info" style="margin-top:6px">${ic("lock")}<div>Your answers are private and only checked against the finder's notes.</div></div>
        </div>
        <div class="sticky-actions"><button class="btn block lg" id="vbtn">${ic("shieldcheck")}Submit Verification</button></div>
      `;
    }},

  /* ---- RECOVERY ---- */
  recovery:{ header:"back", title:"Recovery", tabbar:false,
    render({id}){
      const f = DB.get(id);
      if(!f) return emptyState("box","Item not found","This item is no longer available.");
      return `
        <div class="verified" style="margin-top:6px"><div class="vc">${ic("check")}</div>
          <h2>Match Verified</h2><p>Your lost item appears to match this found item.</p></div>
        <div class="card pad" style="margin:16px 0"><div class="row" style="gap:13px">
          <div class="art-wrap" style="width:64px;height:64px;border-radius:14px">${photo(f)}</div>
          <div><b style="font-size:15px">${displayTitle(f)}</b><div class="meta muted" style="font-size:12.5px;margin-top:4px">Found at: ${f.location}</div><div class="meta muted" style="font-size:12.5px">${f.when||f.time||""}</div></div>
        </div></div>

        <div class="sec"><h2>Connection</h2></div>
        <div class="conn">
          <div class="node"><div class="av" style="background:var(--sage-light);color:var(--sage)">${ic("user")}</div><div><b>Owner</b><span>You</span></div></div>
          <div class="arr">${ic("arrowdown")}</div>
          <div class="node mid"><div class="av">${ic("shieldcheck")}</div><b>Verified by CampusFind</b></div>
          <div class="arr">${ic("arrowdown")}</div>
          <div class="node"><div class="av" style="background:var(--beige-bg);color:var(--beige)">${ic("user")}</div><div><b>Finder</b><span>${f.contact||"Provided on verification"}</span></div></div>
        </div>

        <div class="alert ok" style="margin-top:16px">${ic("info")}<div><b>Recovery Details</b><br>Reach out using the contact shared above to arrange collection.</div></div>
        <div class="sticky-actions"><button class="btn success block lg" onclick="finishRecovery('${f.id}')">${ic("check")}Continue</button></div>
      `;
    }},

  /* ---- MY REPORTS ---- */
  myReports:{ header:"title", title:"My Reports", tab:null, after(){ wireReports(); },
    render(){
      return `
        <div class="seg" id="seg">
          <button data-t="lost" class="active">Lost</button>
          <button data-t="found">Found</button>
          <button data-t="recovered">Recovered</button>
        </div>
        <div id="reportsList"></div>`;
    }},

  /* ---- PROFILE ---- */
  profile:{ header:"back", title:"Profile", tabbar:false,
    render(){
      const row=(icn,label,go,danger)=>`<div class="menu-row ${danger?"danger":""}" onclick="${go}"><div class="mi">${ic(icn)}</div><b>${label}</b><span class="chev">${ic("chevright")}</span></div>`;
      return `
        <div class="profile-head"><div class="pa">${ic("user")}</div><h2>Campus Student</h2><p>student@campus.edu</p></div>
        <div class="menu-list" style="margin-bottom:16px">
          ${row("clipboard","My Reports","go('myReports')")}
          ${row("bell","Notifications","go('notifications')")}
          ${row("layers","Admin Dashboard","window.open('admin.html','_blank')")}
        </div>
        <div class="menu-list" style="margin-bottom:16px">
          ${row("help","Help &amp; Support","toast('Support: help@campusfind.edu')")}
          ${row("lock","Privacy","toast('Your data stays private')")}
          ${row("info","About CampusFind","openAbout()")}
        </div>
        <div class="menu-list">${row("logout","Logout","confirmLogout()",true)}</div>
        <p class="muted center" style="font-size:11.5px;margin-top:18px">CampusFind v1.0 · Smarter Matching. Faster Recovery.</p>
      `;
    }}
};

/* ---------------- List screens (lost/found) ---------------- */
function listMarkup(kind, ph, chips){
  return `
    <div class="searchbar">
      <div class="search">${ic("search")}<input id="q" placeholder="${ph}" oninput="onSearch('${kind}',this.value)"></div>
      <button class="filter-btn" onclick="openFilterSheet('${kind}')">${ic("filter")}</button>
    </div>
    <div class="chips" id="chips">${chips.map((c,i)=>`<button class="chip ${i===0?"active":""}" onclick="onChip('${kind}','${c}',this)">${c}</button>`).join("")}</div>
    <div class="${kind==='lost'?'list-plain':'grid'}" id="grid">${skCards(4)}</div>`;
}
function loadList(kind){
  setTimeout(()=>renderList(kind), 300);
}
function renderList(kind){
  const grid = $("#grid"); if(!grid) return;
  const f = state[kind];
  const source = kind==="lost" ? DB.unresolvedLost() : DB.found();
  let items = source.filter(i=>{
    const okQ = !f.q || ((i.desc||"")+(i.location||"")).toLowerCase().includes(f.q);
    const okC = f.chip==="all" || (i.location||"").includes(f.chip);
    return okQ && okC;
  });
  if(!items.length){
    grid.className = "list-plain";
    grid.innerHTML = kind==="lost"
      ? emptyState("search","No unresolved lost reports","Report a lost item to start AI matching.",`<button class="btn" onclick="go('report',{mode:'lost'})">Report Lost Item</button>`)
      : emptyState("box","No found items yet","Check back soon or report an item you found.",`<button class="btn" onclick="go('report',{mode:'found'})">Report Found Item</button>`);
  } else if(kind==="lost"){
    grid.className = "list-plain";
    grid.innerHTML = items.map(lostItemCard).join("");
    hydrate(grid);
  } else {
    grid.className = "grid";
    grid.innerHTML = items.map(itemCard).join("");
    hydrate(grid);
  }
}
function onSearch(kind,v){ state[kind].q=v.toLowerCase(); renderList(kind); }
function onChip(kind,c,el){ state[kind].chip = c==="All"?"all":c; el.parentElement.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); el.classList.add("active"); renderList(kind); }

/* ---------------- Match card + bars ---------------- */
function matchCard(m){
  const f = DB.get(m.foundId);
  return `<div class="card match-card">
    <div class="top">
      <div class="art-wrap">${photo(f)}</div>
      <div><span class="poss-tag">${ic("sparkle")}Possible Match</span><div style="font-weight:700;font-size:15px;margin-top:6px">${displayTitle(f)}</div>
        <div class="meta muted" style="font-size:12px;display:flex;gap:5px;align-items:center;margin-top:3px">${ic("mappin")}${f.location}</div></div>
      <div class="score"><div class="pct">${m.score}%</div><div class="lbl">Match</div></div>
    </div>
    <div class="score-bar"><i data-w="${m.score}" style="width:0"></i></div>
    <div class="reasons">${m.reasons.map(r=>`<div class="reason"><span class="ic-b">${ic("check")}</span>${r}</div>`).join("")}</div>
    <div class="cta"><button class="btn block" onclick="go('matchDetails',{id:'${m.foundId}'})">View Match</button></div>
  </div>`;
}
function animateBars(){ setTimeout(()=>document.querySelectorAll(".score-bar i").forEach(el=>el.style.width=el.dataset.w+"%"),120); }

/* ---------------- Report wiring ---------------- */
function wireReport(mode){
  if(mode==="found"){
    const up=$("#upload"), file=$("#file");
    file.addEventListener("change",()=>{ const f=file.files[0]; if(!f) return;
      const url=URL.createObjectURL(f);
      $("#preview").innerHTML=`<div class="art-wrap"><img src="${url}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`;
      up.classList.add("has");
    });
    ["dragover","dragleave","drop"].forEach(ev=>up.addEventListener(ev,e=>{e.preventDefault();up.classList.toggle("drag",ev==="dragover");}));
    up.addEventListener("drop",e=>{ if(e.dataTransfer.files[0]){ file.files=e.dataTransfer.files; file.dispatchEvent(new Event("change")); }});

    $("#submitBtn").addEventListener("click",()=>{
      const contact=$("#f_contact");
      let ok=true;
      if(!file.files[0]){ up.classList.add("err"); $("#e_photo").classList.add("show"); ok=false; } else { up.classList.remove("err"); $("#e_photo").classList.remove("show"); }
      if(!contact.value.trim()){ contact.classList.add("err"); $("#e_contact").classList.add("show"); ok=false; } else { contact.classList.remove("err"); $("#e_contact").classList.remove("show"); }
      if(!ok){ toast("Please fill the required fields", true); return; }

      const url = URL.createObjectURL(file.files[0]);
      const item={ id:"F-"+Date.now().toString().slice(-6), type:"found", art:"item", img:url,
        location:$("#f_loc").value.trim(), time:"just now", when:"Today", contact:contact.value.trim(),
        extra:$("#f_extra").value.trim(), status:"Searching" };
      DB.add(item);
      go("analysis",{mode:"found", art:"item", img:item.img, newId:item.id});
    });
  } else {
    $("#submitBtn").addEventListener("click",()=>{
      const desc=$("#f_desc"), loc=$("#f_loc");
      let ok=true;
      if(!desc.value.trim()){ desc.classList.add("err"); $("#e_desc").classList.add("show"); ok=false; } else { desc.classList.remove("err"); $("#e_desc").classList.remove("show"); }
      if(!loc.value.trim()){ loc.classList.add("err"); $("#e_loc").classList.add("show"); ok=false; } else { loc.classList.remove("err"); $("#e_loc").classList.remove("show"); }
      if(!ok){ toast("Please fill the required fields", true); return; }

      const item={ id:"L-"+Date.now().toString().slice(-6), type:"lost", art:"item",
        desc:desc.value.trim(), location:loc.value.trim(), time:"just now",
        when:"Today, "+($("#f_time").value||"10:30"), status:"Searching" };
      DB.add(item);
      setActiveLostId(item.id);
      go("analysis",{mode:"lost", art:"item", newId:item.id});
    });
  }
}

/* ---------------- AI analysis animation ---------------- */
function runAnalysis({mode="lost", art:artKind="item", newId}){
  const steps = mode==="found"
    ? [{t:"Image uploaded"},{t:"Identifying item type"},{t:"Extracting features"},{t:"Saving to database"}]
    : [{t:"Saving your report"},{t:"Searching found items"},{t:"Calculating match scores"}];
  let cur=0;
  const draw=()=>{ $("#steps").innerHTML=steps.map((s,i)=>{
    const cls=i<cur?"done":i===cur?"active":"pending";
    const dot=i<cur?ic("check"):i===cur?'<span class="spin"></span>':"";
    return `<div class="pstep ${cls}"><span class="pc">${dot}</span>${s.t}</div>`;
  }).join(""); };
  draw();
  const tick=setInterval(()=>{ cur++; draw();
    if(cur>=steps.length){ clearInterval(tick); setTimeout(showResult,500); }
  },850);

  function showResult(){
    $("#aiHead").textContent="Done";
    $("#aiSub").textContent = mode==="found" ? "Your found item has been saved." : "Your report has been saved.";
    const stageEl = document.querySelector(".ai-stage .scan");
    if(stageEl) stageEl.style.display="none";
    $("#aiResult").innerHTML=`
      <div class="ai-note">${'<div class="ic-b">'+ic("cpu")+'</div>'}<div><b>AI suggests, you decide.</b><p>Possible matches are ranked by similarity — ownership is confirmed by you.</p></div></div>
      <div class="alert ok" style="margin-top:16px">${ic("check")}<div><b>Report Submitted.</b> ${mode==="lost" ? "AI will compare it with found items." : "Thanks for helping reunite it with its owner."}</div></div>
      <div class="sticky-actions">
        ${mode==="lost"
          ? `<button class="btn block lg" onclick="go('matches')">${ic("sparkle")}View Possible Matches</button>`
          : `<button class="btn success block lg" onclick="go('found')">${ic("check")}Done</button>`}
      </div>`;
    hydrate($("#aiResult"));
  }
}

/* ---------------- Verification wiring ---------------- */
function wireVerify({id}){
  $("#vbtn").addEventListener("click",()=>{
    const vals=["v1","v2","v3"].map(x=>$("#"+x).value.trim());
    if(vals.filter(Boolean).length<2){ toast("Please answer at least 2 questions", true); return; }
    if(id) DB.setStatus(id,"Under Verification");
    $("#vform").innerHTML=`<div class="confirm" style="padding-top:10px">
      <div class="cc">${ic("shieldcheck")}</div>
      <h2>Verification Submitted</h2>
      <p>Thanks! Your answers are being reviewed.</p>
      <div style="margin-top:14px">${statusBadge("Under Verification")}</div>
    </div>`;
    $("#vbtn").outerHTML=`<button class="btn block lg" onclick="go('recovery',{id:'${id||""}'})">${ic("arrowright")}Continue</button>`;
    hydrate($("#screen"));
    toast("Verification submitted");
  });
}
function finishRecovery(id){
  DB.setStatus(id,"Recovered");
  toast("Recovery complete 🎉");
  go("home");
}

/* ---------------- My Reports ---------------- */
function wireReports(){
  const draw=()=>{
    const t=state.reports;
    let items;
    if(t==="recovered") items=DB.all().filter(i=>i.status==="Recovered");
    else items=DB.all().filter(i=>i.type===t && i.status!=="Recovered");
    const el=$("#reportsList");
    if(!items.length){ el.innerHTML=emptyState("clipboard","Nothing here yet","Your "+t+" reports will appear here."); return; }
    el.innerHTML=items.map(i=>{
      if(i.type==="lost"){
        return `<div class="card report-item lost-text-card" onclick="go('item',{id:'${i.id}'})">
          <div style="flex:1"><p class="lost-desc">${i.desc||"No description"}</p><div class="meta">${i.location||"—"} · ${i.time||""}</div><div style="margin-top:7px">${statusBadge(i.status)}</div></div>
          ${ic("chevright")}
        </div>`;
      }
      return `<div class="card report-item" onclick="go('item',{id:'${i.id}'})">
        <div class="art-wrap">${photo(i)}</div>
        <div style="flex:1"><b>${displayTitle(i)}</b><div class="meta">${i.location||"—"} · ${i.time||""}</div><div style="margin-top:7px">${statusBadge(i.status)}</div></div>
        ${ic("chevright")}
      </div>`;
    }).join("");
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
function openFilterSheet(kind){
  openSheet(`<h3>Filters</h3><p class="muted" style="font-size:13px;margin-bottom:14px">Refine ${kind} items.</p>
    <div class="chips" style="flex-wrap:wrap;margin:0 0 16px">
      ${["All","Today","This Week","Library","Cafeteria","Block A","Sports Center","Lab 3"].map(c=>`<button class="chip" onclick="state['${kind}'].chip='${c==='All'?'all':c}';renderList('${kind}');closeSheet();toast('Filter: ${c}')">${c}</button>`).join("")}
    </div>
    <button class="btn block" onclick="closeSheet()">Apply</button>`);
}
function openAbout(){
  openSheet(`<h3>About CampusFind</h3><p class="muted" style="font-size:13.5px;line-height:1.6;margin:8px 0 16px">CampusFind uses computer vision and AI to match lost and found items on campus. AI only suggests <b>possible</b> matches — students verify identifying details before recovery, so ownership is always human-confirmed.</p><button class="btn block" onclick="closeSheet()">Got it</button>`);
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
    o.innerHTML=`
      <div class="onb">
        <div class="skip" onclick="finishOnb()">${i<2?"Skip":"&nbsp;"}</div>
        <div class="slides"><div class="slide">
          <div class="illo">${ONB[i].art}</div><h2>${ONB[i].h}</h2><p>${ONB[i].p}</p>
        </div></div>
        <div class="dots">${ONB.map((_,x)=>`<i class="${x===i?"on":""}"></i>`).join("")}</div>
        <div class="foot">${ i<2
          ? `<button class="btn block lg" onclick="nextOnb()">Next</button>`
          : `<button class="btn block lg" onclick="finishOnb()">Get Started</button>` }</div>
      </div>`;
  };
  window.nextOnb=()=>{ if(i<ONB.length-1){ i++; draw(); } };
  window.finishOnb=()=>{ localStorage.setItem("campusfind_onboarded","1"); o.style.display="none"; startApp(); };
  draw();
}
function startApp(){ go("home",{},{back:true}); }

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded",()=>{
  $("#fab").addEventListener("click", openReportSheet);
  renderTabs("home");
  bootSplash();
});