# Implementation Plan

- [x] 1. Integrar panel de configuración en el editor de blog
  - Crear componente EditorSidebarTabs que organice los paneles laterales
  - Integrar PostSettingsPanel existente en el tab "Configuración"
  - Asegurar que el switch "Destacado en Serie" sea visible y funcional
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Crear diálogos para gestión de series
  - [x] 2.1 Crear CreateSerieDialog con formulario (nombre, slug, color, descripción)
    - Implementar validación de campos
    - Agregar selector de color con paleta predefinida
    - Generar slug automáticamente desde el nombre
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Crear EditSerieDialog reutilizando lógica de CreateSerieDialog
    - Cargar datos existentes de la serie
    - Validar slug único excluyendo el actual
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.3 Crear AddPostDialog para agregar posts a series
    - Listar posts disponibles (no en la serie actual)
    - Implementar búsqueda/filtrado de posts
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3. Implementar funcionalidad CRUD en BlogSeriesManager
  - [x] 3.1 Agregar botón "Crear Serie" y conectar con CreateSerieDialog
    - Implementar función handleCreateSerie
    - Guardar serie en base de datos
    - Actualizar lista de series después de crear
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Agregar botón "Editar" por serie y conectar con EditSerieDialog
    - Implementar función handleEditSerie
    - Actualizar serie en base de datos
    - Refrescar vista después de editar
    - _Requirements: 3.1, 3.2_

  - [x] 3.3 Implementar sistema de post destacado con estrellas clickeables
    - Agregar icono de estrella junto a cada post
    - Implementar función handleSetFeaturedPost
    - Desmarcar otros posts destacados en la misma serie
    - Actualizar campo is_featured en base de datos
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 3.4 Agregar botón "Agregar Post" por serie
    - Conectar con AddPostDialog
    - Implementar función handleAddPostToSerie
    - Actualizar tags del post seleccionado
    - _Requirements: 5.1, 5.2, 5.3_
