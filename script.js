// --- DATOS DE PRODUCTOS ---
const productos = [
    {
        id: 1,
        name: "Portallaves Familia 4",
        price: 15000,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_familia_4.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX1"
    },
    {
        id: 2,
        name: "Portallaves Familia Auto",
        price: 16000,
        variants: "1, 2, 3",
        description: "asd",
        image: "./images/Portallaves_familia_auto.png",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX2"
    },
    {
        id: 3,
        name: "Portallaves Gatitos",
        price: 14500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_gatitos.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX3"
    },
    {
        id: 4,
        name: "Portallaves Nube",
        price: 14000,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_nube.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX4"
    },
    {
        id: 5,
        name: "Portallaves Pareja Auto",
        price: 16500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_pareja_auto.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX5"
    },
    {
        id: 6,
        name: "Portallaves Pareja Gatos",
        price: 15500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_pareja_gatos.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX6"
    },
    {
        id: 7,
        name: "Portallaves Pareja",
        price: 14000,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_pareja.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX7"
    },
    {
        id: 8,
        name: "Portallaves Pez",
        price: 13500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_pez.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX8"
    },
    {
        id: 9,
        name: "Portallaves Salchicha Sentado",
        price: 14500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_salchicha_sentado.jfif", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX9"
    },
    {
        id: 10,
        name: "Portallaves Salchicha",
        price: 14500,
        variants: "1, 2",
        description: "asd",
        image: "./images/Portallaves_salchicha.png", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX10"
    }
];

// --- UTILIDADES ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(price);
};

// --- EFECTO NAVBAR SCROLL (Glassmorphism) ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- LÓGICA DEL SLIDER (Deslizamiento Horizontal Automático) ---
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
    // Desliza el carril a la izquierda
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

// Auto avance cada 10 segundos
setInterval(nextSlide, 10000);

// --- RENDERIZAR PRODUCTOS EN GRILLA ÚNICA ---
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
        p.name.toLowerCase().includes(term) || 
        p.variants.toLowerCase().includes(term)
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
            openModal(producto.id);
        };

        li.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="search-result-img">
            <div class="search-result-info">
                <span class="search-result-title">${producto.name}</span>
                <span class="search-result-variants">${producto.variants}</span>
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
    document.body.style.overflow = 'hidden'; // Prevenir scroll de fondo
};

const closeModal = () => {
    modal.close();
    document.body.style.overflow = 'auto'; // Restaurar scroll
};

closeModalBtn.addEventListener('click', closeModal);

// Cerrar al clickear en el backdrop
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

// --- ANIMACIONES ON SCROLL (Intersection Observer) ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollObserver.unobserve(entry.target); // Dejar de observar después de la animación
        }
    });
}, {
    threshold: 0.1, // Activar cuando el 10% sea visible
    rootMargin: "0px 0px -50px 0px" // Un pequeño margen
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Renderizamos los productos en el contenedor unificado
    renderGrid(productos, 'products-grid');
    
    // Observar elementos para animar
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});