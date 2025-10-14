-- Agregar columna subcategorias_ids a la tabla programas
-- Esta columna almacenará un array de IDs de subcategorías

ALTER TABLE programas 
ADD COLUMN IF NOT EXISTS subcategorias_ids INTEGER[];

-- Opcional: Crear un índice para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_programas_subcategorias 
ON programas USING GIN (subcategorias_ids);

-- Comentario para documentar
COMMENT ON COLUMN programas.subcategorias_ids IS 
  'Array de IDs de subcategorías asociadas al programa';
