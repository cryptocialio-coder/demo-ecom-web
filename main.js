// main.js — HDR Sports interactive logic

// ─── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

// ─── HAMBURGER ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── SCROLL REVEAL ─────────────────────────────────────────
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ─── MOQ PRICE TIERS ───────────────────────────────────────
function getMoqTiers(moq) {
  const base = moq || 25;
  const tier2 = Math.round(base * 2.5);
  const tier3 = Math.round(base * 6);
  return [
    { label: `${base}–${tier2 - 1} pcs`, badge: 'Standard', color: '#888' },
    { label: `${tier2}–${tier3 - 1} pcs`, badge: 'Bulk -8%', color: '#C9A23A' },
    { label: `${tier3}+ pcs`, badge: 'Wholesale -15%', color: '#FFD700' },
  ];
}

// ─── PRODUCT CARD BUILDER ──────────────────────────────────
function buildProductCard(product, linkToDetail = true, showTiers = false) {
  const el = document.createElement('div');
  el.className = 'product-card';

  const href = `product.html?id=${product.id}`;
  const tiers = getMoqTiers(product.moq);

  const tiersHtml = showTiers ? `
    <div class="product-price-tiers">
      ${tiers.map(t => `
        <div class="price-tier">
          <span class="price-tier-badge" style="color:${t.color}">${t.badge}</span>
          <span class="price-tier-range">${t.label}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  el.innerHTML = `
    <a href="${linkToDetail ? href : '#'}" class="product-card-inner">
      <div class="product-img-wrap">
        <div class="product-img-placeholder">${product.emoji || '🏏'}</div>
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        <div class="product-overlay-gradient"></div>
        <div class="product-card-content">
          <div class="product-cat-label">${getCategoryName(product.category)}</div>
          <h3 class="product-card-name">${product.name}</h3>
          <p class="product-card-tagline">${product.tagline || ''}</p>
          ${tiersHtml}
        </div>
      </div>
    </a>
  `;

  return el;
}

function getCategoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

// ─── HOME PAGE: FEATURED PRODUCTS ──────────────────────────
function initFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;

  // Prioritize "Best Seller" tagged products, fill up to 6
  const bestSellers = PRODUCTS.filter(p => p.tag === 'Best Seller');
  const others = PRODUCTS.filter(p => p.tag !== 'Best Seller');
  const featured = [...bestSellers, ...others].slice(0, 6);

  featured.forEach((p, i) => {
    const card = buildProductCard(p, true, true);
    card.style.animationDelay = `${i * 0.08}s`;
    card.classList.add('reveal');
    grid.appendChild(card);
  });
  setupReveal();
}

