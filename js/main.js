/* ============================================================
   HARDWOOD & CARPET CENTER — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navigation Scroll Behavior ---- */
  const nav = document.querySelector('.nav');
  const navHamburger = document.querySelector('.nav__hamburger');
  const navMobile = document.querySelector('.nav__mobile');

  if (nav) {
    const updateNav = () => {
      const isScrolled = window.scrollY > 40;
      nav.classList.toggle('nav--scrolled', isScrolled);
      nav.classList.toggle('nav--transparent', !isScrolled);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  /* ---- Mobile Menu Toggle ---- */
  if (navHamburger && navMobile) {
    navHamburger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navHamburger.classList.toggle('open', isOpen);
      navHamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link or CTA click
    navMobile.querySelectorAll('.nav__mobile-link, .nav__mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navHamburger.classList.remove('open');
        navHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navHamburger.classList.remove('open');
        navHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Hero Background Ken Burns ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Gallery Filter (gallery.html) ---- */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-full-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
          if (show) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.3s, transform 0.3s';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          }
        });
      });
    });
  }

  /* ---- Lightbox (gallery.html) ---- */
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbTag        = document.getElementById('lightboxTag');
  const lbTitle      = document.getElementById('lightboxTitle');
  const lbCounter    = document.getElementById('lightboxCounter');
  const lbClose      = document.getElementById('lightboxClose');
  const lbBackdrop   = document.getElementById('lightboxBackdrop');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');

  if (lightbox && galleryItems.length) {
    let current = 0;
    let visibleItems = () => [...galleryItems].filter(el => el.style.display !== 'none');

    function openLightbox(index) {
      const items = visibleItems();
      current = index;
      const item = items[current];
      const img  = item.querySelector('img');
      lbImg.src        = img.src;
      lbImg.alt        = img.alt;
      lbTag.textContent   = item.querySelector('.gallery-full-item__tag')?.textContent  || '';
      lbTitle.textContent = item.querySelector('.gallery-full-item__title')?.textContent || '';
      lbCounter.textContent = `${current + 1} / ${items.length}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      const items = visibleItems();
      current = (current + dir + items.length) % items.length;
      const item = items[current];
      const img  = item.querySelector('img');
      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src           = img.src;
        lbImg.alt           = img.alt;
        lbTag.textContent   = item.querySelector('.gallery-full-item__tag')?.textContent  || '';
        lbTitle.textContent = item.querySelector('.gallery-full-item__title')?.textContent || '';
        lbCounter.textContent = `${current + 1} / ${items.length}`;
        lbImg.style.opacity = '1';
      }, 180);
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const idx = visibleItems().indexOf(item);
        if (idx !== -1) openLightbox(idx);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => navigate(-1));
    lbNext.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });
  }

  /* ---- Estimate Form (Netlify Forms) ---- */
  const estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    estimateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = estimateForm.querySelector('.form-submit');
      const successMsg = document.getElementById('formSuccess');

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(estimateForm)).toString()
        });

        if (!response.ok) throw new Error('Submission failed');

        estimateForm.reset();
        if (successMsg) {
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => successMsg.classList.remove('visible'), 6000);
        }
      } catch (err) {
        alert('Something went wrong. Please try again or call us at (678) 982-5327.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
    });
  }

  /* ---- Counter Animation (stats section) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start = performance.now();

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const value = Math.round(eased * target);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
