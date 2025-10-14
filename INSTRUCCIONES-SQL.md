# 🔧 Scripts SQL para Ejecutar en Supabase

## ⚠️ IMPORTANTE: Ejecutar en este orden exacto

### PASO 1: Arreglar Login (CRÍTICO - Sin esto no puedes entrar al admin)

```sql
-- ========================================
-- ARREGLAR POLÍTICA DE admin_users
-- ========================================
-- Permite que usuarios autenticados puedan verificar si son admin

DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;

CREATE POLICY "Allow authenticated users to check admin status" 
ON admin_users FOR SELECT 
USING (auth.role() = 'authenticated');

-- Verificar
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'admin_users';
```

**Resultado esperado**: 1 política que permite SELECT a usuarios autenticados

---

### PASO 2: Crear Usuario Admin en Supabase (NO ES SQL)

1. **Ir a**: Supabase Dashboard → Authentication → Users
2. **Click**: "Add user" → "Create new user"
3. **Email**: `01studiobinary@gmail.com`
4. **Password**: Tu contraseña segura
5. **Auto Confirm User**: ✅ **ACTIVAR**
6. **Click**: "Create user"

---

### PASO 3: Configurar RLS para Plataformas y Modelos de Precio

```sql
-- ========================================
-- TABLA: Plataformas
-- ========================================
ALTER TABLE "Plataformas" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_plataformas" ON "Plataformas";
DROP POLICY IF EXISTS "admin_insert_plataformas" ON "Plataformas";
DROP POLICY IF EXISTS "admin_update_plataformas" ON "Plataformas";
DROP POLICY IF EXISTS "admin_delete_plataformas" ON "Plataformas";

CREATE POLICY "admin_select_plataformas" ON "Plataformas" FOR SELECT USING (true);
CREATE POLICY "admin_insert_plataformas" ON "Plataformas" FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "admin_update_plataformas" ON "Plataformas" FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_delete_plataformas" ON "Plataformas" FOR DELETE USING (is_admin());

-- ========================================
-- TABLA: Modelos de Precios
-- ========================================
ALTER TABLE "Modelos de Precios" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_modelos_precios" ON "Modelos de Precios";
DROP POLICY IF EXISTS "admin_insert_modelos_precios" ON "Modelos de Precios";
DROP POLICY IF EXISTS "admin_update_modelos_precios" ON "Modelos de Precios";
DROP POLICY IF EXISTS "admin_delete_modelos_precios" ON "Modelos de Precios";

CREATE POLICY "admin_select_modelos_precios" ON "Modelos de Precios" FOR SELECT USING (true);
CREATE POLICY "admin_insert_modelos_precios" ON "Modelos de Precios" FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "admin_update_modelos_precios" ON "Modelos de Precios" FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_delete_modelos_precios" ON "Modelos de Precios" FOR DELETE USING (is_admin());

-- ========================================
-- TABLA: programas_plataformas
-- ========================================
ALTER TABLE programas_plataformas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_programas_plataformas" ON programas_plataformas;
DROP POLICY IF EXISTS "admin_insert_programas_plataformas" ON programas_plataformas;
DROP POLICY IF EXISTS "admin_update_programas_plataformas" ON programas_plataformas;
DROP POLICY IF EXISTS "admin_delete_programas_plataformas" ON programas_plataformas;

CREATE POLICY "admin_select_programas_plataformas" ON programas_plataformas FOR SELECT USING (true);
CREATE POLICY "admin_insert_programas_plataformas" ON programas_plataformas FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "admin_update_programas_plataformas" ON programas_plataformas FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_delete_programas_plataformas" ON programas_plataformas FOR DELETE USING (is_admin());

-- ========================================
-- TABLA: programas_modelos_de_precios
-- ========================================
ALTER TABLE programas_modelos_de_precios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_programas_modelos" ON programas_modelos_de_precios;
DROP POLICY IF EXISTS "admin_insert_programas_modelos" ON programas_modelos_de_precios;
DROP POLICY IF EXISTS "admin_update_programas_modelos" ON programas_modelos_de_precios;
DROP POLICY IF EXISTS "admin_delete_programas_modelos" ON programas_modelos_de_precios;

CREATE POLICY "admin_select_programas_modelos" ON programas_modelos_de_precios FOR SELECT USING (true);
CREATE POLICY "admin_insert_programas_modelos" ON programas_modelos_de_precios FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "admin_update_programas_modelos" ON programas_modelos_de_precios FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_delete_programas_modelos" ON programas_modelos_de_precios FOR DELETE USING (is_admin());

-- ========================================
-- VERIFICACIÓN
-- ========================================
SELECT 
  tablename, 
  policyname, 
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Público'
    ELSE '🔒 Solo Admins'
  END as acceso
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('Plataformas', 'Modelos de Precios', 'programas_plataformas', 'programas_modelos_de_precios')
ORDER BY tablename, cmd;
```

**Resultado esperado**: 16 políticas (4 por tabla × 4 tablas)

---

## ✅ Verificación Final

1. **Login**: http://localhost:3000/admin/login o https://secret-network.vercel.app/admin/login
2. **Usuario**: `01studiobinary@gmail.com`
3. **Password**: La que configuraste

Deberías ver **6 tabs** en el panel:
- Programas ✅
- Blogs ✅
- Categorías ✅
- Alternativas ✅
- **Plataformas** ⭐ NUEVO
- **Precios** ⭐ NUEVO

---

## 🎉 ¡Listo!

Todo el código ya está en GitHub (commit `b253e4d`).
Solo necesitas ejecutar estos 3 pasos en Supabase y ya podés empezar a usar el admin completo.
