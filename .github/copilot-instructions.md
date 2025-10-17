# Project Manifesto: Secret Network

**IMPORTANTE:** Este documento es la única fuente de verdad para el desarrollo del proyecto "Secret Network". Todo el código generado debe adherirse estrictamente a las reglas, arquitecturas y sistemas de diseño definidos aquí.

## 1. Resumen del Proyecto y Objetivo

**Secret Network** es un directorio moderno y curado de software y recursos para diseñadores. El objetivo es crear un sitio web rápido, estético y funcional donde los usuarios puedan descubrir herramientas, filtrar por categorías específicas (plataforma, precio, etc.), y encontrar alternativas de código abierto a programas populares.

- **Público Objetivo:** Diseñadores (UI/UX, gráficos), desarrolladores, estudiantes y creativos.
- **Tono:** Moderno, limpio, tecnológico y profesional. La estética principal es *dark mode*.

---

## 2. Reglas de Desarrollo Fundamentales (Innegociables)

1.  **TypeScript es Obligatorio:** Todo el código (componentes, funciones, páginas) debe estar fuertemente tipado. Usar `any` está prohibido, salvo en casos excepcionales y justificados.
2.  **Server Components por Defecto:** La arquitectura es "Server-First". Los componentes deben ser React Server Components (RSC) por defecto. Solo se añadirá la directiva `"use client";` si el componente requiere interactividad del lado del cliente (hooks como `useState`, `useEffect`, o eventos como `onClick`).
3.  **Usar Design Tokens, NO Valores Mágicos:** Está prohibido usar valores hardcodeados para estilos (ej: `text-[#ff3399]`, `w-[350px]`). Siempre se deben usar las clases de utilidad de Tailwind que se corresponden con los tokens definidos en el Design System (ej: `text-primary`, `w-80`).
4.  **Iconografía Estricta: Lucide Icons, CERO EMOJIS:** Todos los iconos deben provenir de la librería `lucide-react`. El uso de emojis en la UI está **estrictamente prohibido** para mantener la consistencia visual y profesionalidad.
5.  **Componentes Pequeños y Reutilizables:** Construir componentes pequeños y de propósito único (ej: `<Button>`, `<ProgramCard>`) y componerlos para crear interfaces complejas. Los componentes deben ser "tontos" y recibir todos sus datos a través de props.

---

## 3. Arquitectura y Tech Stack

- **Framework:** **Next.js 15** (con App Router).
- **Lenguaje:** **TypeScript**.
- **Base de Datos:** **Supabase** (PostgreSQL). La interacción se hace exclusivamente a través del cliente `@supabase/supabase-js`.
- **Estilos:** **Tailwind CSS**.
- **Componentes UI:** **shadcn/ui**. Los componentes se añaden al proyecto y son totalmente personalizables.
- **Iconos:** **Lucide React** (`lucide-react`).
- **Animaciones:** **Framer Motion**.
- **Hosting de Imágenes:** **Cloudinary + Unsplash**. La base de datos solo almacena las URLs.
- **Despliegue:** **Vercel** - URL: `https://secretnetwork.co`
- **Control de Versiones:** **Git & GitHub** - Repo: `LucasSabena/secret-network`
- **SEO:** Schema.org JSON-LD, Open Graph, Twitter Cards
- **Analytics:** Google Analytics 4, Google Tag Manager

---

## 4. Esquema de la Base de Datos (Supabase)

**IMPORTANTE:** La base de datos consta de 9 tablas principales + 4 tablas intermedias.

### Tablas Principales

#### 1. `programas`
Contiene la información de cada herramienta/programa.
- `id` (int8, PK)
- `nombre` (text, Not Null)
- `slug` (text, Not Null, Unique)
- `icono_url` (text) - URL de Cloudinary
- `categoria_id` (int8, FK → `categorias.id`)
- `descripcion_corta` (text) - Resumen breve
- `descripcion_larga` (text) - Descripción completa (puede contener HTML)
- `captura_url` (text) - Screenshot del programa
- `dificultad` (text: "Facil", "Intermedio", "Dificil")
- `es_open_source` (bool) - true si es software libre
- `es_recomendado` (bool) - true para destacar en /alternativas
- `web_oficial_url` (text) - Link al sitio web oficial
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 2. `categorias`
Almacena categorías y subcategorías (estructura jerárquica).
- `id` (int8, PK)
- `nombre` (text, Not Null)
- `slug` (text, Not Null, Unique)
- `descripcion` (text)
- `id_categoria_padre` (int8, FK → `categorias.id`, nullable) - null = categoría principal
- `icono` (text) - Nombre del icono de Lucide
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 3. `plataformas`
Lista de plataformas soportadas.
- `id` (int8, PK)
- `nombre` (text, Not Null) - Ej: "macOS", "Windows", "Linux", "Web"
- `slug` (text, Not Null, Unique)
- `icono_url` (text) - URL del icono

#### 4. `modelos_de_precios`
Modelos de precio/licencia.
- `id` (int8, PK)
- `nombre` (text, Not Null) - Ej: "Gratis", "Freemium", "Pago único", "Suscripción"
- `slug` (text, Not Null, Unique)

