// Script de protección simple - Sin alertas
(function() {
    'use strict';

    // Bloquear click derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Bloquear teclas de desarrollador
    document.addEventListener('keydown', function(e) {
        // F12 - Abrir DevTools
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I - Abrir DevTools
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J - Abrir Console
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C - Selector de elementos
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U - Ver código fuente
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S - Guardar página
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
    });

    // Bloquear selección de texto
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Bloquear arrastrar
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Detectar si se abren las DevTools
    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Redirigir a la misma página para cerrar DevTools
                window.location.reload();
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Bloquear console.log
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
    console.debug = function() {};

    // Bloquear acceso a DevTools
    Object.defineProperty(window, 'devtools', {
        get: function() {
            return {};
        },
        set: function() {}
    });

})();
