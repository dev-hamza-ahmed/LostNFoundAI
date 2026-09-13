/* =========================================================
   CampusFind — icons + item illustrations (all inline SVG).
   No external images = nothing can break offline.
   ========================================================= */

/* ---- outline UI icons (24x24) ---- */
const ICONS = {
  home:'<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10.5 20a1.7 1.7 0 0 0 3 0"/>',
  user:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  mappin:'<path d="M20 10c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  camera:'<path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3.3"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  chevright:'<path d="m9 6 6 6-6 6"/>',
  chevleft:'<path d="m15 6-6 6 6 6"/>',
  arrowright:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowdown:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  shield:'<path d="M12 21s7-3.5 7-9V6l-7-3-7 3v6c0 5.5 7 9 7 9z"/>',
  shieldcheck:'<path d="M12 21s7-3.5 7-9V6l-7-3-7 3v6c0 5.5 7 9 7 9z"/><path d="m9 11 2 2 4-4"/>',
  cpu:'<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>',
  sparkle:'<path d="M12 3.5 13.7 9 19 10.7 13.7 12.4 12 18l-1.7-5.6L5 10.7 10.3 9z"/><path d="M18.5 4.5v3M20 6h-3"/>',
  scan:'<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M4 12h16"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  palette:'<path d="M12 21a9 9 0 1 1 0-18c5 0 9 3.6 9 8 0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 21z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="11" r="1"/>',
  shape:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><circle cx="17" cy="7" r="4"/><path d="M7 14 3 21h8z"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  tag:'<path d="M3 11V5a2 2 0 0 1 2-2h6l9 9-8 8z"/><circle cx="8" cy="8" r="1.4"/>',
  megaphone:'<path d="m3 11 15-5v12L3 14z"/><path d="M3 11v3a1 1 0 0 0 1 1h1v-5H4a1 1 0 0 0-1 1z"/><path d="M9 15v3a2 2 0 0 0 3.4 1.4"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 4v4h-4"/>',
  sun:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 13.09H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7"/><path d="M12 17h.01"/>',
  lock:'<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  file:'<path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8 13h8M8 17h5"/>',
  handshake:'<path d="m11 17 2 2a1.5 1.5 0 0 0 2-2M14 15l1.5 1.5a1.5 1.5 0 0 0 2-2L14 11M6 12 3 9l4-4 4 3h4l4 3-3 3M6 12l3 3a1.5 1.5 0 0 0 2 0"/>',
  trophy:'<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 15v5"/>',
  warn:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.5"/>',
  star:'<path d="m12 3 2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19l1-5.8L3.5 9l5.9-.8z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.4 5.6L8 16l2.4-5.6z"/>',
  bookmark:'<path d="M6 4h12v16l-6-4-6 4z"/>',
  clipboard:'<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M9 11h6M9 15h4"/>'
};
function ic(n, cls=''){ return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||ICONS.box}</svg>`; }
function hydrate(scope=document){ scope.querySelectorAll('[data-ic]').forEach(el=>el.innerHTML=ic(el.dataset.ic)); }

/* ---- item illustrations (viewBox 0 0 120 120) ---- */
const P = { sage:'#3F6B5B', sageD:'#294539', sageL:'#DCE9E2', cream:'#F7F4ED', beige:'#C49A6C', beigeD:'#a97f4f', char:'#1F2925', white:'#fff', line:'#cdd8d1' };
const ART = {
  backpack:`<rect x="34" y="30" width="52" height="66" rx="18" fill="${P.sage}"/><rect x="41" y="24" width="38" height="20" rx="12" fill="${P.sageD}"/><rect x="42" y="52" width="36" height="30" rx="12" fill="${P.sageL}"/><rect x="52" y="60" width="16" height="4" rx="2" fill="${P.sage}"/><path d="M46 30v-4a14 14 0 0 1 28 0v4" fill="none" stroke="${P.sageD}" stroke-width="4"/><rect x="55" y="86" width="10" height="8" rx="3" fill="${P.beige}"/>`,
  laptopbag:`<rect x="26" y="40" width="68" height="50" rx="10" fill="${P.char}"/><rect x="26" y="40" width="68" height="16" rx="8" fill="${P.sageD}"/><rect x="34" y="60" width="52" height="22" rx="6" fill="${P.sageL}"/><path d="M44 40v-6a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v6" fill="none" stroke="${P.sage}" stroke-width="4"/><rect x="54" y="47" width="12" height="4" rx="2" fill="${P.beige}"/>`,
  wallet:`<rect x="28" y="40" width="64" height="42" rx="9" fill="${P.beige}"/><rect x="28" y="40" width="64" height="42" rx="9" fill="none" stroke="${P.beigeD}" stroke-width="2"/><rect x="66" y="54" width="22" height="16" rx="5" fill="${P.cream}"/><circle cx="77" cy="62" r="4" fill="${P.sage}"/><rect x="36" y="34" width="34" height="10" rx="4" fill="${P.sageL}"/>`,
  phone:`<rect x="42" y="24" width="36" height="72" rx="11" fill="${P.char}"/><rect x="46" y="30" width="28" height="54" rx="4" fill="${P.sageL}"/><circle cx="60" cy="90" r="3.4" fill="${P.sage}"/><rect x="53" y="27" width="14" height="2.4" rx="1.2" fill="${P.sage}"/><circle cx="66" cy="40" r="3" fill="${P.beige}"/>`,
  keys:`<circle cx="46" cy="58" r="16" fill="none" stroke="${P.beige}" stroke-width="7"/><path d="M58 58h34l-6 8m-10-8v9" stroke="${P.beige}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="46" cy="58" r="5" fill="${P.sageL}"/><rect x="70" y="30" width="14" height="9" rx="3" fill="${P.error||'#B85C5C'}"/>`,
  bottle:`<rect x="48" y="34" width="24" height="60" rx="11" fill="${P.sage}"/><rect x="52" y="24" width="16" height="12" rx="4" fill="${P.sageD}"/><rect x="52" y="50" width="16" height="22" rx="6" fill="${P.sageL}"/><rect x="55" y="20" width="10" height="6" rx="3" fill="${P.beige}"/>`,
  calculator:`<rect x="38" y="26" width="44" height="68" rx="9" fill="${P.char}"/><rect x="44" y="32" width="32" height="14" rx="4" fill="${P.sageL}"/><g fill="${P.sage}"><rect x="44" y="52" width="8" height="8" rx="2"/><rect x="56" y="52" width="8" height="8" rx="2"/><rect x="68" y="52" width="8" height="8" rx="2"/><rect x="44" y="64" width="8" height="8" rx="2"/><rect x="56" y="64" width="8" height="8" rx="2"/><rect x="68" y="64" width="8" height="8" rx="2"/><rect x="44" y="76" width="8" height="8" rx="2"/><rect x="56" y="76" width="8" height="8" rx="2"/></g><rect x="68" y="76" width="8" height="8" rx="2" fill="${P.beige}"/>`,
  idcard:`<rect x="26" y="38" width="68" height="46" rx="8" fill="${P.white}" stroke="${P.line}" stroke-width="2"/><rect x="26" y="38" width="68" height="13" rx="8" fill="${P.sage}"/><circle cx="42" cy="66" r="9" fill="${P.sageL}"/><rect x="57" y="60" width="30" height="5" rx="2.5" fill="${P.sageL}"/><rect x="57" y="70" width="22" height="5" rx="2.5" fill="${P.beige}"/>`,
  airpods:`<rect x="42" y="42" width="36" height="30" rx="14" fill="${P.white}" stroke="${P.line}" stroke-width="2"/><path d="M52 52c0-4 3-6 3-6s0 20 0 24c0 3-6 3-6 0z" fill="${P.sage}"/><path d="M68 52c0-4-3-6-3-6s0 20 0 24c0 3 6 3 6 0z" fill="${P.sage}"/><rect x="54" y="74" width="12" height="4" rx="2" fill="${P.sageL}"/>`,
  jacket:`<path d="M44 30 30 40l6 12 6-3v40h44V49l6 3 6-12-14-10-10 6H54z" fill="${P.sage}"/><path d="M60 34v55" stroke="${P.sageD}" stroke-width="3"/><path d="M54 30l6 6 6-6" fill="none" stroke="${P.sageD}" stroke-width="3"/><circle cx="60" cy="60" r="2.4" fill="${P.beige}"/><circle cx="60" cy="72" r="2.4" fill="${P.beige}"/>`,
  headphones:`<path d="M30 66V56a30 30 0 0 1 60 0v10" fill="none" stroke="${P.char}" stroke-width="7"/><rect x="24" y="62" width="16" height="26" rx="8" fill="${P.sage}"/><rect x="80" y="62" width="16" height="26" rx="8" fill="${P.sage}"/><rect x="28" y="68" width="8" height="14" rx="4" fill="${P.sageL}"/>`,
  book:`<rect x="34" y="28" width="52" height="66" rx="6" fill="${P.beige}"/><rect x="34" y="28" width="12" height="66" fill="${P.beigeD}"/><rect x="52" y="42" width="26" height="5" rx="2.5" fill="${P.cream}"/><rect x="52" y="54" width="20" height="5" rx="2.5" fill="${P.cream}"/>`,
  umbrella:`<path d="M24 58a36 36 0 0 1 72 0z" fill="${P.sage}"/><path d="M24 58a36 36 0 0 1 72 0" fill="none" stroke="${P.sageD}" stroke-width="2"/><path d="M60 58v30a7 7 0 0 0 12 0" fill="none" stroke="${P.char}" stroke-width="4"/>`,
  glasses:`<circle cx="42" cy="60" r="13" fill="none" stroke="${P.char}" stroke-width="5"/><circle cx="78" cy="60" r="13" fill="none" stroke="${P.char}" stroke-width="5"/><path d="M55 58h10M20 54l9-4M100 54l-9-4" stroke="${P.char}" stroke-width="5" fill="none"/>`,
  watch:`<circle cx="60" cy="60" r="22" fill="${P.char}"/><circle cx="60" cy="60" r="15" fill="${P.sageL}"/><path d="M60 52v8l5 3" stroke="${P.sage}" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="52" y="24" width="16" height="16" rx="4" fill="${P.beige}"/><rect x="52" y="80" width="16" height="16" rx="4" fill="${P.beige}"/>`,
  item:`<rect x="36" y="36" width="48" height="48" rx="12" fill="${P.sageL}"/><path d="M48 60h24M60 48v24" stroke="${P.sage}" stroke-width="5" stroke-linecap="round"/>`
};
function art(kind){ return `<svg class="art" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">${ART[kind]||ART.item}</svg>`; }
/* photo with graceful fallback to the SVG illustration if the image fails */
function photo(i){
  if(!i || !i.img) return art(i ? i.art : "item");
  return `<img class="art" src="${i.img}" alt="${i.name||""}" loading="lazy"
    onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend', art('${i.art}'))">`;
}

