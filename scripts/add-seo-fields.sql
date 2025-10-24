-- Script para agregar campos SEO a blog_posts
-- Ejecutar en Supabase SQL Editor

-- ===================================
-- AGREGAR CAMPOS SEO
-- ===================================
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS og_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- ===================================
-- COMENTARIOS
-- ===================================
COMMENT ON COLUMN blog_posts.meta_title IS 'Título optimizado para SEO (30-60 caracteres)';
COMMENT ON COLUMN blog_posts.meta_description IS 'Descripción para meta tags (120-160 caracteres)';
COMMENT ON COLUMN blog_posts.og_image IS 'URL de imagen para Open Graph (1200x630px)';
COMMENT ON COLUMN blog_posts.canonical_url IS 'URL canónica del post';
COMMENT ON COLUMN blog_posts.keywords IS 'Array de keywords para SEO';

-- ===================================
-- ACTUALIZAR POSTS EXISTENTES
-- ===================================
-- Copiar título a meta_title si está vacío (truncar a 60 caracteres)
UPDATE blog_posts 
SET meta_title = LEFT(titulo, 60)
WHERE meta_title IS NULL;

-- Copiar descripción corta a meta_description si está vacío (truncar a 160 caracteres)
UPDATE blog_posts 
SET meta_description = LEFT(descripcion_corta, 160)
WHERE meta_description IS NULL AND descripcion_corta IS NOT NULL;

-- Copiar imagen de portada a og_image si está vacío
UPDATE blog_posts 
SET og_image = imagen_portada_url
WHERE og_image IS NULL AND imagen_portada_url IS NOT NULL;

-- ===================================
-- VERIFICACIÓN
-- ===================================
SELECT '====================================' as resultado;
SELECT 'Campos SEO agregados exitosamente' as resultado;
SELECT 
  COUNT(*) as total_posts,
  COUNT(meta_title) as con_meta_title,
  COUNT(meta_description) as con_meta_description,
  COUNT(og_image) as con_og_image,
  COUNT(keywords) as con_keywords
FROM blog_posts;
