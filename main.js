import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   PREMIUM PORTFOLIO — main.js (v3 final)
   ═══════════════════════════════════════════════════════════════ */

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const reduced = () => window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ── 1. Scroll Reveal ─────────────────────────────────────────── */
function initReveal() {
  const items = $$('.ri');
  items.forEach(el => {
    const d = parseInt(el.dataset.d || 0, 10);
    el.style.transitionDelay = `${d}ms`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });

  items.forEach(el => io.observe(el));
}

/* ── 2. Hero Word Reveal ──────────────────────────────────────── */
function initHeroWords() {
  $$('.hn-word').forEach((w, i) => setTimeout(() => w.classList.add('on'), 300 + i * 250));
}

/* ── 3. Typing Effect ─────────────────────────────────────────── */
function initTyping() {
  const el = $('.typing-el');
  if (!el) return;
  const roles = ['Frontend Developer', 'UI/UX Enthusiast', 'Creative Coder', 'Web Developer'];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    if (del) {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 500); return; }
      setTimeout(tick, 38);
    } else {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { setTimeout(() => { del = true; tick(); }, 2200); return; }
      setTimeout(tick, 72);
    }
  }
  setTimeout(tick, 1400);
}

/* ── 4. Mouse Glow ────────────────────────────────────────────── */
function initMouseGlow() {
  if (reduced()) return;
  let raf;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      // Per-glass-card local glow
      $$('.glass-card').forEach(c => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', `${e.clientX - r.left}px`);
        c.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }, { passive: true });
}

/* ── 5. Project Card Spotlight ────────────────────────────────── */
function initSpotlight() {
  if (reduced()) return;
  $$('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
    }, { passive: true });
  });
}

/* ── 6. Magnetic Buttons ──────────────────────────────────────── */
function initMagnetic() {
  if (reduced()) return;
  $$('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ── 7. Button Ripple ─────────────────────────────────────────── */
function initRipple() {
  $$('.mag-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const el = document.createElement('span');
      el.className = 'ripple-el';
      el.style.left = `${e.clientX - r.left}px`;
      el.style.top  = `${e.clientY - r.top}px`;
      btn.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    });
  });
}

/* ── 8. Skill Card Colors ─────────────────────────────────────── */
function initSkillColors() {
  $$('.skill-card[data-color]').forEach(c => {
    const col = c.dataset.color;
    c.style.setProperty('--card-c', col);
    c.style.setProperty('--card-g', col + '44');
  });
}

/* ── 9. 3D Tilt ───────────────────────────────────────────────── */
function initTilt() {
  if (reduced()) return;
  $$('.skill-card, .j-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ── 10. Section Title Word Split ─────────────────────────────── */
function initTitleSplit() {
  $$('.split-target').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((w, i) =>
      `<span class="sw" style="display:inline-block;overflow:hidden;margin-right:.28em">
         <span class="swi" style="display:inline-block;opacity:0;transform:translateY(110%);transition:opacity .7s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms,transform .7s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms">${w}</span>
       </span>`
    ).join('');
  });

  // Reveal split words when parent .ri gets .on
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.swi').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
        io2.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  $$('.split-target').forEach(el => io2.observe(el));
}

/* ── 11. Navbar (scroll + active section) ─────────────────────── */
function initNavbar() {
  const nav   = $('#navbar');
  const links = $$('.nav-link');
  const sects = $$('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
    $('#stt-btn')?.classList.toggle('on', window.scrollY > 450);
  }, { passive: true });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sects.forEach(s => io.observe(s));
}

/* ── 12. Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = $('#hamburger');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  const close = () => {
    btn.classList.remove('open'); menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mob-link').forEach(l => l.addEventListener('click', close));
}

/* ── 13. Scroll to Top ────────────────────────────────────────── */
function initScrollTop() {
  $('#stt-btn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 14. Journey Timeline Fill ────────────────────────────────── */
function initJourneyFill() {
  const fill = $('#j-fill');
  const wrap = $('#journey');
  if (!fill || !wrap) return;

  const update = () => {
    const r    = wrap.getBoundingClientRect();
    const vis  = Math.max(0, -r.top + window.innerHeight * 0.75);
    const pct  = Math.min(100, (vis / r.height) * 100);
    fill.style.height = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── 15. Contact Form ─────────────────────────────────────────── */
function initContactForm() {
  const form  = $('#contact-form');
  const stat  = $('#f-status');
  const btn   = $('#sub-btn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const txt = btn.querySelector('.sub-txt');
    const ico = btn.querySelector('.sub-ico');

    btn.style.pointerEvents = 'none';
    if (txt) txt.textContent = 'Sending…';
    if (ico) { ico.className = 'fas fa-spinner sub-ico'; ico.style.animation = 'spinBtn .8s linear infinite'; }

    try {
      const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        stat.className   = 'f-status ok';
        stat.textContent = '✅ Message sent! I\'ll get back to you soon.';
        form.reset();
      } else throw new Error();
    } catch {
      stat.className   = 'f-status err';
      stat.textContent = '❌ Something went wrong. Try emailing directly.';
    } finally {
      btn.style.pointerEvents = '';
      if (txt) txt.textContent = 'Send Message';
      if (ico) { ico.className = 'fas fa-paper-plane sub-ico'; ico.style.animation = ''; }
      setTimeout(() => { stat.textContent = ''; stat.className = 'f-status'; }, 6000);
    }
  });
}

/* ── 16. Three.js Background ──────────────────────────────────── */
function initThree() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog   = new THREE.FogExp2(0x070b17, 0.018);

  const cam = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
  cam.position.set(0, 4, 22);

  const ren = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  ren.setPixelRatio(Math.min(devicePixelRatio, 2));
  ren.setSize(innerWidth, innerHeight);

  // Grid
  const grid = new THREE.GridHelper(130, 65, 0x00d4ff, 0x7c3aed);
  grid.position.y = -6;
  grid.material.forEach(m => { m.opacity = 0.1; m.transparent = true; });
  scene.add(grid);

  // Particles
  const count = innerWidth < 768 ? 700 : 1300;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 120;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.04, color: 0x00d4ff,
    transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  let mx = 0, my = 0, sy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth)  * 2 - 1;
    my = -(e.clientY / innerHeight) * 2 + 1;
  }, { passive: true });
  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    pts.rotation.y = t * 0.035;
    pts.rotation.x = t * 0.012;
    grid.position.z = (t * 1.5) % 2;

    cam.position.x += (mx * 2   - cam.position.x) * 0.04;
    cam.position.y += (my * 2 + 4 - cam.position.y) * 0.04;
    cam.position.z  = 22 - (sy / Math.max(document.body.scrollHeight - innerHeight, 1)) * 10;
    cam.lookAt(0, 0, 0);
    ren.render(scene, cam);
  })();

  window.addEventListener('resize', () => {
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
    ren.setSize(innerWidth, innerHeight);
  });
}

/* ── Boot ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeroWords();
  initTyping();
  initMouseGlow();
  initSpotlight();
  initMagnetic();
  initRipple();
  initSkillColors();
  initTilt();
  initTitleSplit();
  initNavbar();
  initMobileMenu();
  initScrollTop();
  initJourneyFill();
  initContactForm();
  initThree();
});
