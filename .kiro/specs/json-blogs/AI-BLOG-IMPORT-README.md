# 🤖 Sistema de Importación de Blogs con IA

## ¿Qué es esto?

Un sistema que te permite crear blogs completos con IA (Perplexity, Gemini, ChatGPT, etc.) y subirlos automáticamente al admin en segundos, en lugar de copiar y pegar durante 30 minutos.

## 🎯 Flujo Completo (5 minutos)

```
1. Sube archivos a la IA → 2. IA genera JSON → 3. Descargas JSON → 
4. Importas en admin → 5. Completas campos manuales → ¡Listo!
```

**Tiempo estimado:** 5-10 minutos vs 30 minutos copiando y pegando

## 🚀 Cómo Funciona

### 1. Prepara la IA

Sube estos archivos a tu IA favorita:

- **`AI-BLOG-SPEC.json`** - Especificación completa de todos los bloques
- **`AI-BLOG-EXAMPLE.json`** - Ejemplo real de un blog completo

### 2. Pide a la IA que Genere el Blog

Ejemplo de prompt:

```
He subido dos archivos JSON:
1. AI-BLOG-SPEC.json - La especificación de formato
2. AI-BLOG-EXAMPLE.json - Un ejemplo completo

Por favor, genera un blog completo sobre [TEMA] siguiendo exactamente 
el formato del ejemplo. Usa los bloques apropiados para el contenido:
- text para párrafos y títulos
- faq para preguntas frecuentes
- pros-cons para análisis
- table para datos tabulares
- feature-list para características
- etc.

Deja los campos marcados con [MANUAL] vacíos o con placeholder.
Genera el JSON completo y válido.
```

### 3. Descarga el JSON

La IA te dará un archivo JSON completo. Descárgalo.

### 4. Importa en el Admin

1. Ve a `/admin`
2. Tab "Blogs"
3. Clic en **"Importar JSON"**
4. Sube el archivo
5. Revisa la validación
6. Clic en **"Importar Blog"**

### 5. Completa Campos Manuales

El sistema te abrirá el editor con el blog importado. Solo necesitas completar:

- 🖼️ URLs de imágenes
- 📦 IDs de programas (si usaste bloques de programas)
- 🔗 IDs de blogs relacionados
- 📁 IDs de categorías (asignar desde el editor)
- 👤 ID de autor (asignar desde el editor)

## ✅ Lo que la IA Completa Automáticamente

### Metadata del Blog
- ✅ **Título** - El título principal del blog
- ✅ **Slug** - URL amigable (ej: `mi-blog-post-2025`)
- ✅ **Descripción corta** - Para SEO (máx 160 caracteres)
- ✅ **Autor** - Nombre del autor (texto)
- ✅ **Tags** - Array de etiquetas
- ✅ **Fecha de publicación** - Fecha en formato ISO
- ✅ **Estado** - Publicado o borrador
- ⚠️ **Imagen de portada** - URL (dejar vacío o con placeholder)
- ⚠️ **Alt de imagen** - Descripción para SEO (la IA puede completarlo)

## 📦 Bloques Disponibles

### ✅ La IA Puede Completar Automáticamente (26 bloques)

#### Texto y Formato
- ✅ `text` - Párrafos, títulos (h1-h6), listas, quotes
- ✅ `quote` - Citas con autor y cargo
- ✅ `callout` - Notas destacadas con iconos
- ✅ `alert` - Alertas (default, destructive, success, warning)
- ✅ `code` - Bloques de código con syntax highlighting

#### Contenido Estructurado
- ✅ `faq` - Preguntas frecuentes (con schema.org para SEO)
- ✅ `pros-cons` - Ventajas y desventajas visuales
- ✅ `table` - Tablas completas con headers, rows y footer
- ✅ `comparison` - Tablas comparativas de productos/servicios
- ✅ `feature-list` - Lista de características con iconos de Lucide

#### Interactivo
- ✅ `tabs` - Contenido organizado en pestañas
- ✅ `accordion` - Acordeones expandibles
- ✅ `poll` - Encuestas con opciones
- ✅ `checklist` - Listas de tareas interactivas
- ✅ `progress-bar` - Barras de progreso con porcentajes

#### Avanzado
- ✅ `timeline` - Líneas de tiempo cronológicas
- ✅ `changelog` - Historial de versiones/cambios
- ✅ `stats` - Estadísticas y métricas destacadas
- ✅ `icon-grid` - Grid de iconos con descripciones

