function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  // Create or reuse backdrop for mobile drawer
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function closeNav() {
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (links) links.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function openNav() {
    if (toggle) {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }
    if (links) links.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  if (toggle && links) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (links.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    backdrop.addEventListener('click', closeNav);

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && links.classList.contains('open')) {
        closeNav();
      }
    }, { passive: true });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  const revealVisible = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh - 12) {
        el.classList.add('visible');
      }
    });
  };

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
  }, { threshold: 0.04, rootMargin: '0px 0px -10px 0px' });

  els.forEach(el => observer.observe(el));

  // Immediate + load check without continuous scroll listener overhead
  requestAnimationFrame(revealVisible);
  window.addEventListener('load', revealVisible, { once: true });
}
/**
 * [SECURITY]: Safe Toast Notification Renderer
 * Uses safe DOM node creation and textContent to completely prevent DOM XSS.
 * No innerHTML is used with dynamic message text.
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return null;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Safe Icon node creation
  const iconSpan = document.createElement('span');
  const iconI = document.createElement('i');
  if (type === 'error') {
    iconI.className = 'fa-solid fa-circle-xmark';
  } else if (type === 'loading') {
    iconI.className = 'fa-solid fa-spinner fa-spin';
  } else {
    iconI.className = 'fa-solid fa-circle-check';
  }
  iconSpan.appendChild(iconI);

  // Safe Text node creation (prevents HTML/JS injection)
  const textSpan = document.createElement('span');
  textSpan.textContent = String(message || '');

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  container.appendChild(toast);

  // Micro-animation entry
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  if (type !== 'loading') {
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 5000);
  }

  return toast;
}

/**
 * [SECURITY]: Contact Form Handler with Client-Side Sanitization & Validation
 * - Sanitizes all input fields before submission
 * - Validates emails using strict regex
 * - Prevents DOM XSS when displaying backend response messages
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const nameInput = form.querySelector('#cf-name');
  const emailInput = form.querySelector('#cf-email');
  const msgInput = form.querySelector('#cf-message');
  const submitBtn = form.querySelector('.form-submit');

  function validate() {
    let valid = true;
    [nameInput, emailInput, msgInput].forEach(i => i && i.classList.remove('error'));

    const nameErr = form.querySelector('[data-err="name"]');
    const emailErr = form.querySelector('[data-err="email"]');
    const msgErr = form.querySelector('[data-err="message"]');

    // Name sanitization & check
    const rawName = nameInput ? nameInput.value.trim() : '';
    if (!rawName || rawName.length < 2) {
      if (nameInput) nameInput.classList.add('error');
      if (nameErr) nameErr.textContent = getFormErr('nameError');
      valid = false;
    } else if (nameErr) {
      nameErr.textContent = '';
    }

    // Email strict regex check
    const rawEmail = emailInput ? emailInput.value.trim() : '';
    const isEmailValid = (typeof SecurityUtils !== 'undefined' && SecurityUtils.isValidEmail)
      ? SecurityUtils.isValidEmail(rawEmail)
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

    if (!isEmailValid) {
      if (emailInput) emailInput.classList.add('error');
      if (emailErr) emailErr.textContent = getFormErr('emailError');
      valid = false;
    } else if (emailErr) {
      emailErr.textContent = '';
    }

    // Message check
    const rawMsg = msgInput ? msgInput.value.trim() : '';
    if (!rawMsg || rawMsg.length < 5) {
      if (msgInput) msgInput.classList.add('error');
      if (msgErr) msgErr.textContent = getFormErr('messageError');
      valid = false;
    } else if (msgErr) {
      msgErr.textContent = '';
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (!submitBtn) return;

    const originalHTML = submitBtn.innerHTML;
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;

    const loadingToast = showToast('Sending your message...', 'loading');

    try {
      // [SECURITY]: Input Sanitization before building FormData
      const cleanName = (typeof SecurityUtils !== 'undefined')
        ? SecurityUtils.sanitizeInput(nameInput.value, 100)
        : nameInput.value.trim().slice(0, 100);

      const cleanEmail = (typeof SecurityUtils !== 'undefined')
        ? SecurityUtils.sanitizeInput(emailInput.value, 150)
        : emailInput.value.trim().slice(0, 150);

      const cleanMsg = (typeof SecurityUtils !== 'undefined')
        ? SecurityUtils.sanitizeInput(msgInput.value, 3000)
        : msgInput.value.trim().slice(0, 3000);

      const formData = new FormData();
      formData.append("access_key", "174edbd8-27af-45dc-af18-a2c8a7727f4a");
      formData.append("name", cleanName);
      formData.append("email", cleanEmail);
      formData.append("message", cleanMsg);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (loadingToast) loadingToast.remove();

      if (data && data.success) {
        showToast('Message sent successfully!', 'success');

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.2 }
          });
        }

        form.reset();
      } else {
        const errorMsg = (data && data.message) ? String(data.message) : 'Failed to send message';
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      if (loadingToast) loadingToast.remove();
      showToast('Something went wrong. Please try again.', 'error');
      console.error('[Contact Form Error]:', error);
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
}

function getFormErr(key) {
  const lang = (typeof Storage !== 'undefined' && Storage.getLang) ? Storage.getLang() : 'en';
  if (!Translations || !Translations[lang]) return key;
  return resolve(Translations[lang], `contact.form.${key}`) || key;
}

function initIntroParticles() {
  if (typeof particlesJS === 'undefined') return;
  const el = document.getElementById('particles-intro');
  if (!el) return;
  particlesJS('particles-intro', {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 900 } },
      color: { value: ['#A855F7', '#3B82F6'] },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 130, color: '#A855F7', opacity: 0.25, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, straight: false, out_mode: 'out' }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false } }, modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } } },
    retina_detect: true
  });
}

function showIntroAgain() {
  Storage.resetIntro();
  window.location.href = 'index.html?intro=1';
}

/**
 * Professional Mobile Navigation, Bottom Dock & Auto-Scroll Transitions
 * - Single clean floating dock for mobile (no duplicate cards above footer)
 * - Auto-navigates smoothly when scrolling past main content into footer area
 * - Rich arrival/departure visual effects with bfcache & scroll-lock safety
 */
