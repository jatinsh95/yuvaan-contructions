/* ===== Helpers ===== */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

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
const registerReveals = (elements = [])=>{
  elements.forEach(el=>io.observe(el));
};

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

/* ===== Projects gallery ===== */
const gallery = $('#gallery');
const modal = $('#projectModal');
const modalImg = modal ? $('.lightbox__img', modal) : null;
const modalTitle = modal ? $('.lightbox__title', modal) : null;
const modalCounter = modal ? $('.lightbox__counter', modal) : null;
const modalPrev = modal ? $('.lightbox__nav--prev', modal) : null;
const modalNext = modal ? $('.lightbox__nav--next', modal) : null;
const modalClose = modal ? $('.lightbox__close', modal) : null;

const projects = [
  {
    title: 'Galaxy Blue Sapphire Plaza',
    meta: 'Commercial • 525 sq.ft',
    category: 'commercial',
    images: [
      'assets/images/project_1_1.jpeg',
      'assets/images/project_1_2.jpeg'
    ]
  },
  {
    title: 'ELITE HOMZ Tile & Façade Repair Work',
    meta: 'Residential • Tile Work',
    category: 'residential',
    images: [
      'assets/images/project_2_1.jpeg',
      'assets/images/project_2_2.jpeg'
    ]
  },
  {
    title: 'Woodland Shop Interior',
    meta: 'Interiors • Retail Fit-out',
    category: 'interior',
    images: [
      'assets/images/project_3_1.jpeg',
      'assets/images/project_3_2.jpeg'
    ]
  }
];

let currentProjectIndex = -1;
let currentImageIndex = 0;
let lastFocusedTrigger = null;

const initCardTilt = ()=>{
  $$('#gallery .card').forEach(card=>{
    const inner = $('.card__inner', card);
    if(!inner || inner.dataset.tiltBound) return;
    inner.dataset.tiltBound = 'true';
    inner.addEventListener('mousemove', (e)=>{
      const r = inner.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      inner.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
    });
    inner.addEventListener('mouseleave', ()=> inner.style.transform = 'none');
  });
};

function renderProjects(){
  if(!gallery) return;
  const fragment = document.createDocumentFragment();
  projects.forEach((project, projectIndex)=>{
    if(!project.images || !project.images.length) return;

    const article = document.createElement('article');
    article.className = 'card reveal';
    article.dataset.cat = project.category || 'all';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card__inner';
    button.dataset.project = projectIndex;
    button.setAttribute('aria-label', `Open gallery for ${project.title}`);

    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = `${project.title} image 1`;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'card__overlay';
    const overlayTitle = document.createElement('h3');
    overlayTitle.textContent = project.title;
    overlay.appendChild(overlayTitle);
    if(project.meta){
      const overlayMeta = document.createElement('p');
      overlayMeta.textContent = project.meta;
      overlay.appendChild(overlayMeta);
    }

    button.append(img, overlay);
    button.addEventListener('click', ()=> openModal(projectIndex, 0, button));

    const titleEl = document.createElement('h3');
    titleEl.className = 'card__title';
    titleEl.textContent = project.title;
    if(project.meta){
      const metaEl = document.createElement('span');
      metaEl.textContent = project.meta;
      titleEl.appendChild(metaEl);
    }

    article.append(button, titleEl);
    fragment.appendChild(article);
  });

  gallery.replaceChildren(fragment);
  registerReveals($$('.reveal', gallery));
  initCardTilt();
}

renderProjects();

const filters = $$('.filter');
if(filters.length){
  filters.forEach(btn=>{
    btn.setAttribute('aria-selected', btn.classList.contains('is-active') ? 'true' : 'false');
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>{
        b.classList.remove('is-active');
        b.setAttribute('aria-selected','false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      const cat = btn.dataset.filter;
      $$('#gallery .card').forEach(card=>{
        const show = (cat === 'all') || ((card.dataset.cat || 'all') === cat);
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

function updateModal(){
  const project = projects[currentProjectIndex];
  if(!project || !modalImg) return;
  const total = project.images.length;
  const src = project.images[currentImageIndex];
  modalImg.src = src;
  modalImg.alt = `${project.title} image ${currentImageIndex + 1}`;
  if(modalTitle) modalTitle.textContent = project.title;
  if(modalCounter) modalCounter.textContent = `${currentImageIndex + 1} / ${total}`;
  if(modalPrev) modalPrev.disabled = currentImageIndex === 0;
  if(modalNext) modalNext.disabled = currentImageIndex === total - 1;
}

function openModal(projectIndex, imageIndex = 0, trigger){
  if(!modal) return;
  currentProjectIndex = projectIndex;
  currentImageIndex = imageIndex;
  lastFocusedTrigger = trigger || null;
  updateModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if(modalClose) modalClose.focus();
}

function closeModal(){
  if(!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if(modalImg){
    modalImg.src = '';
    modalImg.alt = '';
  }
  currentProjectIndex = -1;
  currentImageIndex = 0;
  if(lastFocusedTrigger){
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
}

const showPrevImage = ()=>{
  if(currentImageIndex <= 0) return;
  currentImageIndex--;
  updateModal();
};

const showNextImage = ()=>{
  const project = projects[currentProjectIndex];
  if(!project || currentImageIndex >= project.images.length - 1) return;
  currentImageIndex++;
  updateModal();
};

if(modalPrev) modalPrev.addEventListener('click', showPrevImage);
if(modalNext) modalNext.addEventListener('click', showNextImage);
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modal){
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) closeModal();
  });
}

document.addEventListener('keydown', (e)=>{
  if(!modal || !modal.classList.contains('is-open')) return;
  if(e.key === 'Escape') closeModal();
  if(e.key === 'ArrowLeft' && modalPrev && !modalPrev.disabled) showPrevImage();
  if(e.key === 'ArrowRight' && modalNext && !modalNext.disabled) showNextImage();
});

registerReveals($$('.reveal'));

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
