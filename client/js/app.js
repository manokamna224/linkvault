'use strict';
/* ===== LinkVault app.js — complete with mobile support ===== */

const API = '/api';
let currentPage = 1, currentSort = 'top';
let currentCat = '', currentTag = '', currentSearch = '';
let isGridView = false;
let allCategories = [];

// ── Helpers ───────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('lv_token');
const getUser  = () => JSON.parse(localStorage.getItem('lv_user') || 'null');
const authHdr  = () => getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
const esc = s => s == null ? '' : String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const CAT_ICONS = {
  'figma-templates':'🎨','ai-prompts':'🤖','free-dev-tools':'🛠️',
  'ui-ux-resources':'✏️','learning':'📚','free-apis':'🔌',
  'productivity':'⚡','open-source':'🌟','css-animations':'💅',
  'javascript':'🟨','backend':'🗄️','devops':'☁️',
  'interview-prep':'🎯','design-inspiration':'💡',
};

// ── Theme ─────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('lv_theme', theme);
  const icon = theme === 'dark' ? '☀️' : '🌙';
  const label = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  ['theme-toggle','theme-toggle-drawer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = id === 'theme-toggle' ? icon : label; }
  });
}
applyTheme(localStorage.getItem('lv_theme') || 'light');
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
document.getElementById('theme-toggle-drawer')?.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Nav / Auth ────────────────────────────────────────────────────────────
(function initNav() {
  const u = getUser();
  if (u) {
    const navUser  = document.getElementById('nav-user');
    const navAuth  = document.getElementById('nav-auth-link');
    const navAdmin = document.getElementById('nav-admin');
    const drawerAdmin = document.getElementById('drawer-admin');
    const drawerAuth  = document.getElementById('drawer-auth');
    const drawerLogout = document.getElementById('drawer-logout');
    const mobProfile = document.getElementById('mob-profile');
    if (navUser) navUser.style.display = 'flex';
    if (navAuth) { navAuth.textContent = 'Logout'; navAuth.addEventListener('click', e => { e.preventDefault(); localStorage.clear(); location.reload(); }); }
    if (navAdmin && ['admin','moderator'].includes(u.role)) navAdmin.style.display = 'inline-flex';
    if (drawerAdmin && ['admin','moderator'].includes(u.role)) drawerAdmin.style.display = 'flex';
    if (drawerAuth) drawerAuth.style.display = 'none';
    if (drawerLogout) { drawerLogout.style.display = 'flex'; drawerLogout.addEventListener('click', () => { localStorage.clear(); location.reload(); }); }
    if (mobProfile) { mobProfile.href = '#'; mobProfile.addEventListener('click', e => { e.preventDefault(); localStorage.clear(); location.reload(); }); }
    const avatar = document.getElementById('nav-avatar');
    const uname  = document.getElementById('nav-username');
    if (avatar) avatar.textContent = u.username[0].toUpperCase();
    if (uname)  uname.textContent  = u.username;
  }
})();

// ── Mobile Drawer ─────────────────────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose   = document.getElementById('drawer-close');

