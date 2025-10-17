# 📧 Cómo Invitar Administradores

## Paso 1: Agregar el email a la tabla admin_users

Primero, agregá el email de tu hermano a la tabla `admin_users` en Supabase:

```sql
INSERT INTO admin_users (email, nombre)
VALUES ('email-de-tu-hermano@ejemplo.com', 'Nombre de tu hermano');
```

O hacelo desde el panel de Supabase:
1. Andá a Table Editor → admin_users
2. Click en "Insert" → "Insert row"
3. Completá el email y nombre
4. Guardá

## Paso 2: Configurar la URL de redirección en Supabase

1. Andá a tu proyecto en Supabase: https://supabase.com/dashboard
2. En el menú lateral, andá a **Authentication** → **URL Configuration**
3. En **Site URL**, poné: `https://secretnetwork.co` (o `http://localhost:3000` para desarrollo)
4. En **Redirect URLs**, agregá estas URLs (una por línea):
   ```
   http://localhost:3000/admin/setup-password
   https://secretnetwork.co/admin/setup-password
   http://localhost:3000/admin/login
   https://secretnetwork.co/admin/login
   ```
5. Guardá los cambios

## Paso 3: Configurar el Email Template de Invitación

1. En Supabase, andá a **Authentication** → **Email Templates**
2. Buscá el template **"Invite user"**
3. Reemplazá el contenido con este:

```html
<h2>Has sido invitado a Secret Network Admin</h2>

<p>Hola,</p>

<p>Has sido invitado a ser administrador de Secret Network.</p>

<p>Haz clic en el siguiente enlace para configurar tu contraseña:</p>

<p><a href="{{ .ConfirmationURL }}">Configurar mi contraseña</a></p>

<p>Este enlace expira en 24 horas.</p>

<p>Si no solicitaste esta invitación, puedes ignorar este email.</p>
```

4. **IMPORTANTE**: En la parte superior del template, donde dice **"Confirmation URL"**, cambiá la URL a:
   ```
   {{ .SiteURL }}/admin/setup-password
   ```

5. Guardá el template

## Paso 4: Invitar al usuario

Ahora sí, invitá a tu hermano:

1. En Supabase, andá a **Authentication** → **Users**
2. Click en **"Invite user"**
3. Ingresá el email de tu hermano (el mismo que pusiste en admin_users)
4. Click en **"Send invitation"**

## ¿Qué pasa después?

1. Tu hermano va a recibir un email con el link de invitación
2. Al hacer click, va a ir a `/admin/setup-password`
3. Ahí va a poder elegir su contraseña
4. Una vez configurada, lo redirige automáticamente a `/admin`
5. La próxima vez que entre, usa `/admin/login` con su email y contraseña

## Para desarrollo local

Si estás probando en localhost:

1. En Supabase, en **Site URL** poné: `http://localhost:3000`
2. Asegurate de tener `http://localhost:3000/admin/setup-password` en las Redirect URLs
3. El resto del proceso es igual

## Troubleshooting

**Si el link redirige a la home en lugar de setup-password:**
- Verificá que hayas agregado la URL en "Redirect URLs" en Supabase
- Verificá que el Site URL esté correcto
- Probá cerrando todas las sesiones y volviendo a enviar la invitación

**Si dice "No autorizado":**
- Verificá que el email esté en la tabla `admin_users`
- Verificá que el email sea exactamente el mismo (sin espacios)

**Si el link expiró:**
- Simplemente enviá una nueva invitación desde Supabase

## Notas importantes

- El link de invitación expira en 24 horas
- Solo los emails que estén en `admin_users` pueden configurar contraseña
- Una vez configurada la contraseña, el usuario puede cambiarla desde su perfil
- Podés invitar múltiples admins, solo agregá sus emails a `admin_users` primero
