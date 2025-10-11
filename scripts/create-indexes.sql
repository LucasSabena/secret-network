-- Script para crear índices que mejoran el rendimiento de las consultas
-- Ejecutar en el SQL Editor de Supabase

-- ⚡ ÍNDICES PRINCIPALES (CRÍTICOS)

-- Índice para buscar programas por categoría
CREATE INDEX IF NOT EXISTS idx_programas_categoria_id 
ON programas(categoria_id);

-- Índice para buscar relaciones programa-subcategoría por programa
CREATE INDEX IF NOT EXISTS idx_programas_subcategorias_programa_id 
ON programas_subcategorias(programa_id);

-- Índice para buscar relaciones programa-subcategoría por subcategoría
CREATE INDEX IF NOT EXISTS idx_programas_subcategorias_subcategoria_id 
ON programas_subcategorias(subcategoria_id);

-- 🚀 ÍNDICES ADICIONALES (RECOMENDADOS)

-- Índice para buscar programas por slug (URLs amigables)
CREATE INDEX IF NOT EXISTS idx_programas_slug 
ON programas(slug);

-- Índice para buscar categorías por slug
CREATE INDEX IF NOT EXISTS idx_categorias_slug 
ON categorias(slug);

-- Índice para buscar subcategorías por categoría padre
CREATE INDEX IF NOT EXISTS idx_categorias_id_categoria_padre 
ON categorias(id_categoria_padre);

-- Índice para relaciones programa-modelos de precios (por programa)
CREATE INDEX IF NOT EXISTS idx_programas_modelos_programa_id 
ON programas_modelos_de_precios(programa_id);

-- Índice para relaciones programa-modelos de precios (por modelo)
CREATE INDEX IF NOT EXISTS idx_programas_modelos_modelo_id 
ON programas_modelos_de_precios(modelo_precio_id);

-- ✅ VERIFICAR ÍNDICES CREADOS
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('programas', 'programas_subcategorias', 'categorias', 'programas_modelos_de_precios')
ORDER BY tablename, indexname;
