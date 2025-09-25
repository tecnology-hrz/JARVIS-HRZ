// Funcionalidad del toggle de precios mensual/anual
document.addEventListener('DOMContentLoaded', function() {
    const toggleInput = document.getElementById('toggle-precios');
    const descuentoBadge = document.getElementById('descuento-badge');
    const ahorroPremium = document.getElementById('ahorro-premium');
    
    // Precios mensuales
    const preciosMensuales = {
        basico: { precio: '$0 USD', periodo: '/mes' },
        premium: { precio: '$5 USD', periodo: '/mes' },
        lifetime: { precio: '$200 USD', periodo: 'único' }
    };
    
    // Precios anuales (con descuento del 20%)
    const preciosAnuales = {
        basico: { precio: '$0 USD', periodo: '/año' },
        premium: { precio: '$50 USD', periodo: '/año', ahorro: 'Ahorras $10 USD' },
        lifetime: { precio: '$200 USD', periodo: 'único' }
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
    
    // Efectos de click para los botones
    const botones = document.querySelectorAll('.boton-plan');
    botones.forEach(boton => {
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
            
            // Remover ripple después de la animación
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Aquí puedes agregar la lógica de redirección o procesamiento
            console.log('Plan seleccionado:', this.textContent.trim());
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
