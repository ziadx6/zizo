function initTimelineReveal() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(item => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', initTimelineReveal);