function initMobilePageFlow() {
  const PAGE_ORDER = [
    { href: 'index.html', key: 'nav.home', en: 'Home', ar: 'الرئيسية' },
    { href: 'about.html', key: 'nav.about', en: 'About', ar: 'نبذة عني' },
    { href: 'projects.html', key: 'nav.projects', en: 'Projects', ar: 'المشاريع' },
    { href: 'certificates.html', key: 'nav.certificates', en: 'Certificates', ar: 'الشهادات' },
    { href: 'journey.html', key: 'nav.journey', en: 'Journey', ar: 'الرحلة' },
    { href: 'contact.html', key: 'nav.contact', en: 'Contact', ar: 'تواصل' },
    { href: 'more.html', key: 'nav.more', en: 'More', ar: 'المزيد' }
  ];

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentIndex = PAGE_ORDER.findIndex(
    p => p.href === currentPath || (currentPath === '' && p.href === 'index.html')
  );
  if (currentIndex === -1) return;

  const currentPage = PAGE_ORDER[currentIndex];
  const prevPage = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
  const nextPage = currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;

  // Apply directional entrance animation, fog-clear mist & neon top sweep on arrival
  try {
    const dir = sessionStorage.getItem('zizo_nav_dir');
    if (dir === 'next' || dir === 'prev') {
      document.body.classList.add(dir === 'next' ? 'page-enter-next' : 'page-enter-prev');
      sessionStorage.removeItem('zizo_nav_dir');

      const arrivalFog = document.createElement('div');
      arrivalFog.className = 'page-fog-curtain arriving';
      arrivalFog.setAttribute('aria-hidden', 'true');
      document.body.appendChild(arrivalFog);
      setTimeout(() => arrivalFog.remove(), 400);

      const glow = document.createElement('div');
      glow.className = 'page-arrival-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
      setTimeout(() => glow.remove(), 560);
    }
  } catch (e) { }

  // Top progress bar & atmospheric fog transition curtain
  const progressBar = document.createElement('div');
  progressBar.className = 'nav-progress-bar';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  const fogCurtain = document.createElement('div');
  fogCurtain.className = 'page-fog-curtain';
  fogCurtain.setAttribute('aria-hidden', 'true');
  const fogBadge = document.createElement('div');
  fogBadge.className = 'page-fog-badge';
  const fogIcon = document.createElement('i');
  fogIcon.className = 'fa-solid fa-wand-magic-sparkles';
  const fogLabel = document.createElement('span');
  fogBadge.appendChild(fogIcon);
  fogBadge.appendChild(fogLabel);
  fogCurtain.appendChild(fogBadge);
  document.body.appendChild(fogCurtain);

  function getLang() {
    if (typeof Storage !== 'undefined' && Storage.getLang) return Storage.getLang();
    return document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
  }

  function getPageLabel(page) {
    if (!page) return '';
    const lang = getLang();
    if (typeof Translations !== 'undefined' && Translations && Translations[lang] && typeof resolve === 'function') {
      const translated = resolve(Translations[lang], page.key);
      if (translated) return translated;
    }
    return lang === 'ar' ? page.ar : page.en;
  }

  // Prefetch adjacent pages so transitions feel instant
  if (window.location.protocol !== 'file:') {
    [nextPage, prevPage].forEach(page => {
      if (!page) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page.href;
      document.head.appendChild(link);
    });
  }

  // Prevent native pull-to-refresh from hijacking top-edge pull-back on inner pages
  function syncOverscrollBehavior() {
    const isMobileOrTouch = window.innerWidth <= 960 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const val = (prevPage && isMobileOrTouch) ? 'contain' : 'auto';
    document.documentElement.style.overscrollBehaviorY = val;
  }
  syncOverscrollBehavior();
  window.addEventListener('resize', syncOverscrollBehavior, { passive: true });

  // Single Floating Mobile Bottom Dock (<= 960px)
  const dock = document.createElement('nav');
  dock.className = 'mobile-bottom-dock';
  dock.setAttribute('aria-label', 'Mobile quick navigation');
  document.body.appendChild(dock);

  function isIntroVisible() {
    const intro = document.getElementById('introScreen');
    return !!(intro && !intro.classList.contains('hidden'));
  }

  function syncDockVisibility() {
    const linksOpen = document.querySelector('.nav-links.open');
    const activeEl = document.activeElement;
    const typing = !!(activeEl && activeEl.matches && activeEl.matches('input, textarea, select'));
    dock.classList.toggle('dock-hidden', isIntroVisible() || !!linksOpen || typing);
  }

  let isNavigating = false;
  let navDelayTimer = null;

  function clearTransitionClasses() {
    clearTimeout(navDelayTimer);
    navDelayTimer = null;
    document.body.classList.remove('leaving-next', 'leaving-prev');
    progressBar.classList.remove('active', 'done');
    fogCurtain.classList.remove('active');
  }

  function navigateWithTransition(href, direction, targetPageObj) {
    if (!href || isNavigating) return;
    isNavigating = true;

    const targetPage = targetPageObj || PAGE_ORDER.find(p => p.href === href);
    const label = targetPage ? getPageLabel(targetPage) : '';
    const isAr = getLang() === 'ar';

    progressBar.classList.remove('done');
    progressBar.classList.add('active');

    if (label) {
      fogLabel.textContent = isAr
        ? (direction === 'prev' ? `الرجوع إلى ${label}` : `الانتقال إلى ${label}`)
        : label;
      fogIcon.className = direction === 'prev'
        ? 'fa-solid fa-arrow-up'
        : 'fa-solid fa-wand-magic-sparkles';
    }
    fogCurtain.classList.add('active');

    if (direction === 'next' || direction === 'prev') {
      document.body.classList.add(direction === 'next' ? 'leaving-next' : 'leaving-prev');
      try {
        sessionStorage.setItem('zizo_nav_dir', direction);
      } catch (e) { }
    }

    // Safety unlock if user cancels navigation
    setTimeout(() => {
      isNavigating = false;
      clearTransitionClasses();
      hidePill();
    }, 2500);

    requestAnimationFrame(() => {
      navDelayTimer = setTimeout(() => {
        window.location.href = href;
      }, 130);
    });
  }

  function bindSmoothLink(el, href, direction) {
    el.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigateWithTransition(href, direction);
    });
  }

  function renderDock() {
    const lang = getLang();
    const isAr = lang === 'ar';
    dock.textContent = '';

    const prevBtn = document.createElement(prevPage ? 'a' : 'span');
    prevBtn.className = `dock-btn${!prevPage ? ' disabled' : ''}`;
    if (prevPage) {
      prevBtn.href = prevPage.href;
      prevBtn.setAttribute('aria-label', `${isAr ? 'السابق' : 'Previous'}: ${getPageLabel(prevPage)}`);
      bindSmoothLink(prevBtn, prevPage.href, 'prev');
    }
    const prevIcon = document.createElement('i');
    prevIcon.className = isAr ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
    const prevSpan = document.createElement('span');
    prevSpan.textContent = prevPage ? getPageLabel(prevPage) : (isAr ? 'البداية' : 'Start');
    prevBtn.appendChild(prevIcon);
    prevBtn.appendChild(prevSpan);

    const centerBtn = document.createElement('button');
    centerBtn.type = 'button';
    centerBtn.className = 'dock-center';
    centerBtn.setAttribute('aria-label', isAr ? 'فتح قائمة الصفحات' : 'Open pages menu');
    centerBtn.addEventListener('click', () => {
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.click();
    });

    const curLabel = document.createElement('span');
    curLabel.className = 'dock-current';
    curLabel.textContent = getPageLabel(currentPage);

    const dotsWrap = document.createElement('span');
    dotsWrap.className = 'dock-dots';
    PAGE_ORDER.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `dock-dot${idx === currentIndex ? ' active' : ''}`;
      dotsWrap.appendChild(dot);
    });

    centerBtn.appendChild(curLabel);
    centerBtn.appendChild(dotsWrap);

    const nextBtn = document.createElement(nextPage ? 'a' : 'span');
    nextBtn.className = `dock-btn primary${!nextPage ? ' disabled' : ''}`;
    if (nextPage) {
      nextBtn.href = nextPage.href;
      nextBtn.setAttribute('aria-label', `${isAr ? 'التالي' : 'Next'}: ${getPageLabel(nextPage)}`);
      bindSmoothLink(nextBtn, nextPage.href, 'next');
    }
    const nextSpan = document.createElement('span');
    nextSpan.textContent = nextPage ? getPageLabel(nextPage) : (isAr ? 'النهاية' : 'End');
    const nextIcon = document.createElement('i');
    nextIcon.className = isAr ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right';
    nextBtn.appendChild(nextSpan);
    nextBtn.appendChild(nextIcon);

    dock.appendChild(prevBtn);
    dock.appendChild(centerBtn);
    dock.appendChild(nextBtn);
    syncDockVisibility();
  }

  // Enhance navbar links with smooth transition too
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    const targetIdx = PAGE_ORDER.findIndex(p => p.href === href);
    if (targetIdx !== -1 && targetIdx !== currentIndex) {
      bindSmoothLink(a, href, targetIdx > currentIndex ? 'next' : 'prev');
    }
  });

  // Floating Edge / Auto-Transition Indicator Pill
  const pill = document.createElement('div');
  pill.className = 'edge-nav-pill';
  pill.setAttribute('aria-hidden', 'true');

  const pillRow = document.createElement('div');
  pillRow.className = 'edge-nav-pill-row';
  const pillIcon = document.createElement('i');
  pillIcon.className = 'fa-solid fa-wand-magic-sparkles';
  const pillText = document.createElement('span');
  pillRow.appendChild(pillIcon);
  pillRow.appendChild(pillText);

  const progressTrack = document.createElement('div');
  progressTrack.className = 'edge-nav-progress';
  const progressFill = document.createElement('div');
  progressFill.className = 'edge-nav-progress-fill';
  progressTrack.appendChild(progressFill);

  pill.appendChild(pillRow);
  pill.appendChild(progressTrack);
  document.body.appendChild(pill);

  let readyHapticFired = false;
  const mountedAt = Date.now();
  const PULL_THRESHOLD = 48;
  const WHEEL_THRESHOLD = 110;

  renderDock();
  document.addEventListener('lang:ready', renderDock);
  document.addEventListener('lang:changed', renderDock);
  window.addEventListener('focusin', syncDockVisibility);
  window.addEventListener('focusout', () => setTimeout(syncDockVisibility, 80));

  const stateObserver = new MutationObserver(() => {
    syncDockVisibility();
  });
  stateObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const introEl = document.getElementById('introScreen');
  if (introEl) {
    stateObserver.observe(introEl, { attributes: true, attributeFilter: ['class'] });
  }

  // Reset all transition states on pageshow (fixes mobile bfcache / Back button freeze)
  window.addEventListener('pageshow', () => {
    isNavigating = false;
    clearTransitionClasses();
    hidePill();
    if (!isIntroVisible()) {
      document.body.classList.remove('no-scroll');
    }
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    const navBackdrop = document.querySelector('.nav-backdrop');
    if (navLinks) navLinks.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    syncDockVisibility();
  });

  function hasActiveOrFilledForm() {
    const active = document.activeElement;
    if (active && active.matches && active.matches('input, textarea, select, [contenteditable="true"]')) {
      return true;
    }
    const fields = document.querySelectorAll('.contact-form input:not([type="hidden"]), .contact-form textarea');
    for (const f of fields) {
      if (f.value && f.value.trim().length > 0) return true;
    }
    return false;
  }

  function isBlocked() {
    if (isNavigating) return true;
    if (Date.now() - mountedAt < 500) return true;
    if (document.body.classList.contains('no-scroll')) return true;
    if (isIntroVisible()) return true;
    if (hasActiveOrFilledForm()) return true;
    return false;
  }

  function isInteractiveTarget(target) {
    return !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]'));
  }

  function getScrollMetrics() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    return {
      scrollTop,
      atTop: scrollTop <= 4,
      // Only consider bottom reached when user actually scrolls all the way to the bottom of the screen
      atBottom: Math.ceil(scrollTop + viewportH) >= (docH - 6)
    };
  }

  function showPill(direction, progress, customText) {
    const clamped = Math.max(0, Math.min(1, progress));
    const isAr = getLang() === 'ar';
    const targetPage = direction === 'next' ? nextPage : prevPage;
    if (!targetPage) return;

    const label = getPageLabel(targetPage);
    const isReady = clamped >= 1;

    pill.classList.toggle('pos-bottom', direction === 'next');
    pill.classList.toggle('pos-top', direction === 'prev');
    pill.classList.toggle('visible', clamped > 0.06);
    pill.classList.toggle('ready', isReady);

    pillIcon.className = isReady
      ? 'fa-solid fa-wand-magic-sparkles'
      : (direction === 'next' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up');

    if (customText) {
      pillText.textContent = customText;
    } else if (isAr) {
      pillText.textContent = isReady
        ? (direction === 'next' ? `اتركه للانتقال إلى: ${label}` : `اتركه للرجوع إلى: ${label}`)
        : (direction === 'next' ? `اسحب للمتابعة: ${label}` : `اسحب للرجوع: ${label}`);
    } else {
      pillText.textContent = isReady
        ? (direction === 'next' ? `Release for: ${label}` : `Release to return: ${label}`)
        : (direction === 'next' ? `Pull for Next: ${label}` : `Pull for Previous: ${label}`);
    }

    progressFill.style.width = `${Math.round(clamped * 100)}%`;

    if (isReady && !readyHapticFired) {
      readyHapticFired = true;
      if (navigator.vibrate) navigator.vibrate(14);
    } else if (!isReady) {
      readyHapticFired = false;
    }
  }

  function hidePill() {
    pill.classList.remove('visible', 'ready');
    progressFill.style.width = '0%';
    readyHapticFired = false;
  }

  // Touch Edge-Pull Gesture (only triggers when already at very bottom / very top)
  let lastEdgeReach = Date.now();
  let touchActive = false;
  let startX = 0;
  let startY = 0;
  let startedAtTop = false;
  let startedAtBottom = false;
  let activeDirection = null;
  let activeProgress = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1 || isBlocked() || isInteractiveTarget(e.target)) {
      touchActive = false;
      return;
    }
    const m = getScrollMetrics();
    touchActive = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startedAtTop = m.atTop;
    startedAtBottom = m.atBottom;
    activeDirection = null;
    activeProgress = 0;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!touchActive || e.touches.length !== 1 || isBlocked()) return;

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    if (Math.abs(dx) > Math.abs(dy) * 1.15) {
      hidePill();
      activeDirection = null;
      activeProgress = 0;
      return;
    }

    const m = getScrollMetrics();
    if (dy < -12 && nextPage && startedAtBottom && m.atBottom) {
      activeDirection = 'next';
      activeProgress = Math.abs(dy) / PULL_THRESHOLD;
      showPill('next', activeProgress);
    } else if (dy > 12 && prevPage && startedAtTop && m.atTop) {
      activeDirection = 'prev';
      activeProgress = dy / PULL_THRESHOLD;
      showPill('prev', activeProgress);
    } else {
      activeDirection = null;
      activeProgress = 0;
      hidePill();
    }
  }, { passive: true });

  function finishTouch() {
    if (!touchActive) return;
    touchActive = false;
    if (activeDirection && activeProgress >= 1) {
      const target = activeDirection === 'next' ? nextPage : prevPage;
      hidePill();
      if (target) navigateWithTransition(target.href, activeDirection, target);
    } else {
      hidePill();
    }
    activeDirection = null;
    activeProgress = 0;
  }

  window.addEventListener('touchend', finishTouch, { passive: true });
  window.addEventListener('touchcancel', finishTouch, { passive: true });

  // Wheel fallback on <= 960px viewports (only after reaching very bottom/top)
  let wheelAccum = 0;
  let wheelDir = null;
  let wheelResetTimer = null;
  let wasAtEdge = true;

  window.addEventListener('wheel', (e) => {
    if (window.innerWidth > 960 || isBlocked() || isInteractiveTarget(e.target)) return;

    const m = getScrollMetrics();
    const atEdgeNow = m.atTop || m.atBottom;
    if (atEdgeNow && !wasAtEdge) {
      lastEdgeReach = Date.now();
    }
    wasAtEdge = atEdgeNow;

    if (Date.now() - lastEdgeReach < 240) return;

    if (e.deltaY > 0 && nextPage && m.atBottom) {
      if (wheelDir !== 'next') wheelAccum = 0;
      wheelDir = 'next';
      wheelAccum += e.deltaY;
      showPill('next', wheelAccum / WHEEL_THRESHOLD);
    } else if (e.deltaY < 0 && prevPage && m.atTop) {
      if (wheelDir !== 'prev') wheelAccum = 0;
      wheelDir = 'prev';
      wheelAccum += Math.abs(e.deltaY);
      showPill('prev', wheelAccum / WHEEL_THRESHOLD);
    } else {
      wheelAccum = 0;
      wheelDir = null;
      hidePill();
      return;
    }

    clearTimeout(wheelResetTimer);
    if (wheelAccum >= WHEEL_THRESHOLD) {
      const target = wheelDir === 'next' ? nextPage : prevPage;
      wheelAccum = 0;
      hidePill();
      if (target) navigateWithTransition(target.href, wheelDir, target);
      return;
    }
    wheelResetTimer = setTimeout(() => {
      wheelAccum = 0;
      wheelDir = null;
      hidePill();
    }, 300);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealOnScroll();
  initContactForm();
  initMobilePageFlow();
});

document.addEventListener('lang:ready', initIntroParticles);
