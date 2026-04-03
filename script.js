// --- DATOS DE PRODUCTOS DESDE GOOGLE SHEETS ---
let productos = []; 

// 👇👇👇 PEGA TU LINK .CSV ACÁ ADENTRO DE LAS COMILLAS 👇👇👇
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
        },
        error: function(err) {
            console.error("Error al cargar el Excel:", err);
            document.getElementById('products-grid').innerHTML = '<p style="text-align:center; width:100%;">Hubo un error cargando el catálogo.</p>';
        }
    });
};

// --- UTILIDADES ---
const formatPrice = (price) => {
    if(!price) return "";
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(price);
};

// --- MENU MOVIL ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Previene el scroll del fondo cuando el menú está abierto
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// Cerrar el menú móvil al clickear un link normal
document.querySelectorAll('.close-on-click').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// --- EFECTO NAVBAR SCROLL ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- LÓGICA DEL SLIDER (Con soporte Touch/Swipe) ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const sliderTrack = document.getElementById('slider-track');
const totalSlides = slides.length;

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

setInterval(nextSlide, 8000); 

// GESTOS TOUCH (SWIPE) PARA MÓVIL
let touchStartX = 0;
let touchEndX = 0;

sliderTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

sliderTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // Si arrastra más de 50px hacia la izquierda o derecha, cambia de foto
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
}

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

searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
});

function renderSearchResults(query) {
    searchResultsContainer.innerHTML = '';
    const term = query.toLowerCase().trim();
    
    const filtered = productos.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.variants && p.variants.toString().toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
        searchResultsContainer.innerHTML = '<li style="padding: 15px; color: #856A48; font-size: 0.9rem;">No se encontraron resultados.</li>';
        return;
    }

    filtered.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        
        li.onclick = () => {
            searchDropdown.classList.remove('active');
            
            // Si estábamos en celular, cierra el menú de pantalla completa
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
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalLink = document.getElementById('modal-link');

window.openModal = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    modalImg.src = producto.image;
    modalImg.alt = producto.name;
    modalTitle.textContent = producto.name;
    modalDesc.textContent = producto.description;
    modalPrice.textContent = formatPrice(producto.price);
    modalLink.href = producto.link;

    modal.showModal();
    document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
    // Al cerrar, sacamos la animación primero
    modal.close();
    document.body.style.overflow = 'auto'; 
};

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
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
}, {
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px"
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    cargarProductos();
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});