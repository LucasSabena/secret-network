-- Script completo de verificación de todas las tablas del blog
-- Ejecutar en Supabase SQL Editor

-- ===================================
-- 1. VERIFICAR TABLAS EXISTENTES
-- ===================================
SELECT '========== TABLAS DEL BLOG ==========' as info;

SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columnas
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE 'blog%'
ORDER BY table_name;

-- ===================================
-- 2. VERIFICAR blog_posts (tabla principal)
-- ===================================
SELECT '========== COLUMNAS DE blog_posts ==========' as info;

SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- ===================================
-- 3. VERIFICAR blog_categories
-- ===================================
SELECT '========== CATEGORÍAS ==========' as info;

SELECT id, nombre, slug, color, icono, orden
FROM blog_categories
ORDER BY orden;

-- ===================================
-- 4. VERIFICAR blog_posts_categories (relaciones)
-- ===================================
SELECT '========== RELACIONES POST-CATEGORÍAS ==========' as info;

SELECT COUNT(*) as total_relaciones FROM blog_posts_categories;

-- ===================================
-- 5. VERIFICAR blog_preview_tokens
-- ===================================
SELECT '========== TOKENS DE PREVIEW ==========' as info;

SELECT COUNT(*) as total_tokens,
       COUNT(*) FILTER (WHERE expires_at > NOW()) as tokens_validos,
       COUNT(*) FILTER (WHERE expires_at <= NOW()) as tokens_expirados
FROM blog_preview_tokens;

-- ===================================
-- 6. VERIFICAR blog_analytics
-- ===================================
SELECT '========== ANALYTICS ==========' as info;

SELECT COUNT(*) as total_eventos,
       COUNT(DISTINCT post_id) as posts_con_eventos,
       COUNT(*) FILTER (WHERE event_type = 'view') as vistas,
       COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
       COUNT(*) FILTER (WHERE event_type = 'share') as shares
FROM blog_analytics;

-- ===================================
-- 7. VERIFICAR CAMPOS NUEVOS EN blog_posts
-- ===================================
SELECT '========== CAMPOS NUEVOS ==========' as info;

SELECT 
  COUNT(*) as total_posts,
  COUNT(status) as con_status,
  COUNT(scheduled_for) as con_scheduled_for,
  COUNT(meta_title) as con_meta_title,
  COUNT(meta_description) as con_meta_description,
  COUNT(og_image) as con_og_image,
  COUNT(keywords) as con_keywords
FROM blog_posts;

-- ===================================
-- 8. VERIFICAR ÍNDICES
-- ===================================
SELECT '========== ÍNDICES ==========' as info;

SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename LIKE 'blog%'
ORDER BY tablename, indexname;

-- ===================================
-- 9. VERIFICAR RLS (Row Level Security)
-- ===================================
SELECT '========== RLS POLICIES ==========' as info;

SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE 'blog%'
ORDER BY tablename, policyname;

-- ===================================
-- 10. RESUMEN FINAL
-- ===================================
SELECT '========== RESUMEN FINAL ==========' as info;

SELECT 
  'blog_posts' as tabla,
  COUNT(*) as registros,
  'Tabla principal' as descripcion
FROM blog_posts
UNION ALL
SELECT 
  'blog_categories' as tabla,
  COUNT(*) as registros,
  'Categorías' as descripcion
FROM blog_categories
UNION ALL
SELECT 
  'blog_posts_categories' as tabla,
  COUNT(*) as registros,
  'Relaciones' as descripcion
FROM blog_posts_categories
UNION ALL
SELECT 
  'blog_preview_tokens' as tabla,
  COUNT(*) as registros,
  'Tokens de preview' as descripcion
FROM blog_preview_tokens
UNION ALL
SELECT 
  'blog_analytics' as tabla,
  COUNT(*) as registros,
  'Eventos de analytics' as descripcion
FROM blog_analytics;

-- ===================================
-- 11. VERIFICAR INTEGRIDAD
-- ===================================
SELECT '========== VERIFICACIÓN DE INTEGRIDAD ==========' as info;

-- Posts sin categoría
SELECT 'Posts sin categoría' as check_name, COUNT(*) as cantidad
FROM blog_posts p
WHERE NOT EXISTS (
  SELECT 1 FROM blog_posts_categories pc WHERE pc.post_id = p.id
)
UNION ALL
-- Posts con status inválido
SELECT 'Posts con status inválido' as check_name, COUNT(*) as cantidad
FROM blog_posts
WHERE status NOT IN ('draft', 'scheduled', 'published', 'archived')
UNION ALL
-- Tokens expirados
SELECT 'Tokens expirados' as check_name, COUNT(*) as cantidad
FROM blog_preview_tokens
WHERE expires_at <= NOW();