// ─── HOME PAGE: CATEGORIES ─────────────────────────────────
const CATEGORY_SVG = {
  bats: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="batGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8B4513;stop-opacity:1"/><stop offset="100%" style="stop-color:#D2691E;stop-opacity:1"/></linearGradient></defs>
    <rect x="88" y="20" width="24" height="110" rx="4" fill="url(#batGrad)" opacity="0.9"/>
    <ellipse cx="100" cy="140" rx="30" ry="38" fill="url(#batGrad)" opacity="0.95"/>
    <rect x="96" y="155" width="8" height="30" rx="4" fill="#5C2D0A" opacity="0.8"/>
    <line x1="100" y1="130" x2="100" y2="180" stroke="#C9A23A" stroke-width="0.5" opacity="0.4"/>
    <ellipse cx="100" cy="108" rx="5" ry="2" fill="#C9A23A" opacity="0.6"/>
  </svg>`,
  balls: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="ballGrad" cx="40%" cy="35%"><stop offset="0%" style="stop-color:#cc3333"/><stop offset="100%" style="stop-color:#8B0000"/></radialGradient></defs>
    <circle cx="100" cy="100" r="65" fill="url(#ballGrad)" opacity="0.95"/>
    <path d="M60 60 Q100 45 140 60" stroke="#8B0000" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M45 100 Q100 85 155 100" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M60 140 Q100 155 140 140" stroke="#8B0000" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M55 75 Q52 100 55 125" stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M145 75 Q148 100 145 125" stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/>
    <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  </svg>`,
  gloves: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gloveGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2D5A27"/><stop offset="100%" style="stop-color:#1a3a18"/></linearGradient></defs>
    <path d="M70 160 L70 90 Q70 75 80 75 L82 75 L82 55 Q82 45 90 45 Q98 45 98 55 L98 75 L102 75 L102 50 Q102 40 110 40 Q118 40 118 50 L118 75 L122 75 L122 58 Q122 48 130 48 Q138 48 138 58 L138 78 Q148 80 148 95 L148 140 Q148 160 130 165 L85 165 Q70 162 70 160Z" fill="url(#gloveGrad)" opacity="0.9"/>
    <path d="M70 110 Q60 112 58 120 Q56 130 65 135 L70 135" fill="url(#gloveGrad)" opacity="0.8"/>
    <line x1="82" y1="75" x2="82" y2="165" stroke="rgba(201,162,58,0.3)" stroke-width="1"/>
    <line x1="102" y1="75" x2="102" y2="165" stroke="rgba(201,162,58,0.3)" stroke-width="1"/>
    <line x1="122" y1="75" x2="122" y2="165" stroke="rgba(201,162,58,0.3)" stroke-width="1"/>
    <rect x="68" y="150" width="82" height="18" rx="9" fill="#C9A23A" opacity="0.7"/>
  </svg>`,
  wicketkeeping: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="wkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1A3A5C"/><stop offset="100%" style="stop-color:#0d2040"/></linearGradient></defs>
    <path d="M50 165 L55 80 Q60 50 100 48 Q140 50 145 80 L150 165Z" fill="url(#wkGrad)" opacity="0.9"/>
    <path d="M55 80 Q60 50 100 48 Q140 50 145 80" fill="none" stroke="#C9A23A" stroke-width="2" opacity="0.6"/>
    <circle cx="100" cy="95" r="28" fill="none" stroke="rgba(201,162,58,0.4)" stroke-width="8"/>
    <circle cx="100" cy="95" r="18" fill="rgba(201,162,58,0.12)"/>
    <line x1="50" y1="130" x2="150" y2="130" stroke="rgba(201,162,58,0.3)" stroke-width="1.5"/>
    <line x1="52" y1="150" x2="148" y2="150" stroke="rgba(201,162,58,0.3)" stroke-width="1.5"/>
    <path d="M72 48 L68 30 M100 48 L100 28 M128 48 L132 30" stroke="#C9A23A" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  </svg>`,
  pads: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="padGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#4A4A4A"/><stop offset="100%" style="stop-color:#2a2a2a"/></linearGradient></defs>
    <rect x="65" y="30" width="70" height="145" rx="18" fill="url(#padGrad)" opacity="0.9"/>
    <ellipse cx="100" cy="90" rx="28" ry="32" fill="rgba(201,162,58,0.15)" stroke="#C9A23A" stroke-width="1.5" opacity="0.8"/>
    <rect x="72" y="130" width="56" height="12" rx="6" fill="rgba(201,162,58,0.2)" stroke="#C9A23A" stroke-width="1" opacity="0.7"/>
    <rect x="72" y="148" width="56" height="10" rx="5" fill="rgba(201,162,58,0.2)" stroke="#C9A23A" stroke-width="1" opacity="0.7"/>
    <line x1="100" y1="35" x2="100" y2="170" stroke="rgba(201,162,58,0.2)" stroke-width="1"/>
    <rect x="75" y="38" width="50" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
  </svg>`,
  kits: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="kitGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#C9A23A"/><stop offset="100%" style="stop-color:#8B6914"/></linearGradient></defs>
    <rect x="35" y="85" width="130" height="90" rx="10" fill="url(#kitGrad)" opacity="0.85"/>
    <rect x="35" y="85" width="130" height="22" rx="10" fill="#8B6914" opacity="0.9"/>
    <path d="M80 85 L80 68 Q80 55 100 55 Q120 55 120 68 L120 85" fill="none" stroke="#C9A23A" stroke-width="4" stroke-linecap="round"/>
    <rect x="88" y="107" width="24" height="18" rx="4" fill="rgba(0,0,0,0.3)"/>
    <rect x="92" y="111" width="16" height="10" rx="2" fill="rgba(201,162,58,0.5)"/>
    <line x1="60" y1="130" x2="140" y2="130" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
    <line x1="60" y1="148" x2="140" y2="148" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
    <rect x="42" y="92" width="6" height="70" rx="3" fill="rgba(0,0,0,0.15)"/>
    <rect x="152" y="92" width="6" height="70" rx="3" fill="rgba(0,0,0,0.15)"/>
  </svg>`,
};

function initCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  CATEGORIES.forEach((cat, i) => {
    const el = document.createElement('div');
    el.className = 'cat-card reveal';
    el.style.animationDelay = `${i * 0.08}s`;
    const svgImg = CATEGORY_SVG[cat.slug] || `<span class="cat-emoji">${cat.emoji}</span>`;
    el.innerHTML = `
      <a href="products.html?category=${cat.slug}" class="cat-card-inner">
        <div class="cat-img-wrap" style="background:linear-gradient(135deg,rgba(${hexToRgb(cat.color)},0.18),rgba(0,0,0,0.7))">
          <div class="cat-svg-art">${svgImg}</div>
          <div class="product-overlay-gradient"></div>
          <span class="product-tag">${cat.productCount}+ Products</span>
          <div class="cat-card-content">
            <h3>${cat.name}</h3>
            <p>${cat.description}</p>
          </div>
        </div>
      </a>
    `;
    grid.appendChild(el);
  });
  setupReveal();
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── CONTACT FORM ──────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
  }
}

function resetForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    form.reset();
    form.style.display = 'block';
    success.style.display = 'none';
  }
}

// ─── PRODUCTS CATALOG PAGE ─────────────────────────────────
let currentCategory = 'all';

function initCatalog(initialCat = 'all') {
  currentCategory = initialCat;
  buildCategoryFilters();
  renderCatalogGrid();
  setupReveal();
}

