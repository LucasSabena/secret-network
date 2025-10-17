-- Política RLS para permitir inserts desde scripts
-- Ejecuta esto en el SQL Editor de Supabase

-- Opción A: Permitir inserts sin autenticación (SOLO PARA DESARROLLO)
CREATE POLICY "Allow public inserts for development"
ON blog_posts
FOR INSERT
TO anon
WITH CHECK (true);

-- Opción B: Permitir inserts autenticados
CREATE POLICY "Allow authenticated inserts"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Para ver las políticas actuales:
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';

-- Para eliminar una política:
-- DROP POLICY "nombre_de_la_politica" ON blog_posts;
