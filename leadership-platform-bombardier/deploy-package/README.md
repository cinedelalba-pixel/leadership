# Leadership Skills Formation Platform - Bombardier

Plataforma completa de formación en habilidades de liderazgo para Bombardier con funcionalidades de gestión de contenido, subida de archivos y administración.

## Características

- ✅ **Subida real de archivos**: Soporta PDF, PowerPoint, Word, Excel, videos, audio, imágenes
- ✅ **Gestión de contenido editable**: Modificación completa de textos y módulos como administrador
- ✅ **Optimización móvil**: Interfaz responsive para todos los dispositivos
- ✅ **Sincronización en tiempo real**: Cambios se reflejan automáticamente entre dispositivos
- ✅ **Autenticación segura**: Sistema de login con JWT
- ✅ **Base de datos SQLite**: Sin requerimientos de servidor de BD adicional

## Credenciales de Administrador

- **Usuario**: `admin`
- **Contraseña**: `bombardier2024`

## Instalación

### Requisitos Previos

- Node.js versión 16 o superior
- npm o yarn
- Puerto 3001 disponible

### Pasos de Instalación

1. **Extraer archivos**
   ```bash
   unzip leadership-platform-deploy.zip
   cd leadership-platform-bombardier-production
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**

   **Linux/Mac:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   **Windows:**
   ```cmd
   start.bat
   ```

   **Manual:**
   ```bash
   npm start
   ```

4. **Acceder a la aplicación**
   - Abrir navegador en: `http://localhost:3001`
   - Para acceso desde otros dispositivos: `http://[IP-DEL-SERVIDOR]:3001`

## Configuración para Servidor Web

### Apache (.htaccess incluido)

Si deseas servir desde Apache, copia el contenido de la carpeta `dist/` a tu directorio web y asegúrate de que el archivo `.htaccess` esté presente para el manejo de rutas SPA.

### Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Estructura del Proyecto

```
leadership-platform-bombardier-production/
├── dist/                    # Frontend compilado
│   ├── index.html          # Página principal
│   ├── assets/             # CSS y JS compilados
│   └── *.jpg, *.png        # Imágenes y logos
├── server/                 # Backend Express.js
│   ├── index.js           # Servidor principal
│   ├── models/            # Base de datos SQLite
│   ├── routes/            # Rutas API
│   └── uploads/           # Archivos subidos
├── package.json           # Dependencias del proyecto
├── start.sh              # Script de inicio Linux/Mac
├── start.bat             # Script de inicio Windows
└── .htaccess             # Configuración Apache
```

## Uso de la Plataforma

### Como Administrador

1. **Acceder al panel de administración**
   - Hacer clic en "Admin" en la esquina superior derecha
   - Ingresar credenciales: `admin` / `bombardier2024`

2. **Editar contenido**
   - Hacer clic en "Editar" en cualquier sección
   - Modificar textos, títulos, descripciones
   - Guardar cambios

3. **Gestionar módulos**
   - Ir a la sección "Repositorio"
   - Editar información de módulos existentes
   - Subir archivos a cada módulo
   - Eliminar archivos cuando sea necesario

4. **Gestionar recursos y testimoniales**
   - Subir documentos, videos, audio en "Recursos"
   - Agregar testimoniales con archivos multimedia
   - Organizar contenido por categorías

### Para Usuarios

1. **Navegar el contenido**
   - Explorar módulos de formación
   - Descargar recursos disponibles
   - Ver testimoniales y casos de éxito

2. **Acceso móvil**
   - La plataforma es completamente responsive
   - Navegación optimizada para dispositivos táctiles
   - Misma funcionalidad en móvil y desktop

## Tipos de Archivo Soportados

### Documentos
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)

### Multimedia
- Videos: MP4, AVI, MOV, WMV
- Audio: MP3, WAV, AAC
- Imágenes: JPG, PNG, GIF, SVG

### Otros
- Archivos comprimidos: ZIP, RAR
- Archivos de texto: TXT, CSV

## Solución de Problemas

### El servidor no inicia
1. Verificar que el puerto 3001 esté disponible
2. Comprobar que Node.js esté instalado correctamente
3. Ejecutar `npm install` para reinstalar dependencias

### Los archivos no se suben
1. Verificar permisos de escritura en la carpeta `server/uploads`
2. Comprobar que el archivo no exceda 100MB
3. Verificar que el tipo de archivo esté soportado

### Los cambios no se sincronizan
1. Verificar conexión a internet
2. Comprobar que ambos dispositivos accedan a la misma URL
3. Refrescar la página en el dispositivo que no muestra cambios

### Error de autenticación
1. Verificar credenciales: `admin` / `bombardier2024`
2. Limpiar cookies del navegador
3. Intentar en modo incógnito

## Configuración Avanzada

### Variables de Entorno

Puedes configurar las siguientes variables de entorno:

```bash
# Puerto del servidor (por defecto: 3001)
PORT=3001

# Entorno de ejecución (production para servir frontend)
NODE_ENV=production

# Secret para JWT (se genera automáticamente si no se especifica)
JWT_SECRET=tu-secret-personalizado
```

### Backup de Datos

La base de datos SQLite se encuentra en `server/database.db`. Para hacer backup:

```bash
# Copiar archivo de base de datos
cp server/database.db backup-$(date +%Y%m%d).db

# Copiar archivos subidos
cp -r server/uploads uploads-backup-$(date +%Y%m%d)
```

## Soporte

Para soporte técnico o consultas sobre la plataforma, contactar al equipo de desarrollo que implementó esta solución.

## Licencia

© 2024 Bombardier. Todos los derechos reservados.