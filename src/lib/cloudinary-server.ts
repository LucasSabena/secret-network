import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side credentials
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
}

/**
 * Upload a buffer to Cloudinary from the server side
 * Uses signed uploads (requires API key and secret)
 */
export async function uploadBufferToCloudinary(
    buffer: Buffer,
    folder: string,
    publicId?: string,
    transformation?: Array<Record<string, unknown>>
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const uploadOptions: Record<string, unknown> = {
            folder,
            resource_type: 'image',
            overwrite: true,
            invalidate: true,
        };

        if (publicId) {
            uploadOptions.public_id = publicId;
        }

        if (transformation) {
            uploadOptions.transformation = transformation;
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    return;
                }
                if (!result) {
                    reject(new Error('Cloudinary upload returned no result'));
                    return;
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                });
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Upload an image from URL to Cloudinary
 */
export async function uploadUrlToCloudinary(
    imageUrl: string,
    folder: string,
    publicId?: string
): Promise<UploadResult> {
    const uploadOptions: Record<string, unknown> = {
        folder,
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
    };

    if (publicId) {
        uploadOptions.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
    };
}

export { cloudinary };
