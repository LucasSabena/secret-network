# ⏰ Configuración de Cron Jobs

## 🚨 IMPORTANTE: Plan Hobby de Vercel

El plan **Hobby (gratis)** de Vercel tiene limitaciones:
- **Máximo 2 cron jobs** por cuenta
- **Solo se ejecutan 1 vez al día**
- **Horario no garantizado** (puede ejecutarse en cualquier momento de la hora configurada)

Por esta razón, **NO incluimos `vercel.json` en el proyecto** para evitar bloquear el deploy.

---

## 📋 Opciones para Auto-Publicación

### Opción 1: Sin Cron (Recomendado para Hobby)

**Publicación Manual:**
- Los posts programados se quedan en estado "scheduled"
- Debes publicarlos manualmente desde el admin cuando llegue la fecha
- No requiere configuración adicional
- ✅ Funciona en plan Hobby

---

### Opción 2: Cron en Plan Hobby (Limitado)

Si quieres usar el cron en plan Hobby:

1. **Renombrar archivo:**
   ```bash
   mv vercel.json.example vercel.json
   ```

2. **El archivo ya está configurado para 1 vez al día:**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/publish-scheduled",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```
   - `0 0 * * *` = Todos los días a medianoche (aproximadamente)

3. **Limitaciones:**
   - Solo se ejecuta 1 vez al día
   - Horario no exacto (puede ser entre 00:00 y 00:59)
   - Si programas un post para las 10am, se publicará hasta medianoche

---

### Opción 3: Upgrade a Plan Pro (Recomendado para Producción)

**Beneficios:**
- Hasta 40 cron jobs
- Invocaciones ilimitadas
- Horarios exactos garantizados
- Puedes usar `0 * * * *` (cada hora)

**Costo:** $20/mes

**Configuración:**
1. Upgrade en Vercel Dashboard
2. Renombrar `vercel.json.example` a `vercel.json`
3. Cambiar schedule a `0 * * * *` para ejecución cada hora
4. Redeploy

---

### Opción 4: Alternativas Externas (Gratis)

#### A) GitHub Actions (Gratis)

Crear `.github/workflows/publish-scheduled.yml`:

```yaml
name: Publish Scheduled Posts

on:
  schedule:
    - cron: '0 * * * *'  # Cada hora
  workflow_dispatch:  # Manual trigger

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Function
        run: |
          curl -X GET "https://tu-dominio.vercel.app/api/cron/publish-scheduled" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Ventajas:**
- ✅ Gratis
- ✅ Cada hora
- ✅ Confiable

**Desventajas:**
- Requiere configurar GitHub Actions
- Requiere agregar CRON_SECRET a GitHub Secrets

---

#### B) Cron-job.org (Gratis)

1. Registrarse en https://cron-job.org
2. Crear nuevo cron job:
   - URL: `https://tu-dominio.vercel.app/api/cron/publish-scheduled`
   - Schedule: Cada hora
   - Headers: `Authorization: Bearer TU_CRON_SECRET`

**Ventajas:**
- ✅ Gratis
- ✅ Fácil de configurar
- ✅ Cada hora

**Desventajas:**
- Servicio externo
- Requiere cuenta adicional

---

#### C) EasyCron (Gratis con límites)

Similar a cron-job.org pero con interfaz más moderna.

---

## 🔐 Seguridad: CRON_SECRET

**IMPORTANTE:** Siempre protege tu endpoint de cron con un secret.

### Generar CRON_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Agregar en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agregar:
   - Key: `CRON_SECRET`
   - Value: (el string generado)
4. Redeploy

### El endpoint ya está protegido:

```typescript
// src/app/api/cron/publish-scheduled/route.ts
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## 🎯 Recomendación

**Para Plan Hobby:**
- Opción 1 (Manual) o Opción 4A (GitHub Actions)

**Para Producción:**
- Opción 3 (Plan Pro) - Más confiable y profesional

---

## 📝 Estado Actual

- ✅ Endpoint `/api/cron/publish-scheduled` creado y funcional
- ✅ Lógica de auto-publicación implementada
- ❌ `vercel.json` NO incluido (para evitar bloquear deploy en Hobby)
- ✅ `vercel.json.example` disponible para referencia

---

## 🧪 Testing Manual

Puedes probar el endpoint manualmente:

```bash
curl -X GET "https://tu-dominio.vercel.app/api/cron/publish-scheduled" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

Respuesta esperada:
```json
{
  "message": "Posts published successfully",
  "published": 2,
  "posts": [
    { "id": 1, "titulo": "Post 1" },
    { "id": 2, "titulo": "Post 2" }
  ]
}
```

---

**Última Actualización:** 24 Oct 2024