#### 5. `blog_posts` ⭐ NUEVA
Posts del blog con CMS completo.
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion_corta TEXT,
  contenido TEXT NOT NULL,                    -- Contenido HTML
  imagen_portada_url TEXT,                    -- URL de Cloudinary/Unsplash
  autor VARCHAR(100),
  fecha_publicacion TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  publicado BOOLEAN DEFAULT false,            -- Solo mostrar si es true
  tags TEXT[]                                 -- Array de tags
);
```

### Tablas Intermedias (Relaciones Muchos-a-Muchos)

#### 6. `programas_plataformas`
Relaciona programas con plataformas.
- `programa_id` (int8, FK → `programas.id`)
- `plataforma_id` (int8, FK → `plataformas.id`)
- PK: (`programa_id`, `plataforma_id`)

#### 7. `programas_subcategorias`
Relaciona programas con subcategorías.
- `programa_id` (int8, FK → `programas.id`)
- `subcategoria_id` (int8, FK → `categorias.id`)
- PK: (`programa_id`, `subcategoria_id`)

#### 8. `programas_modelos_de_precios`
Relaciona programas con modelos de precio.
- `programa_id` (int8, FK → `programas.id`)
- `modelo_precio_id` (int8, FK → `modelos_de_precios.id`)
- PK: (`programa_id`, `modelo_precio_id`)

#### 9. `programas_alternativas`
Relaciona programas originales con sus alternativas.
- `programa_original_id` (int8, FK → `programas.id`)
- `programa_alternativa_id` (int8, FK → `programas.id`)
- PK: (`programa_original_id`, `programa_alternativa_id`)
- **Ejemplo**: Photoshop → [GIMP, Krita, Photopea]

---

## 5. Design System

### 5.1. Tipografía
- **Fuente:** `Space Grotesk`, importada vía `next/font`.
- **Aplicación:** Ver el archivo `src/app/layout.tsx` para la implementación correcta a través de una variable CSS `--font-space-grotesk`.

### 5.2. Sistema de Colores
Los colores se definen como variables CSS en HSL en `globals.css` y se mapean en `tailwind.config.ts`. Esto permite el cambio de tema dark/light.

- **Primario:** Rosa (`#ff3399`, `hsl(326 100% 60%)`)
- **Fondo (Dark):** Gris oscuro (`#202020` aprox., `hsl(240 10% 3.9%)`)
- **Texto (Dark):** Blanco roto (`#FAFAFA`, `hsl(0 0% 98%)`)

#### Uso de Degradados (Gradient Pattern)
Para resaltar palabras clave en títulos y headings, se utiliza el siguiente patrón estándar:

**Degradado Primario (Rosa a Rosa Oscuro):**
```jsx
<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
  palabra clave
</span>
```

Este degradado debe usarse consistentemente en:
- Títulos principales de hero sections
- Palabras destacadas en headings (h1, h2)
- CTAs importantes
- Nombres de programas/herramientas destacadas

**Ejemplo de implementación:**
```jsx
<h1>
  Descubrí programas de{" "}
  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
    diseño
  </span>
</h1>
```

### 5.3. Código de Implementación del Design System

#### Archivo: `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* DARK MODE (DEFAULT) */
  :root {
    --background: 240 10% 3.9%; --foreground: 0 0% 98%; --card: 240 10% 3.9%; --card-foreground: 0 0% 98%; --popover: 240 10% 3.9%; --popover-foreground: 0 0% 98%; --primary: 326 100% 60%; --primary-foreground: 0 0% 98%; --secondary: 150 100% 40%; --secondary-foreground: 0 0% 98%; --destructive: 0 84.2% 60.2%; --destructive-foreground: 0 0% 98%; --success: 150 100% 40%; --success-foreground: 0 0% 98%; --warning: 38 92% 50%; --warning-foreground: 0 0% 3.9%; --muted: 240 3.7% 15.9%; --muted-foreground: 240 5% 64.9%; --accent: 240 3.7% 15.9%; --accent-foreground: 0 0% 98%; --border: 240 3.7% 15.9%; --input: 240 3.7% 15.9%; --ring: 326 100% 60%; --radius: 0.5rem;
  }
  /* LIGHT MODE */
  .light {
    --background: 0 0% 100%; --foreground: 240 10% 3.9%; --card: 0 0% 100%; --card-foreground: 240 10% 3.9%; --popover: 0 0% 100%; --popover-foreground: 240 10% 3.9%; --primary: 326 100% 60%; --primary-foreground: 0 0% 98%; --secondary: 150 100% 40%; --secondary-foreground: 0 0% 98%; --destructive: 0 84.2% 60.2%; --destructive-foreground: 0 0% 98%; --success: 150 100% 40%; --success-foreground: 0 0% 98%; --warning: 38 92% 50%; --warning-foreground: 0 0% 3.9%; --muted: 240 4.8% 95.9%; --muted-foreground: 240 3.8% 46.1%; --accent: 240 4.8% 95.9%; --accent-foreground: 240 5.9% 10%; --border: 240 5.9% 90%; --input: 240 5.9% 90%; --ring: 326 100% 60%;
  }
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

---

## 6. Estructura de Archivos

El proyecto usa el directorio `src/` y sigue la siguiente organización:

