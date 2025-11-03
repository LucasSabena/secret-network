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

// Estilos comunes para bloques
export type BlockStyle = {
  alignment?: 'left' | 'center' | 'right';
  width?: 'full' | 'content';
};

// Bloque de texto (párrafo, headings, listas, etc.)
export type TextBlock = {
  id: string;
  type: 'text';
  data: {
    format: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'ul' | 'ol' | 'quote' | 'code';
    content: string; // HTML simple o texto
    textColor?: string;
    backgroundColor?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  };
  style?: BlockStyle;
};

// Bloque de tarjeta de programa
export type ProgramCardBlock = {
  id: string;
  type: 'program-card';
  data: {
    programId: number;
    variant?: 'small' | 'default' | 'large';
  };
  style?: BlockStyle;
};

// Bloque de grid de programas
export type ProgramsGridBlock = {
  id: string;
  type: 'programs-grid';
  data: {
    programIds: number[];
    columns: 2 | 3 | 4;
  };
  style?: BlockStyle;
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
  style?: BlockStyle;
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
      icon?: string;
    }>;
    orientation?: 'horizontal' | 'vertical';
    defaultTab?: number;
  };
  style?: BlockStyle;
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
      icon?: string;
    }>;
    allowMultiple?: boolean;
    defaultOpen?: boolean;
  };
  style?: BlockStyle;
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
  style?: BlockStyle;
};

// Bloque de separador
export type SeparatorBlock = {
  id: string;
  type: 'separator';
  data: {
    style: 'solid' | 'dashed' | 'dotted';
  };
  style?: BlockStyle;
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
    lightbox?: boolean;
    borderRadius?: number;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | '21/9';
  };
  style?: BlockStyle;
};

// Bloque de código
export type CodeBlock = {
  id: string;
  type: 'code';
  data: {
    language: string;
    code: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    filename?: string;
    theme?: 'dark' | 'light' | 'auto';
    copyButton?: boolean;
  };
  style?: BlockStyle;
};

// Bloque de video embed
export type VideoBlock = {
  id: string;
  type: 'video';
  data: {
    url: string;
    platform: 'youtube' | 'vimeo' | 'loom';
    caption?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
  };
  style?: BlockStyle;
};

// Bloque de tweet embed
export type TweetBlock = {
  id: string;
  type: 'tweet';
  data: {
    tweetUrl: string;
  };
  style?: BlockStyle;
};

// Bloque de tabla
export type TableBlock = {
  id: string;
  type: 'table';
  data: {
    headers: string[];
    rows: string[][];
    striped?: boolean;
    showLeftHeaders?: boolean;
    leftHeaders?: string[];
    showFooter?: boolean;
    footerRow?: string[];
    caption?: string;
  };
  style?: BlockStyle;
};

// Bloque de callout/note
export type CalloutBlock = {
  id: string;
  type: 'callout';
  data: {
    icon: string;
    content: string;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  };
  style?: BlockStyle;
};

// Bloque de botón/CTA
export type ButtonBlock = {
  id: string;
  type: 'button';
  data: {
    text: string;
    url: string;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    icon?: string;
    openInNewTab?: boolean;
  };
  style?: BlockStyle;
};

