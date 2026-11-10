function initTimelineReveal() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  items.forEach(item => item.classList.add('reveal'));
  if (typeof initRevealOnScroll === 'function') {
    initRevealOnScroll();
  }
}

document.addEventListener('DOMContentLoaded', initTimelineReveal);
