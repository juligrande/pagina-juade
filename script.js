// --- DATOS DE PRODUCTOS (Ahora son 8 para llenar la página) ---
const productos = [
    // Primeros 4 para Últimos Lanzamientos
    {
        id: 1,
        name: "Mesa de Comedor Maciza",
        price: 180000,
        variants: "Roble, Petiribí, Nogal",
        description: "Mesa robusta de madera maciza, ideal para hogares modernos. Terminaciones de alta calidad tratadas con aceites naturales para resaltar la veta original de la madera. Capacidad para 6 a 8 personas.",
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX1"
    },
    {
        id: 2,
        name: "Estante Flotante",
        price: 25000,
        variants: "Natural, Blanco, Negro",
        description: "Estante moderno de líneas limpias, ideal para decoración y organización en salas de estar, dormitorios o recibidores. Sistema de anclaje invisible de alta resistencia incluido.",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX2"
    },
    {
        id: 3,
        name: "Escritorio Office S26",
        price: 95000,
        variants: "Paraíso, Guatambú",
        description: "Escritorio amplio con acabado natural y estructura firme, perfecto para home office o estudios. Diseño ergonómico pensado para la comodidad durante largas horas de trabajo.",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX3"
    },
    {
        id: 4,
        name: "Banco Rústico Vintage",
        price: 40000,
        variants: "Rústico, Barnizado",
        description: "Banco artesanal con estilo rústico, resistente y elegante. Ensamblado a mano con técnicas tradicionales de carpintería que garantizan su durabilidad a través del tiempo.",
        image: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX4"
    },
    // Siguientes 4 para Los Más Vendidos
    {
        id: 5,
        name: "Silla Nórdica Curva",
        price: 35000,
        variants: "Haya, Fresno",
        description: "Silla de diseño nórdico con respaldo curvo para mayor ergonomía. Fabricada en madera torneada de alta resistencia.",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX5"
    },
    {
        id: 6,
        name: "Mesa Ratona Industrial",
        price: 55000,
        variants: "Roble Oscuro, Natural",
        description: "Mesa de centro que combina madera maciza con patas de hierro negro. Un toque industrial y cálido para tu living.",
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX6"
    },
    {
        id: 7,
        name: "Perchero de Pie Premium",
        price: 28000,
        variants: "Nogal, Paraíso",
        description: "Perchero minimalista de madera maciza. Excelente estabilidad y diseño que se adapta a cualquier rincón de tu casa.",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX7"
    },
    {
        id: 8,
        name: "Biblioteca Geométrica",
        price: 120000,
        variants: "Cruda, Barnizada",
        description: "Biblioteca de diseño asimétrico para exhibir libros y decoración. Amplio espacio de guardado y estructura súper firme.",
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

// --- SLIDER LOGIC ---
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

// --- RENDERIZAR PRODUCTOS EN GRILLAS SEPARADAS ---
// Creamos una funcion que recibe la lista de productos y el ID del contenedor
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
                    <button class="btn-ver-mas">Ver Detalles</button>
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
    
    // Repartimos los productos en las dos grillas
    const ultimosLanzamientos = productos.slice(0, 4); // Los primeros 4
    const masVendidos = productos.slice(4, 8); // Los ultimos 4
    
    renderGrid(ultimosLanzamientos, 'grid-lanzamientos');
    renderGrid(masVendidos, 'grid-vendidos');
    
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});