// Bloque de divider con texto
export type DividerTextBlock = {
  id: string;
  type: 'divider-text';
  data: {
    text?: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  style?: BlockStyle;
};

// Bloque de quote con autor
export type QuoteBlock = {
  id: string;
  type: 'quote';
  data: {
    quote: string;
    author?: string;
    role?: string;
    avatar?: string;
    variant: 'default' | 'bordered' | 'highlighted';
  };
  style?: BlockStyle;
};

// Bloque de stats/metrics
export type StatsBlock = {
  id: string;
  type: 'stats';
  data: {
    stats: Array<{
      label: string;
      value: string;
      icon?: string;
      trend?: 'up' | 'down' | 'neutral';
      trendValue?: string;
    }>;
    columns: 2 | 3 | 4;
  };
  style?: BlockStyle;
};

// Bloque de timeline
export type TimelineBlock = {
  id: string;
  type: 'timeline';
  data: {
    items: Array<{
      id: string;
      date: string;
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  style?: BlockStyle;
};

// Bloque de comparison table
export type ComparisonBlock = {
  id: string;
  type: 'comparison';
  data: {
    items: Array<{
      name: string;
      features: Record<string, boolean | string>;
    }>;
    featureLabels: string[];
  };
  style?: BlockStyle;
};

// Bloque de file download
export type FileDownloadBlock = {
  id: string;
  type: 'file-download';
  data: {
    fileName: string;
    fileUrl: string;
    fileSize?: string;
    fileType?: string;
    description?: string;
  };
  style?: BlockStyle;
};

// Bloque de embed genérico
export type EmbedBlock = {
  id: string;
  type: 'embed';
  data: {
    embedCode: string;
    height?: number;
    caption?: string;
  };
  style?: BlockStyle;
};

// Bloque de tarjeta de blog
export type BlogCardBlock = {
  id: string;
  type: 'blog-card';
  data: {
    blogId: number;
    variant?: 'small' | 'default' | 'large';
  };
  style?: BlockStyle;
};

// Bloque de grid de blogs
export type BlogsGridBlock = {
  id: string;
  type: 'blogs-grid';
  data: {
    blogIds: number[];
    columns: 2 | 3 | 4;
  };
  style?: BlockStyle;
};

// Bloque de FAQ
export type FAQBlock = {
  id: string;
  type: 'faq';
  data: {
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  style?: BlockStyle;
};

// Bloque de Pros & Cons
export type ProsConsBlock = {
  id: string;
  type: 'pros-cons';
  data: {
    pros: string[];
    cons: string[];
    title?: string;
  };
  style?: BlockStyle;
};

// Bloque de Feature List
export type FeatureListBlock = {
  id: string;
  type: 'feature-list';
  data: {
    features: Array<{
      id: string;
      icon: string; // Nombre del icono de Lucide
      title: string;
      description: string;
    }>;
    columns: 2 | 3 | 4;
  };
  style?: BlockStyle;
};

// Bloque de Before/After
export type BeforeAfterBlock = {
  id: string;
  type: 'before-after';
  data: {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
  };
  style?: BlockStyle;
};

// Bloque de Icon Grid
export type IconGridBlock = {
  id: string;
  type: 'icon-grid';
  data: {
    items: Array<{
      id: string;
      icon: string; // Nombre del icono de Lucide
      title: string;
      description?: string;
    }>;
    columns: 2 | 3 | 4;
  };
  style?: BlockStyle;
};

// Bloque de Category Card
export type CategoryCardBlock = {
  id: string;
  type: 'category-card';
  data: {
    categoryId: number;
    variant?: 'small' | 'default' | 'large';
  };
  style?: BlockStyle;
};

// Bloque de Author Bio
export type AuthorBioBlock = {
  id: string;
  type: 'author-bio';
  data: {
    authorId: number;
    showSocial?: boolean;
  };
  style?: BlockStyle;
};

// Bloque de Poll/Survey
export type PollBlock = {
  id: string;
  type: 'poll';
  data: {
    pollId: string; // ID único para identificar el poll
    question: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    allowMultiple?: boolean;
  };
  style?: BlockStyle;
};

// Bloque de Progress Bar
export type ProgressBarBlock = {
  id: string;
  type: 'progress-bar';
  data: {
    items: Array<{
      id: string;
      label: string;
      value: number; // 0-100
      color?: string;
    }>;
  };
  style?: BlockStyle;
};

// Bloque de Checklist
export type ChecklistBlock = {
  id: string;
  type: 'checklist';
  data: {
    items: Array<{
      id: string;
      text: string;
      checked?: boolean;
    }>;
    title?: string;
  };
  style?: BlockStyle;
};

// Bloque de Changelog
export type ChangelogBlock = {
  id: string;
  type: 'changelog';
  data: {
    entries: Array<{
      id: string;
      version: string;
      date: string;
      changes: string[];
      type?: 'added' | 'fixed' | 'changed' | 'removed';
    }>;
  };
  style?: BlockStyle;
};

// Bloque de Pricing Table
export type PricingTableBlock = {
  id: string;
  type: 'pricing-table';
  data: {
    plans: Array<{
      id: string;
      name: string;
      price: string;
      period?: string;
      features: string[];
      highlighted?: boolean;
      ctaText?: string;
      ctaUrl?: string;
    }>;
  };
  style?: BlockStyle;
};

// Bloque de Testimonial
export type TestimonialBlock = {
  id: string;
  type: 'testimonial';
  data: {
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
    rating?: number;
  };
  style?: BlockStyle;
};

// Bloque de Warning/Tip Box
export type TipBoxBlock = {
  id: string;
  type: 'tip-box';
  data: {
    type: 'tip' | 'warning' | 'danger' | 'info' | 'success';
    title?: string;
    content: string;
    icon?: string;
  };
  style?: BlockStyle;
};

// Bloque de CTA Banner
export type CTABannerBlock = {
  id: string;
  type: 'cta-banner';
  data: {
    title: string;
    description?: string;
    ctaText: string;
    ctaUrl: string;
    backgroundImage?: string;
    backgroundColor?: string;
  };
  style?: BlockStyle;
};

// Bloque de Product Showcase
export type ProductShowcaseBlock = {
  id: string;
  type: 'product-showcase';
  data: {
    programId: number;
    features?: string[];
    ctaText?: string;
  };
  style?: BlockStyle;
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
  | CodeBlock
  | VideoBlock
  | TweetBlock
  | TableBlock
  | CalloutBlock
  | ButtonBlock
  | DividerTextBlock
  | QuoteBlock
  | StatsBlock
  | TimelineBlock
  | ComparisonBlock
  | FileDownloadBlock
  | EmbedBlock
  | BlogCardBlock
  | BlogsGridBlock
  | FAQBlock
  | ProsConsBlock
  | FeatureListBlock
  | BeforeAfterBlock
  | IconGridBlock
  | CategoryCardBlock
  | AuthorBioBlock
  | PollBlock
  | ProgressBarBlock
  | ChecklistBlock
  | ChangelogBlock
  | PricingTableBlock
  | TestimonialBlock
  | TipBoxBlock
  | CTABannerBlock
  | ProductShowcaseBlock;

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
  is_featured?: boolean; // Destacado en serie
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduled_for?: string | null;
  tags: string[] | null;
  categories?: number[]; // IDs de categorías
};

// Tipo para categorías del blog
export type BlogCategory = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  icono: string;
  orden: number;
  created_at: string;
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