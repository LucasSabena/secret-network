/**
 * Helper para generar URLs optimizadas de Cloudinary
 * Evita usar la optimización de Next.js que consume la cuota
 */

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit' | 'pad';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

/**
 * Genera una URL optimizada de Cloudinary con transformaciones
 * @param url - URL original de Cloudinary
 * @param options - Opciones de transformación
 * @returns URL optimizada
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  // Si no es una URL de Cloudinary, devolver la original
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  // Construir transformaciones
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop !== 'scale') transformations.push(`g_${gravity}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  // Insertar transformaciones en la URL
  // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8); // incluye '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  return `${beforeUpload}${transformString}/${afterUpload}`;
}

/**
 * Genera URLs responsivas para diferentes tamaños de pantalla
 * @param url - URL original de Cloudinary
 * @param sizes - Array de anchos para generar
 * @returns Objeto con URLs para cada tamaño
 */
export function getResponsiveCloudinaryUrls(
  url: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): Record<number, string> {
  const urls: Record<number, string> = {};

  sizes.forEach((size) => {
    urls[size] = getOptimizedCloudinaryUrl(url, {
      width: size,
      quality: 'auto:good',
      format: 'auto',
    });
  });

  return urls;
}

/**
 * Genera un srcset para imágenes responsivas
 * @param url - URL original de Cloudinary
 * @param sizes - Array de anchos
 * @returns String srcset para usar en <img>
 */
export function getCloudinarySrcSet(
  url: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedCloudinaryUrl(url, {
        width: size,
        quality: 'auto:good',
        format: 'auto',
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Genera una URL de thumbnail optimizada
 * @param url - URL original
 * @param size - Tamaño del thumbnail (default: 300)
 * @returns URL del thumbnail
 */
export function getCloudinaryThumbnail(url: string, size: number = 300): string {
  return getOptimizedCloudinaryUrl(url, {
    width: size,
    height: size,
    crop: 'thumb',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'auto',
  });
}
