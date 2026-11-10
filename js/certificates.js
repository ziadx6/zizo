/**
 * Certificates & Projects Management with Skeleton Loading & Error Handling
 */

/**
 * Fallback dataset in case JSON files cannot be fetched
 */
const FallbackCerts = [
  { "id": "cs50", "category": "programming", "image": "cs50" },
  { "id": "fundamentals", "category": "programming", "image": "fundamentals" },
  { "id": "genai", "category": "ai", "image": "genai" },
  { "id": "excelIntro", "category": "microsoft", "image": "excel-intro" },
  { "id": "excelAdvanced", "category": "microsoft", "image": "excel-advanced" }
];

const FallbackProjects = [
  {
    "id": "siemens",
    "image": "siemens",
    "features": ["excel", "word", "powerpoint", "businessAnalysis", "businessSimulation"],
    "tech": ["Excel", "Word", "PowerPoint"],
    "files": [
      { "name": "Siemens Business Project - Excel", "path": "assets/projects/siemens.xls", "icon": "fa-file-excel" },
      { "name": "Siemens Business Project - Word", "path": "assets/projects/siemens.doc", "icon": "fa-file-word" },
      { "name": "Siemens Business Project - PowerPoint", "path": "assets/projects/siemens.ppt", "icon": "fa-file-powerpoint" }
    ]
  },
  {
    "id": "bakery",
    "image": "bakery",
    "features": ["customerManagement", "salesManagement", "ordersManagement", "reports"],
    "tech": ["C++", "Python", "SQL"],
    "url": "https://ziad9.pythonanywhere.com/login"
  },
  {
    "id": "portfolio",
    "image": "portfolio",
    "features": [],
    "tech": ["HTML", "CSS", "JavaScript"],
    "url": "https://ziadx6.github.io/zizo/"
  },
  {
    "id": "cs50",
    "image": "cs50x",
    "features": [],
    "tech": ["C", "Python", "JavaScript"],
    "url": "https://github.com/ziadx6/Harvard-CS50-Tasks.git"
  }
];

let CertsData = FallbackCerts;
let ProjectsData = FallbackProjects;
let activeFilter = 'all';
let searchTerm = '';
let isLoadingData = false;

/**
 * Render Skeleton Loading Placeholder Cards
 */
function renderSkeletons() {
  const certContainers = document.querySelectorAll('.cert-grid, #certGrid, #latestCerts');
  certContainers.forEach(container => {
    if (container.children.length > 0) return;
    const count = container.id === 'latestCerts' ? 3 : 5;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-card">
          <div class="skeleton-img skeleton-shimmer"></div>
          <div class="skeleton-body">
            <div class="skeleton-title skeleton-shimmer"></div>
            <div class="skeleton-text skeleton-shimmer short"></div>
            <div class="skeleton-btn skeleton-shimmer"></div>
          </div>
        </div>`;
    }
    container.innerHTML = html;
  });

  const projContainers = document.querySelectorAll('.projects-grid, #latestProjects, #projectsGrid');
  projContainers.forEach(container => {
    if (container.children.length > 0) return;
    const count = container.id === 'latestProjects' ? 2 : 4;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-card">
          <div class="skeleton-img skeleton-shimmer"></div>
          <div class="skeleton-body">
            <div class="skeleton-title skeleton-shimmer"></div>
            <div class="skeleton-text skeleton-shimmer"></div>
            <div class="skeleton-tags">
              <div class="skeleton-tag skeleton-shimmer"></div>
              <div class="skeleton-tag skeleton-shimmer"></div>
              <div class="skeleton-tag skeleton-shimmer"></div>
            </div>
          </div>
        </div>`;
    }
    container.innerHTML = html;
  });
}

/**
 * Load JSON data asynchronously with error handling and fallback
 */
async function loadData() {
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return { CertsData, ProjectsData };
  }
  isLoadingData = true;

  try {
    const [certsRes, projRes] = await Promise.all([
      fetch('data/certificates.json').catch(() => null),
      fetch('data/projects.json').catch(() => null)
    ]);

    if (certsRes && certsRes.ok) {
      const json = await certsRes.json();
      if (Array.isArray(json) && json.length) CertsData = json;
    }

    if (projRes && projRes.ok) {
      const json = await projRes.json();
      if (Array.isArray(json) && json.length) ProjectsData = json;
    }
  } catch (error) {
    // Fallback is active
  } finally {
    isLoadingData = false;
  }

  return { CertsData, ProjectsData };
}

/**
 * Translation helper with fallback to key
 */
