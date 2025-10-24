'use client';

import {
  cloudinaryConfig,
  validateCloudinaryConfig,
  validateImageFile,
} from './cloudinary-config';

// Helper function to extract public_id from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Helper function to upload images to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string = 'programas',
  existingUrl?: string // URL de la imagen existente para reemplazar
): Promise<string> {
  // Validate configuration
  if (!validateCloudinaryConfig()) {
    throw new Error('Cloudinary configuration is missing');
  }

  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder);
  
  // Si hay una URL existente, extraer el public_id y reemplazar
  if (existingUrl) {
    const publicId = extractPublicIdFromUrl(existingUrl);
    if (publicId) {
      formData.append('public_id', publicId);
      formData.append('overwrite', 'true');
      formData.append('invalidate', 'true'); // Invalida cache de CDN
    }
  }

  const cloudName = cloudinaryConfig.cloudName;

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(
      'No se pudo subir la imagen. Verifica tu configuración de Cloudinary.'
    );
  }
}

// Helper function to delete an image from Cloudinary (requires backend)
// This is a placeholder - you'd need to implement this with your backend
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  // This would require your backend to call Cloudinary's API with authentication
  // Cannot be done from the frontend for security reasons
  console.warn('Delete from Cloudinary should be implemented on the backend');
  return false;
}

