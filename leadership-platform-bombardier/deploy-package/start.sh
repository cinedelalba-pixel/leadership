#!/bin/bash

# Leadership Skills Formation Platform - Bombardier
# Script de inicio para Linux/Mac

echo "=========================================="
echo "Leadership Skills Formation Platform"
echo "Bombardier - Iniciando servidor..."
echo "=========================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Por favor instala Node.js versión 16 o superior"
    echo "   Descarga desde: https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Error: Node.js versión $NODE_VERSION detectada"
    echo "   Se requiere Node.js versión 16 o superior"
    echo "   Descarga desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
    echo "✅ Dependencias instaladas correctamente"
else
    echo "✅ Dependencias ya instaladas"
fi

# Verificar si el puerto está disponible
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Advertencia: El puerto 3001 ya está en uso"
    echo "   Terminando procesos en el puerto 3001..."
    pkill -f "node.*3001" 2>/dev/null || true
    sleep 2
fi

# Configurar variables de entorno
export NODE_ENV=production
export PORT=3001

echo "🔧 Variables de entorno configuradas:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"

echo "🚀 Iniciando servidor en puerto 3001..."
echo "   Accede a: http://localhost:3001"
echo "   Para acceso remoto: http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo '[IP-DEL-SERVIDOR]'):3001"
echo ""
echo "📋 Credenciales de administrador:"
echo "   Usuario: admin"
echo "   Contraseña: bombardier2024"
echo ""
echo "⏹️  Para detener el servidor: Ctrl + C"
echo "=========================================="

# Iniciar el servidor
npm start