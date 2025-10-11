# 🚀 Guía de Optimización de Performance

## ✅ Pasos para Mejorar la Velocidad de Carga

### 1. **Crear Índices en Supabase** (CRÍTICO - Ejecutar primero)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `scripts/create-indexes.sql`
4. Ejecuta el script
5. Verifica que se crearon correctamente

**Impacto esperado:** Reducción de ~400ms a ~100ms en consultas con relaciones

---

### 2. **Habilitar ISR (Incremental Static Regeneration)**

Ya implementado en `src/app/page.tsx`:
```typescript
export const revalidate = 3600; // Revalidar cada hora
```

**Beneficio:** La página se genera estáticamente y solo se regenera cada hora, mejorando drásticamente la velocidad.

---

### 3. **Optimización de Imágenes** ✅ (Ya implementado)

- Lazy loading
- Quality: 75
- Prefetch: false
- Formato: WebP automático
- CDN: Cloudinary (100% migrado)

---

### 4. **Configuración Avanzada de Next.js**

Ya optimizado en `next.config.ts`:
- Compresión habilitada
- Cache TTL: 60 segundos
- WebP automático
- React Strict Mode

---

## 📊 Resultados Esperados

| Métrica | ANTES | DESPUÉS |
|---------|-------|---------|
| **Tiempo de carga inicial** | 1000ms+ | 200-400ms |
| **Imágenes en Framer (lentas)** | 100% | 0% ✅ |
| **Imágenes en Cloudinary** | 0% | 100% ✅ |
| **Consultas DB con relaciones** | 595ms | ~100-150ms |
| **Cache estático (ISR)** | ❌ | ✅ 1 hora |

---

## 🔧 Optimizaciones Adicionales Opcionales

### A. Habilitar Caché de Supabase en el Servidor
```typescript
// En src/lib/supabase.ts - agregar caché en memoria
const cache = new Map<string, { data: any; expires: number }>();

export async function getCachedQuery(key: string, queryFn: () => Promise<any>) {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && cached.expires > now) {
    return cached.data;
  }
  
  const data = await queryFn();
  cache.set(key, { data, expires: now + 60000 }); // 1 minuto
  return data;
}
```

### B. Lazy Loading de Componentes Pesados
```typescript
import dynamic from 'next/dynamic';

const ProgramsListClient = dynamic(
  () => import('@/components/shared/programs-list-client').then(m => m.ProgramsListClient),
  { loading: () => <ProgramsGridSkeleton /> }
);
```

### C. Virtualización para Muchos Programas
Si tienes más de 500 programas, considera usar `react-virtual`:
```bash
npm install @tanstack/react-virtual
```

---

## 🎯 Prioridad de Implementación

1. **🔴 CRÍTICO:** Crear índices en Supabase (mejora inmediata de 60-70%)
2. **🟡 IMPORTANTE:** Verificar que ISR está activo (desplegar a producción)
3. **🟢 OPCIONAL:** Caché adicional si aún es lento

---

## 📈 Cómo Medir el Impacto

### Antes de optimizar:
```bash
npm run diagnose
```

### Después de crear índices:
```bash
npm run diagnose
```

Deberías ver:
- ⏱️ Consultas: 595ms → ~100ms
- 🐌 Framer: 0% ✅
- ⚡ Cloudinary: 100% ✅

### En producción (Vercel):
1. Ve a Vercel Dashboard → Analytics
2. Verifica **Time to First Byte (TTFB)**: debe ser < 300ms
3. Verifica **First Contentful Paint (FCP)**: debe ser < 1.5s

---

## 🚨 IMPORTANTE: Deploy

Para que ISR funcione, debes deployar a Vercel:
```bash
git add .
git commit -m "feat: optimizaciones de performance - índices, ISR, CDN"
git push
```

El deploy automático aplicará todas las optimizaciones en producción.
