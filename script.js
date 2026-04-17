// --- DATOS DE PRODUCTOS DESDE GOOGLE SHEETS ---
let productos = [];

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgT3tL1JyA-4SZAwmqkCh1wTbLJO-Wxxk5ZFT6w1ToNnTwnp7REyfb02Z96JL0SgHT6ZZyIZQ3eGXm/pub?output=csv";

const cargarProductos = () => {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            productos = results.data.filter(p => p.id);
            renderGrid(productos, 'products-grid');
            renderSlider(productos); // Llenamos el slider dinámicamente
        },
        error: function(err) {
            console.error("Error al cargar el Excel:", err);
            document.getElementById('products-grid').innerHTML = '<p style="text-align:center; width:100%; color: var(--color-marron);">Hubo un error cargando el catálogo.</p>';
        }
    });
};

const formatPrice = (price) => {
    if(!price) return "";
    return new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: 'ARS', maximumFractionDigits: 0
    }).format(price);
};

// --- MENU MOVIL ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const mobileDropdownTrigger = document.getElementById('mobile-dropdown-trigger');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

if(mobileDropdownTrigger) {
    mobileDropdownTrigger.addEventListener('click', (e) => {
        if(window.innerWidth <= 768) {
            if(e.target.tagName !== 'A' || e.target.classList.contains('prevent-mobile')) {
                e.preventDefault();
                mobileDropdownTrigger.classList.toggle('open');
            }
        }
    });
}

// --- SMOOTH SCROLL VIP (Animación fluida y lenta) ---
function smoothScroll(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#' || targetId === '') return; 
        
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            e.preventDefault(); 
            
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            const targetPosition = Math.max(0, targetElement.getBoundingClientRect().top + window.scrollY - 80);
            
            smoothScroll(targetPosition, 1200); 
        }
    });
});

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// --- LÓGICA DEL SLIDER DINÁMICO (AHORA IDENTICO A LAS TARJETAS) ---
let currentSlide = 0;
let totalSlides = 0;
let slides = [];
const sliderTrack = document.getElementById('slider-track');

const renderSlider = (listaProductos) => {
    if(!sliderTrack) return;
    sliderTrack.innerHTML = '';
    
    const sliderProducts = listaProductos.slice(0, 5);
    
    sliderProducts.forEach(producto => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.onclick = () => openModal(producto.id); 
        
        // Estructura idéntica a la grilla de catálogo
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
    showSlide(0);
};

function getItemsPerView() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slider-items-visible')) || 1;
}

function showSlide(index) {
    if(totalSlides === 0) return;
    const itemsPerView = getItemsPerView();
    const maxIndex = totalSlides - itemsPerView; 
    
    if (index > maxIndex) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = maxIndex > 0 ? maxIndex : 0;
    } else {
        currentSlide = index;
    }
    
    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(sliderTrack).gap) || 0;
    const moveDistance = currentSlide * (slideWidth + gap);
    
    sliderTrack.style.transform = `translateX(-${moveDistance}px)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

window.addEventListener('resize', () => {
    if(totalSlides > 0) showSlide(currentSlide);
});

setInterval(() => {
    if(totalSlides > 0) nextSlide();
}, 5000);

let touchStartX = 0;
let touchEndX = 0;
sliderTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
sliderTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
});

// --- RENDERIZAR PRODUCTOS EN GRILLA ---
const renderGrid = (listaProductos, containerId) => {
    const grid = document.getElementById(containerId);
    if(!grid) return;
    grid.innerHTML = '';
   
    listaProductos.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'card';
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
    });
};

// --- LÓGICA DEL BUSCADOR ---
const searchTrigger = document.getElementById('search-trigger');
const searchDropdown = document.getElementById('search-dropdown');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    searchDropdown.classList.toggle('active');
    if(searchDropdown.classList.contains('active')) {
        searchInput.focus();
        renderSearchResults('');
    }
});

searchInput.addEventListener('input', (e) => { renderSearchResults(e.target.value); });

function renderSearchResults(query) {
    searchResultsContainer.innerHTML = '';
    const term = query.toLowerCase().trim();
   
    const filtered = productos.filter(p =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.variants && p.variants.toString().toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
        searchResultsContainer.innerHTML = '<li style="padding: 15px; color: var(--color-marron); font-size: 0.9rem;">No se encontraron resultados.</li>';
        return;
    }

    filtered.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.onclick = () => {
            searchDropdown.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
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
    if (!searchTrigger.contains(e.target) && !searchDropdown.contains(e.target) && e.target.id !== 'search-input') {
        searchDropdown.classList.remove('active');
    }
});

// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

window.openModal = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modal-img').src = producto.image;
    document.getElementById('modal-img').alt = producto.name;
    document.getElementById('modal-title').textContent = producto.name;
    document.getElementById('modal-desc').textContent = producto.description;
    document.getElementById('modal-price').textContent = formatPrice(producto.price);
    document.getElementById('modal-link').href = producto.link;

    modal.showModal();
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    modal.close();
    document.body.style.overflow = 'auto';
};

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
        closeModal();
    }
});

// --- ANIMACIONES ON SCROLL ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    cargarProductos(); 
    document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));
});