// Sistema de verificación de sesión global
(function() {
    // Verificar si el usuario está logueado
    function verificarSesion() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userName = localStorage.getItem('userName');
        
        return {
            logueado: isLoggedIn === 'true',
            nombre: userName || 'Usuario'
        };
    }

    // Determinar la ruta correcta según la ubicación actual
    function obtenerRutaDashboard() {
        const path = window.location.pathname;
        if (path.includes('/secciones/')) {
            return 'dashboard.html';
        } else {
            return 'secciones/dashboard.html';
        }
    }

    // Crear modal de confirmación
    function crearModalCerrarSesion() {
        // Verificar si ya existe
        if (document.getElementById('modal-cerrar-sesion')) return;

        const modalHTML = `
            <div id="modal-cerrar-sesion" class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </div>
                        <h2 class="modal-title">Cerrar Sesión</h2>
                        <p class="modal-message">¿Estás seguro de que deseas cerrar tu sesión?</p>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="btn-cancelar-logout">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        <button class="modal-btn modal-btn-confirm" id="btn-confirmar-logout">
                            <i class="fas fa-sign-out-alt"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners
        const modal = document.getElementById('modal-cerrar-sesion');
        const btnCancelar = document.getElementById('btn-cancelar-logout');
        const btnConfirmar = document.getElementById('btn-confirmar-logout');

        btnCancelar.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        btnConfirmar.addEventListener('click', () => {
            ejecutarCierreSesion();
        });

        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Cerrar con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    // Mostrar modal
    function mostrarModalCerrarSesion() {
        const modal = document.getElementById('modal-cerrar-sesion');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Ejecutar cierre de sesión
    function ejecutarCierreSesion() {
        // Limpiar localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPlan');
        localStorage.removeItem('userPlanId');
        localStorage.removeItem('userDocId');
        localStorage.removeItem('userActivo');
        localStorage.removeItem('userFechaInicio');
        localStorage.removeItem('userFechaVencimiento');
        
        // Determinar ruta correcta según la ubicación actual
        const path = window.location.pathname;
        if (path.includes('/secciones/')) {
            window.location.href = 'iniciar-sesion.html';
        } else {
            window.location.href = 'secciones/iniciar-sesion.html';
        }
    }

    // Actualizar menús de navegación
    function actualizarMenus() {
        const sesion = verificarSesion();
        
        if (!sesion.logueado) return; // Solo actualizar si está logueado

        const rutaDashboard = obtenerRutaDashboard();
        
        // Actualizar menú desktop
        const menuDesktop = document.querySelector('.menu-desktop');
        if (menuDesktop) {
            const enlaceIniciarSesion = menuDesktop.querySelector('.boton-iniciar');
            
            if (enlaceIniciarSesion) {
                // Cambiar "Iniciar Sesión" por "Dashboard"
                enlaceIniciarSesion.href = rutaDashboard;
                enlaceIniciarSesion.innerHTML = 'Dashboard';
                enlaceIniciarSesion.title = 'Ir a mi Dashboard';
                
                // Agregar ícono de usuario con nombre
                const userIcon = document.createElement('i');
                userIcon.className = 'fas fa-user-circle';
                userIcon.style.marginRight = '0.5rem';
                enlaceIniciarSesion.insertBefore(userIcon, enlaceIniciarSesion.firstChild);
            }
        }

        // Actualizar menú móvil
        const menuMovil = document.querySelector('.menu-movil .lista-movil');
        if (menuMovil) {
            const enlaceIniciarSesionMovil = menuMovil.querySelector('.boton-iniciar-movil');
            
            if (enlaceIniciarSesionMovil) {
                // Cambiar "Iniciar Sesión" por "Dashboard"
                enlaceIniciarSesionMovil.href = rutaDashboard;
                const iconElement = enlaceIniciarSesionMovil.querySelector('i');
                const spanElement = enlaceIniciarSesionMovil.querySelector('span');
                
                if (iconElement) {
                    iconElement.className = 'fas fa-user-circle';
                }
                if (spanElement) {
                    spanElement.textContent = 'Dashboard';
                }
            }
        }
    }

    // Función para cerrar sesión (global) - Muestra el modal
    window.cerrarSesionGlobal = function() {
        mostrarModalCerrarSesion();
    };

    // Inicializar
    function inicializar() {
        actualizarMenus();
        crearModalCerrarSesion();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();

