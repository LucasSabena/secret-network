-- Agregar campo para marcar posts como destacados en series
ALTER TABLE blog_posts 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Agregar índice para mejorar performance
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);

-- Comentario
COMMENT ON COLUMN blog_posts.is_featured IS 'Marca si el post es destacado en su serie (aparece en carrusel)';
