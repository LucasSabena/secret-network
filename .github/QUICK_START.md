# Quick Start - Agregar Programas a Secret Network

> Guía rápida de referencia. Para instrucciones completas ver `GUIA_CARGA_BASE_DATOS.md`

## ⚠️ VERIFICACIÓN PRE-CARGA (OBLIGATORIO)

**ANTES de crear el JSON, ejecuta estos comandos:**

```bash
# Ver TODAS las categorías disponibles (especialmente IDs específicos)
node scripts/list-categories.js

# Ver TODOS los programas para alternativas
node scripts/list-all-programs.js
```

**⚠️ CRÍTICO:** El sistema usa categorías **ESPECÍFICAS** (IDs altos), NO genéricas.
- ✅ Correcto: "Generadores de texto" (ID: 49)
- ❌ Incorrecto: "Creación con IA" (ID: 44)

---

## 🚀 Proceso en 5 Pasos

### 1️⃣ Preparar JSON
Crea `temporal/nuevos-programas.json`:

**⚠️ IMPORTANTE:** Usa las categorías ESPECÍFICAS del output de `list-categories.js`

```json
{
  "nuevos_programas": [
    {
      "slug": "tu-programa",
      "nombre": "Tu Programa",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": ["generadores-de-texto"],  // ⚠️ Debe ser categoría ESPECÍFICA
      "descripcion_corta": "<p>Descripción breve</p>",
      "descripcion_larga": "<p>Descripción larga...</p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": ["web", "macos", "windows"],
      "modelos_precios_slugs": ["freemium", "suscripcion"],
      "dificultad": "Facil",
      "es_open_source": false,
      "es_recomendado": true,
      "web_oficial_url": "https://ejemplo.com",
      "alternativas_slugs": ["programa-1", "programa-2"]  // ⚠️ Verificar que existan
    }
  ]
}
```

**Mapeo de subcategorias_slugs → Categorías Específicas:**
- `"chatbot"` → "Generadores de texto" (ID: 49)
- `"editor-de-imagenes"` → "Editor de imágenes" (ID: 70)
- `"edicion-de-video"` → "Edición de video" (ID: 35)
- Ver `list-categories.js` para lista completa

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
# PASO 0: Verificación (OBLIGATORIO antes de crear JSON)
node scripts/list-categories.js       # Ver categorías disponibles
node scripts/list-all-programs.js     # Ver programas para alternativas

# PASO 1: Desarrollo
npm run dev

# PASO 2: Cargar programas
node scripts/upload-new-programs.js

# PASO 3: Verificar si todo está correcto
node scripts/check-alternatives.js    # Verificar alternativas
node scripts/list-categories.js       # Ver categorías asignadas

# PASO 4: Corregir categorías (si necesario)
node scripts/fix-categories.js

# PASO 5: Generar checklist de imágenes
node scripts/generate-images-list.js

# Ver variables de entorno
cat .env.local
```

---

## 🔧 Scripts de Verificación

### `list-categories.js`
Lista TODAS las categorías con sus IDs. **Úsalo para:**
- Ver qué categorías ESPECÍFICAS existen
- Obtener IDs correctos para mapeo
- Verificar categorías asignadas a programas

### `list-all-programs.js`
Lista TODOS los programas. **Úsalo para:**
- Verificar slugs de alternativas
- Evitar duplicados
- Ver programas disponibles para referencias

### `check-alternatives.js`
Verifica alternativas asignadas. **Úsalo para:**
- Confirmar que alternativas se insertaron
- Detectar programas sin alternativas

### `fix-categories.js`
Corrige categorías incorrectas. **Úsalo para:**
- Reasignar categorías genéricas a específicas
- Corregir errores post-carga

---

## ⚠️ Reglas Críticas

1. **SIEMPRE ejecutar `list-categories.js` ANTES** → Ver categorías ESPECÍFICAS disponibles
2. **SIEMPRE ejecutar `list-all-programs.js` ANTES** → Verificar alternativas existen
3. **Comillas simples en HTML** → `'texto'` NO `"texto"`
4. **Dificultad exacta** → `"Facil"`, `"Intermedio"` o `"Dificil"`
5. **Slugs existentes** → Verifica con scripts de listado
6. **IDs automáticos** → No especifiques IDs manualmente
7. **Categorías ESPECÍFICAS** → Usa IDs altos (49, 70, 77) NO genéricos (29, 44)

---

## 📋 Checklist

**ANTES de crear JSON:**
- [ ] Ejecutado `list-categories.js` (ver categorías disponibles)
- [ ] Ejecutado `list-all-programs.js` (ver programas para alternativas)
- [ ] Verificado que `subcategorias_slugs` mapean a categorías ESPECÍFICAS
- [ ] Verificado que TODOS los `alternativas_slugs` existen

**Durante preparación:**
- [ ] JSON válido (sin comillas dobles en HTML)
- [ ] Todos los slugs verificados contra salida de scripts
- [ ] `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`

**Después de ejecutar script:**
- [ ] Script ejecutado sin errores
- [ ] Programas verificados en Supabase
- [ ] Ejecutado `check-alternatives.js` (verificar alternativas)
- [ ] Ejecutado `list-categories.js` (verificar categorías correctas)
- [ ] Si categorías incorrectas → ejecutar `fix-categories.js`
- [ ] Ejecutado `generate-images-list.js` (generar checklist)
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
| **Categorías genéricas asignadas** | **Ejecutar `fix-categories.js` con mapeo correcto** |
| **Alternativas no se insertan** | **Re-ejecutar script o verificar que slugs existan** |
| **Programas sin categorías en web** | **Categorías son genéricas, usar `fix-categories.js`** |

---

## 🔑 Arquitectura de Categorías

**Sistema NO tradicional:**
- ❌ NO usar categorías genéricas (Programas de diseño, Creación con IA)
- ✅ Usar categorías ESPECÍFICAS (Editor de imágenes, Generadores de texto)

**Ejemplos de mapeo correcto:**
```javascript
// subcategorias_slugs en JSON → category_id en BD
'editor-de-imagenes': 70        // NO 29 (Programas de diseño)
'chatbot': 49                   // NO 44 (Creación con IA)
'generadores-de-código': 51     // NO 44 (Creación con IA)
'edicion-de-video': 35
'toma-de-notas-y-conocimiento': 77
```

**Cómo verificar:**
1. Ejecuta `node scripts/list-categories.js`
2. Busca la categoría ESPECÍFICA (ID más alto)
3. Usa ese slug en `subcategorias_slugs`

---

## 📚 Más Info

- **Guía completa:** `.github/GUIA_CARGA_BASE_DATOS.md`
- **Resumen de cambios:** `.github/RESUMEN_CAMBIOS_OCT2025.md`
- **Manifesto del proyecto:** `.github/copilot-instrucciones.md`

---

**Última actualización:** Octubre 2025
