# 📊 Guía Completa de SEO y Analytics - Secret Network

## 🎯 Descripción General

Este documento contiene toda la información sobre la implementación de SEO, Schema.org, Google Analytics y Google Tag Manager en Secret Network.

---

## 📁 Estructura de Archivos SEO

### 1. Archivos de Configuración
```
public/
  └── robots.txt          # Configuración de crawlers y sitemap

src/app/
  ├── sitemap.ts          # Sitemap dinámico (se regenera cada hora)
  └── layout.tsx          # Metadata global y scripts de analytics
```

### 2. Componentes SEO
```
src/components/seo/
  ├── seo-metadata.tsx           # Utilidad para generar metadatos
  ├── json-ld-organization.tsx   # Schema.org Organization
  ├── json-ld-website.tsx        # Schema.org WebSite
  ├── json-ld-software.tsx       # Schema.org SoftwareApplication
  ├── json-ld-article.tsx        # Schema.org Article (blog)
  └── json-ld-breadcrumb.tsx     # Schema.org BreadcrumbList
```

### 3. Componentes de Analytics
```
src/components/analytics/
  ├── google-analytics.tsx       # Google Analytics 4 (GA4)
  ├── google-tag-manager.tsx     # Google Tag Manager (GTM)
  └── analytics-events.tsx       # Sistema de eventos personalizados
```

---

## 🚀 Configuración Inicial

### Paso 1: Variables de Entorno

Crea o actualiza tu archivo `.env.local` con:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://secret-network.vercel.app
```

### Paso 2: Obtener Google Analytics ID

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una propiedad (si no tienes una)
3. Selecciona "Web" como plataforma
4. Copia tu Measurement ID (formato: `G-XXXXXXXXXX`)
5. Agrégalo a `.env.local`

### Paso 3: Obtener Google Tag Manager ID

1. Ve a [Google Tag Manager](https://tagmanager.google.com/)
2. Crea un contenedor (si no tienes uno)
3. Copia tu Container ID (formato: `GTM-XXXXXXX`)
4. Agrégalo a `.env.local`

### Paso 4: Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GTM_ID`
4. Redeploy el proyecto

---

## 🔍 Verificación en Google Search Console

### 1. Agregar tu sitio

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega una nueva propiedad: `https://secret-network.vercel.app`
3. Verifica la propiedad usando uno de estos métodos:
   - **HTML Tag**: Copia el código y agrégalo en `src/app/layout.tsx` en la metadata
   - **Google Analytics**: Si ya configuraste GA4, será automático

### 2. Enviar el sitemap

1. En Search Console, ve a "Sitemaps"
2. Ingresa: `https://secret-network.vercel.app/sitemap.xml`
3. Haz clic en "Submit"

### 3. Verificar indexación

Después de 24-48 horas, podrás ver:
- Páginas indexadas
- Errores de rastreo
- Performance en búsquedas
- Consultas de búsqueda

---

## 📈 Eventos de Analytics Implementados

### Eventos de Programas
```typescript
// Click en tarjeta de programa
programEvents.clickProgram(programName, category)

// Visitar sitio web oficial
programEvents.visitWebsite(programName)

// Ver detalles del programa
programEvents.viewDetails(programName)
```

### Eventos de Navegación
```typescript
// Click en categoría
navigationEvents.clickCategory(categoryName)

// Click en subcategoría
navigationEvents.clickSubcategory(subcategoryName, parentCategory)

// Click en breadcrumb
navigationEvents.clickBreadcrumb(path)
```

### Eventos de Filtros
```typescript
// Aplicar filtro
filterEvents.applyFilter(filterType, filterValue)

// Búsqueda
filterEvents.search(searchTerm, resultsCount)
```

### Eventos de Redes Sociales
```typescript
// Compartir en redes
socialEvents.share(platform, contentType, contentTitle)
```

### Eventos de Blog
```typescript
// Leer artículo
blogEvents.readArticle(articleTitle, readingTime)

// Click en post relacionado
blogEvents.clickRelatedPost(postTitle)
```

### Eventos de Conversión
```typescript
// Descargar recurso
conversionEvents.downloadResource(resourceName)

// Ver alternativas
conversionEvents.viewAlternatives(programName, alternativesCount)
```

---

## 🎨 Schema.org Structured Data

### Organization (Global)
Aparece en todas las páginas. Define la organización:
- Nombre: Secret Network
- Logo
- Descripción
- Redes sociales (cuando las agregues)

### WebSite (Homepage)
Habilita el "sitelinks searchbox" en Google:
- Nombre del sitio
- URL
- SearchAction con query template