```
/src/app                              # Rutas y páginas (Next.js App Router)
  ├── page.tsx                        # Homepage
  ├── layout.tsx                      # Layout global con Analytics
  ├── sitemap.ts                      # Sitemap dinámico (ISR cada hora)
  ├── categorias/                     # Páginas de categorías
  │   ├── page.tsx                    # Lista de categorías
  │   ├── [categoria]/
  │   │   └── page.tsx                # Categoría individual
  │   └── [categoria]/[subcategoria]/
  │       └── page.tsx                # Subcategoría
  ├── programas/
  │   └── [slug]/
  │       └── page.tsx                # Programa individual + JSON-LD
  ├── blog/                           # Sistema de blog ⭐ NUEVO
  │   ├── page.tsx                    # Índice de posts
  │   └── [slug]/
  │       └── page.tsx                # Post individual + JSON-LD
  ├── alternativas/                   # Sistema de alternativas ⭐ NUEVO
  │   ├── page.tsx                    # Programas populares
  │   └── [slug]/
  │       └── page.tsx                # Alternativas de un programa
  ├── sobre-nosotros/                 # About page ⭐ NUEVO
  │   └── page.tsx
  └── open-source/                    # Programas open source ⭐ NUEVO
      └── page.tsx
  └── contacto/                       # Sistema de contacto ⭐ NUEVO
      └── page.tsx

/src/components                       # Componentes React reutilizables
  ├── ui/                             # shadcn/ui base components
  ├── shared/                         # Componentes compartidos
  │   ├── program-card.tsx            # Con analytics tracking
  │   ├── program-filters.tsx
  │   └── formatted-text.tsx
  ├── layout/                         # Estructura principal
  │   ├── navbar.tsx                  # Con menú hamburguesa
  │   ├── footer.tsx
  │   ├── hero.tsx
  │   └── theme-provider.tsx
  ├── seo/                            # Componentes SEO ⭐ NUEVO
  │   ├── seo-metadata.tsx            # Utilidad para metadatos
  │   ├── json-ld-organization.tsx    # Schema.org Organization
  │   ├── json-ld-website.tsx         # Schema.org WebSite
  │   ├── json-ld-software.tsx        # Schema.org SoftwareApplication
  │   ├── json-ld-article.tsx         # Schema.org Article
  │   └── json-ld-breadcrumb.tsx      # Schema.org BreadcrumbList
  ├── analytics/                      # Google Analytics & GTM ⭐ NUEVO
  │   ├── google-analytics.tsx        # GA4 component
  │   ├── google-tag-manager.tsx      # GTM + NoScript
  │   └── analytics-events.tsx        # Sistema de eventos
  ├── blog/                           # Componentes del blog ⭐ NUEVO
  │   ├── blog-hero.tsx
  │   ├── blog-card.tsx
  │   ├── blog-grid.tsx
  │   ├── blog-post-header.tsx
  │   ├── blog-content.tsx
  │   └── related-posts.tsx
  ├── alternativas/                   # Componentes alternativas ⭐ NUEVO
  │   ├── alternatives-hero.tsx
  │   ├── alternatives-grid.tsx
  │   ├── alternative-hero.tsx
  │   └── alternatives-list.tsx
  ├── about/                          # Componentes About ⭐ NUEVO
  │   ├── about-hero.tsx
  │   ├── about-story.tsx
  │   ├── about-mission.tsx
  │   └── about-binary-studio.tsx
  └── open-source/                    # Componentes Open Source ⭐ NUEVO
      ├── open-source-hero.tsx
      └── open-source-list-client.tsx
  └── contact/                        # Componentes de Contacto ⭐ NUEVO
      ├── contact-hero.tsx            # Hero animado
      ├── contact-form.tsx            # Orquestador principal
      ├── contact-info.tsx            # Sidebar con info
      └── forms/
          ├── sponsor-form.tsx        # Form de sponsors
          ├── error-report-form.tsx   # Form de errores
          ├── program-suggestion-form.tsx  # Form de sugerencias
          └── general-contact-form.tsx # Form general

/src/lib                              # Lógica auxiliar y configuración
  ├── supabase.js                     # Cliente de Supabase
  ├── utils.ts                        # Funciones de utilidad (cn, etc.)
  └── types.ts                        # Tipos TypeScript
```

### Tipos TypeScript Definidos (`src/lib/types.ts`)

```typescript
export type Programa = {
  id: number;
  nombre: string;
  slug: string;
  icono_url: string | null;
  categoria_id: number;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  captura_url: string | null;
  dificultad: 'Facil' | 'Intermedio' | 'Dificil' | null;
  es_open_source: boolean;
  es_recomendado: boolean;
  web_oficial_url: string | null;
};

export type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  id_categoria_padre: number | null;
  icono: string | null;
};

export type BlogPost = {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  contenido: string;
  imagen_portada_url: string | null;
  autor: string | null;
  fecha_publicacion: string;
  actualizado_en: string;
  publicado: boolean;
  tags: string[] | null;
};

export type ProgramaAlternativa = {
  programa_original_id: number;
  programa_alternativa_id: number;
};
```

---

## 7. Páginas Implementadas

### 7.1. Homepage (`/`)
- Hero con gradiente rosa
- Grid de programas destacados
- Filtros y búsqueda
- Cards con efecto flip 3D

### 7.2. Categorías (`/categorias`)
- Lista de todas las categorías principales
- Navegación a categorías y subcategorías

### 7.3. Programas (`/programas/[slug]`)
- Página individual de cada programa
- Breadcrumb navigation
- Screenshot e información completa
- Hasta 5 alternativas recomendadas
- **JSON-LD**: SoftwareApplication + BreadcrumbList
- **Metadata**: Open Graph, Twitter Cards

### 7.4. Blog (`/blog`) ⭐ NUEVO
Sistema completo de blog con CMS en Supabase:
- **Índice** (`/blog`): Grid de artículos publicados
- **Post** (`/blog/[slug]`): Contenido completo con HTML
- ISR: revalidate cada hora
- **JSON-LD**: Article + BreadcrumbList
- **Features**:
  - Imagen de portada
  - Tags
  - Autor y fechas
  - Posts relacionados
  - Contenido HTML renderizado con `dangerouslySetInnerHTML`

