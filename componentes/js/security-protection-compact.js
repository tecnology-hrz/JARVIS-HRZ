// Sistema de Seguridad Anti-Inyección Compacto para JARVIS-HRZ
class SecurityProtectionCompact {
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

        console.log('[Security] Sistema de protección compacto activado');
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

        // Verificar longitud sospechosa
        if (input.length > 1000) {
            this.logThreat('Suspicious Length', input);
        }

        return false;
    }

    // Validar email específicamente
    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        
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

    // Obtener IP real del usuario
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            if (data && data.ip) {
                localStorage.setItem('userRealIP', data.ip);
                return data.ip;
            }
        } catch (error) {
            console.log('[Security] Usando IP alternativa');
        }

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data && data.ip) {
                localStorage.setItem('userRealIP', data.ip);
                return data.ip;
            }
        } catch (error) {
            console.log('[Security] Usando IP simulada');
        }

        // Fallback: IP simulada realista
        let storedIP = localStorage.getItem('userSimulatedIP');
        if (!storedIP) {
            storedIP = this.generateRealisticIP();
            localStorage.setItem('userSimulatedIP', storedIP);
        }
        return storedIP;
    }

    generateRealisticIP() {
        const ranges = [
            { min: 192, max: 223 },
            { min: 172, max: 172 },
            { min: 10, max: 10 }
        ];
        
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const oct1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const oct2 = Math.floor(Math.random() * 256);
        const oct3 = Math.floor(Math.random() * 256);
        const oct4 = Math.floor(Math.random() * 254) + 1;
        
        return `${oct1}.${oct2}.${oct3}.${oct4}`;
    }

    // Logging de amenazas
    async logThreat(type, input) {
        const timestamp = new Date().toISOString();
        const userIP = await this.getUserIP();
        
        console.warn(`[THREAT DETECTED] ${type} at ${timestamp}`);
        console.warn(`[IP] ***.***.**.*** (registerada segurmente)`);
        console.warn(`[Input] ${input.substring(0, 100)}...`);
        
        if (!this.suspiciousAttempts.has(userIP)) {
            this.suspiciousAttempts.set(userIP, 0);
        }
        this.suspiciousAttempts.set(userIP, this.suspiciousAttempts.get(userIP) + 1);
        
        if (this.suspiciousAttempts.get(userIP) >= 3) {
            this.blockedIPs.add(userIP);
            console.error(`[IP BLOCKED] ***.***.**.*** - Multiple threats detected`);
        }
    }

    // Verificar si la IP está bloqueada
    async isIPBlocked() {
        const userIP = await this.getUserIP();
        return this.blockedIPs.has(userIP);
    }

    // Mostrar modal compacto de amenaza
    async showThreatModal(type = 'Detectada', details = 'Peligrosa') {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'threat-modal-overlay';
        
        const modalContainer = document.createElement('div');
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
                        <strong>IP Registrada:</strong> <span class="ip-display">***.***.**.***</span>
                    </div>
                </div>
                
                <p class="warning-text">Si sigues así tu IP será registrada y no podrás usar JARVIS nunca.</p>
                
                <div class="compact-countdown">
                    <span>Tiempo restante:</span>
                    <span id="countdown-number">3</span>
                </div>
                
                <div class="compact-buttons">
                    <button class="btn-confess" onclick="securityProtectionCompact.handleConfession()">
                        Cerrar y Continuar
                    </button>
                    <button class="btn-deny" onclick="securityProtectionCompact.closeThreatModal()">
                        Es Solo Un Error
                    </button>
                </div>
            </div>`;
        
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);
        
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 100);
        
        this.startCountdown(modalOverlay);
        
        if (typeof window !== 'undefined') {
            window.securityProtectionCompact = this;
        }
    }
    
    startCountdown(overlay) {
        let countdown = 3;
        const countdownElement = document.getElementById('countdown-number');
        
        const interval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(interval);
                setTimeout(() => {
                    this.closeThreatModal();
                }, 500);
            }
        }, 1000);
    }
    
    handleConfession() {
        this.closeThreatModal();
        alert('Comportamiento registrado. Continuando con el proceso legítimo.');
        
        setTimeout(() => {
            const form = document.querySelector('.formulario-auth');
            if (form) {
                form.style.pointerEvents = 'auto';
                form.style.opacity = '1';
            }
        }, 1000);
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

// Crear instancia global del sistema de seguridad compacto
const securityProtectionCompact = new SecurityProtectionCompact();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.securityProtectionCompact = securityProtectionCompact;
}

// Auto-inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[Security Protection Compact] Cargado automáticamente');
    });
}
