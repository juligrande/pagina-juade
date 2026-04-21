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
// HELPERS
// ============================================================
function isMobile() { return window.innerWidth <= 768; }

function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// NAVBAR
// ============================================================
const mobileMenuBtn         = document.getElementById('mobile-menu-btn');
const navLinks              = document.getElementById('nav-links');
const mobileDropdownTrigger = document.getElementById('mobile-dropdown-trigger');

mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// ============================================================
// CATÁLOGO DROPDOWN — en mobile: accordion sin navegar
// ============================================================
if (mobileDropdownTrigger) {
    const dropdownAnchor = mobileDropdownTrigger.querySelector('a.prevent-mobile');

    mobileDropdownTrigger.addEventListener('click', (e) => {
        if (!isMobile()) return;

        // Click en el link principal o el chevron → toggle accordion
        if (dropdownAnchor && (e.target === dropdownAnchor || dropdownAnchor.contains(e.target))) {
            e.preventDefault();
            e.stopPropagation();
            mobileDropdownTrigger.classList.toggle('open');
            return;
        }

        // Click en link hijo → navegar y cerrar menú
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });
}

// Cerrar menú al hacer click fuera en mobile
document.addEventListener('click', (e) => {
    if (isMobile() && navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

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

        // En mobile, el link principal del catálogo no navega, solo abre el accordion
        if (this.classList.contains('prevent-mobile') && isMobile()) {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        const navH = document.getElementById('navbar').offsetHeight;
        const pos  = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH - 8);
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
let currentSlide  = 0;
let totalSlides   = 0;
let slides        = [];
let autoplayTimer = null;

const sliderTrack   = document.getElementById('slider-track');
const dotsContainer = document.getElementById('slider-dots');

const renderSlider = (lista) => {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = '';

    const pool = lista.slice(0, 6);

    pool.forEach((producto) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="slide-bg">
            <div class="card-overlay">
                <button class="btn-quickview">Ver Detalles</button>
            </div>
        `;
        slide.addEventListener('click', () => {
            if (!isSwiping) openModal(producto.id);
        });
        sliderTrack.appendChild(slide);
    });

    slides      = Array.from(sliderTrack.querySelectorAll('.slide'));
    totalSlides = slides.length;

    buildDots();
    showSlide(0);
    startAutoplay();
};

function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    const ipv     = getItemsPerView();
    const numDots = Math.max(1, totalSlides - ipv + 1);

    // No mostrar dots si solo hay 1 posición
    if (numDots <= 1) return;

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
        const idx = i;
        dot.addEventListener('click', () => { showSlide(idx); resetAutoplay(); });
        dotsContainer.appendChild(dot);
    }
}

function getItemsPerView() {
    const val = getComputedStyle(document.documentElement)
        .getPropertyValue('--slider-items-visible').trim();
    return parseInt(val) || 1;
}

function showSlide(index) {
    if (totalSlides === 0 || slides.length === 0) return;
    const ipv      = getItemsPerView();
    const maxIndex = Math.max(0, totalSlides - ipv);

    if (index > maxIndex) currentSlide = 0;
    else if (index < 0)   currentSlide = maxIndex;
    else                  currentSlide = index;

    const slideWidth = slides[0].offsetWidth;
    const gap        = parseFloat(getComputedStyle(sliderTrack).gap) || 0;
    sliderTrack.style.transform = `translateX(-${currentSlide * (slideWidth + gap)}px)`;

    if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
}

window.nextSlide = () => { showSlide(currentSlide + 1); resetAutoplay(); };
window.prevSlide = () => { showSlide(currentSlide - 1); resetAutoplay(); };

function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
        if (totalSlides > 0) showSlide(currentSlide + 1);
    }, 5000);
}
function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }

window.addEventListener('resize', () => {
    if (totalSlides > 0) { buildDots(); showSlide(currentSlide); }
}, { passive: true });

// Touch swipe con flag anti-click
let touchStartX = 0;
let touchStartY = 0;
let isSwiping   = false;

sliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    isSwiping   = false;
}, { passive: true });

sliderTrack.addEventListener('touchmove', (e) => {
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dx > dy && dx > 10) isSwiping = true;
}, { passive: true });

sliderTrack.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (isSwiping) {
        if (dx < -40) nextSlide();
        if (dx > 40)  prevSlide();
    }
    setTimeout(() => { isSwiping = false; }, 100);
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
        card.style.transitionDelay = `${i * 50}ms`;
        card.addEventListener('click', () => openModal(producto.id));

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
        scrollObserver.observe(card);
    });
};

// ============================================================
// BUSCADOR
// ============================================================
const searchTrigger          = document.getElementById('search-trigger');
const searchDropdown         = document.getElementById('search-dropdown');
const searchInput            = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = searchDropdown.classList.toggle('active');
    if (isOpen) {
        setTimeout(() => searchInput.focus(), 60);
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
            '<li style="padding:14px 16px;color:var(--color-marron);font-size:0.88rem;">No se encontraron resultados.</li>';
        return;
    }

    filtered.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.addEventListener('click', () => {
            searchDropdown.classList.remove('active');
            closeMobileMenu();
            openModal(producto.id);
        });
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
const modal         = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

window.openModal = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modal-img').src           = producto.image;
    document.getElementById('modal-img').alt           = producto.name;
    document.getElementById('modal-title').textContent = producto.name;
    document.getElementById('modal-desc').textContent  = producto.description;
    document.getElementById('modal-price').textContent = formatPrice(producto.price);
    document.getElementById('modal-link').href         = producto.link;

    // Reset scroll interno del modal
    const modalGrid = modal.querySelector('.modal-grid');
    if (modalGrid) modalGrid.scrollTop = 0;

    modal.showModal();
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    modal.close();
    document.body.style.overflow = '';
};

closeModalBtn.addEventListener('click', closeModal);

// Cerrar al tocar el backdrop (solo el elemento <dialog> directamente)
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

modal.addEventListener('close', () => {
    document.body.style.overflow = '';
});

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
}, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    cargarProductos();
    document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));
});