function openDrawer()  { mobileDrawer?.classList.add('open'); drawerOverlay?.classList.add('show'); hamburger?.classList.add('open'); mobileDrawer?.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { mobileDrawer?.classList.remove('open'); drawerOverlay?.classList.remove('show'); hamburger?.classList.remove('open'); mobileDrawer?.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
hamburger?.addEventListener('click', () => mobileDrawer?.classList.contains('open') ? closeDrawer() : openDrawer());
drawerOverlay?.addEventListener('click', closeDrawer);
drawerClose?.addEventListener('click', closeDrawer);

// ── Mobile Search Overlay ─────────────────────────────────────────────────
const mobSearchOverlay = document.getElementById('mob-search-overlay');
const mobSearchClose   = document.getElementById('mob-search-close');
const mobSearchBtn     = document.getElementById('mob-search-btn');
const qOverlay         = document.getElementById('q-overlay');

mobSearchBtn?.addEventListener('click', () => {
  mobSearchOverlay?.classList.add('show');
  setTimeout(() => qOverlay?.focus(), 100);
});
mobSearchClose?.addEventListener('click', () => mobSearchOverlay?.classList.remove('show'));
mobSearchOverlay?.addEventListener('click', e => { if (e.target === mobSearchOverlay) mobSearchOverlay.classList.remove('show'); });
qOverlay?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    currentSearch = qOverlay.value.trim();
    mobSearchOverlay?.classList.remove('show');
    if (document.getElementById('q')) document.getElementById('q').value = currentSearch;
    if (document.getElementById('q-mobile')) document.getElementById('q-mobile').value = currentSearch;
    currentCat = ''; currentTag = ''; currentPage = 1;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-btn[data-slug=""]')?.classList.add('active');
    clearTagHighlight(); updateFilterBadge(); loadLinks(1);
  }
  if (e.key === 'Escape') mobSearchOverlay?.classList.remove('show');
});

// ── Filter Bottom Sheet ───────────────────────────────────────────────────
const filterSheet   = document.getElementById('filter-sheet');
const sheetOverlay  = document.getElementById('sheet-overlay');
const mobFilterBtn  = document.getElementById('mob-filter-btn');
const sheetClose    = document.getElementById('sheet-close');
const sheetApply    = document.getElementById('sheet-apply');
let pendingSort = currentSort, pendingCat = currentCat;

function openSheet()  { filterSheet?.classList.add('open'); sheetOverlay?.classList.add('show'); filterSheet?.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
function closeSheet() { filterSheet?.classList.remove('open'); sheetOverlay?.classList.remove('show'); filterSheet?.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
mobFilterBtn?.addEventListener('click', openSheet);
sheetClose?.addEventListener('click', closeSheet);
sheetOverlay?.addEventListener('click', closeSheet);
sheetApply?.addEventListener('click', () => {
  currentSort = pendingSort; currentCat = pendingCat; currentTag = ''; currentPage = 1;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === currentSort));
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.slug === currentCat));
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b.dataset.slug === currentCat));
  updateFilterBadge(); closeSheet(); loadLinks(1);
});
document.querySelectorAll('.sheet-sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sheet-sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); pendingSort = btn.dataset.sort;
  });
});

function populateSheet(cats) {
  const sheetCats = document.getElementById('sheet-cats');
  if (!sheetCats) return;
  sheetCats.innerHTML = `<button class="sheet-cat active" data-slug="">🌐 All Links</button>`;
  cats.forEach(c => {
    const icon = CAT_ICONS[c.slug] || '📂';
    const btn = document.createElement('button');
    btn.className = 'sheet-cat'; btn.dataset.slug = c.slug;
    btn.textContent = `${icon} ${c.name}`;
    sheetCats.appendChild(btn);
  });
  sheetCats.querySelectorAll('.sheet-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      sheetCats.querySelectorAll('.sheet-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); pendingCat = btn.dataset.slug;
    });
  });
}

// ── View toggle ───────────────────────────────────────────────────────────
document.getElementById('view-list')?.addEventListener('click', () => {
  isGridView = false;
  document.getElementById('links-container').classList.remove('grid-view');
  document.getElementById('view-list').classList.add('active');
  document.getElementById('view-grid').classList.remove('active');
});
document.getElementById('view-grid')?.addEventListener('click', () => {
  isGridView = true;
  document.getElementById('links-container').classList.add('grid-view');
  document.getElementById('view-grid').classList.add('active');
  document.getElementById('view-list').classList.remove('active');
});

