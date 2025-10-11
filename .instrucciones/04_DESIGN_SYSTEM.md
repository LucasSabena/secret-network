# Design System & Tokens: Secret Station

Este documento es la fuente de verdad para toda la identidad visual y los tokens de UI del proyecto Secret Station. Define los colores, la tipografía, el espaciado y otros elementos visuales para asegurar una apariencia consistente y un desarrollo escalable.

El sistema está construido sobre **Tailwind CSS** y está diseñado para ser compatible con **shadcn/ui**.

## Principios Fundamentales

1.  **Tokens Primero:** Nunca usar valores "mágicos" o hardcodeados (ej. `px-3.5`, `text-[#ff3399]`). Siempre usar las clases de utilidad de Tailwind que se corresponden con estos tokens (ej. `px-4`, `text-primary`).
2.  **Dark Mode por Defecto:** La experiencia principal es en modo oscuro. El modo claro es una variante soportada.
3.  **Accesibilidad:** Las escalas de tipografía y los colores se eligen teniendo en cuenta la legibilidad y el contraste.

---

## 1. Iconografía

La iconografía es un pilar de la interfaz de Secret Station. Para mantener un estilo limpio, profesional y consistente, se seguirán las siguientes reglas:

-   **Librería Principal:** Todos los iconos de la interfaz deben provenir de la librería **Lucide React (`lucide-react`)**. Esta librería ofrece un conjunto de iconos de línea coherentes y altamente personalizables.
-   **PROHIBIDO EL USO DE EMOJIS:** **Está estrictamente prohibido el uso de emojis** en cualquier parte de la interfaz de usuario. Los emojis varían drásticamente entre sistemas operativos, no se pueden colorear con CSS para que coincidan con la paleta de la marca y rompen la estética profesional del sitio.
-   **Implementación:** Los iconos de Lucide deben ser importados como componentes React (ej. `import { ArrowRight } from 'lucide-react'`) y pueden ser estilizados con clases de Tailwind (`className="h-4 w-4 text-primary"`).

---

## 2. Tipografía

La fuente principal para toda la interfaz es **Space Grotesk**.

-   **Familia de Fuente Principal:** `Space Grotesk`
-   **Fuente de Respaldo:** `sans-serif`

### Implementación de la Fuente

La fuente se importa desde `next/font` y se aplica globalmente en el layout raíz.

**Archivo:** `src/app/layout.tsx`

```typescript
// FILE: src/app/layout.tsx

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk", // Asigna la fuente a una variable CSS
});

export const metadata: Metadata = {
  title: "Secret Station",
  description: "Your secret directory for design tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSpaceGrotesk.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
3. Sistema de Colores
Los colores se definen como variables CSS en formato HSL en globals.css y luego se mapean en tailwind.config.ts. Esto permite un fácil cambio de tema (dark/light).
Definición de Variables de Color
Archivo: src/app/globals.css
code
CSS
/* FILE: src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* DARK MODE (DEFAULT) */
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    
    --primary: 326 100% 60%; /* #ff3399 */
    --primary-foreground: 0 0% 98%;

    --secondary: 150 100% 40%; /* #00cc66 */
    --secondary-foreground: 0 0% 98%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    --success: 150 100% 40%;
    --success-foreground: 0 0% 98%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 3.9%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 326 100% 60%;

    --radius: 0.5rem;
  }

  /* LIGHT MODE */
  .light {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 326 100% 60%;
    --primary-foreground: 0 0% 98%;

    --secondary: 150 100% 40%;
    --secondary-foreground: 0 0% 98%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --success: 150 100% 40%;
    --success-foreground: 0 0% 98%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 3.9%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 326 100% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
4. Configuración de Tailwind CSS
El archivo de configuración de Tailwind es donde conectamos todos nuestros tokens (colores, fuentes, radios de borde) a las clases de utilidad de Tailwind.
Archivo: tailwind.config.ts
code
TypeScript
// FILE: tailwind.config.ts

import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
5. Otros Tokens
Tamaños de Texto (fontSize)
Aunque Tailwind viene con una excelente escala por defecto, si necesitamos extenderla o sobreescribirla, lo haríamos en la sección theme.extend.fontSize del tailwind.config.ts. Por ahora, usaremos la escala por defecto, que ya usa rem.
Espaciado y Tamaños (spacing)
Usaremos la escala por defecto de Tailwind, que está basada en rem y es muy completa. La unidad base es 1 = 0.25rem = 4px.
p-4 = 1rem = 16px padding.
w-8 = 2rem = 32px width.
Puntos de Ruptura (screens)
Los breakpoints definen los tamaños de pantalla para el diseño responsive.
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px