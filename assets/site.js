// Shared behaviour for the home page and every project page.
// Loaded after /assets/projects.js, which defines `projects` and `palette`.

// ============ ANALYTICS ============
const isBot = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebookexternalhit|twitterbot|linkedinbot|semrush|ahref/i.test(navigator.userAgent);
function track(eventName, props) {
  if (isBot) return;
  if (typeof window.va === 'function') window.va('event', Object.assign({ name: eventName }, props || {}));
}
function trackPageView(pageName) {
  if (isBot) return;
  if (typeof window.va === 'function') window.va('pageview', { path: '/' + pageName });
}

// ============ COLLAPSIBLE SECTIONS ============
function toggleSection(id, btn) {
  const el = document.getElementById(id);
  const showing = el.style.display !== 'block';
  el.style.display = showing ? 'block' : 'none';
  if (btn) {
    btn.classList.toggle('is-open', showing);
    btn.setAttribute('aria-expanded', showing);
    if (btn.dataset.staticLabel) return;   // label stays put, the x carries the open/closed state
    if (!btn.dataset.showLabel) btn.dataset.showLabel = btn.textContent;
    if (!btn.dataset.hideLabel) btn.dataset.hideLabel = 'Hide ' + btn.textContent.replace(/^Show\s+/i, '');
    btn.textContent = showing ? btn.dataset.hideLabel : btn.dataset.showLabel;
  }
}

// ============ LIGHTBOX ============
// Built on demand so a page only needs to mark images `zoomable`.
function lightboxEl() {
  let box = document.getElementById('lightbox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'lightbox';
    box.innerHTML = '<img id="lightbox-img" src="" alt="">';
    box.addEventListener('click', closeLightbox);
    document.body.appendChild(box);
  }
  return box;
}

function openLightbox(src, alt) {
  const box = lightboxEl();
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || '';
  box.classList.add('open');
  track('image_zoomed', { image: alt || src });
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  if (box) box.classList.remove('open');
}

// ============ SUBPAGE ============
// A project can carry a `subpage` of extra markup (Companion Robot's subassemblies).
function openSubpage() {
  const sp = document.getElementById('subpage-detail');
  if (!sp) return;
  sp.style.display = 'block';
  sp.style.animation = 'detailIn .5s ease forwards';
  sp.scrollTop = 0;
  track('subassemblies_opened');
  trackPageView('project/robot/subassemblies');
}

function closeSubpage() {
  const sp = document.getElementById('subpage-detail');
  if (sp) sp.style.display = 'none';
  track('subassemblies_closed');
}

// ============ BACK TO THE RECORD SHELF ============
// The back button inside each project's markup calls this. Going back through
// history keeps the home page's scroll position; a direct visit just goes home.
function closeDetail() {
  track('back_to_home');
  const cameFromSite = document.referrer && document.referrer.indexOf(location.origin) === 0;
  if (cameFromSite && history.length > 1) history.back();
  else location.href = '/';
}

// ============ LOCKED PROJECTS ============
const GATE_PASSWORD = '9724';
function isUnlocked(key) {
  return localStorage.getItem('unlocked_' + key) === '1';
}

function tryUnlock(slug) {
  const proj = projects.find(p => p.slug === slug);
  const input = document.getElementById('gate-pw');
  if (input.value === GATE_PASSWORD) {
    localStorage.setItem('unlocked_' + proj.trackKey, '1');
    track('project_unlocked', { project: proj.displayName });
    renderProjectPage(slug);
  } else {
    document.getElementById('gate-err').classList.add('show');
    input.value = '';
    track('project_unlock_failed', { project: proj.displayName });
  }
}

// ============ PROJECT PAGE ============
// Each /<slug>/ page calls this; the content comes from /assets/projects.js.
function renderProjectPage(slug) {
  const proj = projects.find(p => p.slug === slug);
  const container = document.getElementById('detail-inner');
  if (!proj) { location.href = '/'; return; }

  if (proj.locked && !isUnlocked(proj.trackKey)) {
    const tagsHtml = proj.tags.map(t => `<span class="detail-tag">${t}</span>`).join('');
    container.innerHTML = `
      <button class="detail-back" onclick="closeDetail()">← Back to Records</button>
      <h2 class="detail-title">${proj.displayName}</h2>
      <div class="detail-tags" style="margin-bottom:30px">${tagsHtml}</div>
      <div class="lock-gate">
        <div class="lock-gate-wip">WIP</div>
        <div class="lock-gate-form">
          <input type="password" id="gate-pw" class="lock-gate-input" placeholder="password" onkeydown="if(event.key==='Enter') tryUnlock('${proj.slug}')">
          <button class="lock-gate-btn" onclick="tryUnlock('${proj.slug}')">Unlock</button>
        </div>
        <div class="lock-gate-error" id="gate-err">incorrect password</div>
      </div>
    `;
  } else {
    container.innerHTML = proj.html;
    if (proj.subpage && !document.getElementById('subpage-detail')) {
      document.body.insertAdjacentHTML('beforeend', proj.subpage);
    }
  }

  // Tags and feature code names take the project's colour, as they do on its record label
  container.querySelectorAll('.detail-tags').forEach(el => { el.style.color = proj.color; });
  container.querySelectorAll('.feature-list code').forEach(el => { el.style.color = proj.color; });

  track('project_opened', { project: proj.displayName });
  trackPageView('project/' + proj.trackKey);
}

// ============ ESCAPE ============
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const lb = document.getElementById('lightbox');
  const pcb = document.getElementById('pcb-gallery');
  const sp = document.getElementById('subpage-detail');
  if (lb && lb.classList.contains('open')) closeLightbox();
  else if (pcb && pcb.classList.contains('open')) closePcbGallery();
  else if (sp && sp.style.display === 'block') closeSubpage();
  else if (document.getElementById('detail-inner')) closeDetail();
});
