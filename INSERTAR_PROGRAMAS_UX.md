# 📋 Instrucciones: Insertar Programas de UX Testing

## ✅ Problemas Solucionados

### 1. **Error de Base de Datos**: `categoria_slug` NULL
**Causa**: El formulario admin no enviaba el campo `categoria_slug` (columna NOT NULL)
**Solución**: ✅ Código arreglado en `programa-form.tsx` - ahora obtiene y envía el slug automáticamente

### 2. **Error de Cloudinary**: Upload preset must be whitelisted
**Causa**: Cloudinary no está configurado para unsigned uploads
**Solución**: Puedes usar el script SQL (no requiere uploads) o configurar Cloudinary:

#### Configurar Cloudinary (Opcional):
1. Ve a tu dashboard: https://console.cloudinary.com/
2. Settings → Upload → Upload presets
3. Crear nuevo preset:
   - Preset name: `secret_network_unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `programas` (o vacío)
   - Save
4. Agregar a `.env.local`:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=secret_network_unsigned
   ```

---

## 🚀 Cómo Insertar los 5 Programas

### Opción A: Script SQL (RECOMENDADO) ⚡

El script ya está listo en: `scripts/insert-ux-programs.sql`

**Pasos**:

1. **Verificar IDs en tu base de datos**:
   ```sql
   -- Ejecuta esto primero para confirmar los IDs:
   SELECT id, nombre, slug FROM categorias WHERE slug = 'programas-de-diseño';
   SELECT id, nombre, slug FROM categorias WHERE slug = 'diseño-ui-ux-y-prototipado';
   SELECT id, nombre, slug FROM programas WHERE slug = 'figma';
   ```

2. **Ajustar IDs en el script** (si es necesario):
   - Línea 12: `categoria_id = 29` (Programas de Diseño)
   - Línea 13: `subcategoria_id = 32` (Diseño UI/UX)
   - Línea 276: `SELECT id FROM programas WHERE slug = 'figma'`

3. **Ejecutar el script completo** en Supabase SQL Editor:
   - Inserta los 5 programas
   - Asigna subcategorías automáticamente
   - Configura alternativas (todos conectados + Figma)
   - Muestra verificación al final

4. **Verificar resultados**:
   El script incluye queries de verificación al final que muestran:
   - ✅ Programas insertados
   - ✅ Subcategorías asignadas
   - ✅ Alternativas configuradas

---

### Opción B: Desde el Admin Panel (Manual)

Ahora que arreglé el código, puedes usar el formulario:

**Para cada programa**:

1. Ir a `/admin` → Tab "Programas" → "Nuevo Programa"
2. Completar datos básicos:
   - **Nombre**: Maze (Useberry, UXtweak, etc.)
   - **Slug**: Se genera automático
   - **Categoría Principal**: Programas de Diseño
   - **Subcategorías**: Seleccionar "Diseño UI/UX y Prototipado"
3. Descripción:
   - Copiar de `archivos-nuevos.txt`
   - Pegar en Rich Text Editor
4. Opciones:
   - **Dificultad**: Intermedio
   - **Open Source**: NO
   - **Recomendado**: SÍ
   - **Web Oficial**: (URLs en el script SQL)
5. Alternativas:
   - Buscar y agregar los otros 4 programas de UX
   - Agregar "Figma"
6. Iconos/Capturas:
   - Dejar en NULL (completar después)
7. Guardar

---

## 📊 Programas a Insertar

| # | Nombre | Slug | Web Oficial |
|---|--------|------|-------------|
| 1 | Maze | `maze` | https://maze.co |
| 2 | Useberry | `useberry` | https://www.useberry.com |
| 3 | UXtweak | `uxtweak` | https://www.uxtweak.com |
| 4 | Optimal Workshop | `optimal-workshop` | https://www.optimalworkshop.com |
| 5 | Lyssna | `lyssna` | https://www.lyssna.com |

