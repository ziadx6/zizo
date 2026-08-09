let Translations = null;

async function loadTranslations() {
  if (Translations) return Translations;
  if (typeof TranslationsData !== 'undefined') {
    Translations = TranslationsData;
    return Translations;
  }

  try {
    const res = await fetch('data/translations.json');
    Translations = await res.json();
    return Translations;
  } catch (e) {
    console.error('Failed to load translations.json and no inline fallback is available.', e);
    return null;
  }
}

function t(path) {
  if (!Translations) return path;
  const lang = Storage.getLang();
  const data = Translations[lang];
  if (!data) return path;
  const parts = path.split('.');
  let cur = data;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return path;
  }
  return cur;
}

function applyDir() {
  const lang = Storage.getLang();
  const dir = (Translations && Translations[lang] && Translations[lang].dir) || (lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}

function applyTranslations() {
  if (!Translations) return;
  const lang = Storage.getLang();
  const data = Translations[lang];
  if (!data) return;
  applyDir();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = resolve(data, key);
    if (val != null) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = resolve(data, key);
    if (val != null) el.setAttribute('placeholder', val);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const val = resolve(data, key);
    if (val != null) el.setAttribute('aria-label', val);
  });

  document.title = `${data.intro.brand} | ${resolve(data, 'nav.home')}`;
}

function resolve(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return undefined;
  }
  return cur;
}

async function initLanguage() {
  await loadTranslations();
  applyTranslations();
  document.dispatchEvent(new CustomEvent('lang:ready', { detail: { lang: Storage.getLang() } }));
}

function setLanguage(lang) {
  Storage.setLang(lang);
  applyTranslations();
  applyDir();
  document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang } }));
}

function toggleLanguage() {
  const cur = Storage.getLang();
  setLanguage(cur === 'en' ? 'ar' : 'en');
}

async function setupLangSwitch() {
  await initLanguage();
  
  // استخدام querySelectorAll لاختيار كل أزرار تغيير اللغة
  const btns = document.querySelectorAll('.lang-switch');
  
  if (btns.length > 0) {
    updateLangSwitchLabel();
    // ربط الحدث (Click) بكل زرار
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleLanguage();
      });
    });
  }
  
  document.addEventListener('lang:changed', updateLangSwitchLabel);
}

function updateLangSwitchLabel() {
  // تحديث النص في كل الأزرار
  const btns = document.querySelectorAll('.lang-switch');
  const cur = Storage.getLang();
  
  btns.forEach(btn => {
    const span = btn.querySelector('span');
    if (span) span.textContent = cur === 'en' ? 'ع' : 'EN';
  });
}

document.addEventListener('DOMContentLoaded', setupLangSwitch);
