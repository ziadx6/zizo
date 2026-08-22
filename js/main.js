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
  const els = document.querySelectorAll('.reveal');
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
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => observer.observe(el));
}
function showToast(message, type = 'success') {

  const container = document.getElementById('toast-container');

  if (!container) return;

  const toast = document.createElement('div');

  toast.className = `toast ${type}`;

  let icon = '<i class="fa-solid fa-circle-check"></i>';

  if (type === 'error') {
    icon = '<i class="fa-solid fa-circle-xmark"></i>';
  }

  if (type === 'loading') {
    icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
  }

  toast.innerHTML = `
    <span>${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

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
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const nameInput = form.querySelector('#cf-name');
  const emailInput = form.querySelector('#cf-email');
  const msgInput = form.querySelector('#cf-message');
  const success = document.getElementById('result');

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submitBtn = form.querySelector('.form-submit');

    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Sending...';
    submitBtn.disabled = true;

    const loadingToast = showToast(
      'Sending your message...',
      'loading'
    );

    try {

      const formData = new FormData();

      formData.append(
        "access_key",
        "174edbd8-27af-45dc-af18-a2c8a7727f4a"
      );

      formData.append(
        "name",
        nameInput.value
      );

      formData.append(
        "email",
        emailInput.value
      );

      formData.append(
        "message",
        msgInput.value
      );

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {

        loadingToast.remove();

        showToast(
          'Message sent successfully!',
          'success'
        );

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.2 }
          });
        }

        form.reset();

      } else {

        loadingToast.remove();

        showToast(
          data.message || 'Failed to send message',
          'error'
        );

      }

    } catch (error) {

      loadingToast.remove();

      showToast(
        'Something went wrong. Please try again.',
        'error'
      );

      console.error(error);

    } finally {

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

    }

  }); // يقفل addEventListener

} // يقفل initContactForm
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
