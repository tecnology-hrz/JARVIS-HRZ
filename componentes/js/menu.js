// Funcionalidad del menú móvil lateral
const botonHamburger = document.getElementById('boton-hamburger');
const menuMovil = document.getElementById('menu-movil');
const overlayMenu = document.getElementById('overlay-menu');
const botonCerrarMovil = document.getElementById('boton-cerrar-movil');

// Función para abrir el menú
function abrirMenu() {
    menuMovil.classList.add('activo');
    overlayMenu.classList.add('activo');
    botonHamburger.classList.add('activo');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

// Función para cerrar el menú
function cerrarMenu() {
    menuMovil.classList.remove('activo');
    overlayMenu.classList.remove('activo');
    botonHamburger.classList.remove('activo');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// Abrir menú con botón hamburger
botonHamburger.addEventListener('click', abrirMenu);

// Cerrar menú con botón X
botonCerrarMovil.addEventListener('click', cerrarMenu);

// Cerrar menú al hacer clic en el overlay
overlayMenu.addEventListener('click', cerrarMenu);

// Cerrar menú al hacer clic en un enlace
const enlacesMovil = document.querySelectorAll('.enlace-movil');
enlacesMovil.forEach(enlace => {
    enlace.addEventListener('click', cerrarMenu);
});

// Cerrar menú con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuMovil.classList.contains('activo')) {
        cerrarMenu();
    }
});