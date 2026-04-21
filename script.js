// ============================================================
// DATOS DE PRODUCTOS — GOOGLE SHEETS
// ============================================================
let productos = [];

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgT3tL1JyA-4SZAwmqkCh1wTbLJO-Wxxk5ZFT6w1ToNnTwnp7REyfb02Z96JL0SgHT6ZZyIZQ3eGXm/pub?output=csv";

const cargarProductos = () => {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete(results) {
            productos = results.data.filter(p => p.id);
            renderGrid(productos, 'products-grid');
            renderSlider(productos);
        },
        error(err) {
            console.error("Error al cargar el catálogo:", err);
            document.getElementById('products-grid').innerHTML =
                '<p style="text-align:center;width:100%;color:var(--color-marron);padding:2rem 0;">Hubo un error cargando el catálogo.</p>';
        }
    });
};

const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: 'ARS', maximumFractionDigits: 0
    }).format(price);
};

// ============================================================
// MENU MÓVIL
// ============================================================
const mobileMenuBtn       = document.getElementById('mobile-menu-btn');
const navLinks            = document.getElementById('nav-links');
const mobileDropdownTrigger = document.getElementById('mobile-dropdown-trigger');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

if (mobileDropdownTrigger) {
    mobileDropdownTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (e.target.tagName !== 'A' || e.target.classList.contains('prevent-mobile')) {
                e.preventDefault();
                mobileDropdownTrigger.classList.toggle('open');
            }
        }
    });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function smoothScroll(targetPos, duration) {
    const start = window.pageYOffset;
    const dist  = targetPos - start;
    let startTime = null;

    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };

    const animate = (now) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        window.scrollTo(0, ease(elapsed, start, dist, duration));
        if (elapsed < duration) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#' || id === '') return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();

        // close mobile nav
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';

        const pos = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80);
        smoothScroll(pos, 1100);
    });
});

// Navbar scroll state
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ============================================================
// SLIDER
// ============================================================
let currentSlide = 0;
let totalSlides  = 0;
let slides       = [];
const sliderTrack = document.getElementById('slider-track');
const dotsContainer = document.getElementById('slider-dots');

const renderSlider = (lista) => {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = '';
    dotsContainer.innerHTML = '';

    const pool = lista.slice(0, 6);

    pool.forEach((producto) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.onclick = () => openModal(producto.id);
        slide.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="slide-bg">
            <div class="card-overlay">
                <button class="btn-quickview">Ver Detalles</button>
            </div>
        `;
        sliderTrack.appendChild(slide);
    });

    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    buildDots();
    showSlide(0);
};

function buildDots() {
    dotsContainer.innerHTML = '';
    const ipv = getItemsPerView();
    const numDots = Math.max(1, totalSlides - ipv + 1);
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
        const idx = i;
        dot.addEventListener('click', () => showSlide(idx));
        dotsContainer.appendChild(dot);
    }
}

function getItemsPerView() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slider-items-visible')) || 1;
}

function showSlide(index) {
    if (totalSlides === 0) return;
    const ipv      = getItemsPerView();
    const maxIndex = Math.max(0, totalSlides - ipv);

    if (index > maxIndex)     currentSlide = 0;
    else if (index < 0)       currentSlide = maxIndex;
    else                      currentSlide = index;

    const slideWidth  = slides[0].offsetWidth;
    const gap         = parseFloat(getComputedStyle(sliderTrack).gap) || 0;
    sliderTrack.style.transform = `translateX(-${currentSlide * (slideWidth + gap)}px)`;

    // sync dots
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

window.nextSlide = () => showSlide(currentSlide + 1);
window.prevSlide = () => showSlide(currentSlide - 1);

window.addEventListener('resize', () => {
    if (totalSlides > 0) {
        buildDots();          // rebuild correct number of dots for new viewport
        showSlide(currentSlide);
    }
}, { passive: true });

// Autoplay
setInterval(() => { if (totalSlides > 0) nextSlide(); }, 5000);

// Touch swipe
let touchStartX = 0;
sliderTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
sliderTrack.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (dx < -50) nextSlide();
    if (dx >  50) prevSlide();
});

// ============================================================
// GRILLA DE PRODUCTOS
// ============================================================
const renderGrid = (lista, containerId) => {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';

    lista.forEach((producto, i) => {
        const card = document.createElement('article');
        card.className = 'card fade-in';
        card.style.transitionDelay = `${i * 60}ms`;
        card.onclick = () => openModal(producto.id);

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${producto.image}" alt="${producto.name}" loading="lazy">
                <div class="card-overlay">
                    <button class="btn-quickview">Ver Detalles</button>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${producto.name}</h3>
                <p class="card-price">${formatPrice(producto.price)}</p>
            </div>
        `;

        grid.appendChild(card);

        // observe each card for fade-in
        scrollObserver.observe(card);
    });
};

// ============================================================
// BUSCADOR
// ============================================================
const searchTrigger         = document.getElementById('search-trigger');
const searchDropdown        = document.getElementById('search-dropdown');
const searchInput           = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    searchDropdown.classList.toggle('active');
    if (searchDropdown.classList.contains('active')) {
        searchInput.focus();
        renderSearchResults('');
    }
});

searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

function renderSearchResults(query) {
    searchResultsContainer.innerHTML = '';
    const term = query.toLowerCase().trim();

    const filtered = productos.filter(p =>
        (p.name     && p.name.toLowerCase().includes(term)) ||
        (p.variants && p.variants.toString().toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
        searchResultsContainer.innerHTML =
            '<li style="padding:14px 16px;color:var(--text-muted);font-size:0.88rem;">No se encontraron resultados.</li>';
        return;
    }

    filtered.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.onclick = () => {
            searchDropdown.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            openModal(producto.id);
        };
        li.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="search-result-img">
            <div class="search-result-info">
                <span class="search-result-title">${producto.name}</span>
                <span class="search-result-variants">${producto.variants || ''}</span>
            </div>
        `;
        searchResultsContainer.appendChild(li);
    });
}

document.addEventListener('click', (e) => {
    if (!searchTrigger.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
    }
});

// ============================================================
// MODAL
// ============================================================
const modal        = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

window.openModal = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modal-img').src          = producto.image;
    document.getElementById('modal-img').alt          = producto.name;
    document.getElementById('modal-title').textContent = producto.name;
    document.getElementById('modal-desc').textContent  = producto.description;
    document.getElementById('modal-price').textContent = formatPrice(producto.price);
    document.getElementById('modal-link').href         = producto.link;

    modal.showModal();
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    modal.close();
    document.body.style.overflow = '';
};

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        closeModal();
    }
});

// Close with Escape (native for <dialog>, but ensures body overflow reset)
modal.addEventListener('close', () => { document.body.style.overflow = ''; });

// ============================================================
// SCROLL OBSERVER (fade-in)
// ============================================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    cargarProductos();
    document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));
});