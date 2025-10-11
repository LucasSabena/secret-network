# 🚀 Migración de Imágenes a Cloudinary

Este script automatiza la migración de todas las imágenes desde `framerusercontent.com` a Cloudinary.

## 📋 Requisitos Previos

### 1. Cuenta de Cloudinary
- Crea una cuenta gratuita en [Cloudinary](https://cloudinary.com/)
- Ve a tu [Dashboard](https://console.cloudinary.com/)
- Copia estas credenciales:
  - **Cloud Name**
  - **API Key**
  - **API Secret**

### 2. Service Role Key de Supabase
- Ve a tu proyecto en [Supabase](https://supabase.com/)
- Dashboard > Project Settings > API
- Copia la **service_role** key (⚠️ Esta key tiene permisos de admin)

## ⚙️ Configuración

### 1. Agregar variables de entorno a `.env.local`:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Supabase Service Role (solo para scripts)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 2. Instalar dependencias (si no lo has hecho):

```bash
npm install
```

## 🎯 Ejecución

### Migrar todas las imágenes:

```bash
npm run migrate:images
```

## 📊 Qué hace el script:

1. ✅ Busca todos los programas con imágenes de `framerusercontent.com`
2. ✅ Descarga cada imagen (íconos y capturas)
3. ✅ Las sube a Cloudinary con estructura organizada:
   - `secret-station/icons/` - Íconos de programas
   - `secret-station/screenshots/` - Capturas de pantalla
4. ✅ Actualiza automáticamente la base de datos con las nuevas URLs
5. ✅ Muestra un resumen de éxitos y errores

## 📁 Estructura en Cloudinary:

```
secret-station/
├── icons/
│   ├── figma.svg
│   ├── photoshop.svg
│   └── ...
└── screenshots/
    ├── figma-screenshot.png
    ├── photoshop-screenshot.png
    └── ...
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 
- La `SUPABASE_SERVICE_ROLE_KEY` tiene permisos completos
- **NUNCA** la incluyas en el código del cliente
- Úsala solo en scripts del servidor
- **NO** la subas a Git (está en `.gitignore`)

## 🎨 Beneficios de Cloudinary:

✅ **Rendimiento**: CDN global ultra rápido
✅ **Optimización automática**: WebP, compresión inteligente
✅ **Transformaciones**: Redimensiona imágenes on-the-fly
✅ **Cache**: Mucho mejor que Framer
✅ **Confiabilidad**: 99.9% uptime

## 🐛 Solución de Problemas

### Error: "Cannot find module 'cloudinary'"
```bash
npm install cloudinary
```

### Error: "Invalid credentials"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que `.env.local` esté en la raíz del proyecto

### Error de Supabase
- Verifica que tu `SUPABASE_SERVICE_ROLE_KEY` sea correcta
- Confirma que tenga permisos para actualizar la tabla `programas`

## 📈 Después de la Migración

Una vez completada la migración:

1. ✅ Las imágenes estarán en Cloudinary
2. ✅ La base de datos tendrá las nuevas URLs
3. ✅ La página cargará MUCHO más rápido
4. ✅ Puedes eliminar las referencias a `framerusercontent.com` del `next.config.ts`

## 🔄 Re-ejecutar el Script

El script es **idempotente** - puedes ejecutarlo múltiples veces sin problemas:
- Si una imagen ya existe en Cloudinary, la sobrescribirá
- Solo procesa imágenes que todavía estén en Framer
- Es seguro ejecutarlo varias veces

## 💡 Tips

- El script hace pausas de 500ms entre imágenes para no saturar las APIs
- Muestra progreso en tiempo real en la consola
- Al final muestra un resumen completo
- Si algo falla, puedes revisar qué programas tuvieron error y re-ejecutar

## 🎉 Resultado Esperado

Después de ejecutar el script, verás algo como:

```
🚀 Iniciando migración de imágenes...

📊 Encontrados 150 programas con imágenes de Framer

📦 Procesando: Figma (figma)
📥 Descargando icon para figma...
✅ icon subido: https://res.cloudinary.com/...
✅ Base de datos actualizada para Figma

...

==================================================
📊 RESUMEN DE MIGRACIÓN
==================================================
✅ Exitosos: 148
❌ Errores: 2
📦 Total procesados: 150
==================================================

🎉 Migración completada!
```
