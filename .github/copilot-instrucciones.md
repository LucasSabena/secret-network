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

- **Framework:** **Next.js** (con App Router).
- **Lenguaje:** **TypeScript**.
- **Base de Datos:** **Supabase** (PostgreSQL). La interacción se hace exclusivamente a través del cliente `@supabase/supabase-js`.
- **Estilos:** **Tailwind CSS**.
- **Componentes UI:** **shadcn/ui**. Los componentes se añaden al proyecto y son totalmente personalizables.
- **Iconos:** **Lucide React** (`lucide-react`).
- **Animaciones:** **Framer Motion**.
- **Hosting de Imágenes:** **Cloudinary**. La base de datos solo almacena las URLs.
- **Despliegue:** **Vercel**.
- **Control de Versiones:** **Git & GitHub**.

---

## 4. Esquema de la Base de Datos (Supabase)

La base de datos se compone de 8 tablas.

### Tablas Principales
- **`programas`**: Contiene la información de cada herramienta.
  - `id` (int8, PK), `nombre` (text, Not Null), `slug` (text, Not Null, Unique), `icono_url` (text), `categoria_id` (int8, FK a `categorias`), `descripcion_corta` (text), `descripcion_larga` (text), `captura_url` (text), `dificultad` (text: "Facil", "Intermedio", "Dificil"), `es_open_source` (bool), `es_recomendado` (bool), `web_oficial_url` (text).
- **`categorias`**: Almacena categorías y subcategorías.
  - `id` (int8, PK), `nombre` (text, Not Null), `slug` (text, Not Null, Unique), `descripcion` (text), `id_categoria_padre` (int8, FK a `categorias.id`), `icono` (text).
- **`plataformas`**: Lista de plataformas (macOS, Windows, etc.).
  - `id` (int8, PK), `nombre` (text, Not Null), `slug` (text, Not Null, Unique), `icono_url` (text).
- **`modelos_de_precios`**: Lista de modelos de precios (Freemium, etc.).
  - `id` (int8, PK), `nombre` (text, Not Null), `slug` (text, Not Null, Unique).

### Tablas Intermedias (Relaciones Muchos-a-Muchos)
- **`programas_plataformas`**: (`programa_id`, `plataforma_id`)
- **`programas_subcategorias`**: (`programa_id`, `subcategoria_id`)
- **`programas_modelos_de_precios`**: (`programa_id`, `modelo_precio_id`)
- **`programas_alternativas`**: (`programa_original_id`, `programa_alternativa_id`)

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