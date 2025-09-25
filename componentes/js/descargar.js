// Sistema de Descarga para JARVIS HRZ
// Maneja las descargas gratuitas y premium

class SistemaDescarga {
    constructor() {
        this.inicializar();
    }

    inicializar() {
        console.log('Sistema de descarga JARVIS HRZ inicializado');
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
        console.log(`Iniciando descarga premium para ${plataforma}`);
        
        // Simular descarga
        this.simularDescarga(plataforma, 'premium');
        
        // Mostrar notificación
        this.mostrarNotificacion('success', `Descarga de ${plataforma} premium iniciada`);
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

// Funciones globales para los botones
function descargarGratuito(plataforma) {
    if (window.sistemaDescarga) {
        window.sistemaDescarga.descargarGratuito(plataforma);
    }
}

function descargarPremium(plataforma) {
    if (window.sistemaDescarga) {
        window.sistemaDescarga.descargarPremium(plataforma);
    }
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaDescarga = new SistemaDescarga();
    console.log('Sistema de descarga JARVIS HRZ inicializado');
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaDescarga;
}
