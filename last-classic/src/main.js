/* =========================================================
   LAST CLASSIC — FASHION
   Lógica de la tienda (UX Apple)
   ========================================================= */

import './style.css';
import {
  createIcons,
  Truck,
  LockKeyhole,
  RotateCcw,
  Search,
  X,
  Menu,
  User,
  Heart,
  ShoppingBag,
  ArrowRight,
  SearchX,
  Leaf,
  Scissors,
  Sparkles,
  ShieldCheck,
  Headset,
  Mail,
  Check,
  Camera,
  Music2,
  Pin,
  Rss,
  Plus,
  Minus,
  Trash2,
  Sun,
  Moon,
} from 'lucide';

/* =========================================================
   01. UTILIDADES
   ========================================================= */
const STORAGE = {
  cart: 'lc:cart',
  wish: 'lc:wish',
  theme: 'lc:theme',
};

const SHIPPING_THRESHOLD = 250000;
const SHIPPING_COST = 12000;

const CURRENCY = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatPrice = (value) => CURRENCY.format(value).replace(/\s/g, ' ');

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const debounce = (fn, wait = 160) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

const state = {
  filter: 'todos',
  query: '',
  cart: readStorage(STORAGE.cart, []),
  wish: readStorage(STORAGE.wish, []),
  theme: (() => {
    try {
      return localStorage.getItem(STORAGE.theme);
    } catch {
      return null;
    }
  })(),
};

const products = $$('.product');

/* =========================================================
   02. ICONOS
   ========================================================= */
const icons = {
  Truck,
  LockKeyhole,
  RotateCcw,
  Search,
  X,
  Menu,
  User,
  Heart,
  ShoppingBag,
  ArrowRight,
  SearchX,
  Leaf,
  Scissors,
  Sparkles,
  ShieldCheck,
  Headset,
  Mail,
  Check,
  Camera,
  Music2,
  Pin,
  Rss,
  Plus,
  Minus,
  Trash2,
  Sun,
  Moon,
};

const renderIcons = () => createIcons({ icons });

/* =========================================================
   03. TEMA (DARK/LIGHT)
   ========================================================= */
function applyTheme(theme) {
  const t = theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(STORAGE.theme, t);
  } catch {}
  state.theme = t;
}

function initTheme() {
  const btn = $('#themeBtn');
  applyTheme(state.theme);
  btn?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE.theme)) applyTheme(e.matches ? 'dark' : 'light');
  });
}

/* =========================================================
   04. IMÁGENES: FADE-IN + SKELETON
   ========================================================= */
function initImages() {
  $$('img').forEach((img) => {
    const wrap = img.closest('.product__media, .cat-card__media, .lookbook__media, .about__media, .hero__media');
    if (wrap && !wrap.classList.contains('is-loading')) wrap.classList.add('is-loading');

    if (img.complete) {
      img.classList.add('is-loaded');
      wrap?.classList.remove('is-loading');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('is-loaded');
        wrap?.classList.remove('is-loading');
      }, { once: true });
      img.addEventListener('error', () => wrap?.classList.remove('is-loading'), { once: true });
    }
  });
}

/* =========================================================
   05. HEADER
   ========================================================= */
function initHeader() {
  const topbar = $('#topbar');
  const header = $('#header');
  const nav = $('#nav');
  const burger = $('#burgerBtn');
  const year = $('#year');

  if (year) year.textContent = new Date().getFullYear();

  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-stuck', y > 20);
    nav?.classList.toggle('is-stuck', y > 140);

    if (topbar) {
      const goingDown = y > lastY && y > 160;
      topbar.classList.toggle('is-hidden', goingDown);
    }

    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger?.addEventListener('click', () => openDrawer('menuDrawer', burger));
}

/* =========================================================
   06. BUSCADOR
   ========================================================= */
