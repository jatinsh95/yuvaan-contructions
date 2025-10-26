/* ===== Helpers ===== */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/* ===== Projects data, gallery render & lightbox ===== */
const projects = [
  {
    title: 'Galaxy Blue Sapphire Plaza',
    subtitle: 'Commercial • 525 sq.ft',
    category: 'commercial',
    images: [
      'assets/images/project_1_1.jpeg',
      'assets/images/project_1_2.jpeg'
    ]
  },
  {
    title: 'ELITE HOMZ TILE & FAÇADE Repair Work',
    subtitle: 'Residential • TILE Work',
    category: 'residential',
    images: [
      'assets/images/project_2_1.jpeg',
      'assets/images/project_2_2.jpeg'
    ]
  },
  {
    title: 'Woodland Shop Interior',
    subtitle: 'Interiors • Retail Space',
    category: 'interior',
    images: [
      'assets/images/project_3_1.jpeg',
      'assets/images/project_3_2.jpeg'
    ]
  }
];

const gallery = $('#gallery');
const lightbox = $('#lightbox');
const lbContent = lightbox ? $('.lightbox__content', lightbox) : null;
const lbImg = lightbox ? $('.lightbox__img', lightbox) : null;
const lbTitle = lightbox ? $('.lightbox__title', lightbox) : null;
const lbCounter = lightbox ? $('.lightbox__counter', lightbox) : null;
const navPrev = lightbox ? $('.lightbox__nav--prev', lightbox) : null;
const navNext = lightbox ? $('.lightbox__nav--next', lightbox) : null;
const lbClose = lightbox ? $('.lightbox__close', lightbox) : null;

let activeProjectIndex = 0;
let activeImageIndex = 0;
let lastFocusedTrigger = null;
let cards = [];

const updateLightbox = () => {
  if (!lightbox) return;
  const project = projects[activeProjectIndex];
  if (!project || !project.images.length) return;

  const total = project.images.length;
  activeImageIndex = Math.min(Math.max(activeImageIndex, 0), total - 1);

  if (lbImg){
    lbImg.src = project.images[activeImageIndex];
    lbImg.alt = `${project.title} - image ${activeImageIndex + 1}`;
  }
  if (lbTitle) lbTitle.textContent = project.title;
  if (lbCounter) lbCounter.textContent = `${activeImageIndex + 1} / ${total}`;

  if (navPrev){
    navPrev.disabled = activeImageIndex === 0;
    navPrev.setAttribute('aria-disabled', navPrev.disabled ? 'true' : 'false');
  }
  if (navNext){
    navNext.disabled = activeImageIndex === total - 1;
    navNext.setAttribute('aria-disabled', navNext.disabled ? 'true' : 'false');
  }
};

const openLightbox = (projectIndex, imageIndex = 0) => {
  if (!lightbox) return;
  activeProjectIndex = projectIndex;
  activeImageIndex = imageIndex;
  updateLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  if (lbContent) lbContent.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  if (lbImg){
    lbImg.removeAttribute('src');
    lbImg.alt = '';
  }
  if (lastFocusedTrigger){
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
};

if (lightbox){
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (navPrev){
    navPrev.addEventListener('click', () => {
      if (activeImageIndex > 0){
        activeImageIndex -= 1;
        updateLightbox();
      }
    });
  }
  if (navNext){
    navNext.addEventListener('click', () => {
      const total = projects[activeProjectIndex]?.images.length || 0;
      if (activeImageIndex < total - 1){
        activeImageIndex += 1;
        updateLightbox();
      }
    });
  }
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape'){
      closeLightbox();
    } else if (e.key === 'ArrowRight'){
      if (navNext && !navNext.disabled){
        e.preventDefault();
        navNext.click();
      }
    } else if (e.key === 'ArrowLeft'){
      if (navPrev && !navPrev.disabled){
        e.preventDefault();
        navPrev.click();
      }
    }
  });
}

const createProjectCard = (project, index) => {
  const article = document.createElement('article');
  article.className = 'card reveal';
  article.dataset.cat = project.category || 'all';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card__inner';
  button.setAttribute('aria-label', `Open gallery for ${project.title}`);

  if (project.images && project.images.length){
    const thumbnail = document.createElement('img');
    thumbnail.src = project.images[0];
    thumbnail.loading = 'lazy';
    thumbnail.alt = `${project.title} - image 1`;
    button.appendChild(thumbnail);
  }

  const overlay = document.createElement('div');
  overlay.className = 'card__overlay';
  const heading = document.createElement('h3');
  heading.textContent = project.title;
  overlay.appendChild(heading);
  if (project.subtitle){
    const meta = document.createElement('p');
    meta.textContent = project.subtitle;
    overlay.appendChild(meta);
  }
  button.appendChild(overlay);

  button.addEventListener('click', () => {
    lastFocusedTrigger = button;
    openLightbox(index, 0);
  });

  article.appendChild(button);
  return article;
};

const renderProjects = () => {
  if (!gallery) return;
  const fragment = document.createDocumentFragment();
  projects.forEach((project, index) => {
    fragment.appendChild(createProjectCard(project, index));
  });
  gallery.innerHTML = '';
  gallery.appendChild(fragment);
  cards = $$('#gallery .card');
};

renderProjects();

/* ===== Mobile Nav ===== */
const toggle = $('.nav__toggle');
const menu = $('#menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close on click outside (mobile)
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)){
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
}

/* ===== Year in footer ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
},{threshold:.2});
$$('.reveal').forEach(el => io.observe(el));

/* ===== About counters ===== */
const counters = $$('.stat__num');
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const dur = 1200;
    let start = null;
    const step = (t)=>{
      if(!start) start = t;
      const p = Math.min((t - start)/dur, 1);
      el.textContent = Math.floor(p * target);
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
},{threshold:.6});
counters.forEach(el => countIO.observe(el));

/* ===== Gallery Filters ===== */
const filters = $$('.filter');
filters.forEach(btn=>{
  btn.setAttribute('aria-selected', btn.classList.contains('is-active') ? 'true' : 'false');
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>{
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    const cat = btn.dataset.filter;
    cards.forEach(card=>{
      const show = (cat === 'all') || (card.dataset.cat === cat);
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ===== Tilt effect on cards (subtle) ===== */
cards.forEach(card=>{
  const inner = $('.card__inner', card);
  inner.addEventListener('mousemove', (e)=>{
    const r = inner.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    inner.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
  });
  inner.addEventListener('mouseleave', ()=> inner.style.transform = 'none');
});

/* ===== Leaflet Map (no API key) ===== */
(function initMap(){
  const el = $('#map');
  if(!el || typeof L === 'undefined') return;

  const lat = parseFloat(el.dataset.lat || '28.6139');
  const lng = parseFloat(el.dataset.lng || '77.2090');
  const zoom = parseInt(el.dataset.zoom || '12', 10);

  const map = L.map('map', {scrollWheelZoom:false}).setView([lat, lng], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<strong>Yuvaan Constructions </strong><br/>We’d love to host you!`).openPopup();
})();

/* ===== Smooth internal scroll (accessibility-friendly) ===== */
$$('a[href^="#"]').forEach(link=>{
  link.addEventListener('click', (e)=>{
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
    history.pushState(null,'',`#${id}`);
  });
});
