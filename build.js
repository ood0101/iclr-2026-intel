#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const people = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/people.json'), 'utf8'));
const workshops = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/workshops.json'), 'utf8'));

const dataJson = JSON.stringify({ workshops, people });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#b8860b">
<title>ICLR 2026 · Workshop Intelligence Hub</title>
<link rel="manifest" href="data:application/json,{%22name%22:%22ICLR+2026+Hub%22,%22display%22:%22standalone%22,%22background_color%22:%22%23f7f5f0%22,%22theme_color%22:%22%23b8860b%22}">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f7f5f0;
  --surface:#ffffff;
  --surface-el:#f0ede6;
  --text:#1a1814;
  --muted:#7a7060;
  --amber:#b8860b;
  --amber-dim:#8a6408;
  --border:#e0dbd0;
  --danger:#c04040;
  --success:#2d7a40;
  --blue:#2860a0;
  --nav-h:60px;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.5}
body{display:flex;flex-direction:column;min-height:100vh}
a{color:var(--amber);text-decoration:none}
a:hover{text-decoration:underline}

/* Layout */
#app{flex:1;overflow-y:auto;padding-bottom:calc(var(--nav-h) + 8px)}
.view{display:none;padding:16px;max-width:640px;margin:0 auto}
.view.active{display:block}

/* Bottom Nav */
#nav{
  position:fixed;bottom:0;left:0;right:0;
  height:var(--nav-h);
  background:var(--surface);
  border-top:1px solid var(--border);
  display:flex;
  z-index:100;
}
.nav-btn{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:none;border:none;cursor:pointer;
  font-size:10px;color:var(--muted);gap:2px;
  padding:0;border-bottom:2px solid transparent;
  transition:color 0.15s,border-color 0.15s;
  -webkit-tap-highlight-color:transparent;
  min-height:44px;
}
.nav-btn.active{color:var(--amber);border-bottom-color:var(--amber)}
.nav-icon{font-size:20px;line-height:1}

/* Cards */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:12px;padding:14px;margin-bottom:10px;
  cursor:pointer;transition:box-shadow 0.15s;
}
.card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.08)}
.card:active{box-shadow:none;background:var(--surface-el)}

