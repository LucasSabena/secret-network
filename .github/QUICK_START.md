# Quick Start - Agregar Programas a Secret Network

> Guía rápida de referencia. Para instrucciones completas ver `GUIA_CARGA_BASE_DATOS.md`

## 🚀 Proceso en 5 Pasos

### 1️⃣ Preparar JSON
Crea `temporal/nuevos-programas.json`:

```json
{
  "nuevos_programas": [
    {
      "slug": "tu-programa",
      "nombre": "Tu Programa",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": ["diseño-ui-ux-y-prototipado"],
      "descripcion_corta": "<p>Descripción breve</p>",
      "descripcion_larga": "<p>Descripción larga...</p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": ["web", "macos", "windows"],
      "modelos_precios_slugs": ["freemium", "suscripcion"],
      "dificultad": "Facil",
      "es_open_source": false,
      "es_recomendado": true,
      "web_oficial_url": "https://ejemplo.com",
      "alternativas_slugs": ["programa-1", "programa-2"]
    }
  ]
}
```

### 2️⃣ Ejecutar Script
```bash
node scripts/upload-new-programs.js
```

### 3️⃣ Verificar en Supabase
- Abre https://supabase.com
- Ve a la tabla `programas`
- Verifica que se insertaron correctamente

### 4️⃣ Subir Imágenes
- Logo → Cloudinary: `secret-network/logos/`
- Screenshot → Cloudinary: `secret-network/screenshots/`

### 5️⃣ Actualizar URLs
```sql
UPDATE programas
SET 
  icono_url = 'URL_DEL_LOGO',
  captura_url = 'URL_DEL_SCREENSHOT'
WHERE slug = 'tu-programa';
```

---

## ⚡ Comandos Rápidos

```bash
# Desarrollo
npm run dev

# Cargar programas
node scripts/upload-new-programs.js

# Ver variables de entorno
cat .env.local
```

---

## ⚠️ Reglas Críticas

1. **Comillas simples en HTML** → `'texto'` NO `"texto"`
2. **Dificultad exacta** → `"Facil"`, `"Intermedio"` o `"Dificil"`
3. **Slugs existentes** → Verifica en Supabase antes
4. **IDs automáticos** → No especifiques IDs manualmente

---

## 📋 Checklist

- [ ] JSON válido (sin comillas dobles en HTML)
- [ ] Todos los slugs verificados
- [ ] `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Script ejecutado sin errores
- [ ] Programas verificados en Supabase
- [ ] Imágenes subidas a Cloudinary
- [ ] URLs actualizadas en base de datos
- [ ] Verificado en localhost:3000

---

## 🆘 Errores Comunes

| Error | Solución |
|-------|----------|
| `categoria not found` | Usa nombre con mayúsculas: "Programas De Diseño" |
| `created_at column` | Script ya corregido, actualízalo |
| `categoria_slug required` | Script ya incluye este campo |
| `JSON parse error` | Comillas dobles en HTML, usar simples |

---

## 📚 Más Info

- **Guía completa:** `.github/GUIA_CARGA_BASE_DATOS.md`
- **Resumen de cambios:** `.github/RESUMEN_CAMBIOS_OCT2025.md`
- **Manifesto del proyecto:** `.github/copilot-instrucciones.md`

---

**Última actualización:** Octubre 2025
