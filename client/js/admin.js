/* ===== admin.js ===== */
'use strict';

// Apply theme
const t = localStorage.getItem('lv_theme')||'light';
document.documentElement.setAttribute('data-theme', t);
const tb = document.getElementById('theme-toggle');
if (tb) { tb.textContent = t==='dark'?'☀️':'🌙'; tb.onclick = () => { const n=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme',n); localStorage.setItem('lv_theme',n); tb.textContent=n==='dark'?'☀️':'🌙'; }; }

const token = localStorage.getItem('lv_token');
const user  = JSON.parse(localStorage.getItem('lv_user')||'null');
if (!token || !user || !['admin','moderator'].includes(user.role)) {
  alert('Access denied. Admin or Moderator role required.');
  window.location.href = '/auth.html';
}

document.getElementById('nav-avatar').textContent = user.username[0].toUpperCase();
document.getElementById('nav-username').textContent = user.username + ' (' + user.role + ')';
document.getElementById('nav-logout').addEventListener('click', () => { localStorage.clear(); window.location.href='/'; });

const authHdr = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
const esc = s => s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function showToast(msg, ms=2800) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), ms);
}

async function loadStats() {
  try {
    const r = await fetch('/api/admin/stats', { headers: authHdr() });
    const d = await r.json();
    document.getElementById('stat-pending').textContent  = d.pending_count  || 0;
    document.getElementById('stat-approved').textContent = d.approved_count || 0;
    document.getElementById('stat-rejected').textContent = d.rejected_count || 0;
    document.getElementById('stat-users').textContent    = d.total_users    || 0;
    document.getElementById('stat-votes').textContent    = d.total_votes    || 0;
  } catch {}
}

let qPage = 1;
async function loadQueue(page = 1) {
  qPage = page;
  const container = document.getElementById('queue-container');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><span>Loading queue…</span></div>';

  try {
    const r = await fetch(`/api/admin/queue?page=${page}&limit=20`, { headers: authHdr() });
    const d = await r.json();

    const qc = document.getElementById('queue-count');
    if (qc) qc.textContent = d.total ? `${d.total} pending` : '';

    if (!d.results?.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><h3>Queue is empty</h3><p>No pending links to review.</p></div>';
      document.getElementById('queue-pagination').innerHTML = '';
      return;
    }

    const rows = d.results.map(link => `
      <tr>
        <td style="font-weight:600;max-width:180px">
          <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">${esc(link.title)}</a>
          <div style="font-size:.72rem;color:var(--muted);margin-top:2px">${esc(new URL(link.url).hostname.replace('www.',''))}</div>
        </td>
        <td style="max-width:260px;font-size:.8rem;color:var(--muted)">${esc((link.description||'').substring(0,100))}${(link.description||'').length>100?'…':''}</td>
        <td>${link.category_name ? `<span style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;padding:2px 8px;border-radius:99px;font-size:.72rem">${esc(link.category_name)}</span>` : '—'}</td>
        <td style="font-size:.8rem;color:var(--muted2)">${esc(link.submitted_by_username||'—')}</td>
        <td style="font-size:.78rem;color:var(--muted2);white-space:nowrap">${new Date(link.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</td>
        <td style="white-space:nowrap">
          <button class="btn-approve" onclick="reviewLink(${link.id},'approve')">✅ Approve</button>
          <button class="btn-reject"  onclick="reviewLink(${link.id},'reject')">❌ Reject</button>
          <button class="btn-delete"  onclick="deleteLink(${link.id})">🗑</button>
        </td>
      </tr>`).join('');

    container.innerHTML = `
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead><tr><th>Link</th><th>Description</th><th>Category</th><th>Submitted By</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    renderPagination(d.total, page, 20);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Failed to load</h3><p>${esc(err.message)}</p></div>`;
  }
}

function renderPagination(total, current, limit) {
  const pages = Math.ceil(total / limit);
  const el    = document.getElementById('queue-pagination');
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = `<button ${current<=1?'disabled':''} onclick="loadQueue(${current-1})">‹</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="${i===current?'active':''}" onclick="loadQueue(${i})">${i}</button>`;
  html += `<button ${current>=pages?'disabled':''} onclick="loadQueue(${current+1})">›</button>`;
  el.innerHTML = html;
}

async function reviewLink(id, action) {
  try {
    const r = await fetch(`/api/admin/links/${id}/${action}`, { method:'PATCH', headers: authHdr() });
    const d = await r.json();
    if (!r.ok) { showToast(d.error||'Action failed'); return; }
    showToast(`Link ${action}d ✅`);
    loadStats(); loadQueue(qPage);
  } catch { showToast('Network error'); }
}

async function deleteLink(id) {
  if (!confirm('Permanently delete this link?')) return;
  try {
    const r = await fetch(`/api/admin/links/${id}`, { method:'DELETE', headers: authHdr() });
    const d = await r.json();
    if (!r.ok) { showToast(d.error||'Delete failed'); return; }
    showToast('Link deleted 🗑');
    loadStats(); loadQueue(qPage);
  } catch { showToast('Network error'); }
}

loadStats();
loadQueue(1);
