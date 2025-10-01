// Importar funciones de Firebase
import { 
    db,
    collection,
    getDocs,
    query,
    where
} from './Config.js';

// Referencias a elementos del DOM
const formularioLogin = document.getElementById('formulario-login');
const mensaje = document.getElementById('mensaje');
const botonLogin = document.getElementById('boton-login');

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo} visible`;
    
    setTimeout(() => {
        mensaje.classList.remove('visible');
    }, 5000);
}

// Función para verificar usuario y contraseña en Firestore
async function verificarUsuario(email, password) {
    try {
        const q = query(collection(db, 'usuarios'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return {
                exito: false,
                mensaje: 'No existe una cuenta con este correo electrónico.'
            };
        }
        
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // Verificar contraseña
        if (userData.password !== password) {
            return {
                exito: false,
                mensaje: 'Contraseña incorrecta.'
            };
        }
        
        // Verificar si la cuenta está activa
        if (!userData.activo) {
            return {
                exito: false,
                mensaje: 'Tu cuenta está inactiva. Contacta al administrador para activarla.'
            };
        }
        
        // Verificar si la cuenta ha vencido (solo para planes con fecha de vencimiento)
        if (userData.fechaVencimiento) {
            const fechaVencimiento = userData.fechaVencimiento.toDate();
            const ahora = new Date();
            
            if (ahora > fechaVencimiento) {
                return {
                    exito: false,
                    mensaje: 'Tu plan ha vencido. Por favor, renueva tu suscripción.'
                };
            }
        }
        
        // Login exitoso
        return {
            exito: true,
            mensaje: 'Inicio de sesión exitoso',
            userData: userData,
            docId: userDoc.id
        };
        
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return {
            exito: false,
            mensaje: 'Error al verificar las credenciales.'
        };
    }
}

// Manejar el envío del formulario
formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Deshabilitar botón
    botonLogin.disabled = true;
    botonLogin.textContent = 'Iniciando sesión...';
    
    // Obtener valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validaciones básicas
    if (!email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        botonLogin.disabled = false;
        botonLogin.textContent = 'Iniciar Sesión';
        return;
    }
    
    try {
        // Verificar usuario en Firestore
        const resultado = await verificarUsuario(email, password);
        
        if (!resultado.exito) {
            mostrarMensaje(resultado.mensaje, 'error');
            botonLogin.disabled = false;
            botonLogin.textContent = 'Iniciar Sesión';
            return;
        }
        
        // Si la verificación es exitosa, guardar datos en localStorage
        localStorage.setItem('userEmail', resultado.userData.email);
        localStorage.setItem('userName', resultado.userData.nombre);
        localStorage.setItem('userPlan', resultado.userData.plan);
        localStorage.setItem('userPlanId', resultado.userData.planId);
        localStorage.setItem('userDocId', resultado.docId);
        localStorage.setItem('userActivo', resultado.userData.activo);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Guardar fechas si existen
        if (resultado.userData.fechaInicio) {
            localStorage.setItem('userFechaInicio', resultado.userData.fechaInicio.toDate().toISOString());
        }
        if (resultado.userData.fechaVencimiento) {
            localStorage.setItem('userFechaVencimiento', resultado.userData.fechaVencimiento.toDate().toISOString());
        }
        
        // Mostrar mensaje de éxito
        mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo a tu dashboard...', 'exito');
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mostrarMensaje('Error al iniciar sesión. Intenta nuevamente.', 'error');
        botonLogin.disabled = false;
        botonLogin.textContent = 'Iniciar Sesión';
    }
});

