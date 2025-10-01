// Importar funciones de Firebase
import { 
    db, 
    collection, 
    getDocs,
    doc,
    updateDoc,
    query,
    where,
    Timestamp
} from './Config.js';

// Referencias a elementos del DOM
const tablaCuerpo = document.getElementById('tabla-cuerpo');
const mensaje = document.getElementById('mensaje');
const botonVerificar = document.getElementById('verificar-vencidos');

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo} visible`;
    
    setTimeout(() => {
        mensaje.classList.remove('visible');
    }, 5000);
}

// Función para formatear fecha
function formatearFecha(timestamp) {
    if (!timestamp) return 'N/A';
    
    const fecha = timestamp.toDate();
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para verificar si una cuenta ha vencido
function cuentaVencida(fechaVencimiento) {
    if (!fechaVencimiento) return false;
    
    const ahora = new Date();
    const vencimiento = fechaVencimiento.toDate();
    
    return ahora > vencimiento;
}

// Función para cargar usuarios
async function cargarUsuarios() {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        
        if (querySnapshot.empty) {
            tablaCuerpo.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        querySnapshot.forEach((documento) => {
            const usuario = documento.data();
            const vencida = cuentaVencida(usuario.fechaVencimiento);
            
            // Si la cuenta está vencida pero activa, mostrar advertencia
            const estadoTexto = usuario.activo ? 'Activo' : 'Inactivo';
            const estadoClase = usuario.activo ? 'activo' : 'inactivo';
            
            // Determinar el color de advertencia si está vencida
            let estadoFinal = `<span class="estado-badge ${estadoClase}">${estadoTexto}</span>`;
            if (vencida && usuario.activo) {
                estadoFinal = `<span class="estado-badge inactivo">Vencido</span>`;
            }
            
            html += `
                <tr data-doc-id="${documento.id}">
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td><span class="plan-badge">${usuario.plan}</span></td>
                    <td>${formatearFecha(usuario.fechaInicio)}</td>
                    <td>${formatearFecha(usuario.fechaVencimiento)}</td>
                    <td>${estadoFinal}</td>
                    <td>
                        <div class="acciones">
                            ${usuario.activo 
                                ? '<button class="boton-accion desactivar" onclick="cambiarEstado(\'' + documento.id + '\', false)">Desactivar</button>'
                                : '<button class="boton-accion activar" onclick="cambiarEstado(\'' + documento.id + '\', true)">Activar</button>'
                            }
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tablaCuerpo.innerHTML = html;
        
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarMensaje('Error al cargar los usuarios', 'error');
        tablaCuerpo.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #ff3b30;">
                    Error al cargar usuarios
                </td>
            </tr>
        `;
    }
}

// Función para cambiar el estado de un usuario
window.cambiarEstado = async function(docId, nuevoEstado) {
    try {
        const usuarioRef = doc(db, 'usuarios', docId);
        await updateDoc(usuarioRef, {
            activo: nuevoEstado
        });
        
        mostrarMensaje(
            `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
            'exito'
        );
        
        // Recargar usuarios
        await cargarUsuarios();
        
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        mostrarMensaje('Error al cambiar el estado del usuario', 'error');
    }
};

// Función para verificar y desactivar cuentas vencidas
async function verificarCuentasVencidas() {
    try {
        botonVerificar.disabled = true;
        botonVerificar.innerHTML = '<div class="loading"></div> Verificando...';
        
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        let cuentasDesactivadas = 0;
        const ahora = new Date();
        
        for (const documento of querySnapshot.docs) {
            const usuario = documento.data();
            
            // Verificar si tiene fecha de vencimiento y está activo
            if (usuario.fechaVencimiento && usuario.activo) {
                const fechaVencimiento = usuario.fechaVencimiento.toDate();
                
                // Si la fecha actual es mayor que la fecha de vencimiento
                if (ahora > fechaVencimiento) {
                    const usuarioRef = doc(db, 'usuarios', documento.id);
                    await updateDoc(usuarioRef, {
                        activo: false
                    });
                    cuentasDesactivadas++;
                }
            }
        }
        
        if (cuentasDesactivadas > 0) {
            mostrarMensaje(
                `Se desactivaron ${cuentasDesactivadas} cuenta(s) vencida(s)`,
                'exito'
            );
            await cargarUsuarios();
        } else {
            mostrarMensaje('No hay cuentas vencidas', 'exito');
        }
        
    } catch (error) {
        console.error('Error al verificar cuentas vencidas:', error);
        mostrarMensaje('Error al verificar cuentas vencidas', 'error');
    } finally {
        botonVerificar.disabled = false;
        botonVerificar.innerHTML = '<i class="fas fa-sync-alt"></i> Verificar Cuentas Vencidas';
    }
}

// Event listener para verificar cuentas vencidas
botonVerificar.addEventListener('click', verificarCuentasVencidas);

// Cargar usuarios al iniciar la página
cargarUsuarios();

// Verificar cuentas vencidas automáticamente al cargar
verificarCuentasVencidas();

// Recargar usuarios cada 30 segundos
setInterval(cargarUsuarios, 30000);

