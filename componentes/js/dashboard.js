// Importar funciones de Firebase
import { 
    db,
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc
} from './Config.js';

// Verificar si el usuario está logueado
function verificarSesion() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Si no está logueado, redirigir a iniciar sesión
        window.location.href = 'iniciar-sesion.html';
        return false;
    }
    
    return true;
}

// Función para formatear fechas
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    
    const fecha = new Date(fechaISO);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para calcular días restantes
function calcularDiasRestantes(fechaVencimientoISO) {
    if (!fechaVencimientoISO) return null;
    
    const ahora = new Date();
    const vencimiento = new Date(fechaVencimientoISO);
    
    // Calcular diferencia en milisegundos
    const diferencia = vencimiento - ahora;
    
    // Convertir a días
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    
    return dias;
}

// Función para obtener la clase del plan
function obtenerClasePlan(planId) {
    if (planId === 'basico') return 'plan-basico';
    if (planId === 'lifetime') return 'plan-lifetime';
    return 'plan-premium';
}

// Función para cargar información del usuario
function cargarInformacionUsuario() {
    // Obtener datos del localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPlan = localStorage.getItem('userPlan');
    const userPlanId = localStorage.getItem('userPlanId');
    const userActivo = localStorage.getItem('userActivo');
    const fechaInicio = localStorage.getItem('userFechaInicio');
    const fechaVencimiento = localStorage.getItem('userFechaVencimiento');
    
    // Actualizar el header
    document.getElementById('user-name-header').textContent = userName || 'Usuario';
    
    // Actualizar información personal
    document.getElementById('user-name').textContent = userName || 'N/A';
    document.getElementById('user-email').textContent = userEmail || 'N/A';
    
    // Estado del usuario
    const statusElement = document.getElementById('user-status');
    if (userActivo === 'true') {
        statusElement.innerHTML = '<span class="status-badge status-activo"><i class="fas fa-check-circle"></i> Activo</span>';
    } else {
        statusElement.innerHTML = '<span class="status-badge status-vencido"><i class="fas fa-times-circle"></i> Inactivo</span>';
    }
    
    // Plan actual
    const planElement = document.getElementById('user-plan');
    const clasePlan = obtenerClasePlan(userPlanId);
    planElement.innerHTML = `<span class="plan-badge ${clasePlan}">${userPlan || 'N/A'}</span>`;
    
    // Fechas
    document.getElementById('fecha-inicio').textContent = formatearFecha(fechaInicio);
    
    // Fecha de vencimiento y días restantes
    if (fechaVencimiento) {
        document.getElementById('fecha-vencimiento').textContent = formatearFecha(fechaVencimiento);
        
        const diasRestantes = calcularDiasRestantes(fechaVencimiento);
        const diasElement = document.getElementById('dias-restantes');
        
        if (diasRestantes !== null) {
            if (diasRestantes > 0) {
                diasElement.textContent = diasRestantes;
                diasElement.style.color = diasRestantes <= 7 ? '#ff9800' : '#667eea';
            } else {
                diasElement.textContent = '0';
                diasElement.style.color = '#f44336';
            }
            
            // Mostrar alerta si faltan pocos días
            mostrarAlertas(diasRestantes, userPlanId);
        }
    } else {
        document.getElementById('fecha-vencimiento').textContent = 'Sin vencimiento';
        document.getElementById('dias-restantes').textContent = '∞';
        document.getElementById('dias-restantes').nextElementSibling.textContent = 'Plan sin vencimiento';
    }
}

// Función para mostrar alertas
function mostrarAlertas(diasRestantes, planId) {
    const alertContainer = document.getElementById('alert-container');
    
    if (planId === 'basico') {
        alertContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Plan Básico</strong><br>
                    Tienes acceso a las funcionalidades básicas de JARVIS-HRZ. ¡Considera actualizar a Premium para más beneficios!
                </div>
            </div>
        `;
    } else if (planId === 'lifetime') {
        alertContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-crown" style="font-size: 1.5rem; color: #ffd700;"></i>
                <div>
                    <strong>Plan Lifetime</strong><br>
                    ¡Tienes acceso ilimitado de por vida a JARVIS-HRZ! Gracias por tu apoyo.
                </div>
            </div>
        `;
    } else if (diasRestantes !== null && diasRestantes > 0) {
        if (diasRestantes <= 7) {
            alertContainer.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>¡Tu plan está por vencer!</strong><br>
                        Te quedan ${diasRestantes} día(s) de acceso. Renueva tu suscripción para no perder el acceso.
                    </div>
                </div>
            `;
        }
    } else if (diasRestantes !== null && diasRestantes <= 0) {
        alertContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Tu plan ha vencido</strong><br>
                    Tu acceso ha expirado. Renueva tu suscripción para continuar usando JARVIS-HRZ.
                </div>
            </div>
        `;
    }
}

// Función para cerrar sesión (usa el modal global)
window.cerrarSesion = function() {
    window.cerrarSesionGlobal();
};

// Verificar y cargar información al iniciar
if (verificarSesion()) {
    cargarInformacionUsuario();
}

