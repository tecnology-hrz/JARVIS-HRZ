// Sistema de Descarga para JARVIS HRZ
// Maneja las descargas gratuitas y premium, con verificación de cuenta activa para Premium

// Importar Firestore desde la configuración (requiere que este archivo se cargue como módulo)
import { db, collection, getDocs, query, where } from './Config.js';

class SistemaDescarga {
    constructor() {
        this.inicializar();
    }

    inicializar() {
        console.log('Sistema de descarga JARVIS HRZ inicializado');
        this.crearModalVerificacionPremium();
    }

    // Descargar versión gratuita
    descargarGratuito(plataforma) {
        console.log(`Iniciando descarga gratuita para ${plataforma}`);
        
        // Simular descarga
        this.simularDescarga(plataforma, 'gratuita');
        
        // Mostrar notificación
        this.mostrarNotificacion('success', `Descarga de ${plataforma} gratuita iniciada`);
    }

    // Descargar versión premium
    descargarPremium(plataforma) {
        console.log(`Solicitando verificación para descarga premium en ${plataforma}`);

        this.solicitarYVerificarUsuario()
            .then((verificado) => {
                if (!verificado) {
                    this.mostrarNotificacion('error', 'Cuenta no activa o no encontrada. No se permite la descarga.');
                    return;
                }

                // Simular descarga sólo si está verificado
        this.simularDescarga(plataforma, 'premium');
                this.mostrarNotificacion('success', `Descarga de ${plataforma} premium iniciada`);
            })
            .catch((error) => {
                console.error('Error en verificación premium:', error);
                this.mostrarNotificacion('error', 'Error verificando la cuenta. Intenta de nuevo.');
            });
    }

    // Pedir correo mediante modal y verificar en Firestore si la cuenta está activa y vigente
    async solicitarYVerificarUsuario() {
        const email = await this.solicitarEmailPorModal();
        if (!email) {
            return false;
        }

        try {
            const usuariosRef = collection(db, 'usuarios');
            const q = query(usuariosRef, where('email', '==', email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return false;
            }

            // Tomar el primer resultado
            const doc = snapshot.docs[0];
            const usuario = doc.data();

            // Validar activo
            if (!usuario.activo) {
                return false;
            }

            // Validar no vencido si existe fechaVencimiento (tipo Timestamp)
            if (usuario.fechaVencimiento && typeof usuario.fechaVencimiento.toDate === 'function') {
                const ahora = new Date();
                const vencimiento = usuario.fechaVencimiento.toDate();
                if (ahora > vencimiento) {
                    return false;
                }
            }

            return true;
        } catch (e) {
            console.error('Error consultando usuario en Firestore:', e);
            return false;
        }
    }

    // Crear modal de verificación premium (una sola vez)
    crearModalVerificacionPremium() {
        if (document.getElementById('modal-verificacion-premium')) return;

        const modalHTML = `
            <div id="modal-verificacion-premium" class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h2 class="modal-title">Verificar cuenta Premium</h2>
                        <p class="modal-message">Ingresa tu correo para validar que tu suscripción esté activa.</p>
                    </div>
                    <div class="modal-body">
                        <label for="input-email-premium" class="modal-label">Correo electrónico</label>
                        <input id="input-email-premium" type="email" class="modal-input" placeholder="tucorreo@ejemplo.com" autocomplete="email" />
                        <div id="error-email-premium" class="modal-error" style="display:none;">Ingresa un correo válido.</div>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="btn-cancelar-premium">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        <button class="modal-btn modal-btn-confirm" id="btn-confirmar-premium">
                            <i class="fas fa-check"></i>
                            Verificar
                        </button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Mostrar modal y resolver con el email ingresado o null si se cancela
    solicitarEmailPorModal() {
        return new Promise((resolve) => {
            const modal = document.getElementById('modal-verificacion-premium');
            const input = document.getElementById('input-email-premium');
            const btnCancelar = document.getElementById('btn-cancelar-premium');
            const btnConfirmar = document.getElementById('btn-confirmar-premium');
            const error = document.getElementById('error-email-premium');

            if (!modal || !input || !btnCancelar || !btnConfirmar) {
                resolve(null);
                return;
            }

            const cerrar = () => {
                modal.classList.remove('active');
                // Limpiar handlers para evitar fugas
                btnCancelar.onclick = null;
                btnConfirmar.onclick = null;
                modal.onclick = null;
                document.removeEventListener('keydown', onKey);
            };

            const validar = (valor) => {
                const v = (valor || '').trim().toLowerCase();
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                return re.test(v) ? v : '';
            };

            const onKey = (e) => {
                if (e.key === 'Escape') {
                    cerrar();
                    resolve(null);
                }
                if (e.key === 'Enter') {
                    confirmar();
                }
            };

            const confirmar = () => {
                const correo = validar(input.value);
                if (!correo) {
                    if (error) error.style.display = 'block';
                    input.focus();
                    return;
                }
                if (error) error.style.display = 'none';
                cerrar();
                resolve(correo);
            };

            // Mostrar modal y enfocar
            modal.classList.add('active');
            input.value = '';
            if (error) error.style.display = 'none';
            setTimeout(() => input.focus(), 50);

            // Handlers
            btnCancelar.onclick = () => { cerrar(); resolve(null); };
            btnConfirmar.onclick = () => { confirmar(); };
            modal.onclick = (e) => { if (e.target === modal) { cerrar(); resolve(null); } };
            document.addEventListener('keydown', onKey);
        });
    }

    // Simular proceso de descarga
    simularDescarga(plataforma, tipo) {
        const botones = document.querySelectorAll(`[onclick*="descargar${tipo.charAt(0).toUpperCase() + tipo.slice(1)}('${plataforma}')"]`);
        
        botones.forEach(boton => {
            const textoOriginal = boton.innerHTML;
            boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Descargando...';
            boton.disabled = true;
            
            // Simular tiempo de descarga
            setTimeout(() => {
                boton.innerHTML = '<i class="fas fa-check"></i> Descargado';
                boton.style.background = 'var(--success-color)';
                
                // Restaurar botón después de 3 segundos
                setTimeout(() => {
                    boton.innerHTML = textoOriginal;
                    boton.disabled = false;
                    boton.style.background = '';
                }, 3000);
            }, 2000);
        });
    }

    // Mostrar notificación
    mostrarNotificacion(tipo, mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${mensaje}</span>
        `;

        // Estilos para la notificación
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: var(--dark-bg);
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;

        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notificacion);

        // Remover notificación después de 4 segundos
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 4000);
    }

}

// Funciones globales para los botones (exponer en window por ser módulo)
window.descargarGratuito = function(plataforma) {
    if (window.sistemaDescarga) {
        window.sistemaDescarga.descargarGratuito(plataforma);
    }
};

window.descargarPremium = function(plataforma) {
    if (window.sistemaDescarga) {
        window.sistemaDescarga.descargarPremium(plataforma);
    }
};

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaDescarga = new SistemaDescarga();
    console.log('Sistema de descarga JARVIS HRZ inicializado');
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaDescarga;
}
