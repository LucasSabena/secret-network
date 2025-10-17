/**
 * Optimiza URLs de imágenes de Cloudinary agregando transformaciones automáticas
 * para mejorar el rendimiento sin perder calidad
 */

export function optimizeCloudinaryUrl(url: string, options?: {
  width?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
}): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width, quality = 80, format = 'auto' } = options || {};

  // Extraer la parte después de /upload/
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8); // incluye '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Construir transformaciones
  const transformations = [
    'f_auto', // Formato automático (WebP/AVIF según soporte del navegador)
    `q_${quality}`, // Calidad
    'c_limit', // Limitar tamaño sin distorsionar
  ];

  if (width) {
    transformations.push(`w_${width}`);
  }

  const transformString = transformations.join(',');

  return `${beforeUpload}${transformString}/${afterUpload}`;
}

/**
 * Optimiza URLs de imágenes de Unsplash
 */
export function optimizeUnsplashUrl(url: string, options?: {
  width?: number;
  quality?: number;
}): string {
  if (!url || !url.includes('unsplash.com')) {
    return url;
  }

  const { width = 800, quality = 80 } = options || {};

  // Agregar parámetros de optimización
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&q=${quality}&auto=format&fit=crop`;
}

/**
 * Optimiza cualquier URL de imagen según el proveedor
 */
export function optimizeImageUrl(url: string, options?: {
  width?: number;
  quality?: number;
}): string {
  if (!url) return url;

  if (url.includes('cloudinary.com')) {
    return optimizeCloudinaryUrl(url, options);
  }

  if (url.includes('unsplash.com')) {
    return optimizeUnsplashUrl(url, options);
  }

  // Para otras URLs, devolver sin cambios
  return url;
}
