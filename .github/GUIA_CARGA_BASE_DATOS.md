# Guía Completa para Cargar Datos a Supabase

Esta guía detalla cómo agregar nuevos programas, categorías y subcategorías a la base de datos de Secret Network usando scripts automatizados.

---

## 📋 Tabla de Contenidos

1. [⚠️ VERIFICACIÓN PRE-CARGA (OBLIGATORIO)](#verificación-pre-carga-obligatorio)
2. [Requisitos Previos](#requisitos-previos)
3. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
4. [Formato del JSON](#formato-del-json)
5. [Crear Nuevas Subcategorías](#crear-nuevas-subcategorías)
6. [Agregar Nuevos Programas](#agregar-nuevos-programas)
7. [Ejecutar el Script](#ejecutar-el-script)
8. [Actualizar Imágenes](#actualizar-imágenes)
9. [Verificación Post-Carga](#verificación-post-carga)
10. [Troubleshooting](#troubleshooting)

---

## ⚠️ VERIFICACIÓN PRE-CARGA (OBLIGATORIO)

**ANTES de crear el JSON o ejecutar cualquier script, SIEMPRE ejecuta:**

### 1. Listar todas las categorías disponibles

```bash
node scripts/list-categories.js
```

**Esto genera:**
- Lista completa de 69+ categorías con IDs
- Identificación de categorías ESPECÍFICAS (IDs altos)
- Archivo: `temporal/categorias-subcategorias.md`

**⚠️ CRÍTICO:** El sistema NO usa jerarquía tradicional. Usa categorías **ESPECÍFICAS**:
- ✅ Correcto: "Generadores de texto" (ID: 49) 
- ❌ Incorrecto: "Creación con IA" (ID: 44) - Demasiado genérica

**Ejemplo de output:**
```
📂 Categoría: Creación con IA (ID: 44)
   └── Sin subcategorías directas

📂 Categoría: Generadores de texto (ID: 49) ← USA ESTE
   └── 15 programas asignados
```

### 2. Listar todos los programas existentes

```bash
node scripts/list-all-programs.js
```

**Esto genera:**
- Lista de 268+ programas con slugs
- Archivo JSON: `temporal/programas-disponibles.json`
- Archivo TXT: `temporal/slugs-disponibles.txt`

**Úsalo para:**
- ✅ Verificar que slugs de `alternativas_slugs` existen
- ✅ Evitar duplicados de programas
- ✅ Ver qué programas están disponibles para referencias

### 3. Validar el JSON ANTES de ejecutar script

**Checklist de validación:**
- [ ] `subcategorias_slugs` mapean a categorías ESPECÍFICAS (consultar `list-categories.js`)
- [ ] TODOS los `alternativas_slugs` existen en `slugs-disponibles.txt`
- [ ] Comillas simples en HTML, NO dobles
- [ ] `plataformas_slugs` coinciden: web, macos, windows, linux, ios, android, ipados
- [ ] `modelos_precios_slugs` coinciden: gratis, freemium, compra-unica, suscripcion, prueba-gratuita
- [ ] `dificultad` es exactamente: "Facil", "Intermedio" o "Dificil"

---

## 🔑 Requisitos Previos

### 1. Variables de Entorno (`.env.local`)

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui # ⚠️ OBLIGATORIO para scripts

# Cloudinary (para subir imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
```

⚠️ **IMPORTANTE:** Nunca compartas estas keys públicamente. Están en tu archivo local `.env.local` que está en el `.gitignore`.

**⚠️ IMPORTANTE:** Los scripts necesitan `SUPABASE_SERVICE_ROLE_KEY` para tener permisos de escritura en la base de datos.

### 2. Dependencias de Node.js

```bash
npm install @supabase/supabase-js dotenv
```

### 3. Scripts de Verificación Disponibles

Secret Network incluye scripts esenciales para verificar datos ANTES y DESPUÉS de cargar:

| Script | Propósito | Output | Cuándo usar |
|--------|-----------|--------|-------------|
| `list-categories.js` | Lista TODAS las categorías con IDs | `temporal/categorias-subcategorias.md` | **ANTES** de crear JSON para ver categorías específicas |
| `list-all-programs.js` | Lista TODOS los programas | `temporal/programas-disponibles.json`<br>`temporal/slugs-disponibles.txt` | **ANTES** de crear JSON para verificar alternativas |
| `check-alternatives.js` | Verifica alternativas asignadas | Consola | **DESPUÉS** de carga para confirmar alternativas |
| `fix-categories.js` | Corrige categorías incorrectas | Consola | **DESPUÉS** si categorías son genéricas |
| `generate-images-list.js` | Genera checklist de imágenes | `temporal/LISTA_ICONOS_CAPTURAS.md` | **DESPUÉS** de carga antes de buscar imágenes |

**Uso básico:**
```bash
# Pre-carga (OBLIGATORIO)
node scripts/list-categories.js       # Ver categorías disponibles
node scripts/list-all-programs.js     # Ver programas para alternativas

# Post-carga (VERIFICACIÓN)
node scripts/check-alternatives.js    # ¿Alternativas insertadas?
node scripts/list-categories.js       # ¿Categorías correctas?

# Post-carga (CORRECCIÓN si necesario)
node scripts/fix-categories.js        # Reasignar categorías

# Pre-imágenes
node scripts/generate-images-list.js  # Generar checklist
```

---

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### **1. `categorias`**
Categorías y subcategorías (jerárquicas).

| Campo               | Tipo      | Descripción                                      |
|---------------------|-----------|--------------------------------------------------|
| `id`                | int8 (PK) | ID autoincremental                               |
| `nombre`            | text      | Nombre de la categoría (ej: "Programas de diseño") |
| `slug`              | text      | URL-friendly (ej: "programas-de-diseño")         |
| `descripcion`       | text      | Descripción opcional                             |
| `id_categoria_padre`| int8 (FK) | `null` = categoría principal, `id` = subcategoría |
| `icono`             | text      | Nombre del icono de Lucide React                 |

**Ejemplo:**
- Categoría Principal: `nombre="Programas de diseño"`, `id_categoria_padre=null`
- Subcategoría: `nombre="Modelado 3D"`, `id_categoria_padre=29` (ID de "Programas de diseño")

#### **2. `programas`**
Tabla principal de herramientas/programas.

| Campo               | Tipo      | Descripción                                      |
|---------------------|-----------|--------------------------------------------------|
| `id`                | int8 (PK) | ID autoincremental                               |
| `nombre`            | text      | Nombre del programa (ej: "Adobe Photoshop")      |
| `slug`              | text      | URL-friendly (ej: "adobe-photoshop")             |
| `icono_url`         | text      | URL del logo en Cloudinary                       |
| `categoria_id`      | int8 (FK) | ID de la categoría principal                     |
| `categoria_slug`    | text      | Slug de la categoría (⚠️ campo requerido)        |
| `descripcion_corta` | text      | Resumen breve (HTML permitido)                   |
| `descripcion_larga` | text      | Descripción completa (HTML permitido)            |
| `captura_url`       | text      | URL de screenshot en Cloudinary                  |
| `dificultad`        | text      | "Facil", "Intermedio" o "Dificil"                |
| `es_open_source`    | boolean   | `true` si es software libre                      |
| `es_recomendado`    | boolean   | `true` para destacar en /alternativas            |
| `web_oficial_url`   | text      | Link al sitio oficial                            |

⚠️ **NOTA:** La tabla tiene un campo `categoria_slug` que debe coincidir con el slug de la categoría.

#### **3. Tablas de Relación (Many-to-Many)**

Las siguientes tablas conectan programas con otros datos:

| Tabla                           | Campos                                           |
|---------------------------------|--------------------------------------------------|
| `programas_subcategorias`       | `programa_id` (FK), `subcategoria_id` (FK)       |
| `programas_plataformas`         | `programa_id` (FK), `plataforma_id` (FK)         |
| `programas_modelos_de_precios`  | `programa_id` (FK), `modelo_precio_id` (FK)      |
| `programas_alternativas`        | `programa_original_id` (FK), `programa_alternativa_id` (FK) |

#### **4. Tablas de Catálogo**

Estas tablas contienen valores predefinidos:

**`plataformas`:**
| ID | nombre    | slug      |
|----|-----------|-----------|
| 1  | Web       | web       |
| 2  | macOS     | macos     |
| 3  | Windows   | windows   |
| 4  | Linux     | linux     |
| 5  | iOS       | ios       |
| 6  | Android   | android   |
| 7  | iPadOS    | ipados    |

**`modelos_de_precios`:**
| ID | nombre           | slug              |
|----|------------------|-------------------|
| 1  | Gratis           | gratis            |
| 2  | Freemium         | freemium          |
| 3  | Pago único       | compra-unica      |
| 4  | Suscripción      | suscripcion       |
| 5  | Prueba gratuita  | prueba-gratuita   |

---

## 📝 Formato del JSON

Crea un archivo JSON en `temporal/nuevos-programas.json` con la siguiente estructura:

```json
{
  "nuevos_programas": [
    {
      "slug": "adobe-photoshop",
      "nombre": "Adobe Photoshop",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": ["editores-de-graficos-rasterizados", "edicion-de-fotos"],
      "descripcion_corta": "<p>El software de edición de imágenes líder en la industria.</p>",
      "descripcion_larga": "<p>Adobe Photoshop es el estándar...</p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": ["macos", "windows", "ios", "android"],
      "modelos_precios_slugs": ["suscripcion", "prueba-gratuita"],
      "dificultad": "Intermedio",
      "es_open_source": false,
      "es_recomendado": true,
      "web_oficial_url": "https://www.adobe.com/products/photoshop.html",
      "alternativas_slugs": ["gimp", "affinity-photo", "photopea"]
    }
  ]
}
```

### Campos del JSON Explicados

| Campo                    | Tipo      | Descripción                                                          |
|--------------------------|-----------|----------------------------------------------------------------------|
| `slug`                   | string    | Identificador único URL-friendly (ej: `adobe-photoshop`)             |
| `nombre`                 | string    | Nombre completo del programa                                         |
| `icono_url`              | string    | URL o placeholder. Dejar `"URL_DEL_ICONO_AQUI"` para completar después |
| `categoria_slug`         | string    | Slug de la categoría principal (se buscará automáticamente)          |
| `subcategorias_slugs`    | string[]  | Array de slugs de subcategorías                                      |
| `descripcion_corta`      | string    | HTML con resumen breve (1-2 líneas)                                  |
| `descripcion_larga`      | string    | HTML con descripción completa (puede incluir listas `<ul>`, etc.)   |
| `captura_url`            | string    | URL o placeholder. Dejar `"URL_DE_LA_CAPTURA_AQUI"`                  |
| `plataformas_slugs`      | string[]  | Array: `["macos", "windows", "linux", "web", "ios", "android"]`     |
| `modelos_precios_slugs`  | string[]  | Array: `["gratis", "freemium", "compra-unica", "suscripcion"]`      |
| `dificultad`             | string    | Uno de: `"Facil"`, `"Intermedio"`, `"Dificil"`                      |
| `es_open_source`         | boolean   | `true` si es código abierto                                          |
| `es_recomendado`         | boolean   | `true` para mostrar en la página `/alternativas`                     |
| `web_oficial_url`        | string    | Link al sitio web oficial                                            |
| `alternativas_slugs`     | string[]  | Array de slugs de programas alternativos                             |

### ⚠️ Notas Importantes sobre el HTML

- **Usa comillas simples (`'`) dentro del HTML**, no dobles (`"`)
- ❌ INCORRECTO: `"su tecnología ""pixols"" permite..."`
- ✅ CORRECTO: `"su tecnología 'pixols' permite..."`

**Ejemplo de HTML válido:**

```json
"descripcion_larga": "<p>Photoshop es el <strong>estándar de la industria</strong>.</p><ul><li><p><strong>Capas:</strong> Sistema de capas no destructivo.</p></li><li><p><strong>Filtros:</strong> Miles de efectos disponibles.</p></li></ul>"
```

---

## 🆕 Crear Nuevas Subcategorías

Si necesitas crear subcategorías que no existen, agrégalas al principio del script o créalas manualmente en Supabase:

### Opción 1: Agregar al Script

Edita `scripts/upload-new-programs.js` y agrega al array `nuevasSubcategorias`:

```javascript
const nuevasSubcategorias = [
  {
    nombre: 'Editor de imágenes',
    slug: 'editor-de-imagenes',
    categoria_padre: 'Programas de diseño', // Nombre de la categoría padre
    icono: 'ImageIcon' // Nombre de un icono de Lucide React
  },
  // ... agregar más aquí
];
```

### Opción 2: Inserción Manual en Supabase

1. Ve a tu proyecto en Supabase
2. Abre la tabla `categorias`
3. Busca el `id` de la categoría padre
4. Inserta una nueva fila:
   - `nombre`: "Editor de imágenes"
   - `slug`: "editor-de-imagenes"
   - `id_categoria_padre`: ID de la categoría padre
   - `icono`: "ImageIcon"

---

## ➕ Agregar Nuevos Programas

### Paso 1: Preparar el JSON

Crea o edita el archivo `temporal/nuevos-programas.json` con tus programas.

**Ejemplo completo:**

```json
{
  "nuevos_programas": [
    {
      "slug": "figma",
      "nombre": "Figma",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": ["diseño-ui-ux-y-prototipado", "herramientas-de-colaboracion"],
      "descripcion_corta": "<p>La herramienta colaborativa de diseño UI/UX basada en la nube.</p>",
      "descripcion_larga": "<p>Figma revolucionó el diseño UI/UX con su enfoque colaborativo en tiempo real...</p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": ["web", "macos", "windows", "linux"],
      "modelos_precios_slugs": ["freemium", "suscripcion"],
      "dificultad": "Facil",
      "es_open_source": false,
      "es_recomendado": true,
      "web_oficial_url": "https://www.figma.com",
      "alternativas_slugs": ["penpot", "adobe-xd", "sketch"]
    }
  ]
}
```

### Paso 2: Verificar los Slugs

**⚠️ IMPORTANTE:** Usa SOLO categorías ESPECÍFICAS verificadas con `list-categories.js`

Asegúrate de que los slugs de categorías, subcategorías, plataformas y alternativas **existan en la base de datos**.

**Categorías ESPECÍFICAS disponibles (ejemplos):**
- `editor-de-imagenes` (ID: 70) → "Editor de imágenes" 
- `edicion-de-video` (ID: 35) → "Edición de video"
- `generadores-de-texto` (ID: 49) → "Generadores de texto" (chatbots)
- `generadores-de-código` (ID: 51) → "Generadores de código"
- `toma-de-notas-y-conocimiento` (ID: 77) → "Toma de notas y conocimiento"
- `dibujo-digital-y-pintura` (ID: 37) → "Dibujo digital y pintura"

**Categorías genéricas (NO USAR en subcategorias_slugs):**
- ❌ `programas-de-diseño` (ID: 29) - Demasiado genérica
- ❌ `creación-con-ia` (ID: 44) - Demasiado genérica
- ❌ `productividad-y-gestión` (ID: 43) - Demasiado genérica

⚠️ **REGLA:** Usa `list-categories.js` para ver la lista COMPLETA y actualizada de categorías específicas.

**Verificar alternativas:**
```bash
# Verifica que estos slugs existan en slugs-disponibles.txt
cat temporal/slugs-disponibles.txt | grep "gimp"
cat temporal/slugs-disponibles.txt | grep "affinity-photo"
```

### Paso 3: Alternativas

Para la tabla `programas_alternativas`, el script buscará los programas por su `slug`. Si un programa alternativo no existe en la base de datos, **se omitirá silenciosamente**.

**Ejemplo:**
```json
"alternativas_slugs": ["gimp", "affinity-photo", "photopea"]
```

Esto creará 3 filas en `programas_alternativas`:
- `programa_original_id` = ID del programa que estás insertando
- `programa_alternativa_id` = ID de "gimp", "affinity-photo", "photopea"

---

## 🚀 Ejecutar el Script

### Script de Carga: `scripts/upload-new-programs.js`

Este script hace lo siguiente:

1. **Crea nuevas subcategorías** (si las defines en el script)
2. **Inserta cada programa** en la tabla `programas`
3. **Crea todas las relaciones** en las tablas intermedias:
   - `programas_subcategorias`
   - `programas_plataformas`
   - `programas_modelos_de_precios`
   - `programas_alternativas`

### Ejecutar el Script

```bash
# Desde la raíz del proyecto
node scripts/upload-new-programs.js
```

**Salida esperada:**

```
============================================================
🚀 SCRIPT DE CARGA DE NUEVOS PROGRAMAS A SUPABASE
============================================================

📁 PASO 1: Creando nuevas subcategorías...

✅ Subcategoría creada: "Editor de imágenes" (ID: 70)
⏭️  La subcategoría "Escultura digital" ya existe

✅ Subcategorías procesadas correctamente

🚀 PASO 2: Insertando nuevos programas...

📦 Procesando: Adobe Photoshop...
✅ Programa creado (ID: 225)
   ✓ 2 subcategorías vinculadas
   ✓ 4 plataformas vinculadas
   ✓ 2 modelos de precio vinculados
   ✓ 3 alternativas vinculadas

============================================================
✅ Programas insertados exitosamente: 1
❌ Programas fallidos: 0
============================================================
```

### Verificar en Supabase

1. Ve a tu proyecto en Supabase
2. Abre la tabla `programas`
3. Busca los programas recién insertados
4. Verifica que `icono_url` y `captura_url` estén `null` (los completarás después)

---

## 🖼️ Actualizar Imágenes

Una vez que tengas los logos y capturas, súbelos a Cloudinary y actualiza la base de datos.

### Paso 1: Subir a Cloudinary

**Opciones:**

1. **Interfaz web:** https://cloudinary.com/console
   - Carpeta sugerida para logos: `secret-network/logos/`
   - Carpeta sugerida para capturas: `secret-network/screenshots/`

2. **CLI de Cloudinary:**
   ```bash
   npm install -g cloudinary-cli
   cld uploader upload logo.png --folder secret-network/logos
   ```

### Paso 2: Actualizar la Base de Datos

**Opción 1: SQL directo en Supabase**

```sql
-- Actualizar logo
UPDATE programas
SET icono_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/secret-network/logos/photoshop.png'
WHERE slug = 'adobe-photoshop';

-- Actualizar captura
UPDATE programas
SET captura_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/secret-network/screenshots/photoshop-ui.png'
WHERE slug = 'adobe-photoshop';
```

**Opción 2: Script automatizado**

Crea un archivo `temporal/imagenes.json`:

```json
{
  "imagenes": [
    {
      "slug": "adobe-photoshop",
      "icono_url": "https://res.cloudinary.com/TU_CLOUD_NAME/.../logos/photoshop.png",
      "captura_url": "https://res.cloudinary.com/TU_CLOUD_NAME/.../screenshots/photoshop-ui.png"
    }
  ]
}
```

Y ejecuta un script de actualización (puedes crear uno basado en `upload-new-programs.js`).

---

## ✅ Verificación Post-Carga

Después de ejecutar el script de carga, **SIEMPRE verifica:**

### 1. Verificar alternativas se insertaron

```bash
node scripts/check-alternatives.js
```

**Output esperado:**
```
✅ claude: 5 alternativas
✅ cursor-ai: 4 alternativas
⚠️ nuevo-programa: 0 alternativas
```

Si ves `0 alternativas`, verifica que los slugs en el JSON existan.

### 2. Verificar categorías son correctas

```bash
node scripts/list-categories.js
```

**Busca tus programas nuevos en el output:**
```
📂 Categoría: Generadores de texto (ID: 49)
   └── Programas (15):
       - claude (ID: 261) ✓
       - mistral-ai (ID: 262) ✓
```

**⚠️ Si ves tus programas en categoría GENÉRICA:**
```
📂 Categoría: Creación con IA (ID: 44)  ← INCORRECTO
   └── Programas (3):
       - claude (ID: 261) ❌
```

**Solución:** Ejecuta el script de corrección:
```bash
node scripts/fix-categories.js
```

### 3. Generar checklist de imágenes

```bash
node scripts/generate-images-list.js
```

Esto crea `temporal/LISTA_ICONOS_CAPTURAS.md` con:
- Lista de todos los programas nuevos
- URLs oficiales para buscar imágenes
- Checkboxes para tracking

---

## 🔍 Troubleshooting

### Error: "Could not find the 'created_at' column"

**Solución:** La tabla `programas` no tiene campos `created_at`/`updated_at`. El script ya está actualizado para no incluirlos.

### Error: "null value in column 'categoria_slug' violates not-null constraint"

**Solución:** La tabla requiere el campo `categoria_slug`. Asegúrate de que el script lo incluya:

```javascript
categoria_slug: categoria.slug, // ⚠️ Necesario
```

### Error: "No se encontró la categoría: programas-de-diseño"

**Solución:** El slug en el JSON no coincide con el de la base de datos. El script intentará buscar por nombre automáticamente. Si falla:

1. Verifica el nombre exacto de la categoría en Supabase
2. Usa el nombre correcto con mayúsculas: `"Programas De Diseño"`

### Programa con alternativas que no existen

**Comportamiento:** El script omitirá silenciosamente las alternativas que no encuentre.

**Solución:** Verifica que los slugs de las alternativas sean correctos y que esos programas ya existan en la base de datos.

### Comillas dobles en HTML causan error JSON

**Error:** `Expected ',' or '}' after property value in JSON`

**Solución:** Reemplaza todas las comillas dobles dentro del HTML por comillas simples:

```bash
# PowerShell
$content = Get-Content 'temporal/nuevos-programas.json' -Raw
$fixed = $content -replace '""', "'"
Set-Content 'temporal/nuevos-programas.json' -Value $fixed
```

### Categorías genéricas asignadas (MUY COMÚN)

**Problema:** Los programas aparecen en categorías genéricas como "Creación con IA" o "Programas de diseño" en lugar de específicas.

**Causa:** El JSON usó slugs genéricos en `subcategorias_slugs` o el sistema no encontró la categoría específica.

**Solución:**

1. **Verificar las categorías asignadas:**
   ```bash
   node scripts/list-categories.js
   ```
   
2. **Buscar tus programas en el output** - si están en categoría genérica:
   ```
   📂 Categoría: Creación con IA (ID: 44)
      └── Programas: claude, mistral-ai ← INCORRECTO
   ```

3. **Crear script de corrección** con mapeo:
   ```javascript
   // scripts/fix-categories.js
   const categoryMapping = {
     'chatbot': 49,                   // Generadores de texto
     'editor-de-imagenes': 70,
     'generadores-de-código': 51,
     // ... más mappings
   };
   ```

4. **Ejecutar corrección:**
   ```bash
   node scripts/fix-categories.js
   ```

### Alternativas no se insertan

**Problema:** Campo `alternativas_slugs` en JSON pero tabla `programas_alternativas` vacía.

**Verificación:**
```bash
node scripts/check-alternatives.js
```

**Posibles causas:**
1. Los slugs en `alternativas_slugs` no existen en la base de datos
2. Error en el script de carga
3. Query con problema

**Solución:**
```bash
# Re-ejecutar script de actualización
node scripts/update-programs.js
```

### Programas duplicados

**Problema:** El script intenta insertar programa que ya existe.

**Prevención:**
```bash
# Antes de cargar, verifica
node scripts/list-all-programs.js
cat temporal/slugs-disponibles.txt | grep "nombre-programa"
```

---

## 🎓 Lecciones Aprendidas (Experiencia Real)

### Problema 1: Sistema de Categorías NO Tradicional

**Descubrimiento:** Secret Network NO usa jerarquía padre-hijo tradicional.

**Sistema real:**
- ❌ NO: Creación con IA → Generadores de texto → Claude
- ✅ SÍ: Claude directamente en "Generadores de texto" (ID: 49)

**Consecuencia:** Los 28 primeros programas se insertaron con categorías genéricas incorrectas.

**Solución aplicada:** 
1. Creado `list-categories.js` para ver estructura real
2. Creado `fix-categories.js` con diccionario de mapeo
3. Re-asignadas las 28 categorías correctamente

### Problema 2: Alternativas NULL Inicialmente

**Problema:** Tabla `programas_alternativas` vacía a pesar de JSON correcto.

**Causa:** Error en query del script original.

**Solución aplicada:** Re-ejecutar script de actualización que insertó alternativas correctamente.

### Problema 3: HTML Stripping en UI

**Problema:** Descripciones en web mostraban texto plano sin formato.

**Causa:** Componente usaba `stripHtml()` que eliminaba TODAS las etiquetas.

**Solución aplicada:**
```jsx
// ANTES
<FormattedText text={stripHtml(programaCompleto.descripcion_larga)} />

// DESPUÉS
<div dangerouslySetInnerHTML={{ __html: programaCompleto.descripcion_larga }} 
     className="prose prose-neutral dark:prose-invert max-w-none" />
```

---

## 📊 Workflow Completo y Correcto

```bash
# ============================================================
# FASE 1: PREPARACIÓN (OBLIGATORIA)
# ============================================================

# 1. Listar categorías disponibles
node scripts/list-categories.js
# Output: temporal/categorias-subcategorias.md
# Acción: Revisar IDs de categorías ESPECÍFICAS

# 2. Listar programas para alternativas
node scripts/list-all-programs.js
# Output: temporal/programas-disponibles.json
#         temporal/slugs-disponibles.txt
# Acción: Verificar slugs para alternativas_slugs

# 3. Validar JSON
# - Verificar subcategorias_slugs sean categorías ESPECÍFICAS
# - Verificar alternativas_slugs existan en slugs-disponibles.txt
# - Comillas simples en HTML

# ============================================================
# FASE 2: CARGA INICIAL
# ============================================================

# 4. Ejecutar script de carga
node scripts/upload-new-programs.js
# Acción: Observar output, confirmar éxito

# ============================================================
# FASE 3: VERIFICACIÓN POST-CARGA
# ============================================================

# 5. Verificar alternativas
node scripts/check-alternatives.js
# Acción: Confirmar que todos tienen alternativas (no 0)

# 6. Verificar categorías asignadas
node scripts/list-categories.js
# Acción: Buscar programas nuevos, confirmar están en categorías ESPECÍFICAS

# ============================================================
# FASE 4: CORRECCIONES (SI NECESARIO)
# ============================================================

# 7. SI categorías son genéricas → Corregir
node scripts/fix-categories.js
# Acción: Re-verificar con list-categories.js

# 8. SI alternativas son 0 → Re-ejecutar
node scripts/update-programs.js

# ============================================================
# FASE 5: FINALIZACIÓN
# ============================================================

# 9. Generar checklist de imágenes
node scripts/generate-images-list.js
# Output: temporal/LISTA_ICONOS_CAPTURAS.md

# 10. Commit y push
git add .
git commit -m "feat: Agregar X programas nuevos con categorías correctas"
git push origin main

# 11. Subir imágenes a Cloudinary (manual)
# 12. Actualizar URLs en Supabase (SQL)
```

---

## 📊 Ordenamiento de Programas

El sitio web ofrece 5 opciones de ordenamiento en el filtro:

| Opción              | Descripción                                                    |
|---------------------|----------------------------------------------------------------|
| **A → Z**           | Orden alfabético ascendente por nombre                         |
| **Z → A**           | Orden alfabético descendente por nombre                        |
| **Nuevos primero**  | Los programas agregados más recientemente primero (por ID desc)|
| **Recomendados**    | Programas con `es_recomendado=true` primero                    |
| **A → Z + Recomendados** | Recomendados primero, luego alfabético              |

### ¿Cómo funciona "Nuevos primero"?

El ordenamiento "Nuevos primero" utiliza el campo `id` de la tabla `programas` como proxy para determinar qué programas son más recientes:

- **ID más alto** = Programa más nuevo
- **ID más bajo** = Programa más antiguo

**Ejemplo:**
```
ID 240: Epidemic Sound (agregado hoy)
ID 239: Artlist (agregado hoy)
ID 50: Photoshop (agregado hace 1 mes)
ID 10: Figma (agregado hace 2 meses)
```

Cuando el usuario selecciona "Nuevos primero", verá:
1. Epidemic Sound (240)
2. Artlist (239)
3. Photoshop (50)
4. Figma (10)

**⚠️ NOTA:** Si agregas programas manualmente (no con el script), asegúrate de no especificar un ID custom. Deja que Supabase lo genere automáticamente para mantener el orden cronológico correcto.

---

## 📊 Checklist de Carga Completa

### ⚠️ ANTES de crear el JSON:

- [ ] Ejecutado `node scripts/list-categories.js` (ver categorías disponibles)
- [ ] Ejecutado `node scripts/list-all-programs.js` (ver programas para alternativas)
- [ ] Revisado `temporal/categorias-subcategorias.md` para identificar categorías ESPECÍFICAS
- [ ] Revisado `temporal/slugs-disponibles.txt` para verificar alternativas

### Durante preparación del JSON:

- [ ] `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Archivo JSON creado en `temporal/nuevos-programas.json`
- [ ] `subcategorias_slugs` mapean a categorías ESPECÍFICAS (IDs altos: 49, 70, 77, etc.)
- [ ] Todos los `alternativas_slugs` verificados en `slugs-disponibles.txt`
- [ ] `plataformas_slugs` correctos: web, macos, windows, linux, ios, android, ipados
- [ ] `modelos_precios_slugs` correctos: gratis, freemium, compra-unica, suscripcion, prueba-gratuita
- [ ] HTML sin comillas dobles escapadas incorrectamente
- [ ] Campos `es_open_source` y `es_recomendado` definidos
- [ ] `dificultad` exactamente: "Facil", "Intermedio" o "Dificil"

### Después de ejecutar el script:

- [ ] Script ejecutado sin errores (`node scripts/upload-new-programs.js`)
- [ ] Verificar en Supabase que los programas se insertaron
- [ ] Ejecutado `node scripts/check-alternatives.js` → Todos con alternativas (no 0)
- [ ] Ejecutado `node scripts/list-categories.js` → Programas en categorías ESPECÍFICAS
- [ ] **SI categorías incorrectas:** Ejecutar `node scripts/fix-categories.js`
- [ ] **SI alternativas = 0:** Ejecutar `node scripts/update-programs.js`
- [ ] Verificar las relaciones en las tablas intermedias (Supabase UI)
- [ ] Ejecutado `node scripts/generate-images-list.js` (generar checklist)

### Finalización:

- [ ] Subir logos a Cloudinary (`secret-network/logos/`)
- [ ] Subir capturas a Cloudinary (`secret-network/screenshots/`)
- [ ] Actualizar `icono_url` y `captura_url` en la base de datos (SQL)
- [ ] Verificar que el programa se muestra correctamente en localhost:3000
- [ ] Verificar categorías correctas en la web
- [ ] Git commit y push a GitHub
- [ ] Verificar deployment en Vercel

---

## 🎯 Ejemplo Completo: Workflow Típico

### 1. Investigación
- Elegir 5 nuevos programas para agregar
- Buscar información (descripciones, características, sitio web)
- Descargar logos y capturas

### 2. Preparar JSON

```json
{
  "nuevos_programas": [
    {
      "slug": "canva",
      "nombre": "Canva",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": ["diseño-grafico", "edicion-de-fotos"],
      "descripcion_corta": "<p>Plataforma de diseño gráfico simplificada para todos.</p>",
      "descripcion_larga": "<p>Canva democratiza el diseño gráfico...</p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": ["web", "ios", "android"],
      "modelos_precios_slugs": ["freemium", "suscripcion"],
      "dificultad": "Facil",
      "es_open_source": false,
      "es_recomendado": true,
      "web_oficial_url": "https://www.canva.com",
      "alternativas_slugs": ["figma", "adobe-express"]
    }
  ]
}
```

### 3. Ejecutar Script

```bash
node scripts/upload-new-programs.js
```

### 4. Subir Imágenes a Cloudinary

- Carpeta: `secret-network/logos/canva.png`
- Carpeta: `secret-network/screenshots/canva-ui.png`

### 5. Actualizar URLs

```sql
UPDATE programas
SET 
  icono_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/secret-network/logos/canva.png',
  captura_url = 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/secret-network/screenshots/canva-ui.png'
WHERE slug = 'canva';
```

### 6. Verificar en Producción

- Visitar: `https://secret-network.vercel.app/programas/canva`
- Verificar que todo se muestra correctamente

---

## 🤖 Para IAs: Prompt Sugerido

Si vas a usar esta guía con otra IA para generar programas, usa este prompt:

```
Necesito crear datos para 5 programas de diseño siguiendo este formato JSON:

{
  "nuevos_programas": [
    {
      "slug": "",
      "nombre": "",
      "icono_url": "URL_DEL_ICONO_AQUI",
      "categoria_slug": "programas-de-diseño",
      "subcategorias_slugs": [],
      "descripcion_corta": "<p></p>",
      "descripcion_larga": "<p></p>",
      "captura_url": "URL_DE_LA_CAPTURA_AQUI",
      "plataformas_slugs": [],
      "modelos_precios_slugs": [],
      "dificultad": "Facil|Intermedio|Dificil",
      "es_open_source": true|false,
      "es_recomendado": true|false,
      "web_oficial_url": "",
      "alternativas_slugs": []
    }
  ]
}

Reglas importantes:
1. Usa comillas simples dentro del HTML, nunca dobles
2. dificultad debe ser exactamente: "Facil", "Intermedio" o "Dificil"
3. plataformas_slugs: ["web", "macos", "windows", "linux", "ios", "android"]
4. modelos_precios_slugs: ["gratis", "freemium", "compra-unica", "suscripcion", "prueba-gratuita"]
5. Incluye al menos 3 alternativas reales por programa
6. descripcion_larga debe tener al menos 3 párrafos con listas <ul>

Programas a generar: [LISTA AQUÍ]
```

---

## 📞 Contacto y Soporte

Si encuentras problemas o necesitas ayuda:

1. Revisa la sección [Troubleshooting](#troubleshooting)
2. Verifica los logs de la consola del script
3. Inspecciona las tablas en Supabase directamente
4. Consulta el archivo `copilot-instrucciones.md` para más contexto del proyecto

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0  
**Mantenedor:** Binary Studio / Secret Network Team
