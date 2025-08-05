@echo off
:: Leadership Skills Formation Platform - Bombardier
:: Script de inicio para Windows

echo ==========================================
echo Leadership Skills Formation Platform
echo Bombardier - Iniciando servidor...
echo ==========================================

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo    Por favor instala Node.js versión 16 o superior
    echo    Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version

:: Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ✅ Dependencias ya instaladas
)

:: Configurar variables de entorno
set NODE_ENV=production
set PORT=3001

echo.
echo 🔧 Variables de entorno configuradas:
echo    NODE_ENV: %NODE_ENV%
echo    PORT: %PORT%
echo.
echo 🚀 Iniciando servidor en puerto 3001...
echo    Accede a: http://localhost:3001
echo    Para acceso remoto: http://[IP-DEL-SERVIDOR]:3001
echo.
echo 📋 Credenciales de administrador:
echo    Usuario: admin
echo    Contraseña: bombardier2024
echo.
echo ⏹️  Para detener el servidor: Ctrl + C
echo ==========================================
echo.

:: Iniciar el servidor
npm start

:: Pausa al final para ver cualquier mensaje de error
pause