# Requirements Document

## Introduction

Sistema completo de gestión de series de blog que permite crear, editar y administrar series manualmente, así como marcar posts como destacados dentro de cada serie.

## Glossary

- **Serie**: Colección de posts de blog relacionados agrupados bajo un nombre común
- **Post Destacado**: Post principal de una serie que aparece en el carrusel destacado
- **Sistema de Gestión**: Interfaz administrativa para manejar series
- **Editor de Blog**: Interfaz para editar posts individuales

## Requirements

### Requirement 1

**User Story:** Como administrador, quiero poder marcar un post como destacado desde el editor de blog, para que aparezca en el carrusel de su serie

#### Acceptance Criteria

1. WHEN el administrador abre el editor de blog, THE Sistema de Gestión SHALL mostrar un switch "Destacado en Serie" en el panel lateral derecho
2. WHEN el administrador activa el switch, THE Sistema de Gestión SHALL guardar el campo is_featured como true en la base de datos
3. WHEN el administrador guarda el post, THE Sistema de Gestión SHALL persistir el estado de is_featured correctamente

### Requirement 2

**User Story:** Como administrador, quiero crear series manualmente desde el gestor de series, para organizar posts relacionados sin depender de tags automáticos

#### Acceptance Criteria

1. WHEN el administrador hace clic en "Crear Serie", THE Sistema de Gestión SHALL mostrar un diálogo con campos para nombre, slug, color y descripción
2. WHEN el administrador completa el formulario y guarda, THE Sistema de Gestión SHALL crear una nueva serie en la base de datos
3. THE Sistema de Gestión SHALL validar que el slug sea único antes de crear la serie
4. THE Sistema de Gestión SHALL generar automáticamente un slug desde el nombre si no se proporciona uno

### Requirement 3

**User Story:** Como administrador, quiero editar el nombre y color de una serie existente, para mantener la organización actualizada

#### Acceptance Criteria

1. WHEN el administrador hace clic en "Editar" en una serie, THE Sistema de Gestión SHALL mostrar un diálogo con los datos actuales
2. WHEN el administrador modifica los campos y guarda, THE Sistema de Gestión SHALL actualizar la serie en la base de datos
3. THE Sistema de Gestión SHALL validar que el nuevo slug sea único si se modifica
4. THE Sistema de Gestión SHALL mostrar un mensaje de confirmación después de guardar

### Requirement 4

**User Story:** Como administrador, quiero seleccionar qué post es el destacado de una serie desde el gestor, para controlar qué contenido se muestra en el carrusel

#### Acceptance Criteria

1. WHEN el administrador ve la lista de posts de una serie, THE Sistema de Gestión SHALL mostrar un icono de estrella junto a cada post
2. WHEN el administrador hace clic en la estrella de un post, THE Sistema de Gestión SHALL marcar ese post como destacado
3. THE Sistema de Gestión SHALL desmarcar automáticamente cualquier otro post destacado en la misma serie
4. THE Sistema de Gestión SHALL mostrar visualmente qué post está destacado con un indicador claro

### Requirement 5

**User Story:** Como administrador, quiero agregar posts existentes a una serie, para expandir el contenido relacionado

#### Acceptance Criteria

1. WHEN el administrador hace clic en "Agregar Post" en una serie, THE Sistema de Gestión SHALL mostrar un selector de posts disponibles
2. WHEN el administrador selecciona un post y confirma, THE Sistema de Gestión SHALL agregar el tag de la serie al post
3. THE Sistema de Gestión SHALL actualizar la lista de posts de la serie inmediatamente
4. THE Sistema de Gestión SHALL filtrar posts que ya están en la serie del selector
