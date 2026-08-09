function initLoadingScreen() {
  const screen = document.querySelector('.loading-screen');
  if (!screen) return;
  const text = document.querySelector('.loading-text');
  const brand = document.querySelector('.loading-brand');
  const lang = Storage.getLang();

  if (Translations && Translations[lang]) {
    if (brand) brand.textContent = Translations[lang].loading.brand;
    if (text) text.textContent = Translations[lang].loading.text;
  }

  setTimeout(() => {
    screen.classList.add('hidden');
    setTimeout(() => screen.remove(), 700);
  }, 1800);
}

document.addEventListener('lang:ready', () => {
  const screen = document.querySelector('.loading-screen');
  const text = document.querySelector('.loading-text');
  const brand = document.querySelector('.loading-brand');
  const lang = Storage.getLang();
  if (Translations && Translations[lang]) {
    if (brand) brand.textContent = Translations[lang].loading.brand;
    if (text) text.textContent = Translations[lang].loading.text;
  }
});

document.addEventListener('DOMContentLoaded', initLoadingScreen);