function initSearch() {
  const wrap = $('#search');
  const input = $('#searchInput');
  const clear = $('#searchClear');
  if (!wrap || !input) return;

  input.addEventListener('focus', () => wrap.classList.add('is-focused'));
  input.addEventListener('blur', () => {
    wrap.classList.remove('is-focused');
    if (!input.value) wrap.classList.remove('has-query');
  });

  const onType = debounce(() => {
    state.query = input.value.trim().toLowerCase();
    wrap.classList.toggle('has-query', state.query.length > 0);
    applyFilters();
  }, 120);

  input.addEventListener('input', onType);
  clear?.addEventListener('click', () => {
    input.value = '';
    onType();
    input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.query) {
      input.value = '';
      onType();
    }
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* =========================================================
   07. NAV
   ========================================================= */
function initNav() {
  const nav = $('#nav');
  const list = $('#navList');
  const indicator = $('#navIndicator');
  if (!nav || !list || !indicator) return;

  const links = $$('.nav__link', list);

  const moveIndicator = (link) => {
    if (!link) return;
    const navBox = nav.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    indicator.style.width = `${box.width}px`;
    indicator.style.transform = `translateX(${box.left - navBox.left}px)`;
    indicator.classList.add('is-visible');
  };

  const hideIndicator = () => indicator.classList.remove('is-visible');

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('focus', () => moveIndicator(link));
  });

  list.addEventListener('mouseleave', () => {
    const active = links.find((l) => l.classList.contains('is-active'));
    if (active) moveIndicator(active);
    else hideIndicator();
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((l) => l.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  const reposition = () => {
    const active = links.find((l) => l.classList.contains('is-active'));
    if (active && window.innerWidth > 900) moveIndicator(active);
  };

  window.addEventListener('resize', reposition);
  window.addEventListener('load', reposition);
  reposition();

  const sections = $$('main section[id]');
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        const link = links.find((l) => l.getAttribute('href') === id);
        if (!link) return;
        links.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
        if (window.innerWidth > 900) moveIndicator(link);
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => spy.observe(s));
}

/* =========================================================
   08. FILTROS
   ========================================================= */
const FILTER_RULES = {
  todos: () => true,
  nuevos: (el) => el.dataset.new === 'true',
  pantalones: (el) => el.dataset.category === 'pantalones',
  camisas: (el) => el.dataset.category === 'camisas',
  camisetas: (el) => el.dataset.category === 'camisetas',
  accesorios: (el) => el.dataset.category === 'accesorios',
  'mas-vendidos': (el) => el.dataset.best === 'true',
};

function matchesQuery(el) {
  if (!state.query) return true;
  const haystack = `${el.dataset.name ?? ''} ${el.dataset.category ?? ''}`.toLowerCase();
  return haystack.includes(state.query);
}

function applyFilters() {
  const rule = FILTER_RULES[state.filter] ?? FILTER_RULES.todos;
  let visible = 0;

  products.forEach((card) => {
    const show = rule(card) && matchesQuery(card);
    card.classList.toggle('is-hidden', !show);
    if (show) {
      visible += 1;
      // Reinicia la transición de entrada sin depender de requestAnimationFrame
      card.classList.remove('is-visible');
      void card.offsetWidth;
      card.classList.add('is-visible');
    }
  });

  const count = $('#resultsCount');
  if (count) {
    const label = visible === 1 ? 'producto' : 'productos';
    count.textContent = state.query
      ? `${visible} ${label} para "${state.query}"`
      : `${visible} ${label}`;
  }

  const empty = $('#emptyState');
  if (empty) empty.hidden = visible !== 0;
}

function initFilters() {
  const bar = $('.filters');
  const buttons = $$('.filter');
  const indicator = $('#filterIndicator');
  if (!bar || !buttons.length) return;

  const moveIndicator = (btn) => {
    if (!btn || !indicator) return;
    const barBox = bar.getBoundingClientRect();
    const box = btn.getBoundingClientRect();
    indicator.style.width = `${box.width}px`;
    indicator.style.transform = `translateX(${box.left - barBox.left}px)`;
  };

  const setFilter = (value, btn) => {
    state.filter = value;
    buttons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    if (btn) moveIndicator(btn);
    applyFilters();
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter, btn));
    btn.addEventListener('mouseenter', () => moveIndicator(btn));
  });

  bar.addEventListener('mouseleave', () => {
    const active = buttons.find((b) => b.classList.contains('is-active'));
    if (active) moveIndicator(active);
  });

  const active = buttons.find((b) => b.classList.contains('is-active')) ?? buttons[0];
  setFilter(active.dataset.filter, active);
  window.addEventListener('resize', () => {
    const current = buttons.find((b) => b.classList.contains('is-active'));
    if (current) moveIndicator(current);
  });

  $$('[data-filter-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const value = el.dataset.filterLink;
      const target = buttons.find((b) => b.dataset.filter === value) ?? buttons[0];
      setFilter(value, target);
      $('#catalog')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  $('#resetFilters')?.addEventListener('click', () => {
    const input = $('#searchInput');
    if (input) input.value = '';
    state.query = '';
    $('#search')?.classList.remove('has-query');
    setFilter('todos', buttons[0]);
  });

  initProductCards();
}