### 7.5. Alternativas (`/alternativas`) ⭐ NUEVO
Sistema de comparación de herramientas:
- **Índice** (`/alternativas`): Programas recomendados (`es_recomendado=true`)
- **Alternativas** (`/alternativas/[slug]`): Alternativas a un programa específico
- Usa tabla `programas_alternativas` para relaciones
- Separación visual: Open Source vs. Pago
- Cards grandes (variant='large')
- Breadcrumb correcto: /alternativas → /alternativas/[slug] → /programas/[slug]

### 7.6. Sobre Nosotros (`/sobre-nosotros`) ⭐ NUEVO
Página estática sobre el proyecto:
- Historia y origen (inspirado en OpenAlternative)
- Misión y valores (4 cards)
- Información de Binary Studio
- Componentes modulares y reutilizables

### 7.7. Open Source (`/open-source`) ⭐ NUEVO
Programas exclusivamente open source:
- Filtra automáticamente `es_open_source=true`
- Sistema de filtros adaptado
- Hero explicando importancia del open source

### 7.8. Contacto (`/contacto`) ⭐ NUEVO
Sistema completo de formularios de contacto:
- **Índice** (`/contacto`): Página con 4 tipos de formularios dinámicos
- **Hero animado**: Con Framer Motion y gradiente rosa
- **Formularios específicos**:
  - **Sponsor**: Para empresas (8 campos, dropdowns de presupuesto y tipo)
  - **Reporte de error**: Para bugs (7 campos, tipo de error, navegador, URL)
  - **Sugerencia de programa**: Para agregar herramientas (8 campos, categoría, open source)
  - **Contacto general**: Consultas simples (3 campos básicos)
- **Emails HTML**: Formateados profesionalmente con gradiente rosa
- **Resend**: Servicio de email transaccional integrado
- **Validación**: Campos obligatorios marcados, feedback con toast
- **Responsive**: Mobile-first, animaciones suaves

---

## 8. SEO y Analytics

### 8.1. Infraestructura SEO

#### Archivos de Configuración
- **`public/robots.txt`**: Permite todos los bots (incluidos IA: GPTBot, Claude, Perplexity)
- **`src/app/sitemap.ts`**: Sitemap dinámico con ISR (revalidate: 3600s)
  - Incluye: páginas estáticas, categorías, subcategorías, programas, blog, alternativas

#### Metadata Global (`src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://secretnetwork.co'),
  title: {
    default: 'Secret Network - Directorio de Herramientas de Diseño',
    template: '%s | Secret Network',
  },
  description: 'Descubre las mejores herramientas y programas de diseño...',
  keywords: ['herramientas de diseño', 'software de diseño', ...],
  openGraph: { ... },
  twitter: { ... },
};
```

#### Schema.org JSON-LD
Todos los componentes en `src/components/seo/`:
1. **Organization** (global): Info de Secret Network
2. **WebSite** (homepage): SearchAction para sitelinks
3. **SoftwareApplication** (programas): Rich snippets
4. **Article** (blog): Rich snippets para posts
5. **BreadcrumbList** (navegación): Breadcrumbs en búsquedas

### 8.2. Google Analytics 4

#### Configuración
Variables de entorno necesarias:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://secretnetwork.co
```

#### Componentes
- **`GoogleAnalytics`**: Script de GA4
- **`GoogleTagManager`**: GTM + NoScript iframe
- **`analytics-events.tsx`**: Sistema completo de eventos

#### Eventos Implementados
```typescript
// Eventos de programas
programEvents.clickProgram(programName, category)
programEvents.visitWebsite(programName)
programEvents.viewDetails(programName)

// Eventos de navegación
navigationEvents.clickCategory(categoryName)
navigationEvents.clickSubcategory(subcategoryName, parentCategory)
navigationEvents.clickBreadcrumb(path)

// Eventos de filtros
filterEvents.applyFilter(filterType, filterValue)
filterEvents.search(searchTerm, resultsCount)

// Eventos de blog
blogEvents.readArticle(articleTitle, readingTime)
blogEvents.clickRelatedPost(postTitle)

// Eventos de conversión
conversionEvents.viewAlternatives(programName, alternativesCount)
```

### 8.3. Keywords Principales
- herramientas de diseño
- software de diseño
- alternativas photoshop
- alternativas illustrator
- alternativas figma
- programas de diseño gratis
- diseño gráfico
- diseño UI/UX
- software open source

---

## 9. Sistema de Contacto ⭐ NUEVO

### 9.1. Arquitectura

Sistema completo de formularios dinámicos con envío de emails a través de Resend.

#### API Route: `/api/contact`
- Procesa formularios de 4 tipos diferentes
- Genera emails HTML formateados profesionalmente
- Usa Resend para envío transaccional
- Email destino: `01studiobinary@gmail.com`

#### Tipos de Formulario

1. **Sponsor** (8 campos)
   - Nombre, Email, Empresa, Website
   - Tipo de sponsoreo (dropdown): Banner, Newsletter, Categoría, Personalizado
   - Presupuesto (dropdown): Menos de $1,000, $1,000-$5,000, $5,000-$10,000, $10,000-$25,000, $25,000+
   - Mensaje

2. **Reporte de Error** (7 campos)
   - Nombre (opcional), Email
   - Tipo de error (dropdown): Visual, Funcional, Datos, Performance, Link roto, Otro
   - URL del error, Navegador (dropdown)
   - Descripción, Pasos para reproducir

3. **Sugerencia de Programa** (8 campos)
   - Nombre (opcional), Email
   - Nombre del programa, Website oficial
   - Categoría (dropdown), Open Source (dropdown)
   - Descripción, Por qué agregarlo

4. **Contacto General** (3 campos)
   - Nombre, Email, Mensaje