### SoftwareApplication (Páginas de Programas)
Rich snippets para programas individuales:
- Nombre del programa
- Descripción
- Imagen
- Categoría de aplicación
- Precio (si es gratis)
- Sistema operativo
- Autor

### Article (Posts del Blog)
Rich snippets para artículos:
- Título
- Descripción
- Imagen destacada
- Autor
- Fecha de publicación
- Fecha de modificación
- Tags

### BreadcrumbList (Navegación)
Muestra el path de navegación en los resultados de búsqueda:
- Inicio → Categoría → Programa
- Inicio → Blog → Post

---

## 🔧 Personalización Avanzada

### Agregar nuevos eventos personalizados

En `src/components/analytics/analytics-events.tsx`:

```typescript
export const customEvents = {
  myCustomEvent: (param1: string, param2: number) => {
    trackEvent({
      category: 'custom_category',
      action: 'custom_action',
      label: `Custom - ${param1}`,
      value: param2,
      customParams: {
        custom_param: param1,
      },
    });
  },
};
```

### Usar en componentes

```typescript
'use client';

import { customEvents } from '@/components/analytics/analytics-events';

export function MyComponent() {
  const handleClick = () => {
    customEvents.myCustomEvent('test', 123);
  };

  return <button onClick={handleClick}>Track Me</button>;
}
```

---

## 📊 Configurar GTM Tags (Opcional)

Si quieres usar GTM para más control:

### 1. Variables en GTM
- `event_category`
- `event_action`
- `event_label`
- `event_value`

### 2. Triggers en GTM
- Custom Event: `custom_event`
- Page View
- Click

### 3. Tags en GTM
- Google Analytics: GA4 Event
- Facebook Pixel (si lo necesitas)
- LinkedIn Insight Tag
- Otros servicios de tracking

---

## 🎯 Keywords Implementados

### Keywords Generales (Todas las páginas)
- herramientas de diseño
- software de diseño
- alternativas de diseño
- programas de diseño
- diseño gráfico
- diseño UI/UX
- software gratuito
- open source

### Keywords Específicos por Página

**Páginas de programas:**
- Nombre del programa
- "alternativa [nombre]"
- Categoría del programa
- "gratis" (si es open source)

**Blog:**
- Tags del post
- Título del post
- Temas relacionados

**Alternativas:**
- "alternativas a [programa]"
- "reemplazar [programa]"
- "mejor que [programa]"

---

## 📝 Checklist de Optimización

### ✅ SEO Técnico
- [x] Robots.txt configurado
- [x] Sitemap.xml dinámico
- [x] Metadata en todas las páginas
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Canonical URLs
- [x] Schema.org markup
- [ ] Imagen OG personalizada (`/public/og-image.png`)
- [ ] Verificación en Search Console
- [ ] Submit sitemap en Search Console

### ✅ Performance
- [x] Lazy loading de imágenes
- [x] Next.js Image optimization
- [x] ISR (Incremental Static Regeneration)
- [ ] Comprimir imágenes con Cloudinary
- [ ] Preload de fuentes críticas

### ✅ Analytics
- [x] Google Analytics 4 instalado
- [x] Google Tag Manager instalado
- [x] Eventos personalizados
- [x] Labels descriptivos
- [ ] Configurar GA4 property
- [ ] Configurar conversiones en GA4

### ✅ Content
- [x] Keywords en títulos
- [x] Descripciones únicas
- [x] Alt text en imágenes
- [x] Breadcrumbs
- [ ] Más contenido en blog
- [ ] FAQs en páginas clave

---

## 🚦 Monitoreo y Mantenimiento

### Herramientas Recomendadas

1. **Google Search Console**
   - Monitorear indexación
   - Revisar errores
   - Análisis de búsquedas

2. **Google Analytics**
   - Tráfico y usuarios
   - Conversiones
   - Comportamiento de usuarios

3. **Google PageSpeed Insights**
   - Core Web Vitals
   - Performance score
   - Recomendaciones

4. **Ahrefs / SEMrush** (Opcional)
   - Backlinks
   - Posiciones en búsquedas
   - Competencia

### Revisiones Mensuales

- [ ] Revisar páginas indexadas
- [ ] Analizar keywords con mejor ranking
- [ ] Revisar errores 404
- [ ] Actualizar sitemap si hay cambios
- [ ] Revisar velocidad de carga
- [ ] Analizar conversiones

---

## 🎓 Recursos Adicionales

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Tag Manager Guide](https://support.google.com/tagmanager/answer/6102821)

---

## 📧 Soporte

Si necesitas ayuda:
1. Revisa la documentación de Next.js
2. Consulta Google Search Console
3. Verifica las variables de entorno
4. Revisa la consola del navegador para errores

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0

