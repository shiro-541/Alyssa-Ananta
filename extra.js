(() => {
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
// kunci scroll saat menu mobile terbuka
const nm = document.getElementById('navMenu');
if (nm) new MutationObserver(() => { document.body.style.overflow = nm.classList.contains('active') ? 'hidden' : ''; }).observe(nm, { attributes: true, attributeFilter: ['class'] });
addEventListener('resize', () => { if (innerWidth > 1024 && nm) { nm.classList.remove('active'); document.getElementById('menuToggle')?.classList.remove('active'); } });
// active nav link
const here = location.pathname.split('/').pop() || 'index.html';
$$('#navMenu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === here));
// cursor glow
const glow = Object.assign(document.createElement('div'), { className: 'glow' });
document.body.prepend(glow);
let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
// split letters + scramble
$$('.page-hero h1,.fav-hero h1,.bio-hero h1,.hero h1 .name,.hero h1 .surname').forEach(el => {
  const t = el.textContent.trim(); el.textContent = ''; el.setAttribute('aria-label', t);
  [...t].forEach((c, i) => {
    const w = document.createElement('span'); w.className = 'clip';
    const s = document.createElement('span'); s.className = c === ' ' ? 'sp' : 'ch'; s.style.setProperty('--i', i); s.textContent = c === ' ' ? '' : c;
    w.appendChild(s); el.appendChild(w);
  });
  setTimeout(() => el.classList.add('ch-on'), 100);
});
const glyphs = '!<>-_/[]{}=+*^?#';
$$('.page-subtitle,.fav-subtitle,.bio-tagline,.hero-subtitle').forEach(el => {
  const end = el.textContent; let f = 0;
  setTimeout(() => { const id = setInterval(() => {
    el.textContent = [...end].map((c, i) => c === ' ' || i < f / 2 ? c : glyphs[Math.random() * glyphs.length | 0]).join('');
    if (++f > end.length * 2) { el.textContent = end; clearInterval(id); }
  }, 35); }, 1300);
});
// ticker
const first = document.querySelector('.hero,.page-hero,.fav-hero,.bio-hero');
if (first) {
  const words = ['ALYSSA ANANTA', 'CONTENT CREATOR', 'STREAMER', 'SINGER', 'DRIFTER'];
  const row = words.concat(words).map(w => `<span>${w}</span>`).join('');
  const t = document.createElement('div'); t.className = 'ticker'; t.innerHTML = `<div class="ticker-in">${row}${row}</div>`;
  first.after(t);
}
let lastY = scrollY, sk = 0;
// reveal
const targets = '.quick-link,.section-title,.bio-simple-card,.bio-quote,.fav-category-block,.fav-item,.pencapaian-group-title,.pencapaian-card,.lagu-card,.platform-section,.gallery-item,.timeline-content,.timeline-photo,.timeline-header,.hero-stat,.hero-desc,.hero-cta,.hero-badge,.hero-photo-wrapper,.bio-photo-wrapper';
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.dataset.count) count(e.target); } }), { threshold: .12 });
$$(targets).forEach((el, i) => {
  el.classList.add('rv');
  const p = el.parentElement; el.style.setProperty('--d', (([...p.children].indexOf(el)) % 6) * .08 + 's');
  const ti = el.closest('.timeline-item');
  if (ti && !el.matches('.timeline-header')) el.classList.add([...ti.parentElement.children].indexOf(ti) % 2 ? 'r' : 'l');
  io.observe(el);
});
// counters
function count(card) {
  $$('.num,.pencapaian-number', card).forEach(n => {
    const m = n.textContent.trim().match(/^([\d.,]+)(.*)$/); if (!m) return;
    const target = parseFloat(m[1].replace(',', '.')), dec = (m[1].split(/[.,]/)[1] || '').length, t0 = performance.now();
    (function step(t) { const k = Math.min((t - t0) / 1400, 1), v = target * (1 - Math.pow(1 - k, 4));
      n.textContent = v.toFixed(dec) + m[2]; if (k < 1) requestAnimationFrame(step); })(t0);
  });
}
$$('.hero-stat,.pencapaian-card,.stat-box').forEach(c => { c.dataset.count = 1; if (!c.classList.contains('rv')) { c.classList.add('rv'); io.observe(c); } });
// spotlight + ripple
addEventListener('pointermove', e => {
  const c = e.target.closest('.quick-link,.bio-simple-card,.pencapaian-card,.lagu-card,.timeline-content,.fav-item,.stat-box,.platform-section'); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
});
document.addEventListener('click', e => {
  const b = e.target.closest('.btn,.platform-cta,.lagu-btn'); if (!b) return;
  const r = b.getBoundingClientRect(), d = document.createElement('i'); d.className = 'rip';
  d.style.left = e.clientX - r.left + 'px'; d.style.top = e.clientY - r.top + 'px'; b.appendChild(d); setTimeout(() => d.remove(), 700);
});
// page curtain
const curtain = Object.assign(document.createElement('div'), { className: 'curtain' }); document.body.appendChild(curtain);
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
  const h = a.getAttribute('href'); if (!h || h[0] === '#' || !h.endsWith('.html') || h === here) return;
  e.preventDefault(); curtain.classList.add('go'); setTimeout(() => location.href = h, 600);
});
addEventListener('pageshow', () => curtain.classList.remove('go'));
// frame loop: glow, ticker skew, timeline fill
const tl = document.querySelector('.timeline');
(function loop() {
  gx += (tx - gx) * .08; gy += (ty - gy) * .08; glow.style.transform = `translate(${gx}px,${gy}px)`;
  const v = scrollY - lastY; lastY = scrollY; sk += (Math.max(-8, Math.min(8, v * .25)) - sk) * .1;
  document.querySelectorAll('.ticker').forEach(t => t.style.setProperty('--sk', sk + 'deg'));
  if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty('--tl', Math.max(0, Math.min(1, (innerHeight * .6 - r.top) / r.height))); }
  requestAnimationFrame(loop);
})();
// karier: lightbox for timeline photos
if (document.querySelector('.timeline-photo') && !document.getElementById('lightbox')) {
  const box = document.createElement('div'); box.className = 'lightbox'; box.id = 'lightbox';
  box.innerHTML = '<button class="lightbox-close" aria-label="Tutup">✕</button><img src="" alt="" id="lightboxImg">';
  document.body.appendChild(box);
  const close = () => { box.classList.remove('active'); document.body.style.overflow = ''; };
  box.addEventListener('click', e => { if (e.target === box || e.target.closest('.lightbox-close')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  $$('.timeline-photo').forEach(p => { p.tabIndex = 0; p.setAttribute('role', 'button');
    const open = () => { const im = p.querySelector('img'); document.getElementById('lightboxImg').src = im.src; document.getElementById('lightboxImg').alt = im.alt; box.classList.add('active'); document.body.style.overflow = 'hidden'; };
    p.addEventListener('click', open); p.addEventListener('keydown', e => { if (e.key === 'Enter') open(); }); });
}
// lightbox arrows
const imgs = $$('.gallery-item img,.timeline-photo img'), lb = document.getElementById('lightboxImg');
if (lb) addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key) || !document.getElementById('lightbox').classList.contains('active')) return;
  const i = imgs.findIndex(x => x.src === lb.src), n = (i + (e.key === 'ArrowRight' ? 1 : -1) + imgs.length) % imgs.length; lb.src = imgs[n].src;
});
})();