function getTranslated(key) {
  try {
    const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
    const tData = (typeof Translations !== 'undefined' && Translations) ? Translations : (typeof TranslationsData !== 'undefined' ? TranslationsData : null);
    if (tData && tData[lang]) {
      const parts = key.split('.');
      let cur = tData[lang];
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else { cur = undefined; break; }
      }
      if (cur != null) return cur;
    }
  } catch (e) {
    console.error('Error resolving translation for:', key, e);
  }
  return key;
}

/**
 * [SECURITY]: Safe Certificate Card Renderer
 * Encodes all text and attribute nodes, binds download events securely without inline onclick.
 */
function renderCertificates(containerSelector = null, limit = null) {
  const containers = containerSelector
    ? document.querySelectorAll(containerSelector)
    : document.querySelectorAll('#certGrid, .cert-grid:not(#latestCerts)');

  if (!containers.length) return;

  const esc = (typeof SecurityUtils !== 'undefined') ? SecurityUtils.escapeHTML : (s) => String(s || '');
  const escAttr = (typeof SecurityUtils !== 'undefined') ? SecurityUtils.escapeAttr : (s) => String(s || '');
  const sanitizeUrl = (typeof SecurityUtils !== 'undefined') ? SecurityUtils.sanitizeUrl : (u) => u;

  let data = CertsData || FallbackCerts;

  const filtered = data.filter(c => {
    const matchCat = activeFilter === 'all' || c.category === activeFilter;
    const title = getTranslated(`certificates.items.${c.id}.title`) || '';
    const matchSearch = !searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const finalData = limit ? filtered.slice(0, limit) : filtered;

  containers.forEach(grid => {
    if (!finalData.length) {
      grid.innerHTML = `<div class="cert-empty">${esc(getTranslated('certificates.noResults'))}</div>`;
      return;
    }

    grid.innerHTML = finalData.map(c => {
      const rawTitle = getTranslated(`certificates.items.${c.id}.title`);
      const rawIssuer = getTranslated(`certificates.items.${c.id}.issuer`);
      const rawCat = getTranslated(`certificates.${c.category}`);
      const rawDl = getTranslated('certificates.download');

      const title = esc(rawTitle);
      const issuer = esc(rawIssuer);
      const catLabel = esc(rawCat);
      const dl = esc(rawDl);
      const certId = escAttr(c.id);
      const imgPath = sanitizeUrl(`assets/certificates/${c.image}.jpg`);

      return `
        <article class="cert-card glass-card reveal visible">
          <div class="cert-img">
            <img src="${imgPath}" alt="${title}" width="400" height="300" loading="lazy" decoding="async" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <i class="fa-solid fa-certificate" style="display:none;"></i>
            <span class="cat-badge">${catLabel}</span>
          </div>
          <div class="cert-body">
            <h3>${title}</h3>
            <span class="cert-issuer">${issuer}</span>
            <button class="cert-download" data-cert-id="${certId}" aria-label="${dl} ${title}">
              <i class="fa-solid fa-download"></i> <span>${dl}</span>
            </button>
          </div>
        </article>`;
    }).join('');

    // [SECURITY]: Attach safe click handler via event delegation (no inline onclick)
    if (!grid.dataset.certClickBound) {
      grid.dataset.certClickBound = 'true';
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.cert-download');
        if (btn) {
          const id = btn.getAttribute('data-cert-id');
          if (id) downloadCert(id);
        }
      });
    }
  });

  revealNew();
}

/**
 * [SECURITY]: Safe Certificate Download Handler
 * Validates ID format to prevent Path Traversal or Arbitrary File Execution.
 */
