// --- DATOS DE PRODUCTOS (Paleta integrada en placeholders) ---
// Utilizo el color CREMA de fondo para las imágenes y MARRÓN para el texto
const productos = [
    {
        id: 1,
        name: "Separadores de Libros",
        price: 8750,
        description: "Set de separadores minimalistas cortados con precisión láser. Ideales para amantes de la lectura que valoran el diseño sutil. Un detalle premium para tu biblioteca.",
        image: "https://placehold.co/800x800/FCF5E1/856A48?text=Separadores", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX1" 
    },
    {
        id: 2,
        name: "Porta Llaves",
        price: 22500,
        description: "Organizador de entrada elegante y funcional. Mantené tus llaves en su lugar con una pieza de diseño geométrico que eleva la estética de cualquier recibidor.",
        image: "https://placehold.co/800x800/FCF5E1/856A48?text=Porta+Llaves",
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX2"
    },
    {
        id: 3,
        name: "Organizador de Cables",
        price: 12500,
        description: "La solución definitiva para un escritorio minimalista. Este bloque de MDF sujeta tus cables de carga evitando enredos, manteniendo tu espacio de trabajo impecable.",
        image: "https://placehold.co/800x800/FCF5E1/856A48?text=Organizador", 
        link: "https://articulo.mercadolibre.com.ar/MLA-XXXX3"
    }
];

// --- FORMATO DE MONEDA ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(price);
};

// --- NAVBAR EFECTO SCROLL ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- RENDERIZAR PRODUCTOS EN EL DOM ---
const renderProductos = () => {
    const grid = document.getElementById('grid-productos');
    if(!grid) return;
    
    grid.innerHTML = '';
    
    productos.forEach((p, index) => {
        const card = document.createElement('article');
        card.className = 'card fade-in-up';
        // Añadir un pequeño retraso a cada tarjeta para efecto cascada
        card.style.transitionDelay = `${index * 0.15}s`;
        
        card.onclick = () => openModal(p.id);
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="card-info">
                <h3 class="card-title">${p.name}</h3>
                <p class="card-price">${formatPrice(p.price)}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
};

// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

window.openModal = (id) => {
    const p = productos.find(prod => prod.id === id);
    if (!p) return;

    // Rellenar datos
    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-title').textContent = p.name;
    document.getElementById('modal-price').textContent = formatPrice(p.price);
    document.getElementById('modal-desc').textContent = p.description;
    document.getElementById('modal-link').href = p.link;

    // Mostrar modal
    modal.showModal();
    
    // Bloquear scroll de la página de fondo
    document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
    modal.close();
    // Restaurar scroll
    document.body.style.overflow = 'auto';
};

closeModalBtn.addEventListener('click', closeModal);

// Cerrar haciendo click fuera de la caja blanca
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

// --- ANIMACIONES ON SCROLL (Apple-like Fade In Up) ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    rootMargin: "0px 0px -50px 0px"
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar año del footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Generar las tarjetas
    renderProductos();
    
    // Aplicar observador de animaciones a todos los elementos con la clase
    const elementsToAnimate = document.querySelectorAll('.fade-in-up');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
});