/* ===========================
   COB RUN — JAVASCRIPT
   =========================== */

// ---- LOGO: REMOVE FUNDO ESCURO VIA CANVAS ----
function removeLogoBg(imgEl) {
  const process = (src) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tmp = new Image();
    tmp.crossOrigin = 'anonymous';
    tmp.onload = () => {
      canvas.width  = tmp.naturalWidth;
      canvas.height = tmp.naturalHeight;
      ctx.drawImage(tmp, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        // Pega a cor do canto superior esquerdo como cor de fundo
        const bgR = d[0], bgG = d[1], bgB = d[2];
        const tol = 40; // tolerância de cor (0-255)
        for (let i = 0; i < d.length; i += 4) {
          const diff = Math.abs(d[i]-bgR) + Math.abs(d[i+1]-bgG) + Math.abs(d[i+2]-bgB);
          if (diff < tol * 3) {
            // Feathering suave nas bordas
            const alpha = Math.min(255, Math.round((diff / (tol * 3)) * 255));
            d[i+3] = alpha;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        imgEl.src = canvas.toDataURL('image/png');
        // Remove CSS blend após processamento — já tem transparência real
        imgEl.style.mixBlendMode = 'normal';
        imgEl.style.filter = 'drop-shadow(0 0 16px rgba(100,181,246,0.3))';
      } catch {
        // Fallback silencioso se canvas não tiver acesso (file://)
      }
    };
    tmp.src = src;
  };

  if (imgEl.complete && imgEl.naturalWidth) {
    process(imgEl.src);
  } else {
    imgEl.addEventListener('load', () => process(imgEl.src));
  }
}

// Aplica em todas as logos da página
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav__logo-img, .hero__logo-img, .footer__logo-img').forEach(removeLogoBg);
});

// ---- NAV SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  // Anima hamburguer → X
  hamburger.classList.toggle('active', isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Fechar menu ao clicar fora
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ---- REVEAL ON SCROLL ----
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
reveals.forEach(el => observer.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const vals = entry.target.querySelectorAll('.numero__val');
        vals.forEach(v => animateCounter(v, parseInt(v.dataset.target)));
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const numerosSection = document.getElementById('numeros');
if (numerosSection) counterObserver.observe(numerosSection);

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--sky)' : '';
  });
});

// ---- SLIDESHOW SOBRE ----
(function initSobreSlideshow() {
  const slides = document.querySelectorAll('#sobreSlideshow .sobre__slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('sobre__slide--active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('sobre__slide--active');
  }, 4000);
})();

// ---- PARALLAX HERO LINES (só desktop) ----
if (window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.hero__bg').forEach(bg => {
      bg.style.transform = `translateY(${y * 0.3}px)`;
    });
  });
}