#### Conversión y Marketing
- ✅ `pricing-table` - Tablas de precios con planes
- ✅ `testimonial` - Testimonios con rating
- ✅ `cta-banner` - Banners de llamada a la acción
- ✅ `button` - Botones con diferentes estilos
- ✅ `tip-box` - Cajas de consejos (tip, warning, danger, info, success)

#### Diseño
- ✅ `separator` - Separadores horizontales
- ✅ `divider-text` - Divisores con texto

### ⚠️ Requieren Completar Manualmente (14 bloques)

Estos bloques necesitan IDs o URLs que solo tú puedes proporcionar:

#### Medios
- ⚠️ `image` - Necesita URL de imagen
- ⚠️ `images-grid` - Necesita URLs de múltiples imágenes
- ⚠️ `video` - Necesita URL de YouTube/Vimeo/Loom
- ⚠️ `before-after` - Necesita 2 URLs de imágenes

#### Contenido Relacionado
- ⚠️ `program-card` - Necesita ID de programa de tu BD
- ⚠️ `programs-grid` - Necesita array de IDs de programas
- ⚠️ `blog-card` - Necesita ID de blog relacionado
- ⚠️ `blogs-grid` - Necesita array de IDs de blogs
- ⚠️ `category-card` - Necesita ID de categoría
- ⚠️ `author-bio` - Necesita ID de autor
- ⚠️ `product-showcase` - Necesita ID de programa

#### Embeds
- ⚠️ `tweet` - Necesita URL del tweet
- ⚠️ `embed` - Necesita código HTML/iframe
- ⚠️ `file-download` - Necesita URL del archivo

**💡 Tip:** La IA puede dejar estos bloques con valores vacíos o placeholders. Tú los completas después de importar.

## 📝 Ejemplo de Metadata Completo

```json
{
  "metadata": {
    "titulo": "Guía Completa de Next.js 14: Todo lo que Necesitas Saber",
    "slug": "guia-completa-nextjs-14",
    "descripcion_corta": "Aprende Next.js 14 desde cero. Guía completa con ejemplos, mejores prácticas y casos de uso reales para desarrolladores.",
    "autor": "Juan Pérez",
    "tags": ["Next.js", "React", "JavaScript", "Web Development"],
    "imagen_portada_url": "",
    "imagen_portada_alt": "Logo de Next.js 14 con código en el fondo",
    "publicado": false,
    "fecha_publicacion": "2025-01-15T10:00:00Z"
  },
  "bloques": [...]
}
```

**Notas importantes:**
- El **slug** debe ser URL-friendly: solo minúsculas, números y guiones
- La **descripción_corta** debe tener máximo 160 caracteres
- Las **tags** son un array de strings
- La **fecha_publicacion** debe estar en formato ISO 8601
- Deja **imagen_portada_url** vacío si no tienes la URL todavía

## 💡 Tips para la IA

### Estructura Recomendada

```
1. Título principal (h1)
2. Introducción (paragraph con HTML)
3. Callout o tip-box con contexto
4. Secciones con h2
5. Contenido mixto (párrafos, listas, imágenes)
6. FAQ al final
7. CTA o botón de acción
```

### Uso de HTML en Textos

La IA puede usar HTML en campos de texto:

```html
<strong>Texto en negrita</strong>
<em>Texto en cursiva</em>
<a href="https://ejemplo.com">Enlace</a>
<ul>
  <li>Item de lista</li>
  <li>Otro item</li>
</ul>
```

### Iconos Disponibles

Para `feature-list`, `icon-grid`, `tip-box`, etc., usa nombres de iconos de Lucide:

**Comunes**: Check, X, Star, Heart, ThumbsUp, ThumbsDown, Zap, Sparkles, Lightbulb, Target, Award, TrendingUp, AlertCircle, Info, HelpCircle

**Acciones**: Plus, Minus, Edit, Trash2, Save, Download, Upload, Share, Copy, Link

**Navegación**: ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft

**Objetos**: Image, File, Folder, Package, ShoppingCart, CreditCard, DollarSign

**Tecnología**: Code, Terminal, Database, Server, Cloud, Wifi, Cpu, Smartphone

Ver más en: https://lucide.dev/icons/

## 🎯 Ejemplo de Prompt Completo para la IA