function buildCategoryFilters() {
  const container = document.getElementById('catalog-filters');
  if (!container) return;

  // Clear then rebuild
  container.innerHTML = `<button class="filter-btn ${currentCategory === 'all' ? 'active' : ''}" data-cat="all" onclick="setCatalogCategory('all')">All Products</button>`;

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${currentCategory === cat.id ? 'active' : ''}`;
    btn.dataset.cat = cat.id;
    btn.textContent = cat.name;
    btn.onclick = () => setCatalogCategory(cat.id);
    container.appendChild(btn);
  });
}

function setCatalogCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderCatalogGrid();
}

function filterProducts() {
  renderCatalogGrid();
}

function resetFilters() {
  currentCategory = 'all';
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === 'all');
  });
  const si = document.getElementById('search-input');
  if (si) si.value = '';
  renderCatalogGrid();
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('empty-state');
  const countLabel = document.getElementById('count-label');
  if (!grid) return;

  const query = (document.getElementById('search-input')?.value || '').toLowerCase().trim();

  let filtered = PRODUCTS.filter(p => {
    const matchCat = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tagline || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  if (countLabel) countLabel.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  if (empty) empty.style.display = 'none';

  filtered.forEach((p, i) => {
    const card = buildProductCard(p, true, true);
    card.style.animationDelay = `${i * 0.05}s`;
    card.classList.add('catalog-card-anim');
    grid.appendChild(card);
  });

  // trigger animation
  requestAnimationFrame(() => {
    grid.querySelectorAll('.catalog-card-anim').forEach(el => el.classList.add('visible-anim'));
  });
}

// ─── PRODUCT DETAIL PAGE ───────────────────────────────────
let currentProduct = null;
let currentImageIndex = 0;
const PLACEHOLDER_IMAGES = [];

function initProductDetail(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    document.getElementById('pd-title').textContent = 'Product not found.';
    return;
  }

  currentProduct = product;
  currentImageIndex = 0;

  // Update page title
  document.title = `${product.name} — HDR Sports`;

  // Breadcrumb
  const bcName = document.getElementById('pd-breadcrumb-name');
  if (bcName) bcName.textContent = product.name;

  // Tag
  const tagEl = document.getElementById('pd-tag');
  if (tagEl) {
    if (product.tag) { tagEl.textContent = product.tag; tagEl.style.display = 'inline-block'; }
    else tagEl.style.display = 'none';
  }

  // Category
  const catEl = document.getElementById('pd-category');
  if (catEl) catEl.textContent = getCategoryName(product.category);

  // Title
  document.getElementById('pd-title').textContent = product.name;

  // Tagline
  const tl = document.getElementById('pd-tagline');
  if (tl) tl.textContent = product.tagline || '';

  // Description
  const desc = document.getElementById('pd-desc');
  if (desc) desc.textContent = product.description || '';

  // Specs
  const specsEl = document.getElementById('pd-specs');
  if (specsEl && product.specs && product.specs.length) {
    specsEl.innerHTML = product.specs.map(s => `
      <div class="spec-row">
        <span class="spec-label">${s.label}</span>
        <span class="spec-value">${s.value}</span>
      </div>
    `).join('');
  }

  // MOQ
  const moqEl = document.getElementById('pd-moq');
  if (moqEl) moqEl.textContent = `${product.moq || 25} pcs`;

  // Price tiers
  const tiersGrid = document.getElementById('pd-tiers-grid');
  if (tiersGrid) {
    const tiers = getMoqTiers(product.moq);
    const tierColors = ['#888', '#C9A23A', '#FFD700'];
    const tierDesc = ['Standard Rate', 'Bulk Discount', 'Wholesale'];
    tiersGrid.innerHTML = tiers.map((t, idx) => `
      <div class="pd-tier-card ${idx === 1 ? 'pd-tier-featured' : ''}">
        <div class="pd-tier-badge" style="color:${tierColors[idx]}">${tierDesc[idx]}</div>
        <div class="pd-tier-range">${t.label}</div>
        <div class="pd-tier-discount" style="color:${tierColors[idx]}">${idx === 0 ? 'Base Price' : idx === 1 ? 'Save ~8%' : 'Save ~15%'}</div>
      </div>
    `).join('');
  }

  // Gallery — use emoji placeholder since no real images
  setupProductGallery(product);

  // Related products
  setupRelatedProducts(product);

  // Modal product name
  const mpn = document.getElementById('modal-product-name');
  if (mpn) mpn.textContent = product.name;

  const mpb = document.getElementById('modal-product-banner');
  if (mpb) mpb.innerHTML = `
    <div class="w-1 h-10 bg-gold rounded-full shrink-0" style="width:4px;background:#C9A23A;border-radius:4px;flex-shrink:0"></div>
    <div>
      <div style="font-size:11px;font-family:'Oswald',sans-serif;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#C9A23A">Configuring</div>
      <div style="font-size:14px;color:#fff;font-weight:600">${product.name}</div>
    </div>
  `;

  setupReveal();
}

function setupProductGallery(product) {
  const mainImg = document.getElementById('pd-main-img');
  const placeholder = document.getElementById('pd-img-placeholder');
  const thumbs = document.getElementById('pd-thumbs');
  const prevBtn = document.getElementById('pd-prev');
  const nextBtn = document.getElementById('pd-next');

  if (!mainImg) return;

  const hasImages = product.images && product.images.length > 0;

  if (hasImages) {
    mainImg.src = product.images[0];
    mainImg.alt = product.name;
    mainImg.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    if (product.images.length > 1) {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';

      if (thumbs) {
        thumbs.innerHTML = '';
        product.images.forEach((src, i) => {
          const t = document.createElement('button');
          t.className = `pd-thumb ${i === 0 ? 'active' : ''}`;
          t.innerHTML = `<img src="${src}" alt="Image ${i + 1}" />`;
          t.onclick = () => setProductImage(i);
          thumbs.appendChild(t);
        });
      }
    }
  } else {
    mainImg.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'flex';
      placeholder.textContent = product.emoji || '🏏';
    }
  }
}

function changeImage(dir) {
  if (!currentProduct || !currentProduct.images) return;
  const len = currentProduct.images.length;
  currentImageIndex = (currentImageIndex + dir + len) % len;
  setProductImage(currentImageIndex);
}

function setProductImage(index) {
  currentImageIndex = index;
  const mainImg = document.getElementById('pd-main-img');
  if (mainImg && currentProduct.images[index]) {
    mainImg.src = currentProduct.images[index];
  }
  document.querySelectorAll('.pd-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

function setupRelatedProducts(product) {
  const section = document.getElementById('related-section');
  const grid = document.getElementById('related-grid');
  if (!section || !grid) return;

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  if (related.length === 0) { section.style.display = 'none'; return; }

  section.style.display = 'block';
  related.forEach(p => grid.appendChild(buildProductCard(p)));
}

// ─── ORDER MODAL ───────────────────────────────────────────
let modalStep = 0;

function openOrderModal() {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('order-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  setModalStep(0);
}

function closeOrderModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.getElementById('order-modal').classList.remove('active');
  document.body.style.overflow = '';
  modalStep = 0;
}

function setModalStep(step) {
  modalStep = step;
  const TOTAL = 3;
  for (let i = 0; i < TOTAL; i++) {
    const sc = document.getElementById(`modal-step-${i}`);
    if (sc) sc.style.display = i === step ? 'block' : 'none';

    const ms = document.getElementById(`ms-${i}`);
    if (ms) {
      ms.classList.toggle('active', i === step);
      ms.classList.toggle('done', i < step);
    }
    const sl = document.getElementById(`sl-${i}`);
    if (sl) sl.classList.toggle('done', i < step);
  }
  const success = document.getElementById('modal-success');
  if (success) success.classList.remove('visible');

  const footer = document.getElementById('modal-footer');
  if (footer) footer.style.display = step < TOTAL ? 'flex' : 'none';

  const backBtn = document.getElementById('modal-back-btn');
  const nextBtn = document.getElementById('modal-next-btn');
  if (backBtn) backBtn.textContent = step === 0 ? 'Cancel' : 'Back';
  if (nextBtn) {
    if (step < 2) {
      nextBtn.innerHTML = `Continue <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else {
      nextBtn.innerHTML = 'Submit Inquiry';
    }
  }
}

