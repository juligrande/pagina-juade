// --- DATOS DE PRODUCTOS ---
const productos = [
    {
        id: 1,
        name: "Mesa de Comedor Maciza",
        price: 180000,
        variants: "Roble, Petiribí, Nogal",
        description: "Mesa robusta de madera maciza, ideal para hogares modernos. Terminaciones de alta calidad tratadas con aceites naturales para resaltar la veta original de la madera. Capacidad para 6 a 8 personas. Fabricación artesanal.",
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX1"
    },
    {
        id: 2,
        name: "Estante Flotante Minimal",
        price: 25000,
        variants: "Natural, Blanco, Negro",
        description: "Líneas limpias y fijación invisible. Ideal para aportar calidez a cualquier ambiente sin sobrecargar el espacio visual. Soporta hasta 15kg.",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX2"
    },
    {
        id: 3,
        name: "Escritorio Office Elegance",
        price: 95000,
        variants: "Paraíso, Guatambú",
        description: "Diseñado para la productividad. Superficie amplia con tratamiento antimanchas y pasacables oculto integrado. El equilibrio perfecto entre función y estética.",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX3"
    },
    {
        id: 4,
        name: "Banco Rústico Heritage",
        price: 40000,
        variants: "Rústico, Barnizado",
        description: "Pieza de acento fabricada con maderas recuperadas. Cada banco cuenta una historia única a través de sus vetas y texturas irregulares.",
        image: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX4"
    },
    {
        id: 5,
        name: "Silla Nórdica Curva",
        price: 35000,
        variants: "Haya, Fresno",
        description: "Silla de diseño escandinavo con respaldo curvo al vapor. Ergonomía excepcional combinada con una silueta ligera y atemporal.",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX5"
    },
    {
        id: 6,
        name: "Mesa Ratona Industrial",
        price: 55000,
        variants: "Roble Oscuro, Natural",
        description: "Contraste perfecto entre el hierro forjado a mano y la calidez del roble macizo. El centro de atención para tu sala de estar.",
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX6"
    },
    {
        id: 7,
        name: "Perchero de Pie Premium",
        price: 28000,
        variants: "Nogal, Paraíso",
        description: "Escultura funcional. Perchero minimalista torneado a partir de un solo bloque de madera. Estabilidad garantizada por su base pesada.",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX7"
    },
    {
        id: 8,
        name: "Biblioteca Geométrica",
        price: 120000,
        variants: "Cruda, Barnizada",
        description: "Juego de proporciones y espacios vacíos. Una estantería de diseño asimétrico que actúa como separador de ambientes o pieza central.",
        image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX8"
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

// --- RENDERIZAR PRODUCTOS EN GRILLAS ---
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
                <p class="card-price">${formatPrice(producto.price)} USD</p>
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
        searchResultsContainer.innerHTML = '<li style="padding: 15px; color: #888; font-size: 0.9rem;">No se encontraron resultados.</li>';
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
    
    // Repartimos los productos
    const ultimosLanzamientos = productos.slice(0, 4);
    const masVendidos = productos.slice(4, 8); 
    
    renderGrid(ultimosLanzamientos, 'grid-lanzamientos');
    renderGrid(masVendidos, 'grid-vendidos');
    
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});