### 9.2. Configuración de Resend

#### Variables de Entorno
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

#### Implementación
```typescript
// src/app/api/contact/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Secret Network <onboarding@resend.dev>',
  to: ['01studiobinary@gmail.com'],
  replyTo: formData.email,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### 9.3. Estructura de Emails HTML

Cada tipo de formulario genera un email con:
- **Header**: Gradiente rosa (`#ff3399`) con título
- **Campos**: Organizados en secciones con bordes rosa
- **Badges**: Para información destacada (tipo, presupuesto, etc.)
- **Footer**: Branding de Secret Network
- **Responsive**: Optimizado para mobile

### 9.4. Componentes

```
src/components/contact/
├── contact-hero.tsx              # Hero con animaciones Framer Motion
├── contact-form.tsx              # Orquestador con selector de tipo
├── contact-info.tsx              # Sidebar con info y FAQ
└── forms/
    ├── sponsor-form.tsx          # Form específico para sponsors
    ├── error-report-form.tsx     # Form específico para errores
    ├── program-suggestion-form.tsx # Form específico para sugerencias
    └── general-contact-form.tsx  # Form general simplificado
```

### 9.5. Features

- ✅ Formularios dinámicos según tipo seleccionado
- ✅ Animaciones suaves con Framer Motion (AnimatePresence)
- ✅ Validación HTML5 nativa
- ✅ Toast notifications para feedback
- ✅ Emails HTML profesionales
- ✅ Responsive mobile-first
- ✅ Integrado en Navbar y Footer
- ✅ SEO optimizado (breadcrumbs, metadata)
- ✅ CERO emojis (solo Lucide icons)

---

## 10. Comandos y Scripts

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
```

### Scripts de Base de Datos
```bash
node scripts/create-blog-posts.js    # Crear 4 posts de prueba
```

### Git
```bash
git add .
git commit -m "feat: descripción"
git push origin main                  # Auto-deploy en Vercel
```

---

## 11. Documentación Adicional

- **`GUIA_SEO.md`**: Guía completa de configuración SEO (20+ páginas)
- **`RESUMEN_SEO.md`**: Resumen ejecutivo con checklist
- **`NUEVAS_PAGINAS.md`**: Documentación de nuevas páginas
- **`README.md`**: Setup general y características

---

## 12. Tareas Pendientes del Usuario

### Configuración Obligatoria
- [x] Obtener Google Analytics Measurement ID
- [x] Obtener Google Tag Manager Container ID
- [x] Agregar IDs a `.env.local` y Vercel
- [x] Verificar sitio en Google Search Console
- [x] Enviar sitemap: `https://secretnetwork.co/sitemap.xml`
- [ ] Crear imagen OG: `/public/og-image.png` (1200x630px)
- [x] Configurar Resend API Key para sistema de contacto

### Base de Datos
- [ ] Marcar programas como `es_recomendado=true`
- [ ] Agregar relaciones en `programas_alternativas`
- [ ] Crear más posts en `blog_posts`

---

## 13. Sistema de Bloques para Blog ⭐ NUEVO

### 12.1. Arquitectura

El blog NO usa HTML/Markdown sino un **sistema de bloques basado en JSON**. Cada post almacena un array de bloques en la columna `contenido_bloques` (JSONB).

#### Base de Datos
```sql
ALTER TABLE blog_posts ADD COLUMN contenido_bloques JSONB;
```

#### 8 Tipos de Bloques

1. **Text**: Párrafos, títulos (h1-h4), listas (ul/ol), quotes, code inline
2. **ProgramCard**: Tarjeta de programa con 3 tamaños (small, medium, large)
3. **Tabs**: Pestañas interactivas con contenido
4. **Accordion**: Acordeón expandible
5. **Alert**: 4 variantes (default, success, warning, destructive)
6. **Separator**: Línea divisoria (solid, dashed, dotted)
7. **Image**: Imagen con caption y tamaño
8. **Code**: Bloque de código con syntax highlighting (20+ lenguajes)

### 12.2. Tipos TypeScript (`src/lib/types.ts`)

```typescript
export type Block =
  | { type: 'text'; data: { format: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'ul' | 'ol' | 'quote' | 'code'; content: string } }
  | { type: 'program-card'; data: { programId: number; variant: 'small' | 'medium' | 'large' } }
  | { type: 'tabs'; data: { tabs: Array<{ id: string; label: string; content: string }> } }
  | { type: 'accordion'; data: { items: Array<{ id: string; title: string; content: string }> } }
  | { type: 'alert'; data: { variant: 'default' | 'destructive' | 'success' | 'warning'; title?: string; description: string } }
  | { type: 'separator'; data: { style: 'solid' | 'dashed' | 'dotted' } }
  | { type: 'image'; data: { url: string; alt: string; caption?: string; size: 'small' | 'medium' | 'large' | 'full' } }
  | { type: 'code'; data: { language: string; code: string } };
```

### 12.3. Admin Panel

#### Estructura de Archivos
```
/src/components/admin/
  ├── blog-form.tsx              # Formulario principal con tabs (Edit/Preview)
  ├── blog-manager.tsx           # CRUD de posts
  └── blocks/
      ├── block-editor.tsx       # Orquestador principal de bloques
      ├── text-block-editor.tsx
      ├── program-card-block-editor.tsx
      ├── tabs-block-editor.tsx
      ├── accordion-block-editor.tsx
      ├── alert-block-editor.tsx
      ├── separator-block-editor.tsx
      ├── image-block-editor.tsx
      ├── code-block-editor.tsx
      └── icon-selector.tsx      # Selector visual de iconos
```

