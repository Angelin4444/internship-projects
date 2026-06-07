/* ────────────THEME TOGGLE FUNCTIONALITY
   Handles dark/light mode switching with localStorage persistence─────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Set theme function - updates DOM and saves to localStorage
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('nexus-theme', theme);
}

// Load saved theme from localStorage or default to dark
const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
setTheme(savedTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});


/* ─────────────────CUSTOM CURSOR───────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

// Move main cursor instantly with mouse
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Follower lags behind for smooth effect using linear interpolation
function animateCursor() {
  fx += (mouseX - fx) * 0.12;  // Smooth follow with 0.12 factor
  fy += (mouseY - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
 requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements (links, buttons, cards)
document.querySelectorAll('a, button, .feature-card, .testi-card, .pricing-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform    = 'translate(-50%,-50%) scale(2)';  // Enlarge cursor
    follower.style.transform  = 'translate(-50%,-50%) scale(1.4)';  // Enlarge follower
    follower.style.opacity    = '0.7';  // Increase opacity
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform    = 'translate(-50%,-50%) scale(1)';  // Reset size
    follower.style.transform  = 'translate(-50%,-50%) scale(1)';  // Reset size
    follower.style.opacity    = '0.4';  // Reset opacity
  });
});


/* ─────────────────────. NAVBAR SCROLL EFFECT──────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ───────────────── HAMBURGER / MOBILE NAVBAR TOGGLE──────────────────── */
const hamburger= document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


/* ────────────────────── PARTICLES CANVAS ANIMATION────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  // Resize canvas to fill container
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Particle constructor
  function Particle() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.3;  // Radius
    this.vx   = (Math.random() - 0.5) * 0.4;  // Velocity X
    this.vy   = (Math.random() - 0.5) * 0.4;  // Velocity Y
    this.life = Math.random();  // For fade in/out effect
  }

  // Initialize particles array
  function initP() {
    particles = Array.from({ length: 90 }, () => new Particle());
  }

  // Draw and update particles
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Accent color based on theme
    const isDark = html.getAttribute('data-theme') !== 'light';
    const col    = isDark ? '0,229,255' : '0,100,200';

    // Update and draw each particle
    particles.forEach(p => {
      p.x  += p.vx; p.y += p.vy; p.life += 0.004;
      // Respawn particle when it fades out
      if (p.life > 1) { p.x = Math.random() * W; p.y = Math.random() * H; p.life = 0; }
      // Bounce off walls
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const alpha = Math.sin(p.life * Math.PI) * 0.55;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${alpha})`;
      ctx.fill();
    });

    // Draw faint connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${col},${(1 - d / 120) * 0.12})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  // Initialize and start animation
 resize();
  initP();
  draw();
  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });
})();


/* ────────────────────────────────────────
   COUNTER ANIMATION
   ──────────────────────────────────────── */
function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const duration = 2000;
  const decimals = target % 1 !== 0 ? 1 : 0;
  const start    = performance.now();

  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);  // Cubic easing
    el.textContent = (target * ease).toFixed(decimals);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals);
  }
 requestAnimationFrame(update);
}

// Trigger stats animation when hero section is visible
const statsEls = document.querySelectorAll('.stat-num');
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); statsObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
statsEls.forEach(el => statsObs.observe(el));


/* ────────────────────────────────────────
   REVEAL ON SCROLL
   ──────────────────────────────────────── */
const reveals    = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => revealObs.observe(el));


/* ────────────────────────────────────────
    FEATURE CARD MOUSE GLOW
   ──────────────────────────────────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top)  + 'px');
  });
});


/* ────────────────────────────────────────
    BILLING TOGGLE (PRICING)
   ──────────────────────────────────────── */
const billingToggle = document.getElementById('billingToggle');
const priceAmounts  = document.querySelectorAll('.price-amount[data-monthly]');

// Update prices with animated transition
function updatePrices(annual) {
  priceAmounts.forEach(el => {
    const target = parseInt(annual ? el.dataset.annual : el.dataset.monthly);
    const start  = performance.now();
    const from   = parseInt(el.textContent) || 0;
    const dur    = 400;
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
      el.textContent = v;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

billingToggle && billingToggle.addEventListener('change', e => {
  updatePrices(e.target.checked);
});


/* ────────────────────────────────────────
  SMOOTH ANCHOR SCROLL
   ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────
   ACTIVE NAVLINK HIGHLIGHT ON SCROLL
   ──────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}`
          ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));