function downloadCert(id) {
  if (!id || typeof id !== 'string') return;
  // Strict alphanumeric + hyphen/underscore validation
  const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '');
  if (!safeId) return;

  try {
    const link = document.createElement('a');
    link.href = `assets/certificates/${safeId}.pdf`;
    link.download = `${safeId}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer'; // [SECURITY]: Tabnabbing defense
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('[Security] Failed to download certificate:', safeId, e);
  }
}

/**
 * Setup Certificate search and category filters with input debounce
 */
function setupCertControls() {
  const searchInput = document.querySelector('.cert-search input');
  const filterBtns = document.querySelectorAll('.cert-filter');

  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // [SECURITY]: Sanitize search input term
        const raw = searchInput.value || '';
        searchTerm = (typeof SecurityUtils !== 'undefined')
          ? SecurityUtils.sanitizeInput(raw, 100)
          : raw.trim().slice(0, 100);
        renderCertificates();
      }, 150);
    });
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      if (btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const rawFilter = btn.getAttribute('data-filter') || 'all';
        // Validate filter against known categories
        activeFilter = ['all', 'programming', 'ai', 'microsoft'].includes(rawFilter) ? rawFilter : 'all';
        renderCertificates();
      });
    });
  }
}

/**
 * [SECURITY]: Safe Project Cards Renderer
 * Validates URLs against XSS protocols (javascript:), applies Output Encoding, and adds rel="noopener noreferrer".
 */
function renderProjects(containerSelector = null, limit = null) {
  const containers = containerSelector
    ? document.querySelectorAll(containerSelector)
    : document.querySelectorAll('#projectsGrid, .projects-grid:not(#latestProjects)');

  if (!containers.length) return;

  const esc = (typeof SecurityUtils !== 'undefined') ? SecurityUtils.escapeHTML : (s) => String(s || '');
  const sanitizeUrl = (typeof SecurityUtils !== 'undefined') ? SecurityUtils.sanitizeUrl : (u) => u;

  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
  let data = ProjectsData || FallbackProjects;
  if (limit) data = data.slice(0, limit);

  containers.forEach(grid => {
    grid.innerHTML = data.map(p => {
      const title = esc(getTranslated(`projects.items.${p.id}.title`));
      const desc = esc(getTranslated(`projects.items.${p.id}.desc`));
      const techLabel = esc(getTranslated('projects.technologies'));

      const features = (p.features || []).map(f => {
        const label = esc(getTranslated(`projects.features.${f}`));
        return `<li>${label}</li>`;
      }).join('');

      const tech = (p.tech || []).map(tk => `<span>${esc(tk)}</span>`).join('');
      const featureBlock = features ? `<ul class="project-features">${features}</ul>` : '';
      const techBlock = tech ? `<div class="project-tech"><small>${techLabel}:</small> ${tech}</div>` : '';

      // Files block
      let filesBlock = '';
      let filesHtml = '';
      if (p.files && p.files.length > 0) {
        filesHtml += p.files.map(f => {
          const safePath = sanitizeUrl(f.path);
          const safeName = esc(f.name);
          const shortName = esc(f.name.split(' - ').pop());
          const safeIcon = esc(f.icon.replace(/[^a-zA-Z0-9\-]/g, ''));
          return `<a href="${safePath}" download class="project-file" title="${safeName}"><i class="fa-solid ${safeIcon}"></i> <span>${shortName}</span></a>`;
        }).join('');
      }

      // [SECURITY]: Validate external URL protocol to prevent javascript: execution
      if (p.url) {
        const safeUrl = sanitizeUrl(p.url);
        const visitText = lang === 'ar' ? 'الموقع' : 'Live Demo';
        filesHtml += `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="project-file" title="Visit Link"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span>${esc(visitText)}</span></a>`;
      }

      if (filesHtml) {
        filesBlock = `<div class="project-files">${filesHtml}</div>`;
      }

      const imgPath = sanitizeUrl(`assets/projects/${p.image}.jpg`);

      return `
        <article class="project-card glass-card reveal visible">
          <div class="project-img">
            <img src="${imgPath}" alt="${title}" width="480" height="270" loading="lazy" decoding="async" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <i class="fa-solid fa-code" style="display:none;"></i>
          </div>
          <div class="project-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            ${featureBlock}
            ${filesBlock}
            ${techBlock}
          </div>
        </article>`;
    }).join('');
  });

  revealNew();
}

/**
 * Trigger Intersection Observer on new cards
 */
function revealNew() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

  els.forEach(el => observer.observe(el));
}

function renderAllSections() {
  const hasLatestCerts = document.getElementById('latestCerts');
  const hasLatestProjects = document.getElementById('latestProjects');
  const hasCertGrid = document.getElementById('certGrid') || document.querySelector('.cert-grid:not(#latestCerts)');
  const hasProjectsGrid = document.getElementById('projectsGrid') || document.querySelector('.projects-grid:not(#latestProjects)');

  if (hasLatestCerts) renderCertificates('#latestCerts', 3);
  if (hasLatestProjects) renderProjects('#latestProjects', 2);
  if (hasCertGrid) renderCertificates('#certGrid, .cert-grid:not(#latestCerts)');
  if (hasProjectsGrid) renderProjects('#projectsGrid, .projects-grid:not(#latestProjects)');
}

/**
 * Initialize dynamic data rendering across all pages
 */
async function initDataRenderers() {
  // 1. Initial render with fallback/cache immediately
  renderAllSections();
  setupCertControls();

  // 2. Load translations & datasets
  if (typeof loadTranslations === 'function') {
    await loadTranslations();
  }
  await loadData();

  // 3. Re-render with any fresh data
  renderAllSections();
  setupCertControls();
}

// 4. Handle language change & ready re-rendering
document.addEventListener('lang:changed', renderAllSections);
document.addEventListener('lang:ready', renderAllSections);

// Auto-run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDataRenderers);
} else {
  initDataRenderers();
}


