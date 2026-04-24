const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const links = [...document.querySelectorAll('.nav-links a')];

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    layer.style.transform = `translateY(${window.scrollY * 0.14}px) scale(1.08)`;
  });
});

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
links.forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal,.stagger').forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll('section[id]')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.42 });
sections.forEach(section => spy.observe(section));

// Apple-like magnetic buttons and subtle card tilt
const isFinePointer = matchMedia('(pointer:fine)').matches;
if (isFinePointer) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
  });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)');
  });
}

const gallery = document.getElementById('gallery');
if (gallery) {
  for (let i = 1; i <= 22; i++) {
    const page = String(i).padStart(2, '0');
    const src = `assets/slides/page-${page}.png`;
    const button = document.createElement('button');
    button.className = 'reveal';
    button.innerHTML = `<img src="${src}" alt="Deck page ${i}" loading="lazy">`;
    button.addEventListener('click', () => openLightbox(src));
    gallery.appendChild(button);
    observer.observe(button);
  }
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const closeBtn = lightbox?.querySelector('.lightbox-close');
function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}
closeBtn?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
