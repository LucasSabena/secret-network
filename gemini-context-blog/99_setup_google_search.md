# Guía de Configuración: Búsqueda de Imágenes (Google Oficial)

Para usar la opción "Premium" y 100% estable de búsqueda de imágenes, necesitamos configurar Google Custom Search. Es gratis (100 búsquedas/día) y es la forma oficial.

### Paso 1: Habilitar API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto nuevo (o usa uno existente, ej: "Secret Station").
3. Busca **"Custom Search API"** en la barra superior.
4. Dale click a **"ENABLE"**.

### Paso 2: Crear API Key
1. En el menú, ve a **APIs & Services > Credentials**.
2. Click en **Create Credentials > API Key**.
3. Copia esa clave. Esa es tu `GOOGLE_CSE_API_KEY`.

### Paso 3: Crear el Buscador (CSE)
1. Ve a [Programmable Search Engine](https://programmablesearchengine.google.com/).
2. Click en **Add**.
   - **Name:** "Buscador Imagenes Blog"
   - **What to search:** Select "Search the entire web" (Buscar en toda la web).
   - **Image Search:** ACTIVA esta opción (ON).
   - **SafeSearch:** OFF (si quieres resultados sin restricciones) o ON.
3. Click **Create**.
4. En la pantalla siguiente, verás tu "Search Engine ID" (cx). O ve a **Customize** para verlo. Ese es tu `GOOGLE_CSE_ID`.

### Paso 4: Configurar en tu Proyecto
Agrega estas líneas a tu archivo `.env.local`:

```env
GOOGLE_CSE_API_KEY=tu_clave_del_paso_2
GOOGLE_CSE_ID=tu_id_del_paso_3
```

¡Listo! El sistema detectará automáticamente estas claves y las usará. Si se acaban las 100 diarias, automáticamente cambiará al modo "Gratis" (Scraping).
