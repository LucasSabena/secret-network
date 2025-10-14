// Configuración de Cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'ml_default', // Asegúrate de crear este preset en Cloudinary
  folders: {
    programasIcons: 'programas/icons',
    programasCapturas: 'programas/capturas',
    blog: 'blog',
    categorias: 'categorias',
  },
};

// Validar configuración
export function validateCloudinaryConfig(): boolean {
  if (!cloudinaryConfig.cloudName) {
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está configurado');
    return false;
  }
  return true;
}

// Tipos de imágenes permitidas
export const allowedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

// Tamaño máximo de archivo (5MB)
export const maxFileSize = 5 * 1024 * 1024;

// Validar archivo antes de subir
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!allowedImageTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP, GIF o SVG.',
    };
  }

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 5MB.',
    };
  }

  return { valid: true };
}
