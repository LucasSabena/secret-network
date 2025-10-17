-- Script para agregar columna contenido_bloques a blog_posts
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar nueva columna JSONB
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS contenido_bloques JSONB DEFAULT '[]'::jsonb;

-- 2. Crear índice para búsquedas eficientes (opcional pero recomendado)
CREATE INDEX IF NOT EXISTS idx_blog_posts_contenido_bloques 
ON blog_posts USING GIN (contenido_bloques);

-- 3. Verificar cambios
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
