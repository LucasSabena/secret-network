# Database Schema (Supabase - PostgreSQL)

The database consists of 4 primary entity tables and 4 intermediate join tables for handling many-to-many relationships.

## Primary Tables (Entities)

### 1. `programas`
- **Purpose:** The core table containing information for each software tool.

| Column | Type | Rules | Description |
| :--- | :--- | :--- | :--- |
| `id` | `int8` | **Primary Key** | Unique numeric ID for the program. |
| `nombre` | `text` | Not Null | Display name of the program (e.g., "Figma"). |
| `slug` | `text` | Not Null, Unique | URL-friendly identifier (e.g., "figma"). |
| `icono_url` | `text` | Nullable | URL to the program's icon (from Cloudinary). |
| `categoria_id` | `int8` | Not Null, FK | Points to the `id` in the `categorias` table (its main category). |
| `descripcion_corta`| `text` | Nullable | A brief summary paragraph. |
| `descripcion_larga`| `text` | Nullable | The full, detailed description. |
| `captura_url` | `text` | Nullable | URL to a screenshot (from Cloudinary). |
| `dificultad` | `text` | Nullable | Can be "Facil", "Intermedio", or "Dificil". |
| `es_open_source` | `bool` | Not Null | `true` if open source, `false` otherwise. |
| `es_recomendado` | `bool` | Not Null | `true` if it's a personal recommendation. |
| `web_oficial_url` | `text` | Nullable | The official website URL. |

### 2. `categorias`
- **Purpose:** Stores both main categories and subcategories using a self-referencing relationship.

| Column | Type | Rules | Description |
| :--- | :--- | :--- | :--- |
| `id` | `int8` | **Primary Key** | Unique numeric ID for the category. |
| `nombre` | `text` | Not Null | Name of the category (e.g., "Diseño UI/UX"). |
| `slug` | `text` | Not Null, Unique | URL-friendly identifier. |
| `descripcion` | `text` | Nullable | Description of the category. |
| `id_categoria_padre`|`int8` | Nullable, FK | If it's a subcategory, this points to the `id` of its parent category. `NULL` for main categories. |
| `icono` | `text` | Nullable | URL to the category's icon. |

### 3. `plataformas`
- **Purpose:** A list of all possible platforms (e.g., macOS, Windows).

| Column | Type | Rules | Description |
| :--- | :--- | :--- | :--- |
| `id` | `int8` | **Primary Key** | Unique numeric ID. |
| `nombre` | `text` | Not Null | The platform name (e.g., "Windows"). |
| `slug` | `text` | Not Null, Unique | URL-friendly identifier (e.g., "windows"). |
| `icono_url` | `text` | Nullable | URL to the platform's icon. |

### 4. `modelos_de_precios`
- **Purpose:** A list of all possible pricing models (e.g., Freemium, Suscripción).

| Column | Type | Rules | Description |
| :--- | :--- | :--- | :--- |
| `id` | `int8` | **Primary Key** | Unique numeric ID. |
| `nombre` | `text` | Not Null | The model name (e.g., "Freemium"). |
| `slug` | `text` | Not Null, Unique | URL-friendly identifier (e.g., "freemium"). |

## Join Tables (Many-to-Many Relationships)

### 5. `programas_plataformas`
- **Purpose:** Links a program to all its available platforms.

| Column | Type | Rules |
| :--- | :--- | :--- |
| `programa_id` | `int8` | Composite PK, FK to `programas.id` |
| `plataforma_id` | `int8` | Composite PK, FK to `plataformas.id` |

### 6. `programas_subcategorias`
- **Purpose:** Links a program to all its relevant subcategories.

| Column | Type | Rules |
| :--- | :--- | :--- |
| `programa_id` | `int8` | Composite PK, FK to `programas.id` |
| `subcategoria_id` | `int8` | Composite PK, FK to `categorias.id` |

### 7. `programas_modelos_de_precios`
- **Purpose:** Links a program to all its pricing models.

| Column | Type | Rules |
| :--- | :--- | :--- |
| `programa_id` | `int8` | Composite PK, FK to `programas.id` |
| `modelo_precio_id` | `int8` | Composite PK, FK to `modelos_de_precios.id` |

### 8. `programas_alternativas`
- **Purpose:** Links a program to its recommended alternatives. This is a self-referencing join table.

| Column | Type | Rules |
| :--- | :--- | :--- |
| `programa_original_id` | `int8` | Composite PK, FK to `programas.id` |
| `programa_alternativa_id` | `int8`| Composite PK, FK to `programas.id` |