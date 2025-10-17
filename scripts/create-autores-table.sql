-- =====================================================
-- TABLA: autores
-- Descripción: Almacena información de los autores del blog
-- =====================================================

CREATE TABLE IF NOT EXISTS autores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email VARCHAR(255),
  website_url TEXT,
  twitter_handle VARCHAR(50),
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_autores_slug ON autores(slug);
CREATE INDEX idx_autores_nombre ON autores(nombre);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_autores_updated_at BEFORE UPDATE ON autores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MODIFICAR TABLA: blog_posts
-- Agregar relación con autores
-- =====================================================

-- Agregar columna autor_id (si no existe)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS autor_id INTEGER REFERENCES autores(id) ON DELETE SET NULL;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_blog_posts_autor_id ON blog_posts(autor_id);

-- =====================================================
-- DATOS DE EJEMPLO: Autores predeterminados
-- =====================================================

INSERT INTO autores (nombre, slug, bio, avatar_url, email) VALUES
('Equipo Secret Network', 'equipo-secret-network', 'El equipo detrás de Secret Network, curadores de las mejores herramientas de diseño.', NULL, 'hola@secret-network.com'),
('Lucas Sabena', 'lucas-sabena', 'Diseñador y desarrollador apasionado por crear experiencias digitales increíbles.', NULL, 'lucas@secret-network.com')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- COMENTARIOS IMPORTANTES
-- =====================================================
-- 1. La columna 'autor' en blog_posts puede mantenerse por compatibilidad
-- 2. Usar autor_id como referencia principal ahora
-- 3. El avatar_url se sube a Cloudinary igual que otras imágenes
-- 4. Los slugs deben ser únicos para URLs de autor
-- 5. ON DELETE SET NULL mantiene los posts si se elimina un autor

COMMENT ON TABLE autores IS 'Autores del blog con información de perfil';
COMMENT ON COLUMN autores.slug IS 'URL amigable para el perfil del autor';
COMMENT ON COLUMN autores.bio IS 'Biografía corta del autor (150-300 caracteres)';
COMMENT ON COLUMN autores.avatar_url IS 'URL de Cloudinary de la foto del autor';