#### BlockEditor (`block-editor.tsx`)
- Renderiza lista de bloques con orden editable
- Botón "+ Agregar Bloque" con dropdown de 8 tipos
- Cada bloque tiene:
  - Editor específico según tipo
  - Botón de eliminar (con stopPropagation)
  - Drag handles (futuro)

#### BlogForm (`blog-form.tsx`)
- Tabs: **Editar** | **Preview**
- Tab Editar:
  - Título, slug, descripción corta
  - Imagen de portada (URL de Cloudinary)
  - Autor, tags
  - **BlockEditor** (sistema de bloques)
  - Toggle "Publicado"
- Tab Preview:
  - Renderiza blog completo con `BlockRenderer`
  - Vista previa en tiempo real

### 12.4. Frontend Rendering

#### BlockRenderer (`src/components/blog/block-renderer.tsx`)
- Componente client-side (`'use client'`)
- Recibe `blocks: Block[]` como prop
- Mapea cada bloque a su componente:
  - `TextBlockComponent`: Usa `parseTextWithIcons()` para iconos inline
  - `ProgramCardBlockComponent`: Fetch de Supabase + 3 variantes
  - `TabsBlockComponent`: Estado local para tab activo
  - `AccordionBlockComponent`: Estado para items abiertos
  - `AlertBlockComponent`: 4 variantes con iconos
  - `SeparatorBlockComponent`: 3 estilos
  - `ImageBlockComponent`: Next.js Image con tamaños
  - `CodeBlockComponent`: `react-syntax-highlighter` con tema dark

#### Uso en Posts
```tsx
// /src/app/blog/[slug]/page.tsx
import { BlockRenderer } from '@/components/blog/block-renderer';

<BlockRenderer blocks={post.contenido_bloques} />
```

---

## 14. Sistema de Iconos Inline ⭐ NUEVO

### 13.1. Filosofía
**CERO EMOJIS** - Solo Lucide Icons para profesionalidad y consistencia.

### 13.2. Sintaxis
Los usuarios del admin pueden insertar iconos con:
```
[icon:nombre]
```

Ejemplo:
```
Diseño [icon:palette] es mi pasión [icon:heart]
```

### 13.3. Implementación

#### IconSelector (`src/components/admin/blocks/icon-selector.tsx`)
- Componente visual con Command + Popover
- 50+ iconos mapeados: `heart`, `rocket`, `star`, `sparkles`, `palette`, `monitor`, `code`, `zap`, `trophy`, `target`, etc.
- Grid de 4 columnas con búsqueda
- Al hacer clic, inserta `[icon:nombre]` en textarea con cursor position

#### Icon Renderer (`src/lib/icon-renderer.tsx`)
```typescript
// Mapeo de nombres a componentes Lucide
const ICON_MAP: { [key: string]: LucideIcon } = {
  heart: Heart,
  rocket: Rocket,
  star: Star,
  sparkles: Sparkles,
  palette: Palette,
  // ... 50+ iconos
};

// Parser principal
export function parseTextWithIcons(text: string): (string | JSX.Element)[] {
  const regex = /\[icon:([a-z-]+)\]/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const iconName = match[1];
    const IconComponent = ICON_MAP[iconName];
    if (IconComponent) {
      parts.push(<IconComponent key={match.index} className="inline-icon" />);
    } else {
      parts.push(`[icon:${iconName}]`);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
```

#### CSS Global (`src/app/globals.css`)
```css
.inline-icon {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
  margin: 0 0.2em;
}
```

### 13.4. Integración en Bloques

Todos los editores de bloques con texto tienen:
1. `useRef` para el textarea
2. Función `insertIcon(iconName: string)` que:
   - Obtiene posición del cursor (`selectionStart`, `selectionEnd`)
   - Inserta `[icon:${iconName}]` en esa posición
   - Restaura foco y cursor después de la inserción
3. Botón `<IconSelector onSelect={insertIcon} />` sobre el textarea

**Bloques con Iconos:**
- Text
- Tabs (contenido de cada tab)
- Accordion (contenido de cada item)
- Alert (descripción)

### 13.5. Rendering Frontend

En `BlockRenderer`:
- `TextBlockComponent`: `parseTextWithIcons(content)`
- `TabsBlockComponent`: `parseTextWithIcons(tab.content)`
- `AccordionBlockComponent`: `parseTextWithIcons(item.content)`
- `AlertBlockComponent`: `parseTextWithIcons(description)`

**Resultado**: Los iconos se renderizan como componentes React inline con el texto.

---

## 15. Scripts de Base de Datos

### 14.1. `scripts/create-example-blog-posts.js`
Crea 2 posts de ejemplo con 35+ bloques totales demostrando:
- Todos los 8 tipos de bloques
- Iconos inline en textos
- Programas reales de la BD
- Tabs con múltiples pestañas
- Accordions expandibles
- Alerts de 4 variantes
- Código con syntax highlighting

**Uso:**
```bash
node scripts/create-example-blog-posts.js
```

### 14.2. `scripts/update-posts-remove-emojis.js`
Reemplaza emojis con placeholders de iconos:
- 🎨 → `[icon:palette]`
- 🚀 → `[icon:rocket]`
- ❤️ → `[icon:heart]`
- ✨ → `[icon:sparkles]`
- 💡 → `[icon:lightbulb]`
- (35+ mapeos)

Actualiza `contenido_bloques` JSONB escaneando bloques de tipo `text`, `tabs`, `accordion`, `alert`.

**Uso:**
```bash
node scripts/update-posts-remove-emojis.js
```

