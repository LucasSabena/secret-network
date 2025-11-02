# 📝 Prompts de Ejemplo para Generar Blogs con IA

Esta guía contiene prompts probados para diferentes tipos de blogs. Copia, personaliza y úsalos con tu IA favorita.

## 🎯 Prompt Base (Úsalo como plantilla)

```
He subido dos archivos JSON:
1. AI-BLOG-SPEC.json - La especificación de formato
2. AI-BLOG-EXAMPLE.json - Un ejemplo completo

Por favor, genera un blog completo sobre "[TEMA]" siguiendo exactamente el formato del ejemplo.

METADATA:
- Título: "[TÍTULO COMPLETO]"
- Slug: "[slug-url-friendly]"
- Descripción: "[Descripción de 150-160 caracteres]"
- Autor: "[Nombre del Autor]"
- Tags: ["tag1", "tag2", "tag3"]

ESTRUCTURA:
[Lista la estructura que quieres]

IMPORTANTE:
- Usa HTML en los textos para formato rico (<strong>, <em>, <a>)
- Genera IDs únicos para items dentro de bloques
- Deja campos de imágenes vacíos
- El JSON debe ser válido y completo

Genera el JSON completo listo para descargar.
```

---

## 📚 Blog Tutorial / Guía

### Ejemplo: "Cómo usar Figma desde cero"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog tutorial sobre "Cómo usar Figma desde cero en 2025".

METADATA:
- Título: "Cómo Usar Figma desde Cero: Guía Completa 2025"
- Slug: "como-usar-figma-desde-cero-2025"
- Descripción: "Aprende Figma paso a paso. Tutorial completo para principiantes con ejemplos prácticos, atajos de teclado y mejores prácticas."
- Autor: "Equipo Editorial"
- Tags: ["Figma", "Tutorial", "Diseño", "UI/UX"]

ESTRUCTURA:
1. Título (h1)
2. Introducción con callout de actualización 2025
3. "¿Qué es Figma?" (h2 + paragraph)
4. "Ventajas de usar Figma" (feature-list con 4-6 items)
5. "Primeros pasos" (h2 + accordion con 5-7 pasos)
6. "Atajos de teclado esenciales" (table con 10-15 atajos)
7. "Consejos para principiantes" (3 tip-box: tip, success, warning)
8. "Preguntas frecuentes" (faq con 6-8 preguntas)
9. CTA banner para curso o recursos

Usa HTML rico en los textos. Genera el JSON completo.
```

---

## 🆚 Blog Comparativo

### Ejemplo: "Figma vs Adobe XD"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog comparativo sobre "Figma vs Adobe XD: ¿Cuál elegir en 2025?".

METADATA:
- Título: "Figma vs Adobe XD: Comparación Completa 2025"
- Slug: "figma-vs-adobe-xd-comparacion-2025"
- Descripción: "Comparación detallada entre Figma y Adobe XD. Características, precios, ventajas y desventajas para ayudarte a elegir la mejor opción."
- Autor: "Equipo Editorial"
- Tags: ["Figma", "Adobe XD", "Comparación", "Diseño"]

ESTRUCTURA:
1. Título (h1)
2. Introducción (paragraph)
3. "Resumen rápido" (callout con conclusión)
4. "Características principales" (comparison con 8-10 features)
5. "Ventajas y desventajas de Figma" (pros-cons)
6. "Ventajas y desventajas de Adobe XD" (pros-cons)
7. "Comparación de precios" (pricing-table con planes de ambos)
8. "¿Cuál elegir?" (h2 + 3 tip-box para diferentes casos de uso)
9. "Preguntas frecuentes" (faq con 5-7 preguntas)
10. CTA banner

Usa HTML rico. Genera el JSON completo.
```

---

## 📋 Blog Lista / Top

### Ejemplo: "Las 10 mejores herramientas de diseño"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog tipo lista sobre "Las 10 Mejores Herramientas de Diseño UI/UX en 2025".

METADATA:
- Título: "Las 10 Mejores Herramientas de Diseño UI/UX en 2025"
- Slug: "mejores-herramientas-diseno-ui-ux-2025"
- Descripción: "Descubre las herramientas de diseño más poderosas del 2025. Comparación completa con precios, características y casos de uso reales."
- Autor: "Equipo Editorial"
- Tags: ["Diseño", "UI/UX", "Herramientas", "2025"]

ESTRUCTURA:
1. Título (h1)
2. Introducción con callout
3. "Criterios de selección" (feature-list con 4 criterios)
4. Para cada herramienta (10 total):
   - Título (h2): "1. [Nombre de la herramienta]"
   - Descripción (paragraph con HTML)
   - Características (feature-list con 3-4 features)
5. "Comparación rápida" (table con las 10 herramientas)
6. "Precios" (pricing-table con 3 rangos: gratis, medio, premium)
7. "Estadísticas del mercado" (stats con 3 métricas)
8. FAQ (5-7 preguntas)
9. CTA banner

