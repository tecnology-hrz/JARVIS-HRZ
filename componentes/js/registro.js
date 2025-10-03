// Importar funciones de Firebase
import { 
    db, 
    collection, 
    addDoc,
    getDocs,
    query,
    where,
    Timestamp 
} from './Config.js';

// Referencias a elementos del DOM
const formularioRegistro = document.getElementById('formulario-registro');
const mensaje = document.getElementById('mensaje');
const botonRegistro = document.getElementById('boton-registro');

// Funcionalidad para mostrar/ocultar contraseñas en registro
const togglePasswordRegistro = document.getElementById('toggle-password-registro');
const toggleConfirmPasswordRegistro = document.getElementById('toggle-confirm-password-registro');
const passwordRegistro = document.getElementById('password');
const confirmPasswordRegistro = document.getElementById('confirm-password');

// Función genérica para toggle de contraseña
function setupPasswordToggle(toggleButton, passwordInput) {
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tipo = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = tipo;
            
            // Cambiar el ícono
            const icono = this.querySelector('i');
            if (tipo === 'text') {
                icono.className = 'fas fa-eye-slash';
                this.classList.add('active');
            } else {
                icono.className = 'fas fa-eye';
                this.classList.remove('active');
            }
        });
    }
}

// Configurar ambos toggles
setupPasswordToggle(togglePasswordRegistro, passwordRegistro);
setupPasswordToggle(toggleConfirmPasswordRegistro, confirmPasswordRegistro);

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo} visible`;
    
    setTimeout(() => {
        mensaje.classList.remove('visible');
    }, 5000);
}

// Función para calcular fecha de vencimiento
function calcularFechaVencimiento(plan) {
    const ahora = new Date();
    
    if (plan === 'premium-mensual') {
        // Añadir 30 días
        ahora.setDate(ahora.getDate() + 30);
        return ahora;
    } else if (plan === 'premium-anual') {
        // Añadir 365 días
        ahora.setDate(ahora.getDate() + 365);
        return ahora;
    }
    
    // Para básico y lifetime, no hay vencimiento
    return null;
}

// Función para obtener el nombre del plan
function obtenerNombrePlan(plan) {
    const planes = {
        'basico': 'Básico',
        'premium-mensual': 'Premium Mensual',
        'premium-anual': 'Premium Anual',
        'lifetime': 'Lifetime'
    };
    return planes[plan] || plan;
}

// Manejar el envío del formulario
formularioRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Deshabilitar botón
    botonRegistro.disabled = true;
    botonRegistro.textContent = 'Creando cuenta...';
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const plan = document.getElementById('plan').value;
    
     // Validaciones
     if (!nombre || !email || !password || !plan) {
         mostrarMensaje('Por favor, completa todos los campos', 'error');
         botonRegistro.disabled = false;
         botonRegistro.textContent = 'Crear Cuenta';
         return;
     }
     
     if (password !== confirmPassword) {
         mostrarMensaje('Las contraseñas no coinciden', 'error');
         botonRegistro.disabled = false;
         botonRegistro.textContent = 'Crear Cuenta';
         return;
     }
     
     if (password.length < 6) {
         mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
         botonRegistro.disabled = false;
         botonRegistro.textContent = 'Crear Cuenta';
         return;
     }
     
     // Verificación de seguridad contra inyección
     if (window.securityProtectionCompact) {
         const nombreThreat = window.securityProtectionCompact.validateInput(nombre);
         const emailThreat = window.securityProtectionCompact.validateEmail(email);
         const passwordThreat = window.securityProtectionCompact.validateInput(password);
         const confirmPasswordThreat = window.securityProtectionCompact.validateInput(confirmPassword);
         
         if (nombreThreat || emailThreat || passwordThreat || confirmPasswordThreat) {
             // Mostrar modal de amenaza compacto
             setTimeout(async () => {
                 await window.securityProtectionCompact.showThreatModal('MALICIOSA', 'ALTA');
             }, 500);
             
             botonRegistro.disabled = false;
             botonRegistro.textContent = 'Crear Cuenta';
             return;
         }
         
         // Verificar IP bloqueada
         const isBlocked = await window.securityProtectionCompact.isIPBlocked();
         if (isBlocked) {
             mostrarMensaje('Acceso denegado: IP bloqueada por actividad maliciosa.', 'error');
             botonRegistro.disabled = false;
             botonRegistro.textContent = 'Crear Cuenta';
             return;
         }
     }
    
    try {
        // Verificar si el email ya existe en Firestore
        const q = query(collection(db, 'usuarios'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            mostrarMensaje('Este correo electrónico ya está registrado.', 'error');
            botonRegistro.disabled = false;
            botonRegistro.textContent = 'Crear Cuenta';
            return;
        }
        
        // Calcular fechas
        const fechaInicio = new Date();
        const fechaVencimiento = calcularFechaVencimiento(plan);
        
        // Determinar si requiere pago
        const requierePago = plan !== 'basico';
        
        // Guardar usuario directamente en Firestore (sin Firebase Auth)
        await addDoc(collection(db, 'usuarios'), {
            nombre: nombre,
            email: email,
            password: password, // En producción deberías hashear esto
            plan: obtenerNombrePlan(plan),
            planId: plan,
            fechaInicio: Timestamp.fromDate(fechaInicio),
            fechaVencimiento: fechaVencimiento ? Timestamp.fromDate(fechaVencimiento) : null,
            activo: false, // Por defecto inactivo hasta que un admin lo active
            fechaCreacion: Timestamp.fromDate(new Date()),
            requierePago: requierePago
        });
        
        mostrarMensaje('¡Cuenta creada exitosamente! Un administrador debe activar tu cuenta.', 'exito');
        
        // Limpiar formulario
        formularioRegistro.reset();
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = 'iniciar-sesion.html';
        }, 3000);
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
        mostrarMensaje('Error al crear la cuenta. Intenta nuevamente.', 'error');
    } finally {
        botonRegistro.disabled = false;
        botonRegistro.textContent = 'Crear Cuenta';
    }
});