function modalBack() {
  if (modalStep === 0) closeOrderModal();
  else setModalStep(modalStep - 1);
}

function modalNext() {
  if (modalStep === 0) {
    // Basic validation
    const fn = document.getElementById('m-firstName')?.value.trim();
    const ln = document.getElementById('m-lastName')?.value.trim();
    const em = document.getElementById('m-email')?.value.trim();
    const co = document.getElementById('m-country')?.value;
    const qty = document.getElementById('m-quantity')?.value;

    if (!fn || !ln || !em || !co || !qty) {
      alert('Please fill in all required fields (First Name, Last Name, Email, Country, Quantity).');
      return;
    }
    setModalStep(1);
  } else if (modalStep === 1) {
    populateReview();
    setModalStep(2);
  } else if (modalStep === 2) {
    submitModal();
  }
}

function populateReview() {
  const fn = document.getElementById('m-firstName')?.value.trim() || '';
  const ln = document.getElementById('m-lastName')?.value.trim() || '';
  const company = document.getElementById('m-company')?.value.trim() || '';
  const email = document.getElementById('m-email')?.value.trim() || '';
  const phone = document.getElementById('m-phone')?.value.trim() || '';
  const country = document.getElementById('m-country')?.value || '';
  const qty = document.getElementById('m-quantity')?.value || '';
  const timeline = document.getElementById('m-timeline')?.value || '';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('rv-name', `${fn} ${ln}`);
  set('rv-email', email);
  set('rv-country', country);
  set('rv-product', currentProduct ? currentProduct.name : '—');
  set('rv-qty', qty ? `${qty} pcs` : '—');

  const compRow = document.getElementById('rv-company-row');
  if (compRow) compRow.style.display = company ? 'flex' : 'none';
  set('rv-company', company);

  const phoneRow = document.getElementById('rv-phone-row');
  if (phoneRow) phoneRow.style.display = phone ? 'flex' : 'none';
  set('rv-phone', phone);

  const tlRow = document.getElementById('rv-timeline-row');
  if (tlRow) tlRow.style.display = timeline ? 'flex' : 'none';
  set('rv-timeline', timeline);
}

function submitModal() {
  // Simulate submission
  const nextBtn = document.getElementById('modal-next-btn');
  if (nextBtn) {
    nextBtn.innerHTML = `<span style="display:inline-block;width:16px;height:16px;border:2px solid #000;border-top-color:transparent;border-radius:50%;animation:spin 0.7s linear infinite"></span> Submitting…`;
    nextBtn.disabled = true;
  }

  setTimeout(() => {
    for (let i = 0; i < 3; i++) {
      const sc = document.getElementById(`modal-step-${i}`);
      if (sc) sc.style.display = 'none';
    }
    const success = document.getElementById('modal-success');
    if (success) success.classList.add('visible');
    const footer = document.getElementById('modal-footer');
    if (footer) footer.style.display = 'none';

    if (nextBtn) { nextBtn.disabled = false; }
  }, 1200);
}

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  initFeaturedProducts();
  initCategories();
});
