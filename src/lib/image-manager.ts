// FILE: src/lib/image-manager.ts
/**
 * Sistema de gestión de imágenes para el editor de blog
 * Las imágenes se guardan como base64 temporalmente y solo se suben a Cloudinary al hacer Submit
 */

export interface PendingImage {
  file: File;
  tempUrl: string; // Data URL (base64)
  placeholder: string; // ID único temporal
}

export class ImageManager {
  private static pendingImages: Map<string, PendingImage> = new Map();

  /**
   * Genera un placeholder único para una imagen
   */
  static generatePlaceholder(): string {
    return `__IMAGE_PLACEHOLDER_${Date.now()}_${Math.random().toString(36).substring(7)}__`;
  }

  /**
   * Convierte un File a Data URL (base64)
   */
  static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Agrega una imagen pendiente (no sube a Cloudinary todavía)
   */
  static async addPendingImage(file: File): Promise<string> {
    const placeholder = this.generatePlaceholder();
    const tempUrl = await this.fileToDataUrl(file);
    
    this.pendingImages.set(placeholder, {
      file,
      tempUrl,
      placeholder,
    });

    return tempUrl; // Retorna el data URL para mostrarlo en el editor
  }

  /**
   * Obtiene todas las imágenes pendientes
   */
  static getPendingImages(): PendingImage[] {
    return Array.from(this.pendingImages.values());
  }

  /**
   * Limpia todas las imágenes pendientes (llamar al cancelar o después de subir)
   */
  static clearPendingImages(): void {
    this.pendingImages.clear();
  }

  /**
   * Reemplaza una imagen existente
   */
  static async replacePendingImage(oldDataUrl: string, newFile: File): Promise<string> {
    // Buscar y eliminar la imagen antigua
    for (const [placeholder, image] of this.pendingImages.entries()) {
      if (image.tempUrl === oldDataUrl) {
        this.pendingImages.delete(placeholder);
        break;
      }
    }

    // Agregar la nueva
    return await this.addPendingImage(newFile);
  }

  /**
   * Extrae todas las URLs de imágenes de un HTML
   */
  static extractImageUrls(html: string): string[] {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  }

  /**
   * Verifica si una URL es un data URL (base64)
   */
  static isDataUrl(url: string): boolean {
    return url.startsWith('data:');
  }

  /**
   * Verifica si una URL es de Cloudinary
   */
  static isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com');
  }
}
