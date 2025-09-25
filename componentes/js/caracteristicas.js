// Sistema de Características para JARVIS HRZ
// Maneja animaciones e interacciones de la sección de características

class SistemaCaracteristicas {
    constructor() {
        this.inicializar();
    }

    inicializar() {
        this.configurarAnimaciones();
        this.configurarInteracciones();
        this.iniciarAnimacionesScroll();
        console.log('Sistema de características JARVIS HRZ inicializado');
    }

    configurarAnimaciones() {
        // Configurar animaciones de entrada
        this.observadorScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Aplicar animaciones iniciales
        const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
        tarjetas.forEach((tarjeta, index) => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(30px)';
            tarjeta.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.observadorScroll.observe(tarjeta);
        });
    }

    configurarInteracciones() {
        // Efectos hover para las tarjetas
        const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
        
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('mouseenter', () => {
                this.activarEfectosHover(tarjeta);
            });

            tarjeta.addEventListener('mouseleave', () => {
                this.desactivarEfectosHover(tarjeta);
            });

            // Efecto de click
            tarjeta.addEventListener('click', () => {
                this.activarEfectoClick(tarjeta);
            });
        });

        // Animaciones para los mockups
        this.configurarAnimacionesMockups();
    }

    activarEfectosHover(tarjeta) {
        const imagen = tarjeta.querySelector('.imagen-caracteristica');
        const mockup = tarjeta.querySelector('.mockup-chat, .mockup-codigo, .mockup-apps, .mockup-recordatorios, .mockup-documentos, .mockup-internet');
        
        if (imagen) {
            imagen.style.transform = 'scale(1.02)';
            imagen.style.transition = 'transform 0.3s ease';
        }

        if (mockup) {
            mockup.style.transform = 'scale(1.05)';
            mockup.style.transition = 'transform 0.3s ease';
        }

        // Efecto de brillo
        tarjeta.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
    }

    desactivarEfectosHover(tarjeta) {
        const imagen = tarjeta.querySelector('.imagen-caracteristica');
        const mockup = tarjeta.querySelector('.mockup-chat, .mockup-codigo, .mockup-apps, .mockup-recordatorios, .mockup-documentos, .mockup-internet');
        
        if (imagen) {
            imagen.style.transform = 'scale(1)';
        }

        if (mockup) {
            mockup.style.transform = 'scale(1)';
        }

        tarjeta.style.boxShadow = '';
    }

    activarEfectoClick(tarjeta) {
        // Efecto de ripple
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;

        const rect = tarjeta.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        tarjeta.style.position = 'relative';
        tarjeta.appendChild(ripple);

        // Agregar animación CSS
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remover ripple después de la animación
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    configurarAnimacionesMockups() {
        // Animación del chat
        this.animarChat();
        
        // Animación del código
        this.animarCodigo();
        
        // Animación de las apps
        this.animarApps();
        
        // Animación de recordatorios
        this.animarRecordatorios();
        
        // Animación de documentos
        this.animarDocumentos();
        
        // Animación de internet
        this.animarInternet();
    }

    animarChat() {
        const chatTarjeta = document.querySelector('.mockup-chat');
        if (!chatTarjeta) return;

        const typingIndicator = chatTarjeta.querySelector('.typing-indicator');
        if (typingIndicator) {
            // Mostrar/ocultar indicador de escritura
            setInterval(() => {
                typingIndicator.style.opacity = typingIndicator.style.opacity === '0' ? '1' : '0';
            }, 3000);
        }
    }

    animarCodigo() {
        const codigoTarjeta = document.querySelector('.mockup-codigo');
        if (!codigoTarjeta) return;

        const lineasCodigo = codigoTarjeta.querySelectorAll('.linea-codigo');
        
        // Animar aparición de líneas de código
        lineasCodigo.forEach((linea, index) => {
            linea.style.opacity = '0';
            linea.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                linea.style.transition = 'all 0.5s ease';
                linea.style.opacity = '1';
                linea.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    animarApps() {
        const appsTarjeta = document.querySelector('.mockup-apps');
        if (!appsTarjeta) return;

        const appIcons = appsTarjeta.querySelectorAll('.app-icon');
        
        // Animar iconos de apps
        appIcons.forEach((icon, index) => {
            icon.style.transform = 'scale(0)';
            icon.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, index * 100);
        });
    }

    animarRecordatorios() {
        const recordatoriosTarjeta = document.querySelector('.mockup-recordatorios');
        if (!recordatoriosTarjeta) return;

        const recordatorios = recordatoriosTarjeta.querySelectorAll('.recordatorio-item');
        
        // Animar aparición de recordatorios
        recordatorios.forEach((recordatorio, index) => {
            recordatorio.style.opacity = '0';
            recordatorio.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                recordatorio.style.transition = 'all 0.4s ease';
                recordatorio.style.opacity = '1';
                recordatorio.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animarDocumentos() {
        const documentosTarjeta = document.querySelector('.mockup-documentos');
        if (!documentosTarjeta) return;

        const documentos = documentosTarjeta.querySelectorAll('.documento-item');
        
        // Animar aparición de documentos
        documentos.forEach((documento, index) => {
            documento.style.opacity = '0';
            documento.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                documento.style.transition = 'all 0.4s ease';
                documento.style.opacity = '1';
                documento.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    animarInternet() {
        const internetTarjeta = document.querySelector('.mockup-internet');
        if (!internetTarjeta) return;

        const resultados = internetTarjeta.querySelectorAll('.search-result');
        
        // Animar aparición de resultados de búsqueda
        resultados.forEach((resultado, index) => {
            resultado.style.opacity = '0';
            resultado.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultado.style.transition = 'all 0.4s ease';
                resultado.style.opacity = '1';
                resultado.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    iniciarAnimacionesScroll() {
        // Reiniciar animaciones cuando se hace scroll
        let timeoutId;
        window.addEventListener('scroll', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                this.verificarAnimaciones();
            }, 100);
        });
    }

    verificarAnimaciones() {
        const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
        const windowHeight = window.innerHeight;
        
        tarjetas.forEach(tarjeta => {
            const rect = tarjeta.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible && tarjeta.style.opacity === '0') {
                tarjeta.style.opacity = '1';
                tarjeta.style.transform = 'translateY(0)';
            }
        });
    }

    // Método para activar animaciones manualmente
    activarAnimaciones() {
        const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
        tarjetas.forEach((tarjeta, index) => {
            setTimeout(() => {
                tarjeta.style.opacity = '1';
                tarjeta.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Método para reiniciar animaciones
    reiniciarAnimaciones() {
        const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
        tarjetas.forEach(tarjeta => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(30px)';
        });
        
        setTimeout(() => {
            this.activarAnimaciones();
        }, 100);
    }
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaCaracteristicas = new SistemaCaracteristicas();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaCaracteristicas;
}