### Prompt Básico
```
He subido dos archivos JSON:
1. AI-BLOG-SPEC.json - La especificación de formato
2. AI-BLOG-EXAMPLE.json - Un ejemplo completo

Por favor, genera un blog completo sobre "Las mejores alternativas a Photoshop en 2025" 
siguiendo exactamente el formato del ejemplo.

IMPORTANTE:
- Completa TODOS los campos de metadata (titulo, slug, descripcion_corta, autor, tags)
- El slug debe ser URL-friendly: solo minúsculas, números y guiones
- La descripción_corta debe tener máximo 160 caracteres
- Usa bloques apropiados: text, faq, pros-cons, table, feature-list, etc.
- Usa HTML en los textos para formato rico (<strong>, <em>, <a>)
- Deja campos de imágenes vacíos o con ""
- Genera IDs únicos para items dentro de bloques (ej: "faq-1", "tab-1")

Genera el JSON completo y válido listo para descargar.
```

### Prompt Avanzado (con más control)
```
Necesito que generes un blog completo sobre "Las mejores alternativas a Photoshop en 2025".

He subido dos archivos:
- AI-BLOG-SPEC.json: Especificación del formato
- AI-BLOG-EXAMPLE.json: Ejemplo de referencia

METADATA:
- Título: "Las 10 Mejores Alternativas a Photoshop en 2025"
- Slug: "mejores-alternativas-photoshop-2025"
- Descripción: "Descubre las mejores alternativas gratuitas y de pago a Photoshop. Comparación completa con precios, características y casos de uso."
- Autor: "Equipo Editorial"
- Tags: ["Photoshop", "Diseño", "Herramientas", "Alternativas"]

ESTRUCTURA DEL CONTENIDO:
1. Título principal (h1)
2. Introducción con callout destacando la actualización 2025
3. Sección "¿Por qué buscar alternativas?" con feature-list
4. Ventajas y desventajas (pros-cons)
5. Tabla comparativa de las 10 alternativas (table)
6. Sección de precios (pricing-table) con 3 planes
7. FAQ con 5-7 preguntas comunes
8. Tips en tip-box (2-3 consejos)
9. CTA banner al final

FORMATO:
- Usa HTML en los textos: <strong>, <em>, <a href="">, <ul>, <li>
- Iconos de Lucide para feature-list: Check, Star, Zap, Target, Award
- Deja imagen_portada_url vacío
- Genera IDs únicos para todos los items

Genera el JSON completo y válido.
```

## 📊 Validación Automática

El importador valida:

✅ Campos requeridos (título, slug, descripción)
✅ Formato del slug (URL-friendly)
✅ Longitud de descripción (máx 160 caracteres)
✅ Estructura de bloques
✅ Campos obligatorios por tipo de bloque

Y te muestra:
- ❌ Errores que impiden la importación
- ⚠️ Advertencias que puedes ignorar
- ℹ️ Campos que necesitas completar manualmente

## 🔧 Troubleshooting

