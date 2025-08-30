// UI and animations
document.addEventListener('DOMContentLoaded', function(){
  // AOS
  if (window.AOS) {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }

  // Bootstrap carousel tweaks
  try {
    const hero = document.getElementById('heroCarousel');
    if (hero && window.bootstrap && bootstrap.Carousel) {
      new bootstrap.Carousel(hero, { interval: 5000, ride: false, pause: 'hover', touch: true, wrap: true });
    }
  } catch (e) { /* noop */ }

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Navbar scrolled state + progress bar
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const onScroll = () => {
    if (navbar) { (window.scrollY > 50) ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'); }
    if (progress) {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progress.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Stats counters
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; const inc = target / (duration / 16); let cur = 0;
      const t = setInterval(() => { cur += inc; if (cur >= target) { cur = target; clearInterval(t); } counter.textContent = Math.floor(cur).toLocaleString(); }, 16);
    });
  }
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.unobserve(e.target); } });
    });
    obs.observe(statsSection);
  }

  // Loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  window.addEventListener('load', function(){
    if (!loadingOverlay) return;
    setTimeout(() => { loadingOverlay.style.opacity = '0'; setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500); }, 1200);
  });

  // GSAP niceties (if present)
  if (window.gsap) {
    gsap.timeline()
      .from('.hero-title', { duration: 1, y: 50, opacity: 0, delay: 0.5 })
      .from('.hero-subtitle', { duration: 1, y: 30, opacity: 0 }, '-=0.5')
      .from('.hero-buttons', { duration: 1, y: 30, opacity: 0 }, '-=0.5')
      .from('.hero-features', { duration: 1, y: 30, opacity: 0 }, '-=0.5');

    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mouseenter', function(){ gsap.to(this, { duration: 0.25, y: -8, scale: 1.01 }); });
      card.addEventListener('mouseleave', function(){ gsap.to(this, { duration: 0.25, y: 0, scale: 1 }); });
    });

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', function(){ gsap.to(this, { duration: 0.1, scale: 0.95, yoyo: true, repeat: 1 }); });
    });
  }

  // Extra UI in product modal (badges/specs)
  const modalEl = document.getElementById('productDetailsModal');
  const currencyToggle = document.querySelector('.currency-toggle');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', function(){
      if (currencyToggle) currencyToggle.classList.add('show');
      // Send scroll-to-top button behind the modal while open
      if (scrollTopBtn) {
        scrollTopBtn.dataset.prevZ = scrollTopBtn.style.zIndex || '';
        scrollTopBtn.dataset.prevPe = scrollTopBtn.style.pointerEvents || '';
        scrollTopBtn.style.zIndex = '100';
        scrollTopBtn.style.pointerEvents = 'none';
      }
      try {
        const body = document.getElementById('productDetailsModalBody'); if (!body) return;
        const right = body.querySelector('.col-md-7'); if (!right) return;
        if (!right.querySelector('.product-meta')) {
          const badges = document.createElement('div');
          badges.className = 'd-flex flex-wrap gap-2 mb-3 product-meta';
          badges.innerHTML = ['<span class="badge"><i class="fa-solid fa-leaf me-1"></i>Natural</span>', '<span class="badge"><i class="fa-solid fa-snowflake me-1"></i>Helado</span>', '<span class="badge"><i class="fa-solid fa-star me-1"></i>Top ventas</span>'].join('');
          const p = right.querySelector('p'); right.insertBefore(badges, p || right.firstChild);
        }
        if (!right.querySelector('.spec-list')) {
          const specs = document.createElement('ul'); specs.className = 'list-inline text-muted small mb-3 spec-list';
          specs.innerHTML = ['<li class="list-inline-item me-3"><i class="fa-solid fa-ice-cream me-1"></i> 1 bola</li>','<li class="list-inline-item me-3"><i class="fa-solid fa-weight-scale me-1"></i> 200 g</li>','<li class="list-inline-item"><i class="fa-solid fa-fire me-1"></i> 250 kcal</li>'].join('');
          const priceBlock = (right.querySelector('.product-price')||{}).parentElement || right.firstChild; right.insertBefore(specs, priceBlock);
        }
      } catch(e) { console.warn('Enhance product modal failed', e); }
    });
    modalEl.addEventListener('hidden.bs.modal', function(){
      if (currencyToggle) currencyToggle.classList.remove('show');
      if (scrollTopBtn) {
        scrollTopBtn.style.zIndex = scrollTopBtn.dataset.prevZ || '';
        scrollTopBtn.style.pointerEvents = scrollTopBtn.dataset.prevPe || '';
      }
    });
  }
});

