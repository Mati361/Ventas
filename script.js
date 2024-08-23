// Variables globales
let currentSlide = 0;
let totalSlides = document.querySelectorAll('.carousel img').length;
let carrito = [];
let totalPrecio = 0;

// Función para mostrar una diapositiva en el carrusel
function showSlide(index) {
    document.querySelectorAll('.carousel img').forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
    });
}

// Función para mostrar la siguiente diapositiva en el carrusel
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Inicializa el carrusel para cambiar de diapositiva cada 3 segundos
setInterval(nextSlide, 3000);

// Función para alternar la visibilidad del menú de navegación
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        Swal.fire({
            title: `${nombre} ya está en tu carrito.`,
            text: "¿Quieres agregarlo de nuevo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar de nuevo',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.push({ nombre, precio, imagen });
                totalPrecio += precio;
                mostrarCarrito();
            }
        });
    } else {
        carrito.push({ nombre, precio, imagen });
        totalPrecio += precio;
        mostrarCarrito();
    }
}

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';
    carrito.forEach(item => {
        carritoItems.innerHTML += `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <p>${item.nombre} - $${item.precio}</p>
            </div>
        `;
    });
    document.getElementById('total-precio').innerText = `$${totalPrecio}`;
}

// Función para vaciar el carrito
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esto eliminará todos los productos de tu carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            totalPrecio = 0;
            mostrarCarrito();
        }
    });
}

// Función para mostrar el formulario de compra
function mostrarFormulario() {
    document.getElementById('formulario-compra').style.display = 'flex';
}

// Función para manejar el envío del formulario
document.getElementById('compraForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: '¡Gracias!',
                text: 'Muchas gracias por contactarnos, nos pondremos en contacto con usted.',
                icon: 'success'
            }).then(() => {
                form.reset();
                document.getElementById('formulario-compra').style.display = 'none';
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un problema al enviar el formulario. Por favor, inténtelo nuevamente.',
                icon: 'error'
            });
        }
    });
});

// Función para filtrar productos por término de búsqueda
document.getElementById('search').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').innerText.toLowerCase();
        producto.style.display = nombre.includes(searchTerm) ? 'block' : 'none';
    });
});
