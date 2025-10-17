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

// Tipo para posts del blog
export type BlogPost = {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  contenido: string;
  imagen_portada_url: string | null;
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