/* =========================================================
   09. TARJETAS
   ========================================================= */
function initProductCards() {
  products.forEach((card) => {
    const sizes = $('.sizes', card);
    const addBtn = $('[data-add-to-cart]', card);

    sizes?.addEventListener('click', (e) => {
      const size = e.target.closest('.size');
      if (!size) return;
      $$('.size', sizes).forEach((s) => s.classList.remove('is-selected'));
      size.classList.add('is-selected');
      sizes.classList.remove('is-required');
    });

    addBtn?.addEventListener('click', () => {
      if (addBtn.disabled) return;
      const selected = $('.size.is-selected', card);
      if (!selected) {
        sizes?.classList.add('is-required');
        return;
      }
      addToCart({
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        size: selected.dataset.size,
        image: $('.product__img--primary', card)?.currentSrc ?? $('.product__img--primary', card)?.src ?? '',
      });
      const label = $('span', addBtn);
      const original = label.textContent;
      addBtn.classList.add('is-added');
      label.textContent = 'Añadido';
      setTimeout(() => {
        addBtn.classList.remove('is-added');
        label.textContent = original;
      }, 1400);
    });
  });
}

/* =========================================================
   10. CARRITO
   ========================================================= */
const cartBadge = $('#cartBadge');
const drawerCount = $('#drawerCount');
const cartList = $('#cartList');
const cartEmpty = $('#cartEmpty');
const cartSummary = $('#cartSummary');

function cartKey(item) {
  return `${item.id}__${item.size}`;
}

function persistCart() {
  writeStorage(STORAGE.cart, state.cart);
}

function cartTotals() {
  const subtotal = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = state.cart.length === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return { subtotal, shipping, total: subtotal + shipping };
}

