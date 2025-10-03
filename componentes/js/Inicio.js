// ===========================================
// FUNCIONALIDAD PARA LA SECCIÓN DE INICIO
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada para las tarjetas de características
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animación a las tarjetas de características
    const tarjetas = document.querySelectorAll('.tarjeta-caracteristica');
    tarjetas.forEach((tarjeta, index) => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(30px)';
        tarjeta.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(tarjeta);
    });

    // Aplicar animación a los beneficios
    const beneficios = document.querySelectorAll('.beneficio');
    beneficios.forEach((beneficio, index) => {
        beneficio.style.opacity = '0';
        beneficio.style.transform = 'translateX(-30px)';
        beneficio.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(beneficio);
    });

    // Efecto parallax eliminado - la imagen permanece fija

    // Efecto de hover mejorado para las imágenes
    const imagenes = document.querySelectorAll('.img-caracteristica, .img-informacion');
    imagenes.forEach(imagen => {
        imagen.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        imagen.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Smooth scroll para los enlaces internos
    const enlacesInternos = document.querySelectorAll('a[href^="#"]');
    enlacesInternos.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustar para el menú fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto de escritura para el título principal
    const tituloPrincipal = document.querySelector('.titulo-principal');
    if (tituloPrincipal) {
        const textoOriginal = tituloPrincipal.textContent;
        tituloPrincipal.textContent = '';
        
        let i = 0;
        const escribirTexto = () => {
            if (i < textoOriginal.length) {
                tituloPrincipal.textContent += textoOriginal.charAt(i);
                i++;
                setTimeout(escribirTexto, 100);
            }
        };
        
        setTimeout(escribirTexto, 500);
    }

    // Efecto de partículas de fondo (opcional)
    function crearParticulas() {
        const seccionHero = document.querySelector('.seccion-hero');
        if (!seccionHero) return;

        for (let i = 0; i < 20; i++) {
            const particula = document.createElement('div');
            particula.className = 'particula';
            particula.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 212, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                animation: flotar ${3 + Math.random() * 4}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            seccionHero.appendChild(particula);
        }
    }

    // Agregar estilos para las partículas
    const estiloParticulas = document.createElement('style');
    estiloParticulas.textContent = `
        @keyframes flotar {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(estiloParticulas);

    // Crear partículas de fondo
    crearParticulas();

    // Overlay tecnológico sobre la imagen principal
    function crearOverlayTecnologico() {
        const contenedorImg = document.querySelector('.imagen-hero');
        if (!contenedorImg) return;

        // Evitar duplicados si se vuelve a ejecutar
        if (contenedorImg.querySelector('.overlay-tec')) return;

        const overlay = document.createElement('div');
        overlay.className = 'overlay-tec';

        // Generar nodos (puntos luminosos)
        for (let i = 0; i < 8; i++) {
            const nodo = document.createElement('span');
            nodo.className = 'tec-nodo';
            const size = 6 + Math.random() * 10; // 6-16px
            nodo.style.width = `${size}px`;
            nodo.style.height = `${size}px`;
            nodo.style.left = `${10 + Math.random() * 80}%`;
            nodo.style.top = `${10 + Math.random() * 80}%`;
            nodo.style.setProperty('--dur', `${5 + Math.random() * 4}s`);
            overlay.appendChild(nodo);
        }

        // Generar líneas de barrido
        for (let i = 0; i < 3; i++) {
            const linea = document.createElement('span');
            linea.className = 'tec-linea';
            linea.style.width = `${30 + Math.random() * 40}%`;
            linea.style.height = '2px';
            linea.style.top = `${20 + Math.random() * 60}%`;
            linea.style.left = `${-30 + Math.random() * 10}%`;
            linea.style.setProperty('--dur', `${4 + Math.random() * 3}s`);
            overlay.appendChild(linea);
        }

        // Generar hexágonos orbitando
        for (let i = 0; i < 4; i++) {
            const hex = document.createElement('span');
            hex.className = 'tec-hex';
            const size = 24 + Math.random() * 20; // 24-44px
            hex.style.width = `${size}px`;
            hex.style.height = `${size}px`;
            hex.style.left = `${15 + Math.random() * 70}%`;
            hex.style.top = `${15 + Math.random() * 70}%`;
            hex.style.setProperty('--rad', `${12 + Math.random() * 18}px`);
            hex.style.setProperty('--dur', `${8 + Math.random() * 6}s`);
            overlay.appendChild(hex);
        }

        contenedorImg.appendChild(overlay);
    }

    crearOverlayTecnologico();

    // ===========================================
    // MODAL PARA IMÁGENES DE CARACTERÍSTICAS
    // ===========================================

    // Elementos del modal
    const modalImagen = document.getElementById('modal-imagen');
    const imagenModal = document.getElementById('imagen-modal');
    const cerrarModal = document.getElementById('cerrar-modal');

    // Función para abrir el modal
    function abrirModalImagen(imagenSrc, imagenAlt) {
        imagenModal.src = imagenSrc;
        imagenModal.alt = imagenAlt;
        modalImagen.classList.add('mostrar');
        modalImagen.style.display = 'block';
        
        // Prevenir scroll del cuerpo
        document.body.style.overflow = 'hidden';
        
        // Agregar animación de entrada
        setTimeout(() => {
            modalImagen.style.opacity = '1';
        }, 10);
    }

    // Función para cerrar el modal
    function cerrarModalImagen() {
        modalImagen.classList.remove('mostrar');
        modalImagen.style.opacity = '0';
        
        // Restaurar scroll del cuerpo
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modalImagen.style.display = 'none';
        }, 300);
    }

    // Agregar eventos de click a todas las imágenes de características
    const imagenesCaracteristicas = document.querySelectorAll('.img-caracteristica');
    imagenesCaracteristicas.forEach(imagen => {
        imagen.addEventListener('click', function() {
            const imagenSrc = this.src;

            // Si la imagen tiene un atributo data-fullsize, usarlo
            const imagenFullSize = this.getAttribute('data-fullsize');
            const srcToUse = imagenFullSize || imagenSrc;

            abrirModalImagen(srcToUse, this.alt);
        });
    });

    // Eventos para cerrar el modal
    cerrarModal.addEventListener('click', cerrarModalImagen);

    // Cerrar al hacer click fuera de la imagen
    modalImagen.addEventListener('click', function(e) {
        if (e.target === modalImagen) {
            cerrarModalImagen();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalImagen.style.display === 'block') {
            cerrarModalImagen();
        }
    });

    console.log('🎉 JARVIS-HRZ: Sección de inicio inicializada correctamente');
});