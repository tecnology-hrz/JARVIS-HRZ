# 🎮 Galaxy Online II - Servidor Privado

## 📋 Tabla de Contenidos
- [¿Qué es este proyecto?](#qué-es-este-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Cómo Iniciar el Juego](#cómo-iniciar-el-juego)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Puertos Utilizados](#puertos-utilizados)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuración](#configuración)
- [Solución de Problemas](#solución-de-problemas)

---

## 🎯 ¿Qué es este proyecto?

Este es un **servidor privado completo** de Galaxy Online II, un juego espacial multijugador masivo (MMO) originalmente desarrollado en Flash. El proyecto incluye:

- ✅ Backend completo en Java (Spring Boot)
- ✅ Frontend web en React
- ✅ Cliente Flash del juego
- ✅ CDN para recursos estáticos
- ✅ Base de datos MongoDB
- ✅ Sistema de autenticación
- ✅ Sistema de chat en tiempo real
- ✅ Combates, construcción, comercio y más

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                             │
│                    (Flash Browser)                          │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌────────────────┐
    │   Frontend     │          │ Cliente Flash  │
    │   (React)      │          │   (Juego)      │
    │   Puerto 1000  │          │   Puerto 8080  │
    └────────┬───────┘          └────────┬───────┘
             │                           │
             │                           │ Carga SWF
             │                           ▼
             │                  ┌────────────────┐
             │                  │      CDN       │
             │                  │  Puerto 7000   │
             │                  │  (Archivos SWF)│
             │                  └────────────────┘
             │
             │ HTTP/WebSocket
             ▼
    ┌────────────────────────────────────┐
    │         Backend Java               │
    │      (Spring Boot)                 │
    │  Puerto 9090 (API REST)            │
    │  Puerto 5050 (Socket Server)       │
    └────────────┬───────────────────────┘
                 │
                 │ Guarda/Lee datos
                 ▼
        ┌────────────────┐
        │    MongoDB     │
        │  Puerto 27017  │
        │  (Base Datos)  │
        └────────────────┘
```

---

## 💻 Requisitos del Sistema

### Software Necesario

| Software | Versión Mínima | Propósito |
|----------|----------------|-----------|
| **Node.js** | v14+ | Frontend React y servidores HTTP |
| **Java JDK** | 17+ | Backend del juego |
| **MongoDB** | 4.4+ | Base de datos |
| **Maven** | 3.6+ | Compilación del backend (incluido) |
| **http-server** | Latest | Servir archivos estáticos |
| **Flash Browser** | - | Ejecutar el cliente Flash |

### Instalación de Requisitos

```bash
# Node.js y npm
# Descarga desde: https://nodejs.org/

# Java 17
# Descarga desde: https://adoptium.net/

# MongoDB
# Descarga desde: https://www.mongodb.com/try/download/community

# http-server (después de instalar Node.js)
npm install -g http-server

# Flash Browser
# Descarga desde: https://github.com/radubirsan/FlashBrowser/releases
```

---

## 📦 Instalación

### 1. Clonar o Descargar el Proyecto

```bash
git clone <url-del-repositorio>
cd Juego_Galaxy
```

### 2. Instalar Dependencias del Frontend

```bash
cd website
npm install
cd ..
```

### 3. Copiar Archivos SWF al CDN

```bash
COPIAR_ARCHIVOS_CDN.bat
```

Este script copia todos los archivos Flash (.swf) necesarios desde `Servidor-ON/app/client/asset/` hacia `cdn/asset/`.

### 4. Verificar Configuración

```bash
verificar_configuracion.bat
```

Este script verifica que todo esté correctamente configurado antes de iniciar.

---

## 🚀 Cómo Iniciar el Juego

### Paso 1: Iniciar MongoDB

Abre una terminal CMD **como Administrador** y ejecuta:

```bash
mongod
```

**⚠️ IMPORTANTE:** Deja esta ventana abierta. MongoDB debe estar corriendo todo el tiempo.

### Paso 2: Iniciar Todos los Servicios

Ejecuta el script principal:

```bash
INICIAR_SUPERGO2.bat
```

Este script iniciará automáticamente:
1. ✅ CDN (Puerto 7000)
2. ✅ Backend Java (Puertos 9090 y 5050)
3. ✅ Frontend React (Puerto 1000)
4. ✅ Cliente Flash (Puerto 8080)

**Se abrirán 4 ventanas CMD. NO las cierres.**

### Paso 3: Abrir el Juego

1. Abre **Flash Browser**
2. Ve a: `http://localhost:1000`
3. Crea una cuenta o inicia sesión
4. Crea tu primer planeta
5. ¡El juego se abrirá automáticamente!

### Paso 4: Detener Todo

Cuando termines de jugar:

```bash
DETENER_TODO.bat
```

O simplemente cierra todas las ventanas CMD que se abrieron.

---

## 📁 Estructura del Proyecto

```
Juego_Galaxy/
│
├── cdn/                              # CDN - Archivos estáticos
│   ├── asset/                        # Archivos SWF del juego
│   │   ├── 0001Client.swf           # Recursos del cliente
│   │   ├── Ship1Client.swf          # Gráficos de naves
│   │   ├── 0630galaxy_asset.swf     # Mapa de galaxia
│   │   └── ... (70+ archivos)
│   ├── images/                       # Imágenes
│   │   └── profile/                  # Avatares de usuarios
│   ├── crossdomain.xml              # Seguridad Flash
│   └── start.bat                     # Iniciar CDN manualmente
│
├── supergo2-server-closed-alpha/    # Backend Java
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/                # Código Java
│   │   │   │   └── com/go2super/
│   │   │   │       ├── database/    # Entidades y repositorios
│   │   │   │       ├── packet/      # Comunicación con cliente
│   │   │   │       ├── service/     # Lógica del juego
│   │   │   │       └── socket/      # Servidor de sockets
│   │   │   └── resources/
│   │   │       ├── application.yml  # Configuración principal
│   │   │       └── data/            # Datos del juego (JSON)
│   │   └── test/
│   ├── pom.xml                      # Dependencias Maven
│   └── mvnw                         # Maven Wrapper
│
├── website/                          # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   ├── views/                   # Páginas
│   │   └── App.js                   # Aplicación principal
│   ├── package.json                 # Dependencias npm
│   └── .env                         # Variables de entorno
│
├── Servidor-ON/                      # Cliente Flash
│   └── app/
│       └── client/
│           ├── index.html           # Página del juego
│           ├── main.swf             # Cliente Flash principal
│           └── data/
│               └── config.xml       # Configuración del cliente
│
├── logs/                             # Logs del sistema
│
├── INICIAR_SUPERGO2.bat             # 🚀 Script principal de inicio
├── DETENER_TODO.bat                 # 🛑 Detener todos los servicios
├── COPIAR_ARCHIVOS_CDN.bat          # 📦 Copiar archivos SWF
├── verificar_configuracion.bat      # ✅ Verificar configuración
└── README.md                         # Este archivo
```

---

## 🔌 Puertos Utilizados

| Puerto | Servicio | Descripción |
|--------|----------|-------------|
| **1000** | Frontend React | Página web de inicio/login |
| **5050** | Backend Socket | Comunicación en tiempo real con el juego |
| **7000** | CDN | Archivos SWF y recursos estáticos |
| **8080** | Cliente Flash | El juego en sí |
| **9090** | Backend API | API REST para el frontend |
| **27017** | MongoDB | Base de datos |

---

## 🛠️ Scripts Disponibles

### INICIAR_SUPERGO2.bat
**Propósito:** Inicia todos los servicios necesarios para jugar.

**Qué hace:**
1. Verifica que MongoDB esté corriendo
2. Inicia el CDN en puerto 7000
3. Inicia el Backend Java en puertos 9090/5050
4. Inicia el Frontend React en puerto 1000
5. Inicia el Cliente Flash en puerto 8080

**Uso:**
```bash
INICIAR_SUPERGO2.bat
```

---

### DETENER_TODO.bat
**Propósito:** Detiene todos los servicios del juego.

**Qué hace:**
- Mata los procesos en los puertos 1000, 5050, 7000, 8080 y 9090
- NO detiene MongoDB (debes hacerlo manualmente)

**Uso:**
```bash
DETENER_TODO.bat
```

---

### COPIAR_ARCHIVOS_CDN.bat
**Propósito:** Copia los archivos SWF al CDN.

**Qué hace:**
- Crea las carpetas necesarias en `cdn/`
- Copia todos los archivos .swf desde `Servidor-ON/app/client/asset/`
- Copia archivos de música

**Cuándo usarlo:**
- Primera instalación
- Después de actualizar archivos SWF
- Si el CDN no tiene archivos

**Uso:**
```bash
COPIAR_ARCHIVOS_CDN.bat
```

---

### verificar_configuracion.bat
**Propósito:** Verifica que todo esté correctamente configurado.

**Qué verifica:**
- ✅ Node.js instalado
- ✅ Java instalado
- ✅ http-server instalado
- ✅ Archivos de configuración correctos
- ✅ Archivos SWF en el CDN
- ✅ Puertos disponibles
- ✅ MongoDB corriendo

**Uso:**
```bash
verificar_configuracion.bat
```

---

### CONFIGURAR_RECURSOS_INICIALES.bat
**Propósito:** Modificar los recursos iniciales de los usuarios (oro, metal, mall points, etc.).

**Qué hace:**
- Te permite configurar cuánto oro, metal, he3 y mall points reciben los usuarios
- Actualiza TODOS los usuarios existentes en la base de datos

**Uso:**
```bash
cd supergo2-server-closed-alpha
CONFIGURAR_RECURSOS_INICIALES.bat
```

---

## ⚙️ Configuración

### Configuración del Backend (application.yml)

Archivo: `supergo2-server-closed-alpha/src/main/resources/application.yml`

```yaml
application:
  game:
    resources-url: http://localhost:7000/  # URL del CDN
    max-users: 3                            # Máximo de planetas por cuenta
    register: true                          # Permitir registro
    login: true                             # Permitir login
    test-mode: true                         # Modo de prueba
    fast-ship-building: true                # Construcción rápida
    fast-corp-upgrade: true                 # Mejoras rápidas
```

### Configuración del Cliente Flash (config.xml)

Archivo: `Servidor-ON/app/client/data/config.xml`

```xml
<config>
    <path>http://localhost:7000/</path>  <!-- URL del CDN -->
</config>
```

### Configuración del Frontend (.env)

Archivo: `website/.env`

```env
REACT_APP_API_URL=http://localhost:9090
REACT_APP_CLIENT=http://localhost:8080
```

---

## 🔧 Solución de Problemas

### Problema: "MongoDB NO esta corriendo"

**Solución:**
1. Abre CMD como Administrador
2. Ejecuta: `mongod`
3. Deja la ventana abierta
4. Vuelve a ejecutar `INICIAR_SUPERGO2.bat`

---

### Problema: "Puerto ya está en uso"

**Solución:**
```bash
# Detener todos los servicios
DETENER_TODO.bat

# O manualmente matar el proceso
netstat -ano | findstr :7000
taskkill /PID <numero_pid> /F
```

---

### Problema: "No se cargan los archivos SWF"

**Solución:**
```bash
# Copiar archivos al CDN
COPIAR_ARCHIVOS_CDN.bat

# Verificar que existan
dir cdn\asset\*.swf
```

---

### Problema: "El juego no se conecta al servidor"

**Verificar:**
1. Backend corriendo en puerto 5050
2. Cliente Flash en puerto 8080
3. CDN en puerto 7000

```bash
netstat -ano | findstr ":5050 :7000 :8080"
```

---

### Problema: "Error al compilar el backend"

**Solución:**
```bash
cd supergo2-server-closed-alpha
mvnw clean install
mvnw spring-boot:run
```

---

### Problema: "Frontend no inicia"

**Solución:**
```bash
cd website
npm install
npm start
```

---

## 📊 Flujo Completo del Sistema

### 1. Inicio de Sesión
```
Usuario → Frontend (1000) → Backend API (9090) → MongoDB (27017)
                                    ↓
                            Genera token de sesión
                                    ↓
                            Devuelve al Frontend
```

### 2. Carga del Juego
```
Frontend abre Cliente Flash (8080) con token
                ↓
Cliente Flash se conecta a Backend Socket (5050)
                ↓
Cliente Flash carga recursos desde CDN (7000)
                ↓
        ¡Juego funcionando!
```

### 3. Jugando
```
Acciones del jugador → Cliente Flash (8080)
                            ↓
                    Backend Socket (5050)
                            ↓
                    Procesa lógica del juego
                            ↓
                    Guarda en MongoDB (27017)
                            ↓
                    Envía respuesta al cliente
```

---

## 🎮 Características del Juego

- ✅ Sistema de combate en tiempo real
- ✅ Construcción de naves y edificios
- ✅ Exploración de galaxias
- ✅ Sistema de alianzas (Corps)
- ✅ Chat global y privado
- ✅ Comercio entre jugadores
- ✅ Misiones y recompensas
- ✅ Sistema de niveles
- ✅ Tienda (Mall) con items premium
- ✅ PvP y PvE

---

## 📝 Notas Importantes

1. **Flash Browser es necesario** - Los navegadores modernos no soportan Flash
2. **MongoDB debe estar corriendo** - Sin MongoDB, nada funciona
3. **No cierres las ventanas CMD** - Cada una ejecuta un servicio necesario
4. **Puertos deben estar libres** - Verifica con `verificar_configuracion.bat`
5. **Primera vez toma más tiempo** - El backend Java tarda 15-20 segundos en iniciar

---

## 🤝 Contribuir

Si encuentras bugs o quieres agregar funcionalidades:

1. Reporta issues
2. Crea pull requests
3. Documenta cambios

---

## 📄 Licencia

Este es un proyecto educativo/privado. Galaxy Online II es propiedad de sus respectivos dueños.

---

## 🆘 Soporte

Si tienes problemas:

1. Ejecuta `verificar_configuracion.bat`
2. Revisa los logs en `logs/application-debug.log`
3. Verifica que todos los puertos estén disponibles
4. Asegúrate de tener todos los requisitos instalados

---

## 🎯 Comandos Rápidos

```bash
# Iniciar todo
INICIAR_SUPERGO2.bat

# Detener todo
DETENER_TODO.bat

# Verificar configuración
verificar_configuracion.bat

# Copiar archivos SWF
COPIAR_ARCHIVOS_CDN.bat

# Ver logs del backend
type logs\application-debug.log

# Conectarse a MongoDB
mongosh go2super
```

---

**¡Disfruta jugando Galaxy Online II! 🚀✨**
