let CertsData = null;
let ProjectsData = null;
let activeFilter = 'all';
let searchTerm = '';

async function loadData() {
  if (!CertsData) {
    try {
      const res = await fetch('data/certificates.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      CertsData = await res.json();
    } catch (e) {
      console.error('Failed to load certificates.json:', e);
      CertsData = [];
    }
  }
  if (!ProjectsData) {
    try {
      const res = await fetch('data/projects.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      ProjectsData = await res.json();
    } catch (e) {
      console.error('Failed to load projects.json:', e);
      ProjectsData = [];
    }
  }
  return { CertsData, ProjectsData };
}

function getTranslated(key) {
  const lang = Storage.getLang();
  if (!Translations || !Translations[lang]) return key;
  return resolve(Translations[lang], key) || key;
}

/* ---------- Certificates ---------- */
function renderCertificates() {
  const grid = document.querySelector('.cert-grid');
  if (!grid) return;
  const lang = Storage.getLang();
  const filtered = (CertsData || []).filter(c => {
    const matchCat = activeFilter === 'all' || c.category === activeFilter;
    const titleKey = `certificates.items.${c.id}.title`;
    const title = (Translations && Translations[lang] && resolve(Translations[lang], titleKey)) || '';
    const matchSearch = !searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="cert-empty">${getTranslated('certificates.noResults')}</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const title = getTranslated(`certificates.items.${c.id}.title`);
    const issuer = getTranslated(`certificates.items.${c.id}.issuer`);
    const catLabel = getTranslated(`certificates.${c.category}`);
    const dl = getTranslated('certificates.download');
    return `
      <article class="cert-card glass-card reveal">
        <div class="cert-img">
          <img src="assets/certificates/${c.image}.jpg" alt="${title}">
          <span class="cat-badge">${catLabel}</span>
        </div>
        <div class="cert-body">
          <h3>${title}</h3>
          <span class="cert-issuer">${issuer}</span>
          <button class="cert-download" onclick="downloadCert('${c.id}')">
            <i class="fa-solid fa-download"></i> ${dl}
          </button>
        </div>
      </article>`;
  }).join('');

  revealNew();
}

function downloadCert(id) {
  const link = document.createElement('a');
  link.href = `assets/certificates/${id}.pdf`;
  link.download = `${id}.pdf`;
  link.click();
}

function setupCertControls() {
  const search = document.querySelector('.cert-search input');
  const filters = document.querySelectorAll('.cert-filter');
  if (search) {
    search.addEventListener('input', () => {
      searchTerm = search.value.trim();
      renderCertificates();
    });
  }
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderCertificates();
    });
  });
}

/* ---------- Projects ---------- */
function renderProjects(limit) {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  const lang = Storage.getLang();
  let data = ProjectsData || [];
  if (limit) data = data.slice(0, limit);

  grid.innerHTML = data.map(p => {
    const title = getTranslated(`projects.items.${p.id}.title`);
    const desc = getTranslated(`projects.items.${p.id}.desc`);
    const viewDetails = getTranslated('projects.viewDetails');
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
      const visitText = lang === 'ar' ? 'الموقع' : 'Website';
      filesHtml += `<a href="${p.url}" target="_blank" rel="noopener" class="project-file" title="Visit Website"><i class="fa-solid fa-globe"></i> <span>${visitText}</span></a>`;
    }
    
    if (filesHtml) {
      filesBlock = `<div class="project-files">${filesHtml}</div>`;
    }
    
    return `
      <article class="project-card glass-card reveal">
        <div class="project-img">
    <img src="assets/projects/${p.image}.jpg" alt="${title}">
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

  revealNew();
}

function revealNew() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

async function initDataRenderers() {
  await loadTranslations();
  await loadData();
  renderCertificates();
  renderProjects();
  setupCertControls();
  document.addEventListener('lang:changed', () => {
    renderCertificates();
    renderProjects();
  });
}

document.addEventListener('DOMContentLoaded', initDataRenderers);
