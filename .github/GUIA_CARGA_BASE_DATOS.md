# Guía Completa para Cargar Datos a Supabase

Esta guía detalla cómo agregar nuevos programas, categorías y subcategorías a la base de datos de Secret Network usando scripts automatizados.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Formato del JSON](#formato-del-json)
4. [Crear Nuevas Subcategorías](#crear-nuevas-subcategorías)
5. [Agregar Nuevos Programas](#agregar-nuevos-programas)
6. [Ejecutar el Script](#ejecutar-el-script)
7. [Actualizar Imágenes](#actualizar-imágenes)
8. [Troubleshooting](#troubleshooting)

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

Asegúrate de que los slugs de categorías, subcategorías, plataformas y alternativas **existan en la base de datos**.

**Categorías principales disponibles:**
- `programas-de-diseño` → "Programas de diseño"
- `productividad-y-gestión` → "Productividad y gestión"
- `creación-con-ia` → "Creación con IA"
- `utilidades-de-apoyo` → "Utilidades de apoyo"
- `recursos-y-activos` → "Recursos y activos"

⚠️ **NOTA:** El script intentará buscar por nombre si el slug no existe, pero es mejor usar el slug correcto.

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

### Antes de ejecutar el script:

- [ ] `.env.local` tiene `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Archivo JSON creado en `temporal/nuevos-programas.json`
- [ ] Todos los slugs verificados (categorías, plataformas, alternativas)
- [ ] HTML sin comillas dobles escapadas incorrectamente
- [ ] Campos `es_open_source` y `es_recomendado` definidos

### Después de ejecutar el script:

- [ ] Verificar en Supabase que los programas se insertaron
- [ ] Verificar las relaciones en las tablas intermedias
- [ ] Subir logos a Cloudinary
- [ ] Subir capturas a Cloudinary
- [ ] Actualizar `icono_url` y `captura_url` en la base de datos
- [ ] Verificar que el programa se muestra correctamente en el sitio

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
