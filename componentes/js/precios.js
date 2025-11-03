// Funcionalidad del toggle de precios mensual/anual
document.addEventListener('DOMContentLoaded', function() {
    const toggleInput = document.getElementById('toggle-precios');
    const descuentoBadge = document.getElementById('descuento-badge');
    const ahorroPremium = document.getElementById('ahorro-premium');
    
    // Precios mensuales
    const preciosMensuales = {
        basico: { precio: '$0 USD', periodo: '/mes' },
        premium: { precio: '$5 USD', periodo: '/mes' },
        lifetime: { precio: '$50 USD', periodo: 'único' }
    };
    
    // Precios anuales (con descuento del 20%)
    const preciosAnuales = {
        basico: { precio: '$0 USD', periodo: '/año' },
        premium: { precio: '$26 USD', periodo: '/año', ahorro: 'Ahorras $34 USD' },
        lifetime: { precio: '$50 USD', periodo: 'único' }
    };
    
    // Función para actualizar precios
    function actualizarPrecios(esAnual) {
        const precios = esAnual ? preciosAnuales : preciosMensuales;
        
        // Actualizar precio básico
        document.getElementById('precio-basico').textContent = precios.basico.precio;
        document.getElementById('periodo-basico').textContent = precios.basico.periodo;
        
        // Actualizar precio premium
        document.getElementById('precio-premium').textContent = precios.premium.precio;
        document.getElementById('periodo-premium').textContent = precios.premium.periodo;
        
        // Mostrar/ocultar badge de ahorro para premium
        if (esAnual && precios.premium.ahorro) {
            ahorroPremium.textContent = precios.premium.ahorro;
            ahorroPremium.style.display = 'block';
        } else {
            ahorroPremium.style.display = 'none';
        }
        
        // Actualizar precio lifetime
        document.getElementById('precio-lifetime').textContent = precios.lifetime.precio;
        document.getElementById('periodo-lifetime').textContent = precios.lifetime.periodo;
    }
    
    // Event listener para el toggle
    toggleInput.addEventListener('change', function() {
        const esAnual = this.checked;
        actualizarPrecios(esAnual);
        
        // Actualizar etiquetas del toggle
        const mensualLabel = document.getElementById('mensual-label');
        const anualLabel = document.getElementById('anual-label');
        
        if (esAnual) {
            mensualLabel.style.color = 'var(--text-muted)';
            anualLabel.style.color = 'var(--neon-blue)';
            descuentoBadge.style.display = 'inline-block';
        } else {
            mensualLabel.style.color = 'var(--neon-blue)';
            anualLabel.style.color = 'var(--text-muted)';
            descuentoBadge.style.display = 'none';
        }
    });
    
    // Inicializar con precios mensuales
    actualizarPrecios(false);
    
    // Efectos de hover para las tarjetas
    const tarjetas = document.querySelectorAll('.tarjeta-precio');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('destacado') 
                ? 'scale(1.05) translateY(-10px)' 
                : 'translateY(-10px)';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('destacado') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
        });
    });
    
    // Función para mostrar modal de WhatsApp
    function mostrarModalWhatsApp(plan) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        // Determinar el tipo de facturación según el toggle actual (solo para planes con suscripción)
        const toggleInput = document.getElementById('toggle-precios');
        const tipoFacturacion = toggleInput.checked ? 'anual' : 'mensual';
        const esLifetime = plan.toLowerCase().includes('lifetime');
        
        modalContainer.innerHTML = `
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <h3 class="modal-title">Redirección a WhatsApp</h3>
                <p class="modal-message">
                    Serás redirigido al WhatsApp de nuestro asesor para realizar el pago del <strong>${plan}</strong> de manera segura y personalizada.
                </p>
                ${!esLifetime ? `
                <p class="modal-message" style="margin-top: 1rem; font-size: 1rem; color: var(--neon-blue);">
                    Tipo de suscripción: <strong>${tipoFacturacion.charAt(0).toUpperCase() + tipoFacturacion.slice(1)}</strong>
                </p>
                ` : `
                <p class="modal-message" style="margin-top: 1rem; font-size: 1rem; color: var(--neon-blue);">
                    Pago: <strong>Único de por vida</strong>
                </p>
                `}
                <p class="modal-message" style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted); border-top: 1px solid rgba(0, 212, 255, 0.2); padding-top: 1rem;">
                    Número de contacto: <strong>+57 350 7870584</strong> (Colombia)
                </p>
            </div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-cancel" onclick="cerrarModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="modal-btn modal-btn-confirm" onclick="redirigirWhatsApp('${plan}', '${esLifetime ? 'lifetime' : tipoFacturacion}')">
                    <i class="fab fa-whatsapp"></i>
                    Ir a WhatsApp
                </button>
            </div>
        `;
        
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);
        
        // Activar modal con animación
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        // Cerrar modal al hacer click en el overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                cerrarModal();
            }
        });
    }
    
    // Función para cerrar modal
    function cerrarModal() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                modalOverlay.remove();
            }, 300);
        }
    }
    
    // Función para redirigir a WhatsApp
    function redirigirWhatsApp(plan, tipoFacturacion) {
        const numeroWhatsApp = '573507870584';
        
        // Crear mensaje personalizado según el tipo de plan
        let mensaje;
        if (tipoFacturacion === 'lifetime') {
            mensaje = `Hola, me interesa adquirir el plan ${plan} ($50 USD - pago único de por vida) de JARVIS-HRZ. Por favor, proporcióname información sobre el proceso de pago y activación.`;
        } else if (plan.toLowerCase().includes('premium')) {
            mensaje = `🎉 Hola, me interesa adquirir el plan ${plan} con la PROMO DE NOVIEMBRE (3 meses por $5 USD - ${tipoFacturacion}) de JARVIS-HRZ. Por favor, proporcióname información sobre el proceso de pago y activación.`;
        } else {
            mensaje = `Hola, me interesa adquirir el plan ${plan} (${tipoFacturacion}) de JARVIS-HRZ. Por favor, proporcióname información sobre el proceso de pago y activación.`;
        }
        
        const mensajeEncoded = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeEncoded}`;
        
        // Crear enlace temporal para redirección
        const enlaceTemporal = document.createElement('a');
        enlaceTemporal.href = urlWhatsApp;
        enlaceTemporal.target = '_blank';
        enlaceTemporal.click();
        
        cerrarModal();
    }
    
    // Hacer funciones globales para poder llamarlas desde el HTML
    window.cerrarModal = cerrarModal;
    window.redirigirWhatsApp = redirigirWhatsApp;
    
    // Efectos de click para los botones
    const botonesComunes = document.querySelectorAll('.boton-plan:not(.boton-pago)');
    botonesComunes.forEach(boton => {
        boton.addEventListener('click', function(e) {
            // Si es un enlace, no prevenir el comportamiento por defecto
            if (this.tagName === 'A') {
                return;
            }
            e.preventDefault();
            
            // Efecto de ripple para enlaces simulados como botones
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Manejar botones de pago
    const botonesPago = document.querySelectorAll('.boton-pago');
    botonesPago.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Efecto de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Mostrar modal de WhatsApp
            const planSeleccionado = this.getAttribute('data-plan');
            mostrarModalWhatsApp(planSeleccionado);
        });
    });
    
    // Animación de entrada para las tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animación de entrada a las tarjetas
    tarjetas.forEach((tarjeta, index) => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(30px)';
        tarjeta.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(tarjeta);
    });
});

// Estilos para el efecto ripple
const style = document.createElement('style');
style.textContent = `
    .boton-plan {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