/* Pills */
.pill{
  display:inline-block;font-size:11px;font-weight:600;
  padding:2px 7px;border-radius:20px;letter-spacing:0.02em;
}
.pill-org{background:#fff3e0;color:#b8860b;border:1px solid #f0d060}
.pill-spk{background:#e3f0ff;color:#2860a0;border:1px solid #b0ccee}
.pill-pan{background:#efe0f5;color:#6040a0;border:1px solid #c8a8e0}
.pill-t1{background:#fff3cd;color:#856404;border:1px solid #e8c84a}
.pill-t2{background:#cfe2ff;color:#084298;border:1px solid #9ec5fe}
.pill-t3{background:#e2e3e5;color:#41464b;border:1px solid #c4c8cb}
.pill-tag{background:var(--surface-el);color:var(--muted);border:1px solid var(--border);font-weight:400}
.pill-chip{
  display:inline-block;font-size:13px;padding:6px 14px;border-radius:20px;
  border:1px solid var(--border);background:var(--surface);color:var(--muted);
  cursor:pointer;margin:0 4px 6px 0;transition:all 0.15s;user-select:none;
}
.pill-chip.active{background:var(--amber);color:#fff;border-color:var(--amber)}
.pill-chip:active{opacity:0.8}

/* Search */
.search-wrap{position:relative;margin-bottom:12px}
.search-input{
  width:100%;padding:10px 14px 10px 36px;
  border:1px solid var(--border);border-radius:10px;
  background:var(--surface);color:var(--text);font-size:15px;
  outline:none;
}
.search-input:focus{border-color:var(--amber)}
.search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:15px;pointer-events:none}

/* Comm dot */
.comm-dot{
  display:inline-block;width:8px;height:8px;border-radius:50%;
  vertical-align:middle;margin-left:4px;flex-shrink:0;
}
.comm-strong{background:var(--success)}
.comm-medium{background:var(--amber)}
.comm-low{background:#bbb}

/* Priority star */
.priority-star{color:var(--amber);font-size:13px;margin-right:2px}

/* Section headers */
.section-title{
  font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
  color:var(--muted);margin:20px 0 10px;
}
.section-divider{border:none;border-top:1px solid var(--border);margin:20px 0}

/* Home */
.home-header{
  background:var(--amber);color:#fff;border-radius:16px;
  padding:24px 20px;margin-bottom:20px;
}
.home-title{font-size:22px;font-weight:700;letter-spacing:-0.02em}
.home-sub{font-size:13px;opacity:0.85;margin-top:2px}
.home-tagline{font-size:15px;margin-top:8px;opacity:0.9}
.stats-row{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.stat-box{
  flex:1;min-width:80px;background:var(--surface);border:1px solid var(--border);
  border-radius:10px;padding:12px;text-align:center;
}
.stat-num{font-size:24px;font-weight:700;color:var(--amber)}
.stat-label{font-size:11px;color:var(--muted);margin-top:2px}
.cta-row{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
.btn{
  flex:1;min-width:120px;padding:12px 16px;border-radius:10px;border:none;
  font-size:14px;font-weight:600;cursor:pointer;transition:opacity 0.15s;
  -webkit-tap-highlight-color:transparent;
}
.btn-primary{background:var(--amber);color:#fff}
.btn-secondary{background:var(--surface);color:var(--amber);border:1px solid var(--amber)}
.btn:active{opacity:0.8}

/* Person avatar */
.avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;flex-shrink:0;background:var(--surface-el);border:1.5px solid var(--border)}
.avatar-lg{width:72px;height:72px;border-radius:50%;object-fit:cover;flex-shrink:0;background:var(--surface-el);border:2px solid var(--border)}
.card-inner{display:flex;gap:12px;align-items:flex-start}
.card-body{flex:1;min-width:0}

/* Person card */
.person-name{font-size:15px;font-weight:700;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.person-affil{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:2px 0 4px}
.person-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px}
.person-score{font-family:monospace;font-size:12px;color:var(--muted)}
.person-desc{font-size:13px;color:var(--muted);line-height:1.4;margin-top:4px}
.person-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}

/* Profile view */
.profile-header{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px}
.profile-name{font-size:22px;font-weight:700;letter-spacing:-0.02em}
.profile-title{font-size:13px;color:var(--muted);margin:2px 0 8px}
.profile-pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.social-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.social-link{
  display:inline-flex;align-items:center;gap:4px;
  font-size:12px;padding:4px 10px;border-radius:20px;
  background:var(--surface-el);color:var(--muted);border:1px solid var(--border);
}
.social-link:hover{color:var(--amber);border-color:var(--amber);text-decoration:none}
.info-block{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px}
.info-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:4px}
.info-value{font-size:14px;line-height:1.55}
.bwu-grid{display:grid;gap:10px}
.bwu-item{}
.bwu-warn{color:var(--danger)}
.paper-item{padding:8px 0;border-bottom:1px solid var(--border)}
.paper-item:last-child{border-bottom:none}
.paper-title{font-size:13px;font-weight:600}
.paper-meta{font-size:11px;color:var(--muted);margin-top:2px}
.arxiv-item{padding:8px 0;border-bottom:1px solid var(--border)}
.arxiv-item:last-child{border-bottom:none}
.arxiv-title{font-size:13px;font-weight:600}
.arxiv-meta{font-size:11px;color:var(--muted);margin:2px 0}
.arxiv-summary{font-size:12px;color:var(--muted);line-height:1.4}
.confidence-badge{
  display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;
  background:var(--surface-el);color:var(--muted);border:1px solid var(--border);
}
.conf-high{background:#d4edda;color:#155724;border-color:#c3e6cb}
.conf-medium{background:#fff3cd;color:#856404;border-color:#ffeaa7}
.conf-low{background:#f8d7da;color:#721c24;border-color:#f5c6cb}

/* Workshop card */
.ws-name{font-size:14px;font-weight:700;margin:4px 0}
.ws-meta{font-size:12px;color:var(--muted);margin-bottom:6px}
.ws-conflict{font-size:12px;color:var(--danger);margin-top:6px;display:flex;align-items:center;gap:4px}
.ws-themes{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}

/* Workshop detail */
.ws-detail-header{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px}
.ws-detail-name{font-size:20px;font-weight:700;line-height:1.3;margin:6px 0}
.mini-card{
  background:var(--surface-el);border:1px solid var(--border);
  border-radius:8px;padding:10px;cursor:pointer;transition:background 0.15s;
  margin-bottom:8px;
}
.mini-card:hover{background:var(--border)}
.mini-card:active{background:var(--border)}
.mini-name{font-size:13px;font-weight:600}
.mini-affil{font-size:11px;color:var(--muted)}

/* Back btn */
.back-btn{
  display:inline-flex;align-items:center;gap:6px;
  font-size:13px;color:var(--amber);background:none;border:none;cursor:pointer;
  margin-bottom:12px;padding:4px 0;font-weight:600;
}
.back-btn:hover{text-decoration:underline}

/* Agenda */
.agenda-item{padding:8px 0;border-bottom:1px solid var(--border);font-size:13px}
.agenda-item:last-child{border-bottom:none}
.agenda-time{font-family:monospace;font-size:11px;color:var(--muted)}

/* Empty state */
.empty{text-align:center;color:var(--muted);padding:40px 20px;font-size:14px}

/* Scrollbar */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

@media(min-width:480px){
  .view{padding:20px}
  .home-title{font-size:26px}
}
</style>
</head>
<body>
<div id="app">
  <div id="view-home" class="view active"></div>
  <div id="view-people" class="view"></div>
  <div id="view-person" class="view"></div>
  <div id="view-workshops" class="view"></div>
  <div id="view-workshop" class="view"></div>
</div>
<nav id="nav">
  <button class="nav-btn active" data-view="home" onclick="navigate('home')">
    <span class="nav-icon">🏠</span>Home
  </button>
  <button class="nav-btn" data-view="people" onclick="navigate('people')">
    <span class="nav-icon">👥</span>People
  </button>
  <button class="nav-btn" data-view="workshops" onclick="navigate('workshops')">
    <span class="nav-icon">📋</span>Workshops
  </button>
</nav>

<script>
const DATA = ${dataJson};

// ── Helpers ──────────────────────────────────────────────────────────────────
const people = DATA.people;
const workshops = DATA.workshops;

const workshopById = {};
workshops.forEach(w => { workshopById[w.id] = w; });

const personById = {};
people.forEach(p => { personById[p.id] = p; });

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function trunc(s, n) {
  if (!s) return '';
  s = String(s);
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function commDot(p) {
  const score = p.connector_score || 0;
  let cls = 'comm-low', label = 'LOW';
  if (score >= 5) { cls = 'comm-strong'; label = 'STRONG'; }
  else if (score >= 3) { cls = 'comm-medium'; label = 'MEDIUM'; }
  return \`<span class="comm-dot \${cls}" title="\${label} signal"></span>\`;
}

function rolePills(roles) {
  if (!roles || !roles.length) return '';
  return roles.map(r => {
    const rl = r.toLowerCase();
    if (rl === 'organizer') return '<span class="pill pill-org">ORG</span>';
    if (rl === 'speaker') return '<span class="pill pill-spk">SPK</span>';
    if (rl === 'panelist') return '<span class="pill pill-pan">PAN</span>';
    return \`<span class="pill pill-tag">\${esc(r)}</span>\`;
  }).join(' ');
}

function tierPill(tier) {
  if (tier === 1) return '<span class="pill pill-t1">T1</span>';
  if (tier === 2) return '<span class="pill pill-t2">T2</span>';
  return '<span class="pill pill-t3">T3</span>';
}

function workshopTags(wids, max) {
  if (!wids || !wids.length) return '';
  const shown = wids.slice(0, max || 2);
  return shown.map(id => {
    const w = workshopById[id];
    const name = w ? trunc(w.name, 22) : id;
    return \`<span class="pill pill-tag" style="font-size:10px">\${esc(name)}</span>\`;
  }).join('');
}

function personPhoto(p, size) {
  const cls = size === 'lg' ? 'avatar-lg' : 'avatar';
  const src = p.photo_b64 || p.photo_url || '';
  const fallback = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(p.name||'?')}&background=b8860b&color=fff&size=128&bold=true\`;
  if (!src) return \`<img class="\${cls}" src="\${fallback}" alt="\${esc(p.name||'')}" loading="lazy">\`;
  return \`<img class="\${cls}" src="\${esc(src)}" alt="\${esc(p.name||'')}" loading="lazy" onerror="this.src='\${fallback}'">\`;
}

// ── State ─────────────────────────────────────────────────────────────────────
let currentView = 'home';
let currentPersonId = null;
let currentWorkshopId = null;
let peopleFilter = 'all';
let workshopFilter = 'all';
let searchQuery = '';

// ── Navigation ────────────────────────────────────────────────────────────────
function navigate(view, id) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  currentView = view;

  if (view === 'person' && id) {
    currentPersonId = id;
    renderPerson(id);
    document.getElementById('view-person').classList.add('active');
    window.scrollTo(0,0);
    document.getElementById('app').scrollTop = 0;
    return;
  }
  if (view === 'workshop' && id) {
    currentWorkshopId = id;
    renderWorkshopDetail(id);
    document.getElementById('view-workshop').classList.add('active');
    window.scrollTo(0,0);
    document.getElementById('app').scrollTop = 0;
    return;
  }

  const viewMap = { home: 'home', people: 'people', workshops: 'workshops' };
  const viewId = viewMap[view] || 'home';
  document.getElementById('view-' + viewId).classList.add('active');

  const navBtn = document.querySelector(\`.nav-btn[data-view="\${viewId}"]\`);
  if (navBtn) navBtn.classList.add('active');

  if (view === 'home') renderHome();
  if (view === 'people') renderPeople();
  if (view === 'workshops') renderWorkshops();

  window.scrollTo(0,0);
  document.getElementById('app').scrollTop = 0;
}

// ── Home View ─────────────────────────────────────────────────────────────────
function renderHome() {
  const highPri = people.filter(p => (p.priority_score || 0) >= 20).length;
  const top5 = people.slice().sort((a,b) => (b.priority_score||0) - (a.priority_score||0)).slice(0,5);

  const top5Html = top5.map(p => {
    const isPri = (p.priority_score||0) >= 20;
    const desc = trunc(p.before_you_walk_up?.plain_english || p.research_focus || '', 90);
    return \`<div class="card" onclick="navigate('person','\${esc(p.id)}')">
      <div class="card-inner">
        \${personPhoto(p)}
        <div class="card-body">
          <div class="person-name">
            \${isPri ? '<span class="priority-star">✦</span>' : ''}
            \${esc(p.name)}
            \${commDot(p)}
          </div>
          <div class="person-affil">\${esc(p.affiliation || '')}</div>
          <div class="person-meta">
            \${rolePills(p.role)}
            <span class="person-score">P\${p.priority_score || 0}</span>
          </div>
          \${desc ? \`<div class="person-desc">\${esc(desc)}</div>\` : ''}
        </div>
      </div>
    </div>\`;
  }).join('');

  document.getElementById('view-home').innerHTML = \`
    <div class="home-header">
      <div class="home-title">ICLR 2026 · Rio · Apr 26–27</div>
      <div class="home-sub">International Conference on Learning Representations</div>
      <div class="home-tagline">Workshop Intelligence Hub</div>
    </div>
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-num">\${people.length}</div>
        <div class="stat-label">People</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">\${workshops.length}</div>
        <div class="stat-label">Workshops</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">\${highPri}</div>
        <div class="stat-label">Priority 20+</div>
      </div>
    </div>
    <div class="cta-row">
      <button class="btn btn-primary" onclick="navigate('people')">Browse People</button>
      <button class="btn btn-secondary" onclick="navigate('workshops')">View Workshops</button>
    </div>
    <div class="section-title">Top Priority People</div>
    \${top5Html}
  \`;
}

// ── People View ───────────────────────────────────────────────────────────────
function renderPeople() {
  const view = document.getElementById('view-people');

  let filtered = people.slice().sort((a,b) => (b.priority_score||0) - (a.priority_score||0));

  if (peopleFilter === 'priority20') filtered = filtered.filter(p => (p.priority_score||0) >= 20);
  else if (peopleFilter === 'organizer') filtered = filtered.filter(p => p.role && p.role.some(r => r.toLowerCase() === 'organizer'));
  else if (peopleFilter === 'speaker') filtered = filtered.filter(p => p.role && p.role.some(r => r.toLowerCase() === 'speaker' || r.toLowerCase() === 'panelist'));

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => {
      return (p.name || '').toLowerCase().includes(q)
        || (p.affiliation || '').toLowerCase().includes(q)
        || (Array.isArray(p.research_focus) ? p.research_focus.join(' ') : p.research_focus || '').toLowerCase().includes(q);
    });
  }

  const chips = [
    {id:'all', label:'All'},
    {id:'priority20', label:'Priority 20+'},
    {id:'organizer', label:'Organizer'},
    {id:'speaker', label:'Speaker'},
  ].map(c => \`<span class="pill-chip \${peopleFilter===c.id?'active':''}" onclick="setPeopleFilter('\${c.id}')">\${c.label}</span>\`).join('');

  const cards = filtered.length === 0
    ? '<div class="empty">No people found</div>'
    : filtered.map(p => {
        const isPri = (p.priority_score||0) >= 20;
        const desc = trunc(p.before_you_walk_up?.plain_english || p.research_focus || '', 90);
        const tags = workshopTags(p.workshop_ids, 2);
        return \`<div class="card" onclick="navigate('person','\${esc(p.id)}')">
          <div class="card-inner">
            \${personPhoto(p)}
            <div class="card-body">
              <div class="person-name">
                \${isPri ? '<span class="priority-star">✦</span>' : ''}
                \${esc(p.name)}
                \${commDot(p)}
              </div>
              <div class="person-affil">\${esc(trunc(p.affiliation || '', 48))}</div>
              <div class="person-meta">
                \${rolePills(p.role)}
                <span class="person-score">P\${p.priority_score || 0}</span>
              </div>
              \${desc ? \`<div class="person-desc">\${esc(desc)}</div>\` : ''}
              \${tags ? \`<div class="person-tags">\${tags}</div>\` : ''}
            </div>
          </div>
        </div>\`;
      }).join('');

  view.innerHTML = \`
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input class="search-input" type="search" placeholder="Search name, affiliation, research…"
        value="\${esc(searchQuery)}"
        oninput="setSearch(this.value)"
        id="people-search">
    </div>
    <div style="margin-bottom:8px">\${chips}</div>
    \${cards}
  \`;
}

function setPeopleFilter(f) {
  peopleFilter = f;
  renderPeople();
  document.getElementById('people-search')?.focus();
}

function setSearch(v) {
  searchQuery = v;
  renderPeople();
}

// ── Person Profile ────────────────────────────────────────────────────────────
function renderPerson(id) {
  const p = personById[id];
  const view = document.getElementById('view-person');
  if (!p) {
    view.innerHTML = '<div class="empty">Person not found</div>';
    return;
  }

  const bwu = p.before_you_walk_up || {};
  const social = p.social || {};

  // Social links
  const socialLinks = [];
  if (social.twitter) socialLinks.push(\`<a class="social-link" href="\${esc(social.twitter)}" target="_blank" rel="noopener">🐦 Twitter</a>\`);
  if (social.google_scholar) socialLinks.push(\`<a class="social-link" href="\${esc(social.google_scholar)}" target="_blank" rel="noopener">📚 Scholar</a>\`);
  if (social.linkedin) socialLinks.push(\`<a class="social-link" href="\${esc(social.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>\`);
  if (social.personal_site) socialLinks.push(\`<a class="social-link" href="\${esc(social.personal_site)}" target="_blank" rel="noopener">🌐 Site</a>\`);

  // Papers
  const papers = (p.top_papers || []).map(pa => \`
    <div class="paper-item">
      <div class="paper-title">\${esc(pa.title || '')}</div>
      <div class="paper-meta">\${pa.year || ''} · \${pa.citations != null ? pa.citations + ' citations' : ''}\${pa.citation_velocity ? ' · ' + pa.citation_velocity : ''}</div>
      \${pa.one_liner ? \`<div style="font-size:12px;color:var(--muted);margin-top:2px">\${esc(pa.one_liner)}</div>\` : ''}
    </div>
  \`).join('');

  // ArXiv
  const arxiv = (p.recent_arxiv || []).map(a => \`
    <div class="arxiv-item">
      <div class="arxiv-title">\${a.url ? \`<a href="\${esc(a.url)}" target="_blank" rel="noopener">\${esc(a.title||'')}</a>\` : esc(a.title||'')}</div>
      <div class="arxiv-meta">\${esc(a.date || '')}</div>
      \${a.summary ? \`<div class="arxiv-summary">\${esc(a.summary)}</div>\` : ''}
    </div>
  \`).join('');

  // Workshop tags
  const wsItems = (p.workshop_ids || []).map(wid => {
    const w = workshopById[wid];
    if (!w) return '';
    return \`<span class="pill pill-tag" style="cursor:pointer" onclick="navigate('workshop','\${esc(wid)}')">\${esc(w.name)}</span>\`;
  }).join(' ');

  // Confidence
  const conf = (p.confidence || '').toLowerCase();
  let confClass = 'confidence-badge';
  if (conf === 'high') confClass += ' conf-high';
  else if (conf === 'medium') confClass += ' conf-medium';
  else if (conf === 'low') confClass += ' conf-low';

  // Industry connections
  const industryConns = Array.isArray(p.industry_connections)
    ? p.industry_connections.join(', ')
    : (p.industry_connections || '');

  view.innerHTML = \`
    <button class="back-btn" onclick="history.back ? historyBack() : navigate('people')">← Back</button>

    <div class="profile-header">
      <div class="card-inner" style="align-items:center;margin-bottom:12px">
        \${personPhoto(p,'lg')}
        <div class="card-body">
          <div class="profile-name">\${esc(p.name)}</div>
          <div class="profile-title">\${esc(p.title || '')}\${p.affiliation ? ' · ' + esc(p.affiliation) : ''}</div>
        </div>
      </div>
      <div class="profile-pills">
        \${rolePills(p.role)}
        \${p.lab ? \`<span class="pill pill-tag">\${esc(p.lab)}</span>\` : ''}
      </div>
      \${socialLinks.length ? \`<div class="social-links">\${socialLinks.join('')}</div>\` : ''}
      \${wsItems ? \`<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">\${wsItems}</div>\` : ''}
    </div>

    \${bwu.plain_english ? \`
    <div class="info-block">
      <div class="info-label">Plain English</div>
      <div class="info-value">\${esc(bwu.plain_english)}</div>
    </div>\` : ''}

    \${(bwu.informed_question || bwu.thesis_connection || bwu.what_you_can_offer || bwu.avoid_topic) ? \`
    <div class="info-block">
      <div class="info-label">Before You Walk Up</div>
      <div class="bwu-grid">
        \${bwu.informed_question ? \`<div class="bwu-item"><div class="info-label" style="font-size:10px">Ask</div><div class="info-value" style="font-size:13px">\${esc(bwu.informed_question)}</div></div>\` : ''}
        \${bwu.thesis_connection ? \`<div class="bwu-item"><div class="info-label" style="font-size:10px">Your angle</div><div class="info-value" style="font-size:13px">\${esc(bwu.thesis_connection)}</div></div>\` : ''}
        \${bwu.what_you_can_offer ? \`<div class="bwu-item"><div class="info-label" style="font-size:10px">What you offer</div><div class="info-value" style="font-size:13px">\${esc(bwu.what_you_can_offer)}</div></div>\` : ''}
        \${bwu.avoid_topic ? \`<div class="bwu-item bwu-warn"><div class="info-label" style="font-size:10px;color:var(--danger)">⚠ Avoid</div><div class="info-value" style="font-size:13px">\${esc(bwu.avoid_topic)}</div></div>\` : ''}
      </div>
    </div>\` : ''}

    \${p.controversial_take ? \`
    <div class="info-block">
      <div class="info-label">Strong Opinion</div>
      <div class="info-value">\${esc(p.controversial_take)}</div>
    </div>\` : ''}

    \${p.open_problem ? \`
    <div class="info-block">
      <div class="info-label">Open Problem</div>
      <div class="info-value">\${esc(p.open_problem)}</div>
    </div>\` : ''}

    \${(p.commercialization_signal || industryConns) ? \`
    <div class="info-block">
      <div class="info-label">Industry Signal</div>
      \${p.commercialization_signal ? \`<div class="info-value">\${esc(p.commercialization_signal)}</div>\` : ''}
      \${industryConns ? \`<div style="font-size:12px;color:var(--muted);margin-top:6px">Connections: \${esc(industryConns)}</div>\` : ''}
    </div>\` : ''}

    \${papers ? \`
    <div class="info-block">
      <div class="info-label">Key Papers</div>
      \${papers}
    </div>\` : ''}

    \${arxiv ? \`
    <div class="info-block">
      <div class="info-label">Recent Work</div>
      \${arxiv}
    </div>\` : ''}

    \${(p.direction_of_travel || p.current_projects) ? \`
    <div class="info-block">
      <div class="info-label">Research Depth</div>
      \${p.direction_of_travel ? \`<div class="info-value">\${esc(p.direction_of_travel)}</div>\` : ''}
      \${p.current_projects ? \`<div style="font-size:12px;color:var(--muted);margin-top:6px">\${esc(Array.isArray(p.current_projects) ? p.current_projects.join(' · ') : p.current_projects)}</div>\` : ''}
    </div>\` : ''}

    <div style="padding:16px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span class="\${confClass}">Confidence: \${esc(p.confidence || 'unknown')}</span>
      \${p.sources ? \`<span style="font-size:12px;color:var(--muted)">\${Array.isArray(p.sources) ? p.sources.length : 1} sources</span>\` : ''}
    </div>
  \`;
}

// ── History back helper ───────────────────────────────────────────────────────
function historyBack() {
  // Attempt to go back to the previous list view
  navigate('people');
}

// ── Workshops View ────────────────────────────────────────────────────────────
function renderWorkshops() {
  const view = document.getElementById('view-workshops');

  let filtered = workshops.slice();

  if (workshopFilter === 'tier1') filtered = filtered.filter(w => w.tier === 1);
  else if (workshopFilter === 'tier2') filtered = filtered.filter(w => w.tier === 2);
  else if (workshopFilter === 'apr26') filtered = filtered.filter(w => (w.schedule_day || w.date || '').includes('2026-04-26'));
  else if (workshopFilter === 'apr27') filtered = filtered.filter(w => (w.schedule_day || w.date || '').includes('2026-04-27'));

  const chips = [
    {id:'all', label:'All'},
    {id:'tier1', label:'Tier 1'},
    {id:'tier2', label:'Tier 2'},
    {id:'apr26', label:'Apr 26'},
    {id:'apr27', label:'Apr 27'},
  ].map(c => \`<span class="pill-chip \${workshopFilter===c.id?'active':''}" onclick="setWorkshopFilter('\${c.id}')">\${c.label}</span>\`).join('');

  const cards = filtered.length === 0
    ? '<div class="empty">No workshops found</div>'
    : filtered.map(w => {
        const orgCount = (w.organizers || []).length;
        const spkCount = (w.speakers || []).length;
        const hasConflict = w.conflicts_with && w.conflicts_with.length > 0;
        const themes = (w.investment_themes || []).slice(0,3).map(t => \`<span class="pill pill-tag" style="font-size:10px">\${esc(t)}</span>\`).join('');
        const day = w.schedule_day || w.date || '';
        const dayLabel = day.includes('04-26') ? 'Apr 26' : day.includes('04-27') ? 'Apr 27' : day;

        return \`<div class="card" onclick="navigate('workshop','\${esc(w.id)}')">
          <div style="display:flex;align-items:flex-start;gap:8px">
            \${tierPill(w.tier)}
            <div style="flex:1">
              <div class="ws-name">\${esc(w.name)}</div>
              <div class="ws-meta">\${dayLabel}\${w.time_slot ? ' · ' + esc(w.time_slot) : ''} · \${orgCount} org\${orgCount!==1?'s':''}, \${spkCount} spk\${spkCount!==1?'s':''}</div>
            </div>
          </div>
          \${themes ? \`<div class="ws-themes">\${themes}</div>\` : ''}
          \${hasConflict ? \`<div class="ws-conflict">⚠ Conflicts with \${w.conflicts_with.length} other workshop\${w.conflicts_with.length!==1?'s':''}</div>\` : ''}
        </div>\`;
      }).join('');

  view.innerHTML = \`
    <div style="margin-bottom:8px">\${chips}</div>
    \${cards}
  \`;
}

function setWorkshopFilter(f) {
  workshopFilter = f;
  renderWorkshops();
}

// ── Workshop Detail ───────────────────────────────────────────────────────────
function renderWorkshopDetail(id) {
  const w = workshopById[id];
  const view = document.getElementById('view-workshop');
  if (!w) {
    view.innerHTML = '<div class="empty">Workshop not found</div>';
    return;
  }

  const day = w.schedule_day || w.date || '';
  const dayLabel = day.includes('04-26') ? 'Apr 26' : day.includes('04-27') ? 'Apr 27' : day;
  const themes = (w.investment_themes || []).map(t => \`<span class="pill pill-tag">\${esc(t)}</span>\`).join(' ');

  // Organizers
  const orgs = (w.organizers || []).map(o => {
    const person = people.find(p => p.name === o.name);
    return \`<div class="mini-card" \${person ? \`onclick="navigate('person','\${esc(person.id)}')"\` : ''}>
      <div class="card-inner" style="align-items:center;gap:8px">
        \${person ? personPhoto(person) : \`<img class="avatar" src="https://ui-avatars.com/api/?name=\${encodeURIComponent(o.name||'?')}&background=b8860b&color=fff&size=128&bold=true" loading="lazy">\`}
        <div><div class="mini-name">\${esc(o.name || '')}</div><div class="mini-affil">\${esc(o.affiliation || '')}</div></div>
      </div>
    </div>\`;
  }).join('');

  // Speakers
  const spks = (w.speakers || []).map(s => {
    const person = people.find(p => p.name === s.name);
    return \`<div class="mini-card" \${person ? \`onclick="navigate('person','\${esc(person.id)}')"\` : ''}>
      <div class="card-inner" style="align-items:center;gap:8px">
        \${person ? personPhoto(person) : \`<img class="avatar" src="https://ui-avatars.com/api/?name=\${encodeURIComponent(s.name||'?')}&background=e0dbd0&color=7a7060&size=128&bold=true" loading="lazy">\`}
        <div>
          <div class="mini-name">\${esc(s.name || '')}\${s.talk_title ? \`<span style="font-size:11px;font-weight:400;color:var(--muted)"> · \${esc(s.talk_title)}</span>\` : ''}</div>
          <div class="mini-affil">\${esc(s.affiliation || '')}</div>
        </div>
      </div>
    </div>\`;
  }).join('');

  // Agenda
  const agenda = (w.agenda || []).map(a => \`
    <div class="agenda-item">
      \${a.time ? \`<div class="agenda-time">\${esc(a.time)}</div>\` : ''}
      <div>\${esc(a.title || a.event || a.session || JSON.stringify(a))}</div>
    </div>
  \`).join('');

  // Conflicts
  const conflictWarnings = (w.conflicts_with || []).map(cid => {
    const cw = workshopById[cid];
    return cw ? \`<div class="ws-conflict" style="cursor:pointer" onclick="navigate('workshop','\${esc(cid)}')">⚠ Conflicts with: \${esc(cw.name)}</div>\` : '';
  }).join('');

  view.innerHTML = \`
    <button class="back-btn" onclick="navigate('workshops')">← Workshops</button>

    <div class="ws-detail-header">
      \${tierPill(w.tier)}
      <div class="ws-detail-name">\${esc(w.name)}</div>
      <div style="font-size:13px;color:var(--muted);margin-bottom:6px">
        \${dayLabel}\${w.time_slot ? ' · ' + esc(w.time_slot) : ''}
      </div>
      \${w.website ? \`<a class="social-link" href="\${esc(w.website)}" target="_blank" rel="noopener" style="display:inline-flex">🌐 Website</a>\` : ''}
      \${themes ? \`<div class="ws-themes" style="margin-top:8px">\${themes}</div>\` : ''}
      \${conflictWarnings}
    </div>

    \${w.summary ? \`
    <div class="info-block">
      <div class="info-label">Summary</div>
      <div class="info-value">\${esc(w.summary)}</div>
    </div>\` : ''}

    \${orgs ? \`
    <div class="section-title">Organizers (\${(w.organizers||[]).length})</div>
    \${orgs}\` : ''}

    \${spks ? \`
    <div class="section-title">Speakers (\${(w.speakers||[]).length})</div>
    \${spks}\` : ''}

    \${agenda ? \`
    <div class="section-title">Agenda</div>
    <div class="info-block">\${agenda}</div>\` : ''}
  \`;
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderHome();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Written index.html');

// Verify
const written = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const match = written.match(/const DATA = ({[\s\S]*?});\s*\n/);
if (!match) {
  console.error('ERROR: Could not find DATA constant!');
  process.exit(1);
}
try {
  const d = JSON.parse(match[1]);
  console.log('people:', d.people.length, 'workshops:', d.workshops.length);
  if (d.people.length < 48) { console.error('ERROR: Expected 48 people, got', d.people.length); process.exit(1); }
  if (d.workshops.length !== 15) { console.error('ERROR: Expected 15 workshops, got', d.workshops.length); process.exit(1); }
  console.log('Verification PASSED');
} catch(e) {
  console.error('ERROR: JSON parse failed:', e.message);
  process.exit(1);
}