// ── Back to top ───────────────────────────────────────────────────────────
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => { backTop?.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Load categories ───────────────────────────────────────────────────────
async function loadCategories() {
  try {
    const raw  = await fetch(`${API}/categories`).then(r => r.json());
    allCategories = Array.isArray(raw) ? raw : (raw.value || []);

    // Update stats
    const total = allCategories.reduce((s, c) => s + (c.link_count || 0), 0);
    const el = document.getElementById('total-count'); if (el) el.textContent = total;
    const hl = document.getElementById('hstat-links'); if (hl) hl.textContent = total;
    const hc = document.getElementById('hstat-cats');  if (hc) hc.textContent = allCategories.length;

    // Desktop sidebar
    const list = document.getElementById('category-list');
    allCategories.forEach(cat => {
      const icon = CAT_ICONS[cat.slug] || '📂';
      const li = document.createElement('li');
      li.innerHTML = `<button class="cat-btn" data-slug="${esc(cat.slug)}" title="${esc(cat.name)}"><span class="cat-icon">${icon}</span><span class="cat-name">${esc(cat.name)}</span><span class="cat-count">${cat.link_count}</span></button>`;
      list?.appendChild(li);
    });
    list?.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        list.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.slug; currentTag = ''; currentSearch = ''; currentPage = 1;
        document.getElementById('q').value = '';
        syncMobileChip(currentCat); clearTagHighlight(); updateFilterBadge(); loadLinks(1);
      });
    });

    // Mobile filter chips
    const scroll = document.querySelector('.mobile-filter-scroll');
    allCategories.forEach(cat => {
      const icon = CAT_ICONS[cat.slug] || '📂';
      const btn = document.createElement('button');
      btn.className = 'filter-chip'; btn.dataset.slug = cat.slug; btn.dataset.type = 'cat';
      btn.textContent = `${icon} ${cat.name}`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = cat.slug; currentTag = ''; currentSearch = ''; currentPage = 1;
        document.getElementById('q').value = '';
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.slug === cat.slug));
        clearTagHighlight(); updateFilterBadge(); loadLinks(1);
      });
      scroll?.appendChild(btn);
    });

    // Populate filter sheet
    populateSheet(allCategories);
  } catch (e) { console.warn('Categories failed', e); }
}

function syncMobileChip(slug) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b.dataset.slug === slug));
}

// ── Load tags ─────────────────────────────────────────────────────────────
async function loadTags() {
  try {
    const data = await fetch(`${API}/links?limit=50`).then(r => r.json());
    const tagCount = {};
    (data.results || []).forEach(l => {
      (Array.isArray(l.tags) ? l.tags : []).filter(Boolean).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
    });
    const top = Object.entries(tagCount).sort((a,b) => b[1]-a[1]).slice(0, 24);
    const cloud = document.getElementById('tag-cloud');
    if (cloud) {
      cloud.innerHTML = top.map(([tag]) => `<button class="tag-pill" data-tag="${esc(tag)}">${esc(tag)}</button>`).join('');
      cloud.querySelectorAll('.tag-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.dataset.tag;
          if (currentTag === tag) { currentTag = ''; btn.classList.remove('active'); }
          else { clearTagHighlight(); btn.classList.add('active'); currentTag = tag; currentCat = ''; currentSearch = ''; document.getElementById('q').value = ''; document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active')); document.querySelector('.cat-btn[data-slug=""]')?.classList.add('active'); syncMobileChip(''); }
          currentPage = 1; updateFilterBadge(); loadLinks(1);
        });
      });
    }
    const ht = document.getElementById('hstat-tags');
    if (ht) ht.textContent = Object.keys(tagCount).length + '+';
  } catch (e) {}
}
function clearTagHighlight() { document.querySelectorAll('#tag-cloud .tag-pill').forEach(b => b.classList.remove('active')); }

