# Configuración de Variables de Entorno en Vercel

## Google Analytics 4 y Google Tag Manager

Para que funcionen correctamente en producción, necesitás agregar estas variables de entorno en Vercel:

### Pasos:
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Seleccioná tu proyecto "secret-network"
3. Ve a **Settings** → **Environment Variables**
4. Agregá las siguientes variables:

#### Google Analytics 4
- **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Value:** `G-N20G3FK3KB`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Google Tag Manager
- **Key:** `NEXT_PUBLIC_GTM_ID`
- **Value:** `GTM-P6J4M3XL`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

5. Click en **Save** para cada variable
6. **Redeploy** el proyecto para que tome las nuevas variables

### Verificación
Una vez deployado, verificá que funciona:

#### Google Analytics (Tiempo Real)
- URL: https://analytics.google.com/analytics/web/#/p12283172678/realtime/overview
- Abrí tu sitio en otra pestaña y deberías verte en tiempo real

#### Google Tag Manager (Debug)
- Instalá la extensión "Tag Assistant" de Chrome
- Visitá tu sitio: https://secret-network.vercel.app
- Deberías ver que GTM-P6J4M3XL está funcionando

### Información de tu cuenta
- **Nombre del flujo:** secret network web
- **URL del flujo:** https://www.secret-network.vercel.app/
- **ID del flujo:** 12283172678
- **ID de medición GA4:** G-N20G3FK3KB
- **ID de GTM:** GTM-P6J4M3XL

## ✅ Estado Actual
- ✅ Google Analytics 4 configurado en el código
- ✅ Google Tag Manager configurado en el código
- ✅ Scripts agregados al layout (head y body)
- ✅ Variables de entorno en `.env.local`
- ⏳ **PENDIENTE:** Agregar variables en Vercel y redeploy
