import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   PREMIUM PORTFOLIO — main.js
   ═══════════════════════════════════════════════════════════════ */

// ── Helpers ────────────────────────────────────────────────────
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. Reveal-on-scroll ────────────────────────────────────────
function initReveal() {
  const items = qsa('.reveal-item');

  items.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    el.style.transitionDelay = `${delay}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

// ── 2. Hero Word-by-word Reveal ────────────────────────────────
function initHeroWords() {
  const words = qsa('.hero-name .word');
  if (!words.length) return;
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('revealed'), 300 + i * 220);
  });
}

// ── 3. Typing Effect ───────────────────────────────────────────
function initTyping() {
  const el  = qs('.typing-text');
  if (!el) return;
  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Creative Coder',
    'Web Developer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 40);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 70);
    }
  }
  setTimeout(tick, 1200);
}

// ── 4. Mouse Glow ─────────────────────────────────────────────
function initMouseGlow() {
  if (prefersReducedMotion()) return;
  let raf;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      // Per-glass-card local glow
      qsa('.glass-card').forEach(card => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  });
}

// ── 5. Magnetic Buttons ────────────────────────────────────────
function initMagnetic() {
  if (prefersReducedMotion()) return;
  qsa('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const dx  = e.clientX - r.left - r.width  / 2;
      const dy  = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── 6. Skill Card Color Variables ─────────────────────────────
function initSkillColors() {
  qsa('.skill-card[data-color]').forEach(card => {
    const c = card.dataset.color;
    card.style.setProperty('--card-color', c);
    card.style.setProperty('--card-glow', c + '55');
  });
}

// ── 7. 3D Tilt on Skill & Project Cards ───────────────────────
function initTilt() {
  if (prefersReducedMotion()) return;
  const cards = qsa('.skill-card, .project-card, .timeline-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left, y  = e.clientY - r.top;
      const cx = r.width / 2,        cy = r.height / 2;
      const rx = ((y - cy) / cy) * -5;
      const ry = ((x - cx) / cx) *  5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── 8. Navbar — scroll blur + active section ──────────────────
function initNavbar() {
  const nav    = qs('.navbar');
  const links  = qsa('.nav-link');
  const sects  = qsa('section[id]');

  // Scroll blur
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    // Scroll-to-top button
    const btn = qs('.scroll-top-btn');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Active section via IO
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sects.forEach(s => io.observe(s));
}

// ── 9. Mobile Hamburger Menu ───────────────────────────────────
function initMobileMenu() {
  const btn  = qs('#hamburger');
  const menu = qs('#mobile-menu');
  const mobileLinks = qsa('.mobile-link');
  if (!btn || !menu) return;

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
}

// ── 10. Scroll-to-Top Button ───────────────────────────────────
function initScrollTop() {
  const btn = qs('#scroll-top-btn');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── 11. Contact Form ───────────────────────────────────────────
function initContactForm() {
  const form   = qs('#contact-form');
  const status = qs('#form-status');
  const submit = qs('#submit-btn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const txt  = submit.querySelector('.btn-txt');
    const icon = submit.querySelector('.btn-icon');

    // Loading state
    submit.classList.add('loading');
    if (txt)  txt.textContent = 'Sending…';
    if (icon) icon.className  = 'fas fa-spinner fa-spin btn-icon';

    try {
      const res  = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await res.json();

      if (data.success) {
        status.className   = 'form-status success';
        status.textContent = '✅ Message sent! I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error('Failed');
      }
    } catch {
      status.className   = 'form-status error';
      status.textContent = '❌ Something went wrong. Please try emailing directly.';
    } finally {
      submit.classList.remove('loading');
      if (txt)  txt.textContent = 'Send Message';
      if (icon) icon.className  = 'fas fa-paper-plane btn-icon';
      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 6000);
    }
  });
}

// ── 12. Three.js Background ────────────────────────────────────
function initThreeJS() {
  const canvas = qs('#bg-canvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  scene.fog      = new THREE.FogExp2(0x03070f, 0.018);

  const camera   = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 22);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  // Grid
  const grid = new THREE.GridHelper(120, 60, 0x06b6d4, 0x8b5cf6);
  grid.position.y = -6;
  grid.material.forEach(m => { m.opacity = 0.12; m.transparent = true; });
  scene.add(grid);

  // Particles
  const count    = window.innerWidth < 768 ? 800 : 1400;
  const geo      = new THREE.BufferGeometry();
  const pos      = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 110;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.045, color: 0x06b6d4,
    transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Mouse parallax
  let mx = 0, my = 0, tx = 0, ty = 0, scrollY = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth)  * 2 - 1;
    my = -(e.clientY / innerHeight) * 2 + 1;
  }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;
    grid.position.z = (t * 1.5) % 2;

    tx = mx * 2; ty = my * 2 + 4;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;

    const prog = scrollY / Math.max(document.body.scrollHeight - innerHeight, 1);
    camera.position.z = 22 - prog * 10;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

// ── 13. Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeroWords();
  initTyping();
  initMouseGlow();
  initMagnetic();
  initSkillColors();
  initTilt();
  initNavbar();
  initMobileMenu();
  initScrollTop();
  initContactForm();
  initThreeJS();
});