function renderCart() {
  const count = state.cart.reduce((acc, i) => acc + i.qty, 0);
  const { subtotal, shipping, total } = cartTotals();

  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.dataset.count = count;
    cartBadge.classList.toggle('is-visible', count > 0);
    if (count > 0) {
      cartBadge.classList.remove('is-bouncing');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('is-bouncing');
    }
  }

  if (drawerCount) drawerCount.textContent = `(${count})`;
  if (cartEmpty) cartEmpty.hidden = count > 0;
  if (cartSummary) cartSummary.hidden = count === 0;

  const sub = $('#cartSubtotal');
  const ship = $('#cartShipping');
  const tot = $('#cartTotal');
  if (sub) sub.textContent = formatPrice(subtotal);
  if (ship) ship.textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
  if (tot) tot.textContent = formatPrice(total);

  if (!cartList) return;
  cartList.innerHTML = '';

  state.cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.dataset.key = cartKey(item);
    li.style.animationDelay = `${index * 60}ms`;
    li.innerHTML = `
      <div class="cart-item__media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="cart-item__info">
        <h4 class="cart-item__name"></h4>
        <span class="cart-item__meta">Talla ${item.size}</span>
        <div class="cart-item__row">
          <div class="qty">
            <button type="button" data-qty="-1" aria-label="Restar una unidad">
              <i data-lucide="minus"></i>
            </button>
            <span class="qty__value">${item.qty}</span>
            <button type="button" data-qty="1" aria-label="Sumar una unidad">
              <i data-lucide="plus"></i>
            </button>
          </div>
          <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
          <button type="button" class="cart-item__remove" aria-label="Eliminar del carrito">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
    $('.cart-item__name', li).textContent = item.name;
    cartList.appendChild(li);
  });

  renderIcons();
}

function addToCart(item) {
  const key = cartKey(item);
  const existing = state.cart.find((i) => cartKey(i) === key);
  if (existing) existing.qty += 1;
  else state.cart.push({ ...item, qty: 1 });

  persistCart();
  renderCart();
  showToast(`${item.name} · Talla ${item.size}`);
}

function changeQty(key, delta) {
  const item = state.cart.find((i) => cartKey(i) === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((i) => cartKey(i) !== key);
  persistCart();
  renderCart();
}

function removeFromCart(key, node) {
  node?.classList.add('is-removing');
  setTimeout(() => {
    state.cart = state.cart.filter((i) => cartKey(i) !== key);
    persistCart();
    renderCart();
  }, 320);
}

function initCart() {
  const cartBtn = $('#cartBtn');
  cartBtn?.addEventListener('click', () => openDrawer('cartDrawer', cartBtn));

  cartList?.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const key = item.dataset.key;
    const qtyBtn = e.target.closest('[data-qty]');
    const removeBtn = e.target.closest('.cart-item__remove');
    if (qtyBtn) changeQty(key, Number(qtyBtn.dataset.qty));
    else if (removeBtn) removeFromCart(key, item);
  });

  $('#clearCart')?.addEventListener('click', () => {
    if (!state.cart.length) return;
    state.cart = [];
    persistCart();
    renderCart();
    showToast('Carrito vaciado');
  });

  $('#checkoutBtn')?.addEventListener('click', () => {
    const { total } = cartTotals();
    showToast(`Checkout · ${formatPrice(total)}`);
  });

  renderCart();
}

/* =========================================================
   11. FAVORITOS
   ========================================================= */
function initWishlist() {
  const counter = $('#wishCount');

  const render = () => {
    const n = state.wish.length;
    if (counter) {
      counter.textContent = n;
      counter.classList.toggle('is-visible', n > 0);
    }
    $$('[data-wish]').forEach((btn) => {
      const id = btn.closest('.product')?.dataset.id;
      btn.classList.toggle('is-active', state.wish.includes(id));
    });
  };

  $$('[data-wish]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.closest('.product')?.dataset.id;
      if (!id) return;
      if (state.wish.includes(id)) state.wish = state.wish.filter((w) => w !== id);
      else {
        state.wish.push(id);
        btn.style.animation = 'pop 0.45s var(--ease-out-expo)';
        setTimeout(() => (btn.style.animation = ''), 500);
      }
      writeStorage(STORAGE.wish, state.wish);
      render();
    });
  });

  render();
}

/* =========================================================
   12. NEWSLETTER
   ========================================================= */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function initNewsletter() {
  const form = $('#newsletterForm');
  if (!form) return;
  const input = $('#newsletterEmail');
  const error = $('#newsletterError');
  const success = $('#newsletterSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    const valid = EMAIL_RE.test(value);
    form.classList.toggle('has-error', !valid);
    if (error) error.hidden = valid;
    if (!valid) return input.focus();
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.style.animation = 'none';
      void success.offsetWidth;
      success.style.animation = '';
    }
    showToast('¡Bienvenida a LAST CLASSIC!');
  });

  input?.addEventListener('input', () => {
    form.classList.remove('has-error');
    if (error) error.hidden = true;
  });
}

/* =========================================================
   13. DRAWERS + FOCUS TRAP + BOTTOM SHEET DRAG
   ========================================================= */
let openDrawerId = null;
let lastFocused = null;
let focusables = [];
let drag = { active: false, startY: 0, currentY: 0, maxY: 0 };

// Contenido que queda detrás del panel: se marca como inert mientras el
// drawer está abierto para que el foco no pueda escapar de él.
const BACKGROUND = ['.topbar', '.header', '.nav', 'main', '.footer', '.marquee'];

function getFocusables(el) {
  if (!el) return [];
  return $$(
    'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    el
  );
}

function trapFocus(e) {
  if (e.key !== 'Tab' || !openDrawerId || !focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openDrawer(id, trigger) {
  const drawer = document.getElementById(id);
  const overlay = $('#overlay');
  if (!drawer) return;

  closeDrawer(true);

  // Se prefiere el elemento que lanzó la acción; `activeElement` sirve como
  // respaldo (p. ej. apertura por teclado).
  lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
  openDrawerId = id;

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  // `inert` se quita de forma síncrona: el panel es enfocable en el mismo
  // instante en que se abre, sin depender de transiciones ni del motor.
  drawer.removeAttribute('inert');
  $$('.drawer').forEach((d) => {
    if (d !== drawer) d.setAttribute('inert', '');
  });
  BACKGROUND.forEach((sel) => $$(sel).forEach((el) => el.setAttribute('inert', '')));

  if (overlay) {
    overlay.hidden = false;
    // Fuerza reflow para que la opacidad 0 -> 1 tenga un estado inicial
    // que transicionar, sin depender de requestAnimationFrame.
    void overlay.offsetWidth;
    overlay.classList.add('is-visible');
  }

  document.body.classList.add('is-locked');

  focusables = getFocusables(drawer);
  focusables[0]?.focus();
  document.addEventListener('keydown', trapFocus);
}

function closeDrawer(silent = false) {
  if (!openDrawerId) return;

  const drawer = document.getElementById(openDrawerId);
  const overlay = $('#overlay');

  if (drawer) {
    drawer.classList.remove('is-open');
    drawer.classList.remove('is-dragging');
    drawer.style.setProperty('--drag-y', '0px');
    drawer.setAttribute('aria-hidden', 'true');
    // `inert` bloquea foco, teclado y lectores de pantalla de inmediato
    drawer.setAttribute('inert', '');
  }

  if (overlay) {
    overlay.classList.remove('is-visible');
    // 500ms > duración de la transición del overlay (450ms)
    setTimeout(() => (overlay.hidden = true), 500);
  }

  document.body.classList.remove('is-locked');
  document.removeEventListener('keydown', trapFocus);
  BACKGROUND.forEach((sel) => $$(sel).forEach((el) => el.removeAttribute('inert')));

  openDrawerId = null;
  focusables = [];

  if (!silent) {
    if (lastFocused instanceof HTMLElement && document.contains(lastFocused)) {
      lastFocused.focus();
    } else {
      // Respaldo: nunca dejar el foco en <body> tras cerrar
      $('#cartBtn')?.focus();
    }
  }
}

function initDrawers() {
  const overlay = $('#overlay');
  overlay?.addEventListener('click', () => closeDrawer());

  $$('.drawer--menu .drawer__link').forEach((link) => {
    link.addEventListener('click', () => closeDrawer());
  });

  $$('[data-close-drawer]').forEach((b) => b.addEventListener('click', () => closeDrawer()));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.addEventListener('resize', () => {
    if (openDrawerId === 'menuDrawer' && window.innerWidth > 900) closeDrawer();
    if (openDrawerId === 'cartDrawer' && window.innerWidth > 900) {
      const d = $('#cartDrawer');
      d?.classList.remove('is-dragging');
      d?.style.setProperty('--drag-y', '0px');
    }
  });

  // Drag bottom sheet (móvil)
  const cartDrawer = $('#cartDrawer');
  const grip = cartDrawer?.querySelector('.drawer__grip');
  if (cartDrawer && grip) {
    const onTouchStart = (e) => {
      if (window.innerWidth > 900) return;
      drag.active = true;
      cartDrawer.classList.add('is-dragging');
      drag.startY = e.touches[0].clientY;
      drag.currentY = 0;
      const h = cartDrawer.getBoundingClientRect().height;
      drag.maxY = Math.max(120, h * 0.25);
    };

    const onTouchMove = (e) => {
      if (!drag.active) return;
      e.preventDefault();
      const y = e.touches[0].clientY - drag.startY;
      drag.currentY = Math.max(0, y);
      cartDrawer.style.setProperty('--drag-y', `${drag.currentY}px`);
    };

    const onTouchEnd = () => {
      if (!drag.active) return;
      drag.active = false;
      cartDrawer.classList.remove('is-dragging');
      if (drag.currentY > drag.maxY) closeDrawer();
      cartDrawer.style.setProperty('--drag-y', '0px');
    };

    grip.addEventListener('touchstart', onTouchStart, { passive: true });
    cartDrawer.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }
}

/* =========================================================
   14. REVEAL
   ========================================================= */
function initReveal() {
  const items = $$('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );

  items.forEach((el) => obs.observe(el));
}

/* =========================================================
   15. CONTADORES
   ========================================================= */
function initCounters() {
  const counters = $$('.stat__num');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    if (!target && target !== 0) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const v = Math.round(target * eased);
      el.textContent = v >= 1000 ? v.toLocaleString('es-CO') : v;
      if (p < 1) raf = requestAnimationFrame(step);
    };

    // Primer frame inmediato y luego la animación sostenida
    el.textContent = target >= 1000 ? target.toLocaleString('es-CO') : target;
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => obs.observe(el));
}

/* =========================================================
   16. TOASTS
   ========================================================= */
let toastTimer;

function showToast(message) {
  const toast = $('#toast');
  const text = $('#toastText');
  if (!toast) return;
  if (text) text.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function initToasts() {
  $$('[data-toast]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

/* =========================================================
   17. INIT
   ========================================================= */
function init() {
  renderIcons();
  initTheme();
  initImages();
  initHeader();
  initSearch();
  initNav();
  initFilters();
  initCart();
  initWishlist();
  initNewsletter();
  initDrawers();
  initToasts();
  initReveal();
  initCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
