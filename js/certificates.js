/**
 * Certificates & Projects Management with Skeleton Loading & Error Handling
 */

let CertsData = null;
let ProjectsData = null;
let activeFilter = 'all';
let searchTerm = '';
let isLoadingData = false;

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

/**
 * Render Skeleton Loading Placeholder Cards
 */
function renderSkeletons() {
  const certContainers = document.querySelectorAll('.cert-grid, #certGrid, #latestCerts');
  certContainers.forEach(container => {
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
  if (CertsData && ProjectsData) {
    return { CertsData, ProjectsData };
  }

  isLoadingData = true;

  try {
    const [certsRes, projRes] = await Promise.all([
      fetch('data/certificates.json').catch(() => null),
      fetch('data/projects.json').catch(() => null)
    ]);

    if (certsRes && certsRes.ok) {
      CertsData = await certsRes.json();
    } else {
      console.warn('Using fallback certificates data');
      CertsData = FallbackCerts;
    }

    if (projRes && projRes.ok) {
      ProjectsData = await projRes.json();
    } else {
      console.warn('Using fallback projects data');
      ProjectsData = FallbackProjects;
    }
  } catch (error) {
    console.error('Error fetching datasets, applying fallback:', error);
    CertsData = CertsData || FallbackCerts;
    ProjectsData = ProjectsData || FallbackProjects;
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
    if (typeof Translations !== 'undefined' && Translations && Translations[lang]) {
      return resolve(Translations[lang], key) || key;
    }
  } catch (e) {
    console.error('Error resolving translation for:', key, e);
  }
  return key;
}

/**
 * Render Certificate Cards
 */
function renderCertificates(containerSelector = null, limit = null) {
  const containers = containerSelector
    ? document.querySelectorAll(containerSelector)
    : document.querySelectorAll('#certGrid, .cert-grid:not(#latestCerts)');

  if (!containers.length) return;

  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
  let data = CertsData || FallbackCerts;

  const filtered = data.filter(c => {
    const matchCat = activeFilter === 'all' || c.category === activeFilter;
    const titleKey = `certificates.items.${c.id}.title`;
    let title = '';
    try {
      if (typeof Translations !== 'undefined' && Translations && Translations[lang]) {
        title = resolve(Translations[lang], titleKey) || '';
      }
    } catch (e) {
      title = '';
    }
    const matchSearch = !searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const finalData = limit ? filtered.slice(0, limit) : filtered;

  containers.forEach(grid => {
    if (!finalData.length) {
      grid.innerHTML = `<div class="cert-empty">${getTranslated('certificates.noResults')}</div>`;
      return;
    }

    grid.innerHTML = finalData.map(c => {
      const title = getTranslated(`certificates.items.${c.id}.title`);
      const issuer = getTranslated(`certificates.items.${c.id}.issuer`);
      const catLabel = getTranslated(`certificates.${c.category}`);
      const dl = getTranslated('certificates.download');
      const imgPath = `assets/certificates/${c.image}.jpg`;

      return `
        <article class="cert-card glass-card reveal">
          <div class="cert-img">
            <img src="${imgPath}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <i class="fa-solid fa-certificate" style="display:none;"></i>
            <span class="cat-badge">${catLabel}</span>
          </div>
          <div class="cert-body">
            <h3>${title}</h3>
            <span class="cert-issuer">${issuer}</span>
            <button class="cert-download" onclick="downloadCert('${c.id}')" aria-label="${dl} ${title}">
              <i class="fa-solid fa-download"></i> <span>${dl}</span>
            </button>
          </div>
        </article>`;
    }).join('');
  });

  revealNew();
}

/**
 * Handle certificate PDF download safely
 */
function downloadCert(id) {
  try {
    const link = document.createElement('a');
    link.href = `assets/certificates/${id}.pdf`;
    link.download = `${id}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Failed to download certificate:', id, e);
  }
}

/**
 * Setup Certificate search and category filters
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
        searchTerm = searchInput.value.trim();
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
        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderCertificates();
      });
    });
  }
}

/**
 * Render Project Cards
 */
function renderProjects(containerSelector = null, limit = null) {
  const containers = containerSelector
    ? document.querySelectorAll(containerSelector)
    : document.querySelectorAll('#projectsGrid, .projects-grid:not(#latestProjects)');

  if (!containers.length) return;

  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
  let data = ProjectsData || FallbackProjects;
  if (limit) data = data.slice(0, limit);

  containers.forEach(grid => {
    grid.innerHTML = data.map(p => {
      const title = getTranslated(`projects.items.${p.id}.title`);
      const desc = getTranslated(`projects.items.${p.id}.desc`);
      const techLabel = getTranslated('projects.technologies');

      const features = (p.features || []).map(f => {
        const label = getTranslated(`projects.features.${f}`);
        return `<li>${label}</li>`;
      }).join('');

      const tech = (p.tech || []).map(tk => `<span>${tk}</span>`).join('');
      const featureBlock = features ? `<ul class="project-features">${features}</ul>` : '';
      const techBlock = tech ? `<div class="project-tech"><small>${techLabel}:</small> ${tech}</div>` : '';

      // Files block
      let filesBlock = '';
      let filesHtml = '';
      if (p.files && p.files.length > 0) {
        filesHtml += p.files.map(f => {
          return `<a href="${f.path}" download class="project-file" title="${f.name}"><i class="fa-solid ${f.icon}"></i> <span>${f.name.split(' - ').pop()}</span></a>`;
        }).join('');
      }
      if (p.url) {
        const visitText = lang === 'ar' ? 'الموقع' : 'Live Demo';
        filesHtml += `<a href="${p.url}" target="_blank" rel="noopener" class="project-file" title="Visit Link"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span>${visitText}</span></a>`;
      }

      if (filesHtml) {
        filesBlock = `<div class="project-files">${filesHtml}</div>`;
      }

      const imgPath = `assets/projects/${p.image}.jpg`;

      return `
        <article class="project-card glass-card reveal">
          <div class="project-img">
            <img src="${imgPath}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
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

/**
 * Initialize dynamic data rendering across all pages
 */
async function initDataRenderers() {
  // 1. Render immediate skeletons to prevent layout shift
  renderSkeletons();

  // 2. Load translations & datasets
  if (typeof loadTranslations === 'function') {
    await loadTranslations();
  }
  await loadData();

  // 3. Render appropriate sections based on active page
  const hasLatestCerts = document.getElementById('latestCerts');
  const hasLatestProjects = document.getElementById('latestProjects');
  const hasCertGrid = document.getElementById('certGrid') || document.querySelector('.cert-grid:not(#latestCerts)');
  const hasProjectsGrid = document.getElementById('projectsGrid') || document.querySelector('.projects-grid:not(#latestProjects)');

  if (hasLatestCerts) {
    renderCertificates('#latestCerts', 3);
  }
  if (hasLatestProjects) {
    renderProjects('#latestProjects', 2);
  }

  if (hasCertGrid) {
    renderCertificates('#certGrid, .cert-grid:not(#latestCerts)');
    setupCertControls();
  }

  if (hasProjectsGrid) {
    renderProjects('#projectsGrid, .projects-grid:not(#latestProjects)');
  }

  // 4. Handle language change re-rendering
  document.addEventListener('lang:changed', () => {
    if (hasLatestCerts) renderCertificates('#latestCerts', 3);
    if (hasLatestProjects) renderProjects('#latestProjects', 2);
    if (hasCertGrid) renderCertificates('#certGrid, .cert-grid:not(#latestCerts)');
    if (hasProjectsGrid) renderProjects('#projectsGrid, .projects-grid:not(#latestProjects)');
  });
}

// Auto-run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDataRenderers);
} else {
  initDataRenderers();
}