### "El archivo JSON no es válido"
**Causa:** El JSON tiene errores de sintaxis
**Solución:**
- Copia el JSON y pégalo en [jsonlint.com](https://jsonlint.com) para validarlo
- Asegúrate de que tenga las llaves `metadata` y `bloques`
- Verifica que todas las comillas estén cerradas
- Revisa que no falten comas entre elementos

### "Falta el título/slug/descripción"
**Causa:** Campos obligatorios vacíos en metadata
**Solución:**
- Asegúrate de que el JSON tenga estos campos en `metadata`:
  ```json
  {
    "metadata": {
      "titulo": "Tu título aquí",
      "slug": "tu-slug-aqui",
      "descripcion_corta": "Tu descripción aquí"
    }
  }
  ```

### "El slug debe ser URL-friendly"
**Causa:** El slug tiene caracteres no permitidos
**Solución:**
- Solo usa: minúsculas, números y guiones
- ❌ Mal: `Mi Blog Post 2025`, `mi_blog_post`, `mi-blog-post-2025!`
- ✅ Bien: `mi-blog-post-2025`
- Sin acentos, espacios ni caracteres especiales

### "La descripción corta es muy larga"
**Causa:** Más de 160 caracteres
**Solución:**
- Reduce la descripción a máximo 160 caracteres
- Es una advertencia, puedes ignorarla pero afecta el SEO

### "Muchos campos manuales"
**Causa:** Usaste bloques que requieren IDs o URLs
**Solución:**
- Es normal si usaste bloques de imágenes, programas o blogs relacionados
- Importa el blog y complétalos en el editor
- El sistema te mostrará exactamente qué campos necesitas completar

### "La IA no genera el JSON correctamente"
**Causa:** Prompt poco claro o IA no entendió el formato
**Solución:**
- Asegúrate de subir ambos archivos: AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json
- Usa el prompt de ejemplo del README
- Pide explícitamente: "Genera el JSON completo y válido listo para descargar"
- Si la IA muestra el JSON en un bloque de código, cópialo y guárdalo como .json

### "El blog se importó pero faltan bloques"
**Causa:** Algunos bloques no se procesaron correctamente
**Solución:**
- Revisa el JSON original para ver si los bloques están bien formados
- Verifica que cada bloque tenga `type` y `data`
- Comprueba que los IDs de items internos sean únicos

## 🎉 Beneficios

- ⏱️ **Ahorra 30 minutos** por blog
- 🤖 **La IA hace el trabajo pesado** (estructura, contenido, formato)
- ✅ **Validación automática** antes de importar
- 🎨 **Usa todos los bloques** disponibles
- 📝 **Solo completas lo esencial** (imágenes, IDs)
- 🔄 **Consistencia** en la estructura de todos los blogs
- 🚀 **Escalabilidad** - Crea múltiples blogs rápidamente

## 💎 Mejores Prácticas

### Para la IA
1. **Sé específico en el prompt** - Indica exactamente qué bloques quieres usar
2. **Proporciona contexto** - Dale información sobre el tema y audiencia
3. **Pide HTML rico** - Solicita que use `<strong>`, `<em>`, `<a>` en los textos
4. **Especifica la estructura** - Lista el orden de secciones que quieres
5. **Revisa el ejemplo** - Pide que siga el formato de AI-BLOG-EXAMPLE.json

### Para el Contenido
1. **Usa FAQ** - Mejora el SEO y responde dudas comunes
2. **Incluye pros-cons** - Ayuda a la toma de decisiones
3. **Agrega tablas** - Para comparaciones y datos estructurados
4. **Usa callouts** - Para destacar información importante
5. **Termina con CTA** - Banner o botón de llamada a la acción

### Para el SEO
1. **Descripción corta** - Máximo 160 caracteres, incluye palabra clave
2. **Slug optimizado** - Corto, descriptivo, con palabra clave
3. **Tags relevantes** - 3-5 tags relacionados con el contenido
4. **Alt text** - La IA puede generar descripciones para imágenes
5. **Estructura H1-H6** - Usa jerarquía correcta de títulos

### Después de Importar
1. **Revisa el contenido** - La IA puede cometer errores
2. **Completa imágenes** - Sube imágenes relevantes y de calidad
3. **Asigna categorías** - Organiza el blog en categorías apropiadas
4. **Configura autor** - Asigna el autor correcto desde el editor
5. **Vista previa** - Revisa cómo se ve antes de publicar

## 📁 Archivos del Sistema

- `AI-BLOG-SPEC.json` - Especificación completa de formato
- `AI-BLOG-EXAMPLE.json` - Ejemplo real de blog completo
- `AI-BLOG-TEST.json` - Archivo de prueba para testing
- `AI-BLOG-IMPORT-README.md` - Esta guía de uso
- `AI-BLOG-PROMPTS.md` - 📝 **Prompts de ejemplo** para diferentes tipos de blogs
- `src/components/admin/blog-json-importer.tsx` - Componente importador
- `src/components/admin/blog-manager.tsx` - Integración en admin

## 🚀 Próximos Pasos

1. **Prueba el sistema:**
   - Usa `AI-BLOG-TEST.json` para probar la importación
   - Verifica que todo funcione correctamente

2. **Explora los prompts:**
   - Abre `AI-BLOG-PROMPTS.md` para ver ejemplos de prompts
   - Elige el tipo de blog que quieres crear
   - Personaliza el prompt según tus necesidades

3. **Crea tu primer blog:**
   - Sube AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json a tu IA
   - Usa uno de los prompts de ejemplo
   - Importa y completa campos manuales

4. **Optimiza tu workflow:**
   - Guarda los prompts que funcionan bien
   - Crea variaciones para diferentes temas
   - Comparte mejores prácticas con tu equipo

5. **Escala:**
   - Crea múltiples blogs rápidamente
   - Mantén consistencia en la estructura
   - Itera y mejora tus prompts

¡Disfruta creando blogs 10x más rápido! 🎉

---

## 📚 Recursos Adicionales

- **AI-BLOG-PROMPTS.md** - Prompts listos para usar
- **AI-BLOG-TEST.json** - Archivo de prueba
- **Lucide Icons** - https://lucide.dev/icons/
- **JSON Validator** - https://jsonlint.com
