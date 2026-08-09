function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.classList.toggle('no-scroll', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
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
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
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

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const nameInput = form.querySelector('#cf-name');
  const emailInput = form.querySelector('#cf-email');
  const msgInput = form.querySelector('#cf-message');
  const success = form.querySelector('.form-success');

  function validate() {
    let valid = true;
    [nameInput, emailInput, msgInput].forEach(i => i && i.classList.remove('error'));
    const nameErr = form.querySelector('[data-err="name"]');
    const emailErr = form.querySelector('[data-err="email"]');
    const msgErr = form.querySelector('[data-err="message"]');

    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      if (nameErr) nameErr.textContent = getFormErr('nameError');
      valid = false;
    } else if (nameErr) nameErr.textContent = '';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      if (emailErr) emailErr.textContent = getFormErr('emailError');
      valid = false;
    } else if (emailErr) emailErr.textContent = '';

    if (!msgInput.value.trim()) {
      msgInput.classList.add('error');
      if (msgErr) msgErr.textContent = getFormErr('messageError');
      valid = false;
    } else if (msgErr) msgErr.textContent = '';

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (success) {
      success.textContent = getFormErr('success');
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 4000);
    }
  });
}

function getFormErr(key) {
  const lang = Storage.getLang();
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

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealOnScroll();
  initContactForm();
});

document.addEventListener('lang:ready', initIntroParticles);