**Nota:** Ambos scripts usan `SUPABASE_SERVICE_ROLE_KEY` para bypass RLS.

### 14.3. Migración SQL
```sql
-- Archivo: scripts/add-contenido-bloques-column.sql
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS contenido_bloques JSONB;
```

---

## 16. Flujo de Trabajo: Crear un Blog Post

1. **Admin Panel**: `/admin` → Tab "Blog Posts"
2. **Nuevo Post**: Clic en "+ Crear Post"
3. **Metadatos**:
   - Título: "Título del post"
   - Slug: Auto-generado o manual
   - Descripción corta: SEO y card preview
   - Imagen portada: URL de Cloudinary/Unsplash
   - Autor: Dropdown (tabla `autores`)
   - Tags: Array de strings
4. **Contenido con Bloques**:
   - Clic "+ Agregar Bloque" → Seleccionar tipo
   - **Text**: Elegir formato (h1-h4, p, ul, ol, quote, code)
     - Escribir contenido
     - Clic en botón de icono → Seleccionar visualmente
     - Se inserta `[icon:nombre]` en cursor
   - **ProgramCard**: Buscar programa por nombre → Elegir tamaño
   - **Tabs**: Agregar tabs → Título + Contenido (con iconos)
   - **Accordion**: Agregar items → Título + Contenido (con iconos)
   - **Alert**: Tipo → Título → Descripción (con iconos)
   - **Separator**: Estilo (solid/dashed/dotted)
   - **Image**: URL, Alt, Caption, Tamaño
   - **Code**: Lenguaje (20+ opciones) + Código
5. **Preview**: Tab "Preview" para ver post completo renderizado
6. **Guardar**: Se guarda en `contenido_bloques` JSONB
7. **Publicar**: Toggle "Publicado" → true

---

## 17. Seguridad del Repositorio

### 16.1. Archivos Sensibles (NO en Git)
- `.env.local` - Contiene:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - `NEXT_PUBLIC_GTM_ID`

### 16.2. `.gitignore`
```
.env*
```
Línea 34: Ignora todos los archivos `.env*`

### 16.3. Verificación
```bash
git ls-files | Select-String ".env"
# Resultado: (vacío) ✅ SEGURO
```

### 16.4. Scripts
Los scripts usan `process.env` para leer variables de entorno localmente. Esto es seguro porque:
- Scripts NO están expuestos en el frontend
- Solo se ejecutan localmente o en builds de Vercel
- `.env.local` NO está en Git

### 16.5. Repo Público
✅ **SEGURO para hacerlo público**:
- NO hay API keys hardcodeadas
- Variables de entorno en `.env.local` (ignorado)
- Admin usa Supabase Auth (sin credenciales en código)
- URLs públicas son correctas (secretnetwork.co)

---

## 18. Troubleshooting y Reglas de Oro

### 17.1. Emojis
- ❌ NUNCA usar emojis en UI/contenido
- ✅ SIEMPRE usar Lucide icons con `[icon:nombre]`
- Si encuentras emojis: Ejecutar `update-posts-remove-emojis.js`

### 17.2. TypeScript
- ❌ NO usar `any`
- ✅ Definir tipos explícitos en `src/lib/types.ts`
- Todos los bloques tienen tipos estrictos

### 17.3. Server vs Client Components
- **Server (por defecto)**: Fetch de datos, metadatos, SEO
- **Client (`'use client'`)**: useState, useEffect, eventos onClick
- `BlockRenderer` es client porque usa estado (tabs activos, accordions abiertos)

### 17.4. Bloques
- Cada bloque es autocontenido (no depende de otros)
- JSON en `contenido_bloques` es la única fuente de verdad
- `contenido` (TEXT) es legacy, usar solo para backwards compatibility

### 17.5. Iconos
- El parser SOLO reconoce `[icon:nombre]` en minúsculas con guiones
- Si un icono no aparece: Verificar que esté en `ICON_MAP`
- Para agregar icono nuevo:
  1. Importar de `lucide-react`
  2. Agregar a `ICON_MAP` en `icon-renderer.tsx`
  3. Agregar a `icons` array en `icon-selector.tsx`

---

## 19. Estructura de Archivos ACTUALIZADA

