// --- DATOS DE PRODUCTOS ---
const productos = [
    {
        id: 1,
        name: "Mesa de comedor de madera maciza",
        price: 180000,
        description: "Mesa robusta de madera maciza, ideal para hogares modernos. Terminaciones de alta calidad tratadas con aceites naturales para resaltar la veta original de la madera. Capacidad para 6 a 8 personas.",
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX1"
    },
    {
        id: 2,
        name: "Estante flotante minimalista",
        price: 25000,
        description: "Estante moderno de líneas limpias, ideal para decoración y organización en salas de estar, dormitorios o recibidores. Sistema de anclaje invisible de alta resistencia incluido.",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX2"
    },
    {
        id: 3,
        name: "Escritorio de madera natural",
        price: 95000,
        description: "Escritorio amplio con acabado natural y estructura firme, perfecto para home office o estudios. Diseño ergonómico pensado para la comodidad durante largas horas de trabajo.",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX3"
    },
    {
        id: 4,
        name: "Banco rústico de madera",
        price: 40000,
        description: "Banco artesanal con estilo rústico, resistente y elegante. Ensamblado a mano con técnicas tradicionales de carpintería que garantizan su durabilidad a través del tiempo.",
        image: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=1000&auto=format&fit=crop",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX4"
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

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    
    slides[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

// Autoplay slider
setInterval(nextSlide, 5000);

// --- RENDERIZAR PRODUCTOS ---
const renderProducts = () => {
    const grid = document.getElementById('products-grid');
    
    productos.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'card';
        // Agregamos el onclick a TODA la card
        card.onclick = () => openModal(producto.id);
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${producto.image}" alt="${producto.name}" loading="lazy">
                <div class="card-overlay">
                    <button class="btn-ver-mas">Ver detalles</button>
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
            scrollObserver.unobserve(entry.target); // Solo se anima la primera vez
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    renderProducts();
    
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});