/* ---- onboarding scene illustrations ---- */
const ONB_ART = {
  s1:`<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="196" rx="110" ry="14" fill="${P.sageL}"/>
    <circle cx="150" cy="70" r="118" fill="none"/>
    <g><circle cx="120" cy="70" r="22" fill="${P.beige}"/><rect x="100" y="92" width="40" height="52" rx="16" fill="${P.sage}"/>
      <rect x="96" y="100" width="14" height="40" rx="7" fill="${P.sage}" transform="rotate(18 103 120)"/>
      <path d="M150 118h34" stroke="${P.sageD}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="120" cy="66" r="4" fill="${P.char}"/></g>
    <g transform="translate(196 120)"><rect x="0" y="0" width="46" height="56" rx="14" fill="${P.sageD}"/><rect x="8" y="20" width="30" height="24" rx="8" fill="${P.sageL}"/><path d="M12 0v-4a11 11 0 0 1 22 0v4" fill="none" stroke="${P.beige}" stroke-width="5"/></g>
    <g stroke="${P.beige}" stroke-width="3" stroke-dasharray="4 6" fill="none"><path d="M150 110q40-30 60-4"/></g>
    <circle cx="210" cy="96" r="10" fill="none" stroke="${P.sage}" stroke-width="4"/><path d="M217 103l7 7" stroke="${P.sage}" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  s2:`<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="196" rx="110" ry="14" fill="${P.sageL}"/>
    <rect x="26" y="66" width="90" height="90" rx="18" fill="${P.white}" stroke="${P.line}" stroke-width="2"/>
    <g transform="translate(46 84)">${ART.backpack.replace(/120/g,'80')}</g>
    <rect x="184" y="66" width="90" height="90" rx="18" fill="${P.white}" stroke="${P.line}" stroke-width="2"/>
    <g transform="translate(204 84)">${ART.laptopbag.replace(/120/g,'80')}</g>
    <path d="M116 111h68" stroke="${P.sage}" stroke-width="4" stroke-dasharray="3 7" stroke-linecap="round"/>
    <circle cx="150" cy="111" r="24" fill="${P.sage}"/><text x="150" y="116" font-family="Manrope,sans-serif" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">91%</text>
    <g fill="${P.beige}"><circle cx="150" cy="52" r="4"/><path d="M150 40l2.2 6.4 6.4.9-4.6 4.4 1.1 6.4-5.1-3-5.1 3 1.1-6.4-4.6-4.4 6.4-.9z" transform="translate(0 -6) scale(.9)" transform-origin="150 52"/></g>
  </svg>`,
  s3:`<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="196" rx="110" ry="14" fill="${P.sageL}"/>
    <rect x="96" y="52" width="108" height="108" rx="24" fill="${P.white}" stroke="${P.line}" stroke-width="2"/>
    <g transform="translate(116 66)">${ART.backpack.replace(/120/g,'80')}</g>
    <circle cx="196" cy="150" r="30" fill="${P.success}"/><path d="M184 150l8 8 16-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="70" cy="120" r="20" fill="${P.beige}"/><rect x="52" y="142" width="36" height="40" rx="14" fill="${P.sage}"/>
  </svg>`
};
