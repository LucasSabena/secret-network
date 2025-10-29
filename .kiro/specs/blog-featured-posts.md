# Blog Featured Posts System

## Objetivo
Implementar un sistema de posts destacados en /blog similar al de series, con:
- Drag & drop para reordenar posts
- Seleccionar 3-5 posts destacados
- Carrusel en la parte superior de /blog
- Gestión desde /admin/blog

## Cambios en Base de Datos

### Agregar campos a blog_posts:
```sql
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS is_featured_in_blog BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blog_featured_order INTEGER DEFAULT 0;
```

## Componentes a Crear/Modificar

### 1. Admin: Blog Featured Manager
- Componente en /admin/blog para gestionar destacados
- Drag & drop para reordenar
- Toggle para marcar/desmarcar como destacado
- Límite de 5 posts destacados

### 2. Public: Blog Featured Carousel
- Carrusel similar al de series
- Mostrar en /blog arriba de la grilla
- Responsive y con animaciones

### 3. Modificar /blog page
- Cargar posts destacados
- Mostrar carrusel si hay destacados
- Mantener grilla normal debajo

## Flujo de Trabajo
1. Usuario va a /admin/blog
2. Ve lista de posts con opción de destacar
3. Arrastra para reordenar destacados
4. Guarda cambios
5. /blog muestra carrusel con posts destacados
