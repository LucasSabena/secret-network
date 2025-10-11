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
- **Despliegue:** **Vercel** - URL: `https://secret-network.vercel.app`
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
- **Secundario:** Verde (`#00cc66`, `hsl(150 100% 40%)`)
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
  metadataBase: new URL('https://secret-network.vercel.app'),
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
NEXT_PUBLIC_SITE_URL=https://secret-network.vercel.app
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

## 9. Comandos y Scripts

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

## 10. Documentación Adicional

- **`GUIA_SEO.md`**: Guía completa de configuración SEO (20+ páginas)
- **`RESUMEN_SEO.md`**: Resumen ejecutivo con checklist
- **`NUEVAS_PAGINAS.md`**: Documentación de nuevas páginas
- **`README.md`**: Setup general y características

---

## 11. Tareas Pendientes del Usuario

### Configuración Obligatoria
- [ ] Obtener Google Analytics Measurement ID
- [ ] Obtener Google Tag Manager Container ID
- [ ] Agregar IDs a `.env.local` y Vercel
- [ ] Verificar sitio en Google Search Console
- [ ] Enviar sitemap: `https://secret-network.vercel.app/sitemap.xml`
- [ ] Crear imagen OG: `/public/og-image.png` (1200x630px)

### Base de Datos
- [ ] Marcar programas como `es_recomendado=true`
- [ ] Agregar relaciones en `programas_alternativas`
- [ ] Crear más posts en `blog_posts`

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