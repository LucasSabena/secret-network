# Design Document

## Overview

Sistema de gestión de series de blog que permite administrar series manualmente y controlar posts destacados. El diseño se enfoca en simplicidad y usabilidad, integrándose con el sistema existente de tags y el editor de blog.

## Architecture

### Database Schema

Utilizaremos el esquema existente de `blog_posts` con el campo `is_featured` ya presente. Las series se manejan mediante tags, pero agregaremos metadatos adicionales:

```typescript
// Tabla existente: blog_posts
{
  id: number
  titulo: string
  tags: string[]
  is_featured: boolean  // Ya existe
  // ... otros campos
}

// Nueva tabla: blog_series (opcional, para metadatos)
{
  id: number
  nombre: string
  slug: string (unique)
  color: string
  descripcion: string | null
  tag: string  // Vincula con blog_posts.tags
  created_at: timestamp
  updated_at: timestamp
}
```

### Component Structure

```
src/components/admin/
├── blog-editor-v2/
│   ├── blog-editor-full-page.tsx (modificar)
│   ├── editor-sidebar-tabs.tsx (nuevo)
│   └── post-settings-panel.tsx (ya existe, integrar)
└── blog-series-manager.tsx (modificar extensivamente)
```

## Components and Interfaces

### 1. Editor Sidebar Tabs

Nuevo componente que organiza los paneles laterales del editor en tabs:

```typescript
interface EditorSidebarTabsProps {
  postSettings: PostSettingsData
  seoSettings: SEOSettingsData
  onPostSettingsChange: (settings: PostSettingsData) => void
  onSEOSettingsChange: (settings: SEOSettingsData) => void
}

// Tabs: "Configuración" | "SEO" | "Ayuda"
```

### 2. Blog Series Manager (Enhanced)

Componente principal mejorado con diálogos para CRUD:

```typescript
interface Serie {
  id?: number
  tag: string
  nombre: string
  slug: string
  color: string
  descripcion?: string
  count: number
  posts: BlogPost[]
  featuredPostId?: number
}

// Nuevas funciones:
- handleCreateSerie()
- handleEditSerie(serieTag: string)
- handleSetFeaturedPost(serieTag: string, postId: number)
- handleAddPostToSerie(serieTag: string, postId: number)
```

### 3. Serie Dialog Components

Diálogos reutilizables para crear/editar series:

```typescript
<CreateSerieDialog
  open={showCreateDialog}
  onClose={() => setShowCreateDialog(false)}
  onSave={(data) => handleCreateSerie(data)}
/>

<EditSerieDialog
  open={editingSerieTag !== null}
  serie={currentSerie}
  onClose={() => setEditingSerieTag(null)}
  onSave={(data) => handleUpdateSerie(data)}
/>

<AddPostDialog
  open={showAddPostDialog}
  serieTag={selectedSerieTag}
  availablePosts={availablePosts}
  onClose={() => setShowAddPostDialog(false)}
  onAdd={(postId) => handleAddPostToSerie(postId)}
/>
```

## Data Models

### Serie Creation/Edit Form

```typescript
interface SerieFormData {
  nombre: string
  slug: string
  color: string
  descripcion?: string
}

// Validación:
- nombre: required, min 3 chars
- slug: required, unique, kebab-case
- color: required, hex color
- descripcion: optional, max 500 chars
```

### Post Settings Data

```typescript
interface PostSettingsData {
  titulo: string
  slug: string
  descripcionCorta: string
  tags: string[]
  publicado: boolean
  isFeatured: boolean  // ← Campo clave
  fechaPublicacion: Date
  autor: string
  // ... otros campos
}
```

## Error Handling

### Validation Errors

- **Slug duplicado**: "Ya existe una serie con este slug"
- **Nombre vacío**: "El nombre es requerido"
- **Color inválido**: "Selecciona un color válido"

### Database Errors

- **Error al guardar**: Toast con mensaje de error y opción de reintentar
- **Error al cargar**: Mostrar estado de error con botón "Reintentar"
- **Conflicto de featured**: Si dos posts tienen is_featured=true en la misma serie, el sistema debe resolverlo automáticamente

### User Feedback

- **Guardado exitoso**: Toast verde "Serie guardada correctamente"
- **Post destacado cambiado**: Toast "Post destacado actualizado"
- **Post agregado**: Toast "Post agregado a la serie"

## Testing Strategy

### Unit Tests (Opcional)

- Validación de formularios de serie
- Generación de slugs
- Lógica de featured post (solo uno por serie)

### Integration Tests (Opcional)

- Crear serie y agregar posts
- Cambiar post destacado
- Editar serie existente

### Manual Testing

1. Crear una serie nueva desde el gestor
2. Agregar 3 posts a la serie
3. Marcar uno como destacado
4. Cambiar el destacado a otro post
5. Editar el nombre y color de la serie
6. Verificar que el carrusel muestre el post destacado correcto
7. Desde el editor de blog, activar/desactivar "Destacado en Serie"
8. Verificar que se sincronice con el gestor de series

## UI/UX Considerations

### Color Palette for Series

Predefinir 12 colores vibrantes para elegir:
```typescript
const SERIE_COLORS = [
  '#ff3399', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE',
  '#85C1E2', '#F8B739', '#6C5CE7', '#00B894'
]
```

### Featured Post Indicator

- Icono de estrella dorada (⭐) junto al post destacado
- Botón de estrella outline para posts no destacados
- Hover effect para indicar que es clickeable

### Responsive Design

- Gestor de series: Grid responsive (1 col móvil, 2 cols tablet, 3 cols desktop)
- Diálogos: Full screen en móvil, modal centrado en desktop
- Editor sidebar: Colapsable en móvil

## Implementation Notes

### Existing Code Integration

- El campo `is_featured` ya existe en la BD y en el tipo `BlogPost`
- El componente `PostSettingsPanel` ya tiene el switch, solo falta integrarlo
- El `BlogSeriesManager` ya carga series, solo necesita los diálogos CRUD

### Migration Strategy

No se requiere migración de datos. El campo `is_featured` ya existe y tiene valor por defecto `false`.

### Performance Considerations

- Cargar series con paginación si hay más de 50
- Debounce en búsqueda de posts para agregar a serie
- Optimistic UI updates para cambios de featured post
