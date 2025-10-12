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
const cards = $$('#gallery .card');
filters.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    cards.forEach(card=>{
      const show = (cat === 'all') || (card.dataset.cat === cat);
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ===== Lightbox ===== */
const lightbox = $('#lightbox');
const lbImg = $('.lightbox__img', lightbox);
const lbClose = $('.lightbox__close', lightbox);
$$('[data-lightbox]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const src = btn.getAttribute('data-lightbox');
    lbImg.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
lbClose.addEventListener('click', ()=>{
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
});
lightbox.addEventListener('click', (e)=>{
  if(e.target === lightbox) lbClose.click();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && lightbox.classList.contains('is-open')) lbClose.click();
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
  marker.bindPopup(`<strong>Yuvaan Constructions & Interiors</strong><br/>We’d love to host you!`).openPopup();
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