**Características comunes**:
- Categoría: Programas de Diseño
- Subcategoría: Diseño UI/UX y Prototipado
- Dificultad: Intermedio
- Open Source: false
- Recomendado: true
- Alternativas: Todos conectados entre sí + Figma

---

## ✅ Verificación Post-Inserción

Ejecuta estas queries para verificar:

```sql
-- 1. Ver los programas
SELECT id, nombre, slug, web_oficial_url 
FROM programas 
WHERE slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna');

-- 2. Ver subcategorías asignadas
SELECT p.nombre, c.nombre AS subcategoria
FROM programas p
JOIN programas_subcategorias ps ON p.id = ps.programa_id
JOIN categorias c ON ps.subcategoria_id = c.id
WHERE p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna');

-- 3. Ver alternativas (debe haber 25+ filas: 5x4 + 5 con Figma)
SELECT COUNT(*) AS total_alternativas
FROM programas_alternativas pa
JOIN programas p ON pa.programa_original_id = p.id
WHERE p.slug IN ('maze', 'useberry', 'uxtweak', 'optimal-workshop', 'lyssna');

-- 4. Ver alternativas de Maze (ejemplo)
SELECT p2.nombre AS alternativa
FROM programas_alternativas pa
JOIN programas p1 ON pa.programa_original_id = p1.id
JOIN programas p2 ON pa.programa_alternativa_id = p2.id
WHERE p1.slug = 'maze';
```

---

## 🎨 Completar Después

Para agregar iconos y capturas manualmente:

1. **Opción A - Desde Admin** (necesita Cloudinary configurado):
   - Editar programa
   - Upload de archivos
   - Guardar

2. **Opción B - SQL directo**:
   ```sql
   UPDATE programas 
   SET 
     icono_url = 'https://res.cloudinary.com/.../maze-icon.png',
     captura_url = 'https://res.cloudinary.com/.../maze-screenshot.png'
   WHERE slug = 'maze';
   ```

---

## 🔧 Código Modificado

**Archivo**: `src/components/admin/programa-form.tsx`

**Cambio**: Agregado código para obtener `categoria_slug` de la categoría seleccionada:

```typescript
// Obtener el slug de la categoría principal seleccionada
const categoriaPrincipal = categoriasPrincipales.find(
  cat => cat.id === parseInt(data.categoria_principal_id)
);

const programaData = {
  nombre: data.nombre,
  slug: data.slug,
  categoria_slug: categoriaPrincipal.slug, // ⬅️ NUEVO
  categoria_id: parseInt(data.categoria_principal_id),
  // ... resto de campos
};
```

**Beneficio**: Ahora el formulario funciona correctamente y puedes crear programas desde el admin sin errores.

---

## 🎯 Recomendación

**Usa la Opción A (Script SQL)** porque:
- ✅ Más rápido (1 click vs. 5 formularios)
- ✅ Sin errores de Cloudinary
- ✅ Alternativas configuradas automáticamente
- ✅ Puedes agregar iconos/capturas después manualmente
- ✅ El script incluye verificación automática

**Tiempo estimado**:
- Script SQL: 2 minutos ⚡
- Manual desde admin: 15-20 minutos 🐌

---

## 📝 Notas Importantes

1. **IDs de Categorías**: El script asume:
   - Programas de Diseño = ID 29
   - Diseño UI/UX = ID 32
   - Figma existe en la BD

2. **Conflict Handling**: El script usa `ON CONFLICT DO NOTHING`, por lo que es seguro ejecutarlo múltiples veces.

3. **Iconos/Capturas NULL**: Es perfectamente válido insertar programas sin imágenes. Puedes agregarlas después editando desde el admin (una vez que Cloudinary esté configurado).

4. **Alternativas Bidireccionales**: El script crea relaciones en ambos sentidos (A→B y B→A) para que aparezcan correctamente en todas las páginas.

---

¿Necesitas ayuda con algún paso? 🚀
