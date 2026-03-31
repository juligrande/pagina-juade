// --- DATOS DE PRODUCTOS ---
const productos = [
    {
        id: 1,
        name: "Separadores de Libros",
        price: 8750,
        variants: "MDF Natural",
        description: "Prácticos y elegantes separadores de libros cortados en MDF con tecnología CNC. Perfectos para organizar tu biblioteca con un estilo minimalista.",
        image: "https://placehold.co/600x800/FCF5E1/856A48?text=Imagen+Pronto", 
        link: "#"
    },
    {
        id: 2,
        name: "Porta Llaves",
        price: 22500,
        variants: "MDF Natural / Grabado",
        description: "Porta llaves de pared con diseño moderno y cortes de precisión. Mantené tus llaves organizadas y dale un toque especial a la entrada de tu hogar.",
        image: "https://placehold.co/600x800/FCF5E1/856A48?text=Imagen+Pronto",
        link: "#"
    },
    {
        id: 3,
        name: "Organizador de Cables",
        price: 12500,
        variants: "MDF Natural",
        description: "Solución ideal para mantener tu escritorio libre de cables enredados. Corte preciso en MDF para un ensamble perfecto y una estación de trabajo limpia.",
        image: "https://placehold.co/600x800/FCF5E1/856A48?text=Imagen+Pronto", 
        link: "#"
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

// --- EFECTO NAVBAR SCROLL ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- LÓGICA DEL SLIDER ---
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
        searchResultsContainer.innerHTML = '<li style="padding: 15px; color: var(--separator); font-size: 0.9rem;">No se encontraron resultados.</li>';
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
    document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
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
    
    // Renderizamos los 3 productos
    renderGrid(productos, 'grid-productos');
    
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});