// ── Render card ───────────────────────────────────────────────────────────
function renderCard(link, index) {
  const tags   = (Array.isArray(link.tags) ? link.tags : []).filter(Boolean);
  const domain = (() => { try { return new URL(link.url).hostname.replace('www.',''); } catch { return ''; } })();
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  const catSlug = link.category_slug || '';
  const catIcon = CAT_ICONS[catSlug] || '📂';
  const rank    = (currentPage - 1) * 20 + index + 1;
  const score   = link.vote_score ?? 0;
  const isNew   = (Date.now() - new Date(link.created_at)) < 3 * 24 * 60 * 60 * 1000;
  return `
  <div class="link-card" data-link-id="${link.id}">
    <div class="rank-col"><span class="rank-num">${rank}</span></div>
    <div class="vote-col">
      <button class="vote-btn" data-id="${link.id}" data-type="up" aria-label="Upvote">▲</button>
      <span class="vote-score">${score}</span>
      <button class="vote-btn" data-id="${link.id}" data-type="down" aria-label="Downvote">▼</button>
    </div>
    <div class="link-body">
      <div class="link-title">
        <img src="${favicon}" width="14" height="14" alt="" style="border-radius:3px;flex-shrink:0" onerror="this.style.display='none'">
        <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.title)}</a>
        ${isNew ? '<span class="new-badge">New</span>' : ''}
        <span class="link-domain">${esc(domain)}</span>
      </div>
      ${link.description ? `<p class="link-desc">${esc(link.description)}</p>` : ''}
      <div class="link-meta">
        ${link.category_name ? `<button class="meta-cat" data-slug="${esc(catSlug)}">${catIcon} ${esc(link.category_name)}</button>` : ''}
        <span class="meta-date">🕒 ${new Date(link.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
        ${tags.length ? `<div class="tag-row">${tags.slice(0,4).map(t=>`<button class="tag-pill inline-tag" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ── Load links ────────────────────────────────────────────────────────────
async function loadLinks(page = 1) {
  currentPage = page;
  const container = document.getElementById('links-container');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><span>Loading curated links…</span></div>';
  if (isGridView) container.classList.add('grid-view');

  const params = new URLSearchParams({ page, limit: 20, sort: currentSort });
  if (currentSearch) params.set('q', currentSearch);
  if (currentCat)    params.set('category', currentCat);
  if (currentTag)    params.set('tag', currentTag);
  const useSearch = !!(currentSearch || currentCat || currentTag);
  const endpoint  = useSearch ? `${API}/links/search` : `${API}/links`;

  try {
    const res  = await fetch(`${endpoint}?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const total = data.total ?? data.results?.length ?? 0;
    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = `${total.toLocaleString()} link${total !== 1 ? 's' : ''}`;

    if (!data.results?.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>No links found</h3><p>Try a different search or filter.</p><button class="btn-clear" onclick="clearAllFilters()">Clear filters</button></div>`;
      document.getElementById('pagination').innerHTML = '';
      return;
    }
    container.innerHTML = data.results.map((l, i) => renderCard(l, i)).join('');
    if (isGridView) container.classList.add('grid-view');
    attachVoteListeners();
    attachInlineListeners();
    renderPagination(total, page, 20);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Failed to load</h3><p>${esc(err.message)}</p><button class="btn-clear" onclick="loadLinks(1)">Retry</button></div>`;
  }
}

// ── Inline listeners ──────────────────────────────────────────────────────
function attachInlineListeners() {
  document.querySelectorAll('#links-container .inline-tag').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      currentTag = btn.dataset.tag; currentCat = ''; currentSearch = ''; currentPage = 1;
      document.getElementById('q').value = '';
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.cat-btn[data-slug=""]')?.classList.add('active');
      syncMobileChip(''); clearTagHighlight();
      document.querySelectorAll(`#tag-cloud .tag-pill[data-tag="${CSS.escape(currentTag)}"]`).forEach(b => b.classList.add('active'));
      updateFilterBadge(); loadLinks(1);
    });
  });
  document.querySelectorAll('#links-container .meta-cat').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const slug = btn.dataset.slug; if (!slug) return;
      currentCat = slug; currentTag = ''; currentSearch = ''; currentPage = 1;
      document.getElementById('q').value = '';
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.slug === slug));
      syncMobileChip(slug); clearTagHighlight(); updateFilterBadge(); loadLinks(1);
    });
  });
}

