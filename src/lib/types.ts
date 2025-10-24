// FILE: src/lib/types.ts

// Este tipo define la estructura de un objeto 'programa'
// tal como lo recibimos de la base de datos.
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

// Ejemplo para la tabla 'categorias'
export type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  id_categoria_padre: number | null;
  icono: string | null;
};

// ========================================
// SISTEMA DE BLOQUES PARA BLOG
// ========================================

// Bloque de texto (párrafo, headings, listas, etc.)
export type TextBlock = {
  id: string;
  type: 'text';
  data: {
    format: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'ul' | 'ol' | 'quote' | 'code';
    content: string; // HTML simple o texto
  };
};

// Bloque de tarjeta de programa
export type ProgramCardBlock = {
  id: string;
  type: 'program-card';
  data: {
    programId: number;
    variant?: 'small' | 'default' | 'large';
  };
};

// Bloque de grid de programas
export type ProgramsGridBlock = {
  id: string;
  type: 'programs-grid';
  data: {
    programIds: number[];
    columns: 2 | 3 | 4;
  };
};

// Bloque de grid de imágenes
export type ImagesGridBlock = {
  id: string;
  type: 'images-grid';
  data: {
    images: Array<{
      url: string;
      alt: string;
      caption: string;
    }>;
    columns: 2 | 3 | 4;
  };
};

// Bloque de tabs
export type TabsBlock = {
  id: string;
  type: 'tabs';
  data: {
    tabs: Array<{
      id: string;
      label: string;
      content: string; // HTML o markdown
    }>;
  };
};

// Bloque de accordion
export type AccordionBlock = {
  id: string;
  type: 'accordion';
  data: {
    items: Array<{
      id: string;
      title: string;
      content: string; // HTML o markdown
    }>;
  };
};

// Bloque de alerta
export type AlertBlock = {
  id: string;
  type: 'alert';
  data: {
    variant: 'default' | 'destructive' | 'success' | 'warning';
    title?: string;
    description: string;
  };
};

// Bloque de separador
export type SeparatorBlock = {
  id: string;
  type: 'separator';
  data: {
    style: 'solid' | 'dashed' | 'dotted';
  };
};

// Bloque de imagen
export type ImageBlock = {
  id: string;
  type: 'image';
  data: {
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
  };
};

// Bloque de código
export type CodeBlock = {
  id: string;
  type: 'code';
  data: {
    language: string;
    code: string;
  };
};

// Unión de todos los tipos de bloques
export type Block =
  | TextBlock
  | ProgramCardBlock
  | ProgramsGridBlock
  | ImagesGridBlock
  | TabsBlock
  | AccordionBlock
  | AlertBlock
  | SeparatorBlock
  | ImageBlock
  | CodeBlock;

// Tipo para posts del blog
export type BlogPost = {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  contenido: string; // Mantener por compatibilidad (legacy)
  contenido_bloques?: Block[]; // Nuevo sistema de bloques
  imagen_portada_url: string | null;
  imagen_portada_alt: string | null; // Alt text para SEO
  autor: string | null;
  autor_id: number | null; // Nueva relación con tabla autores
  fecha_publicacion: string;
  actualizado_en: string;
  publicado: boolean;
  tags: string[] | null;
};

// Tipo para autores del blog
export type Autor = {
  id: number;
  nombre: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  website_url: string | null;
  twitter_handle: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
};

// Tipo para relaciones de alternativas
export type ProgramaAlternativa = {
  programa_original_id: number;
  programa_alternativa_id: number;
};

// Tipo para plataformas
export type Plataforma = {
  id: number;
  nombre: string;
  slug: string;
  icono_url: string | null;
};

// Tipo para modelos de precio
export type ModeloDePrecio = {
  id: number;
  nombre: string;
  slug: string;
};

// Añadiremos más tipos para plataformas, modelos_de_precios, etc., aquí.