Usa HTML rico. Genera el JSON completo.
```

---

## 🎓 Blog Educativo / Explicativo

### Ejemplo: "Qué es el diseño atómico"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog educativo sobre "Qué es el Diseño Atómico y Cómo Aplicarlo".

METADATA:
- Título: "Diseño Atómico: Guía Completa con Ejemplos Prácticos"
- Slug: "diseno-atomico-guia-completa"
- Descripción: "Aprende qué es el diseño atómico, sus principios fundamentales y cómo aplicarlo en tus proyectos. Guía completa con ejemplos."
- Autor: "Equipo Editorial"
- Tags: ["Diseño Atómico", "Design Systems", "UI/UX", "Metodología"]

ESTRUCTURA:
1. Título (h1)
2. Introducción (paragraph)
3. "¿Qué es el diseño atómico?" (h2 + paragraph + callout con definición)
4. "Los 5 niveles del diseño atómico" (h2 + timeline con 5 items)
5. "Ventajas y desventajas" (pros-cons)
6. "Cómo implementarlo paso a paso" (h2 + accordion con 6-8 pasos)
7. "Ejemplos reales" (h2 + 3 tip-box con casos de uso)
8. "Herramientas recomendadas" (feature-list con 4-6 herramientas)
9. FAQ (6-8 preguntas)
10. CTA banner

Usa HTML rico. Genera el JSON completo.
```

---

## 💼 Blog de Producto / Servicio

### Ejemplo: "Presentación de nuevo curso"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog de producto sobre "Curso Completo de Figma 2025".

METADATA:
- Título: "Nuevo Curso: Domina Figma en 30 Días"
- Slug: "curso-completo-figma-30-dias"
- Descripción: "Aprende Figma desde cero hasta nivel avanzado. Curso completo con proyectos reales, certificado y acceso de por vida."
- Autor: "Equipo Editorial"
- Tags: ["Curso", "Figma", "Educación", "Online"]

ESTRUCTURA:
1. Título (h1)
2. Introducción con callout de lanzamiento
3. "¿Para quién es este curso?" (feature-list con 4 perfiles)
4. "Qué aprenderás" (h2 + accordion con módulos del curso)
5. "Ventajas del curso" (pros-cons solo con pros)
6. "Contenido del curso" (timeline con 4-6 módulos)
7. "Testimonios" (testimonial con 2-3 testimonios ficticios)
8. "Planes y precios" (pricing-table con 3 opciones)
9. "Estadísticas" (stats con 3 métricas: estudiantes, rating, horas)
10. FAQ (6-8 preguntas sobre el curso)
11. CTA banner grande

Usa HTML rico. Genera el JSON completo.
```

---

## 📰 Blog de Noticias / Actualización

### Ejemplo: "Novedades de Figma 2025"

```
He subido AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json.

Genera un blog de noticias sobre "Todas las Novedades de Figma en 2025".

METADATA:
- Título: "Figma 2025: Todas las Nuevas Características y Mejoras"
- Slug: "figma-2025-nuevas-caracteristicas"
- Descripción: "Descubre todas las novedades de Figma en 2025: IA generativa, colaboración mejorada, nuevas herramientas y mucho más."
- Autor: "Equipo Editorial"
- Tags: ["Figma", "Novedades", "2025", "Actualización"]

ESTRUCTURA:
1. Título (h1)
2. Introducción con callout de fecha
3. "Resumen de cambios" (stats con 3-4 métricas)
4. "Nuevas características" (h2 + feature-list con 6-8 features)
5. "Mejoras en IA" (h2 + paragraph + 2 tip-box)
6. "Cambios en precios" (pricing-table comparando antes/después)
7. "Historial de cambios" (changelog con 5-7 versiones)
8. "Impacto en usuarios" (pros-cons)
9. FAQ (5-7 preguntas sobre las novedades)
10. CTA banner

Usa HTML rico. Genera el JSON completo.
```

---

## 🎯 Tips para Personalizar los Prompts

### 1. Ajusta el Tono
- **Formal:** "Genera un análisis profesional..."
- **Casual:** "Crea un blog amigable y conversacional..."
- **Técnico:** "Desarrolla una guía técnica detallada..."

### 2. Especifica la Longitud
- **Corto:** "Máximo 10 bloques, contenido conciso"
- **Medio:** "15-20 bloques, balance entre detalle y brevedad"
- **Largo:** "25-30 bloques, contenido exhaustivo y detallado"

### 3. Define la Audiencia
- "Para principiantes sin experiencia previa"
- "Para diseñadores intermedios que ya conocen lo básico"
- "Para profesionales avanzados buscando optimización"

### 4. Pide Ejemplos Específicos
- "Incluye ejemplos de empresas reales"
- "Agrega casos de uso prácticos"
- "Menciona estadísticas y datos actuales"

### 5. Controla el HTML
- "Usa <strong> para términos importantes"
- "Agrega <a> con enlaces a recursos externos"
- "Incluye <ul> y <li> para listas dentro de párrafos"

---

## 🚀 Workflow Recomendado

1. **Elige el tipo de blog** que quieres crear
2. **Copia el prompt** correspondiente de esta guía
3. **Personaliza** el tema, título, slug y estructura
4. **Sube** AI-BLOG-SPEC.json y AI-BLOG-EXAMPLE.json a tu IA
5. **Pega el prompt** personalizado
6. **Descarga** el JSON generado
7. **Importa** en el admin
8. **Completa** campos manuales
9. **Revisa** y publica

---

## 💡 Consejos Finales

- **Itera:** Si el resultado no es perfecto, pide ajustes específicos
- **Combina bloques:** Mezcla diferentes tipos para contenido más rico
- **Mantén consistencia:** Usa el mismo estilo de prompts para tu equipo
- **Guarda prompts exitosos:** Crea una biblioteca de prompts que funcionan bien
- **Experimenta:** Prueba diferentes estructuras y bloques

¡Disfruta creando blogs 10x más rápido! 🎉
