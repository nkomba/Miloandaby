/* ===================================================
   LeMar - Milo & Aby Resort | Main JavaScript
   Domain: lemarresort.com
   =================================================== */

'use strict';

/* --- Sticky Header --- */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* --- Mobile Navigation --- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* --- Active Nav Link --- */
(function () {
  const links = document.querySelectorAll('nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html') ||
        (current === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* --- Scroll Fade-Up Animations --- */
(function () {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* --- Gallery Lightbox --- */
(function () {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryItems.length) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let current = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt || ''
  }));

  function openLightbox(index) {
    current = index;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    current = (current - 1 + images.length) % images.length;
    lightboxImg.src = images[current].src;
  }

  function showNext() {
    current = (current + 1) % images.length;
    lightboxImg.src = images[current].src;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  prevBtn && prevBtn.addEventListener('click', showPrev);
  nextBtn && nextBtn.addEventListener('click', showNext);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* --- Smooth Anchor Scroll (same-page links) --- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* --- Newsletter Form --- */
(function () {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input || !input.value) return;
    btn.textContent = 'Thank You!';
    btn.style.background = '#2ecc71';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });
})();

/* --- Contact Form --- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent!';
    btn.style.background = '#2ecc71';
    btn.style.borderColor = '#2ecc71';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3000);
  });
})();

/* --- Booking Form --- */
(function () {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our reservations team will contact you within 24 hours.');
  });

  // Set min dates for check-in/out
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  if (checkIn && checkOut) {
    const today = new Date().toISOString().split('T')[0];
    checkIn.min = today;
    checkOut.min = today;
    checkIn.addEventListener('change', () => {
      checkOut.min = checkIn.value;
      if (checkOut.value && checkOut.value <= checkIn.value) {
        const next = new Date(checkIn.value);
        next.setDate(next.getDate() + 1);
        checkOut.value = next.toISOString().split('T')[0];
      }
    });
  }
})();

/* --- Parallax Effect on hero (subtle) --- */
(function () {
  const hero = document.querySelector('.hero-bg img');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.3;
    hero.style.transform = `translateY(${y}px) scale(1.05)`;
  }, { passive: true });
})();

/* --- Stats Counter Animation --- */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
