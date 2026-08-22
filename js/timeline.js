function initTimelineReveal() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => {
      item.classList.add('reveal');
      item.classList.add('visible');
    });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  items.forEach(item => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', initTimelineReveal);