// ── Filter badge ──────────────────────────────────────────────────────────
function updateFilterBadge() {
  const el = document.getElementById('active-filter'); if (!el) return;
  if (currentTag) { el.innerHTML = `<span class="filter-badge">🏷️ <strong>${esc(currentTag)}</strong> <button onclick="clearAllFilters()">✕</button></span>`; return; }
  if (currentCat) {
    const btn = document.querySelector(`.cat-btn[data-slug="${CSS.escape(currentCat)}"]`);
    const name = btn?.querySelector('.cat-name')?.textContent || currentCat;
    el.innerHTML = `<span class="filter-badge">📂 <strong>${esc(name)}</strong> <button onclick="clearAllFilters()">✕</button></span>`; return;
  }
  if (currentSearch) { el.innerHTML = `<span class="filter-badge">🔍 <strong>"${esc(currentSearch)}"</strong> <button onclick="clearAllFilters()">✕</button></span>`; return; }
  el.innerHTML = '';
}
window.clearAllFilters = function () {
  currentTag = ''; currentCat = ''; currentSearch = ''; currentPage = 1;
  document.getElementById('q').value = '';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-btn[data-slug=""]')?.classList.add('active');
  syncMobileChip(''); clearTagHighlight(); updateFilterBadge(); loadLinks(1);
};
window.filterCat = function(slug) { currentCat = slug; currentTag = ''; currentSearch = ''; currentPage = 1; updateFilterBadge(); loadLinks(1); };

// ── Pagination ────────────────────────────────────────────────────────────
function renderPagination(total, current, limit) {
  const pages = Math.ceil(total / limit);
  const el = document.getElementById('pagination');
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  const b = (label, pg, dis = false, active = false) =>
    `<button ${dis ? 'disabled' : `onclick="loadLinks(${pg})"`} class="${active?'active':''}">${label}</button>`;
  let html = b('‹', current-1, current<=1);
  const s = Math.max(1, current-2), e = Math.min(pages, current+2);
  if (s > 1) { html += b('1',1); if (s>2) html += `<span class="pg-ellipsis">…</span>`; }
  for (let i = s; i <= e; i++) html += b(i, i, false, i===current);
  if (e < pages) { if (e<pages-1) html += `<span class="pg-ellipsis">…</span>`; html += b(pages,pages); }
  html += b('›', current+1, current>=pages);
  el.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Vote ──────────────────────────────────────────────────────────────────
function attachVoteListeners() {
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', () => handleVote(btn.dataset.id, btn.dataset.type));
  });
}
async function handleVote(linkId, type) {
  if (!getToken()) { showToast('Please login to vote'); setTimeout(() => window.location.href='/auth.html', 1200); return; }
  try {
    const res = await fetch(`${API}/links/${linkId}/vote`, { method:'POST', headers:{'Content-Type':'application/json',...authHdr()}, body: JSON.stringify({ type }) });
    const data = await res.json();
    if (!res.ok) showToast(data.error || 'Vote failed');
  } catch { showToast('Vote failed'); }
}

// ── Sort ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); currentSort = btn.dataset.sort; currentPage = 1; loadLinks(1);
  });
});

// ── Search ────────────────────────────────────────────────────────────────
function doSearch(val) {
  currentSearch = (val || '').trim(); currentCat = ''; currentTag = ''; currentPage = 1;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-btn[data-slug=""]')?.classList.add('active');
  syncMobileChip(''); clearTagHighlight(); updateFilterBadge(); loadLinks(1);
}
document.getElementById('q')?.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(document.getElementById('q').value); });
document.getElementById('q-mobile')?.addEventListener('keydown', e => { if (e.key==='Enter') { doSearch(document.getElementById('q-mobile').value); if (document.getElementById('q')) document.getElementById('q').value = document.getElementById('q-mobile').value; } });

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg, ms = 2800) {
  const el = document.getElementById('toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), ms);
}

// ── Init ──────────────────────────────────────────────────────────────────
loadCategories();
loadTags();
loadLinks(1);