```
/src/app                              # Rutas y páginas (Next.js App Router)
  ├── page.tsx                        # Homepage
  ├── layout.tsx                      # Layout global con Analytics
  ├── sitemap.ts                      # Sitemap dinámico (ISR cada hora)
  ├── admin/                          # Panel de administración ⭐ NUEVO
  │   ├── page.tsx                    # Dashboard principal
  │   ├── layout.tsx                  # Layout con auth check
  │   └── login/
  │       └── page.tsx                # Login con Supabase Auth
  ├── categorias/                     # Páginas de categorías
  │   ├── page.tsx                    # Lista de categorías
  │   ├── [categoria]/
  │   │   └── page.tsx                # Categoría individual
  │   └── [categoria]/[subcategoria]/
  │       └── page.tsx                # Subcategoría
  ├── programas/
  │   └── [slug]/
  │       └── page.tsx                # Programa individual + JSON-LD
  ├── blog/                           # Sistema de blog ⭐ ACTUALIZADO
  │   ├── page.tsx                    # Índice de posts
  │   └── [slug]/
  │       └── page.tsx                # Post con BlockRenderer
  ├── alternativas/                   # Sistema de alternativas
  │   ├── page.tsx                    # Programas populares
  │   └── [slug]/
  │       └── page.tsx                # Alternativas de un programa
  ├── sobre-nosotros/                 # About page
  │   └── page.tsx
  └── open-source/                    # Programas open source
      └── page.tsx

/src/components                       # Componentes React reutilizables
  ├── ui/                             # shadcn/ui base components
  ├── shared/                         # Componentes compartidos
  │   ├── program-card.tsx            # Con analytics tracking + 3 variantes
  │   ├── program-filters.tsx
  │   └── formatted-text.tsx
  ├── layout/                         # Estructura principal
  │   ├── navbar.tsx                  # Con menú hamburguesa
  │   ├── footer.tsx                  # Con badge de GitHub ⭐ NUEVO
  │   ├── hero.tsx
  │   └── theme-provider.tsx
  ├── seo/                            # Componentes SEO
  │   ├── seo-metadata.tsx            # Utilidad para metadatos
  │   ├── json-ld-organization.tsx    # Schema.org Organization
  │   ├── json-ld-website.tsx         # Schema.org WebSite
  │   ├── json-ld-software.tsx        # Schema.org SoftwareApplication
  │   ├── json-ld-article.tsx         # Schema.org Article
  │   └── json-ld-breadcrumb.tsx      # Schema.org BreadcrumbList
  ├── analytics/                      # Google Analytics & GTM
  │   ├── google-analytics.tsx        # GA4 component
  │   ├── google-tag-manager.tsx      # GTM + NoScript
  │   └── analytics-events.tsx        # Sistema de eventos
  ├── blog/                           # Componentes del blog ⭐ ACTUALIZADO
  │   ├── blog-hero.tsx
  │   ├── blog-card.tsx
  │   ├── blog-grid.tsx
  │   ├── blog-post-header.tsx
  │   ├── blog-content.tsx            # Legacy (HTML)
  │   ├── block-renderer.tsx          # Sistema de bloques ⭐ NUEVO
  │   └── related-posts.tsx
  ├── admin/                          # Componentes del admin ⭐ NUEVO
  │   ├── admin-auth-check.tsx        # Auth wrapper
  │   ├── admin-dashboard.tsx         # Tabs principales
  │   ├── admin-header.tsx            # Header del admin
  │   ├── admin-login.tsx             # Formulario de login
  │   ├── blog-form.tsx               # Form con Edit/Preview tabs
  │   ├── blog-manager.tsx            # CRUD de posts
  │   ├── programas-manager.tsx       # CRUD de programas
  │   ├── categorias-manager.tsx      # CRUD de categorías
  │   ├── plataformas-manager.tsx     # CRUD de plataformas
  │   ├── modelos-de-precio-manager.tsx # CRUD de modelos de precio
  │   ├── alternativas-manager-new.tsx  # Manager de alternativas
  │   ├── programa-form.tsx           # Form de programas
  │   ├── categoria-form.tsx          # Form de categorías
  │   ├── rich-text-editor.tsx        # Editor HTML (legacy)
  │   └── blocks/                     # Editores de bloques ⭐ NUEVO
  │       ├── block-editor.tsx        # Orquestador principal
  │       ├── icon-selector.tsx       # Selector visual de iconos
  │       ├── text-block-editor.tsx
  │       ├── program-card-block-editor.tsx
  │       ├── tabs-block-editor.tsx
  │       ├── accordion-block-editor.tsx
  │       ├── alert-block-editor.tsx
  │       ├── separator-block-editor.tsx
  │       ├── image-block-editor.tsx
  │       └── code-block-editor.tsx
  ├── alternativas/                   # Componentes alternativas
  │   ├── alternatives-hero.tsx
  │   ├── alternatives-grid.tsx
  │   ├── alternative-hero.tsx
  │   └── alternatives-list.tsx
  ├── about/                          # Componentes About
  │   ├── about-hero.tsx
  │   ├── about-story.tsx
  │   ├── about-mission.tsx
  │   └── about-binary-studio.tsx
  └── open-source/                    # Componentes Open Source
      ├── open-source-hero.tsx
      └── open-source-list-client.tsx

/src/lib                              # Lógica auxiliar y configuración
  ├── supabase.js                     # Cliente de Supabase (server)
  ├── supabase-browser.js             # Cliente de Supabase (browser)
  ├── utils.ts                        # Funciones de utilidad (cn, etc.)
  ├── types.ts                        # Tipos TypeScript + Bloques ⭐ ACTUALIZADO
  ├── icon-renderer.tsx               # Parser de iconos inline ⭐ NUEVO
  ├── cloudinary-config.ts            # Configuración de Cloudinary
  └── cloudinary-upload.ts            # Utilidad de upload

/scripts                              # Scripts de base de datos ⭐ NUEVO
  ├── create-example-blog-posts.js    # Crea 2 posts con 35+ bloques
  ├── update-posts-remove-emojis.js   # Reemplaza emojis con iconos
  ├── add-contenido-bloques-column.sql # Migración SQL
  ├── upload-new-programs.js          # Carga masiva de programas
  └── list-all-programs.js            # Lista programas de la BD
```

---

## 6. Estructura de Archivos
El proyecto usa el directorio src y sigue la siguiente organización:
/src/app: Rutas, páginas y layouts.
/src/components: Componentes React reutilizables.
/ui: Componentes añadidos desde shadcn/ui (Button, Card, etc.).
/shared: Componentes personalizados compartidos en varias páginas (ProgramCard, Filters, etc.).
/layout: Componentes de estructura principal (Header, Footer, etc.).
/src/lib: Lógica auxiliar, configuración y tipos.
supabase.js: Cliente de Supabase.
utils.ts: Funciones de utilidad (como la función cn de shadcn).
types.ts: Definiciones de tipos de TypeScript para la base de datos.