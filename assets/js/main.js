// Year in footer
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// Mobile nav toggle
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Sticky header style on scroll
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (!header) return;
  window.scrollY > 10 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// IntersectionObserver for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Simple carousel for home hero
(function initCarousel(){
  const track = document.querySelector('.carousel .carousel-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsWrap = document.querySelector('.carousel .carousel-dots');
  let idx = slides.findIndex(s => s.classList.contains('is-active'));
  if (idx < 0) idx = 0;
  const go = (i) => {
    slides[idx].classList.remove('is-active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('is-active');
    if (dotsWrap) dotsWrap.querySelectorAll('button').forEach((b, bi) => b.classList.toggle('active', bi === idx));
  };
  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === idx) b.classList.add('active');
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
    });
  }
  let timer = setInterval(() => go(idx + 1), 5000);
  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => { timer = setInterval(() => go(idx + 1), 5000); });
})();
