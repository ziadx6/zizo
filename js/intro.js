/**
 * Loading & Intro Screen Controller
 * [PERFORMANCE]: Instantly removes loading screen for returning visitors to prevent any FOUC or visual glitch.
 */
function initLoadingScreen() {
  const screen = document.querySelector('.loading-screen');
  if (!screen) return;

  const params = new URLSearchParams(window.location.search);
  const forceIntro = params.get('intro') === '1';
  const hasSeen = (typeof Storage !== 'undefined' && Storage.hasSeenIntro && Storage.hasSeenIntro());

  // If user has seen intro and not forcing it, eliminate loading screen immediately
  if (hasSeen && !forceIntro) {
    screen.remove();
    return;
  }

  const text = document.querySelector('.loading-text');
  const brand = document.querySelector('.loading-brand');
  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';

  if (Translations && Translations[lang]) {
    if (brand && Translations[lang].loading?.brand) brand.textContent = Translations[lang].loading.brand;
    if (text && Translations[lang].loading?.text) text.textContent = Translations[lang].loading.text;
  }

  screen.classList.remove('hidden');

  const dismiss = () => {
    if (!screen.classList.contains('hidden')) {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 400);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(dismiss, 150);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 150), { once: true });
    setTimeout(dismiss, 500);
  }
}

document.addEventListener('lang:ready', () => {
  const screen = document.querySelector('.loading-screen');
  if (!screen) return;
  const text = document.querySelector('.loading-text');
  const brand = document.querySelector('.loading-brand');
  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
  if (Translations && Translations[lang]) {
    if (brand && Translations[lang].loading?.brand) brand.textContent = Translations[lang].loading.brand;
    if (text && Translations[lang].loading?.text) text.textContent = Translations[lang].loading.text;
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
  initLoadingScreen();
}
