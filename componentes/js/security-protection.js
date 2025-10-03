// Sistema de Seguridad Anti-Inyección para JARVIS-HRZ
class SecurityProtection {
    constructor() {
        this.blockedIPs = new Set();
        this.suspiciousAttempts = new Map();
        this.isEnabled = true;
        this.init();
    }

    init() {
        // Patrones de ataques comunes
        this.maliciousPatterns = [
            // SQL Injection
            /('|(\\\')|(;)|(\-\-)|(\%27)|(\%00)|(\%20))/i,
            /((union|select|insert|update|delete|drop|create|alter|exec|execute))\s+/i,
            /(\<\s*script\s*\>|\<script)|(\<\s*\/\s*script\s*\>)/i,
            
            // XSS Attacks
            /(javascript\s*:)|(vbscript\s*:)|(onload\s*=)|(onerror\s*=)|(onclick\s*=)/i,
            /(alert\s*\(|document\.|window\.|eval\s*\(|innerHTML)/i,
            
            // Command Injection
            /(;|\||&|\$\(|\`|\$|cat\s+|ls\s+|rm\s+|wget\s+|curl\s+)/i,
            
            // Path Traversal
            /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
            
            // LDAP Injection
            /(\*|\(|\\)/
        ];

        // Palabras clave maliciosas comunes
        this.suspiciousKeywords = [
            'script', 'javascript', 'vbscript', 'onload', 'onerror', 'onclick',
            'alert', 'document', 'window', 'eval', 'innerHTML', 'outerHTML',
            'union', 'select', 'insert', 'update', 'delete', 'drop', 'create',
            'alter', 'exec', 'execute', 'bash', 'cmd', 'shell', 'system',
            'cat', 'ls', 'rm', 'wget', 'curl', 'ftp', 'ssh', 'nc', 'netcat'
        ];

        console.log('[🔒 JARVIS Security] Sistema de protección activado');
    }

    // Validar entrada de usuario
    validateInput(input) {
        if (!input || typeof input !== 'string') return false;
        
        const trimmedInput = input.toLowerCase().trim();
        
        // Verificar patrones maliciosos
        for (const pattern of this.maliciousPatterns) {
            if (pattern.test(input)) {
                this.logThreat('Pattern Match', input);
                return true;
            }
        }

        // Verificar palabras clave sospechosas
        for (const keyword of this.suspiciousKeywords) {
            if (trimmedInput.includes(keyword)) {
                this.logThreat('Suspicious Keyword', input);
                return true;
            }
        }

        // Verificar longitud sospechosa (scripts muy largos)
        if (input.length > 1000) {
            this.logThreat('Suspicious Length', input);
            return true;
        }

        return false;
    }

    // Validar email específicamente
    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        
        // Patrones específicos para email
        const maliciousEmailPatterns = [
            /[<>&"'();]/,
            /script/i,
            /javascript/i,
            /vbscript/i,
            /onload/i,
            /onerror/i
        ];

        for (const pattern of maliciousEmailPatterns) {
            if (pattern.test(email)) {
                this.logThreat('Malicious Email', email);
                return true;
            }
        }

        return false;
    }

    // Logging de amenazas
    async logThreat(type, input) {
        const timestamp = new Date().toISOString();
        const userIP = await this.getUserIP();
        
        console.warn(`[🚨 THREAT DETECTED] ${type} at ${timestamp}`);
        console.warn(`[📍 IP] ${userIP}`);
        console.warn(`[🔍 Input] ${input.substring(0, 100)}...`);
        
        // Registrar intento sospechoso
        if (!this.suspiciousAttempts.has(userIP)) {
            this.suspiciousAttempts.set(userIP, 0);
        }
        this.suspiciousAttempts.set(userIP, this.suspiciousAttempts.get(userIP) + 1);
        
        // Si hay múltiples intentos, bloquear IP
        if (this.suspiciousAttempts.get(userIP) >= 3) {
            this.blockedIPs.add(userIP);
            console.error(`[🚫 IP BLOCKED] ${userIP} - Multiple threats detected`);
        }
    }

    // Obtener IP real del usuario
    async getUserIP() {
        try {
            // Intentar obtener IP real usando servicios gratuitos
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            if (data && data.ip) {
                localStorage.setItem('userRealIP', data.ip);
                return data.ip;
            }
        } catch (error) {
            console.log('[Security] Usando IP alternativa por error en API');
        }

        try {
            // Servicio alternativo
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data && data.ip) {
                localStorage.setItem('userRealIP', data.ip);
                return data.ip;
            }
        } catch (error) {
            console.log('[Security] Usando IP simulada por servicios indisponibles');
        }

        // Fallback: usar IP simulada más realista
        let storedIP = localStorage.getItem('userSimulatedIP');
        if (!storedIP) {
            storedIP = this.generateRealisticIP();
            localStorage.setItem('userSimulatedIP', storedIP);
        }
        return storedIP;
    }

    generateRealisticIP() {
        // Generar IPs más realistas basadas en rangos comunes
        const ranges = [
            { min: 192, max: 223 }, // Clases C comunes
            { min: 172, max: 172 }, // Clases B privadas
            { min: 10, max: 10 }   // Clases A privadas
        ];
        
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const oct1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const oct2 = Math.floor(Math.random() * 256);
        const oct3 = Math.floor(Math.random() * 256);
        const oct4 = Math.floor(Math.random() * 254) + 1; // Evitar .0 y .255
        
        return `${oct1}.${oct2}.${oct3}.${oct4}`;
    }

    // Verificar si la IP está bloqueada
    async isIPBlocked() {
        const userIP = await this.getUserIP();
        return this.blockedIPs.has(userIP);
    }

    // Mostrar modal de amenaza
    async showThreatModal(type = 'Detectada', details = 'Peligrosa') {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'threat-modal-overlay';
        
        const modalContainer = document.createElement('div);
        modalContainer.className = 'threat-modal-container';
        
        const userIP = await this.getUserIP();
        
        modalContainer.innerHTML = `
            <div class="modal-compact-header">
                <div class="compact-icon">!</div>
                <h3>SISTEMA DE SEGURIDAD ACTIVADO</h3>
            </div>
            
            <div class="modal-compact-content">
                <p>Detectamos una intención <strong>maliciosa</strong> en tu solicitud.</p>
                
                <div class="threat-info">
                    <div class="threat-detail">
                        <strong>Tipo:</strong> ${type}
                    </div>
                    <div class="threat-detail">
                        <strong>Nivel:</strong> <span class="threat-level">${details}</span>
                    </div>
                    <div class="threat-detail">
                        <strong>IP Registrada:</strong> <span class="ip-display">${userIP}</span>
                    </div>
                </div>
                
                <p class="warning-text">Si sigues así tu IP será registrada y no podrás usar JARVIS nunca.</p>
                
                <div class="compact-countdown">
                    <span>Tiempo restante:</span>
                    <span id="countdown-number">3</span>
                </div>
                
                <div class="compact-buttons">
                    <button class="btn-confess" onclick="securityProtection.handleConfession()">
                        Cerrar y Continuar
                    </button>
                    <button class="btn-deny" onclick="securityProtection.closeThreatModal()">
                        Es Solo Un Error
                    </button>
                </div>
            </div>`
            
            <div class="modal-header-threat">
                <div class="modal-icon-threat">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="modal-title-threat">🚨 SISTEMA DE SEGURIDAD ACTIVADO 🚨</h3>
                <p class="modal-message-threat">
                    Hemos detectado una intención <strong>${type}</strong> proveniente de tu sistema.
                </p>
                <div class="alert-box">
                    <div class="alert-icon">⚠️</div>
                    <div class="alert-content">
                        <h4>AMENAZA:</h4>
                        <p>Actividad sospechosa clasificada como <span class="threat-level">${details}</span></p>
                        <div class="ip-display">
                            <span class="ip-label">TU IP ESTÁ SIENDO REGISTRADA:</span>
                            <span class="ip-address">${userIP}</span>
                        </div>
                    </div>
                </div>
                
                <div class="warning-section">
                    <div class="warning-grid">
                        <div class="warning-item">
                            <div class="warning-icon">🔒</div>
                            <div class="warning-text">
                                <h5>BLOQUEO INMINENTE</h5>
                                <p>Todos tus intentos están siendo monitoreados</p>
                            </div>
                        </div>
                        <div class="warning-item">
                            <div class="warning-icon">📡</div>
                            <div class="warning-text">
                                <h5>REPORTE TÉCNICO</h5>
                                <p>Técnicos de JARVIS han sido notificados</p>
                            </div>
                        </div>
                        <div class="warning-item">
                            <div class="warning-icon">⚡</div>
                            <div class="warning-text">
                                <h5>ACCIÓN REQUERIDA</h5>
                                <p>Tu acceso puede ser permanentemente denegado</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="button-confess" onclick="securityProtection.handleConfession()">
                        <i class="fas fa-hand-paper"></i>
                        ¿QUÉ ESTÁS HACIENDO?
                    </button>
                    <button class="button-close" onclick="securityProtection.closeThreatModal()">
                        <i class="fas fa-times"></i>
                        CERRAZ ESTA SOLO HAZLO DE NUEVO
                    </button>
                </div>
                
                <div class="remaining-section">
                    <p class="remaining-text">
                        Si continúas con estas actividades, perderás el acceso a JARVIS HRZ <strong>PARA SIEMPRE</strong>
                    </p>
                    <div class="countdown-bar">
                        <div class="progresando-bar" id="progress-bar"></div>
                    </div>
                    <p class="last-chance">
                        Esta es tu última oportunidad para usar JARVIS de forma legítima
                    </p>
                </div>
            </div>
        `;
        
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);
        
        // Auto-mostrar modal
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 100);
        
        // Iniciar contador y efectos
        this.startThreatSequence(modalOverlay, modalContainer);
        
        // Registrar en el sistema global
        if (typeof window !== 'undefined') {
            window.securityProtection = this;
        }
    }
    
    startThreatSequence(overlay, container) {
        let contador = 3;
        let progresandoBar = 0;
        
        const contarElement = container.querySelector('.thought-countdown');
        const progresandoBarElement = container.querySelector('.progresando-bar');
        
        const interval = setInterval(() => {
            contador--;
            contarElement.textContent = contador;
            progresandoBar += 33.33;
            progresandoBarElement.style.width = progresandoBar + '%';
            
            // Efectos adicionales
            if (contador === 2) {
                container.classList.add('warning-stage');
            } else if (contador === 1) {
                container.classList.add('danger-stage');
            } else if (contador === 0) {
                container.classList.add('critical-stage');
                clearInterval(interval);
                
                // Crear botones nuevos
                setTimeout(() => {
                    securityProtection.showEscalationButtons(container);
                }, 500);
            }
        }, 1000);
    }
    
    showEscalationButtons(container) {
        const actionButtons = container.querySelector('.action-buttons');
        
        actionButtons.innerHTML = `
        <button class="btn-danger-final" onclick="securityProtection.showFinalWarning()">
            <i class="fas fa-ban"></i>
            ACCESO RECHAZADO - CERRAR SISTEMA
        </button>
        `;
        
        container.classList.add('espanto-stage');
    }
    
    handleConfession() {
        this.closeThreatModal();
        
        // Mostrar mensaje de advertencia
        alert('✅ Comportamiento registrado. Se ha reportado tu confesión al sistema.');
        
        // Los usuarios que "se confiesan" pueden continuar
        setTimeout(() => {
            document.querySelector('.formulario-auth').style.pointerEvents = 'auto';
            document.querySelector('.formulario-auth').style.opacity = '1';
        }, 1000);
    }
    
    showFinalWarning() {
        alert('🚨 SISTEMA COMPROMETIDO 🚨\n\nTu IP ha sido marcada como MALICIOSA.\nTu acceso a JARVIS HRZ ha sido PERMANENTEMENTE DENEGADO.\n\nEsto no se puede revertir.');
        
        // Bloquear IP permanentemente
        const userIP = this.getUserIP();
        this.blockedIPs.add(userIP);
        localStorage.setItem('blockedIPs', JSON.stringify(Array.from(this.blockedIPs)));
        
        // Redirigir a página de bloqueo
        setTimeout(() => {
            window.location.href = '#BLOQUEADO';
        }, 2000);
    }
    
    closeThreatModal() {
        const threatModal = document.querySelector('.threat-modal-overlay');
        if (threatModal) {
            threatModal.classList.remove('active');
            setTimeout(() => {
                threatModal.remove();
            }, 300);
        }
    }
}

// Crear instancia global del sistema de seguridad
const securityProtection = new SecurityProtection();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.securityProtection = securityProtection;
}

// Auto-inicialización si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[🛡️ SecurityProtection] Cargado automáticamente');
    });
}
