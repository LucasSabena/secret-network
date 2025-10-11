# 🚀 Guía Rápida de Deploy a Vercel

## ¿Por qué Vercel?

Tu app usa Next.js que fue creado por Vercel. En Vercel:
- ✅ ISR funciona automáticamente (páginas pre-renderizadas)
- ✅ CDN global (carga rápida desde cualquier lugar)
- ✅ Deploy automático con cada push a GitHub
- ✅ HTTPS gratis
- ✅ Plan gratuito muy generoso

---

## 🎯 Método 1: Deploy Rápido (5 minutos)

### 1. Instala Vercel CLI
```bash
npm i -g vercel
```

### 2. Login
```bash
vercel login
```
Sigue las instrucciones (email o GitHub)

### 3. Deploy
```bash
vercel
```

Responde las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → No
- **Project name?** → secret-station (o el que quieras)
- **Directory?** → ./ (presiona Enter)
- **Override settings?** → No

### 4. ¡Listo!
Te dará una URL como: `https://secret-station-abc123.vercel.app`

### 5. Deploy a Producción
```bash
vercel --prod
```

---

## 🎯 Método 2: Deploy con GitHub (Recomendado)

### 1. Crear repositorio en GitHub

```bash
# Si no tienes git iniciado:
git init

# Agrega todos los archivos
git add .

# Commit
git commit -m "feat: app completa con optimizaciones"

# Crea repo en GitHub y conecta
git remote add origin https://github.com/TU_USUARIO/secret-station.git
git branch -M main
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New..." → "Project"
3. Importa tu repo de GitHub
4. Click "Deploy"

### 3. Deploy Automático

Ahora cada vez que hagas `git push`, Vercel deployará automáticamente.

---

## ⚙️ Variables de Entorno

Después del primer deploy, agrega tus variables:

1. Ve al dashboard de Vercel
2. Tu proyecto → Settings → Environment Variables
3. Agrega estas variables (copia de tu `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Redeploy para aplicar las variables:
   - Ve a Deployments
   - Click en el último deploy
   - Click en "..." → "Redeploy"

---

## 🧪 Verificar que ISR Funciona

Después del deploy:

### 1. Abre DevTools (F12)
- Ve a la pestaña "Network"
- Recarga la página
- Busca el documento HTML principal
- En Headers debería decir: `x-vercel-cache: HIT` o `STALE`

### 2. Verifica la velocidad
```bash
# Reemplaza con tu URL
curl -w "Tiempo total: %{time_total}s\n" -o /dev/null -s https://tu-app.vercel.app
```

Debería ser < 0.5s (500ms)

### 3. Lighthouse
1. Abre tu sitio en Chrome
2. F12 → Lighthouse
3. Run audit
4. Performance Score debería ser 90+

---

## 📊 Resultados Esperados

| Métrica | Localhost | Vercel |
|---------|-----------|---------|
| Primera carga | 2000ms | 100-200ms |
| Navegación | 2000ms | 50ms |
| Performance Score | 60-70 | 90-95 |
| ISR | ❌ No funciona | ✅ Funciona |

---

## 🐛 Troubleshooting

### Error: "Build failed"
- Revisa los logs en Vercel dashboard
- Asegúrate de que `npm run build` funcione localmente

### Error: "Internal Server Error"
- Verifica las variables de entorno
- Revisa Function Logs en Vercel dashboard

### La app funciona pero sigue lenta
1. Verifica que ISR esté activo (`x-vercel-cache` header)
2. Revisa que las variables de entorno estén configuradas
3. Espera 1 hora (ISR regenera cada hora)
4. Limpia el cache: Deployments → Redeploy

### Imágenes no cargan
- Verifica que las variables de Cloudinary estén en Vercel
- Revisa los logs de la consola del navegador

---

## 🎉 Después del Deploy

1. **Comparte tu URL** para verificar que todo funciona
2. **Ejecuta Lighthouse** para ver tu score de performance
3. **Configura dominio custom** (opcional):
   - Settings → Domains
   - Agrega tu dominio
   - Configura DNS

---

## 💰 Costo

- **Plan Hobby (Gratis):**
  - Proyectos ilimitados
  - 100 GB bandwidth/mes
  - Serverless Functions
  - Perfecto para tu caso

Si necesitas más, el plan Pro es $20/mes.

---

## 📞 Ayuda

Después del deploy, si algo no funciona:
1. Comparte el URL de Vercel
2. Comparte el error específico
3. Te ayudo a debuggearlo

¡El 99% de probabilidad es que funcione perfecto! 🚀
