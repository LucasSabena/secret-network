import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadBufferToCloudinary, uploadUrlToCloudinary } from '@/lib/cloudinary-server';

interface AutoAssetsResult {
    screenshotUrl?: string;
    logoUrl?: string;
    errors: string[];
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return url.replace(/^https?:\/\//, '').split('/')[0];
    }
}

/**
 * Fetch screenshot using Microlink API (free tier: 50/day)
 * @param url - The URL to screenshot
 * @param delay - Delay in seconds before capture (for animations)
 */
async function fetchScreenshot(url: string, delay: number = 3): Promise<string | null> {
    try {
        const microlinkUrl = new URL('https://api.microlink.io');
        microlinkUrl.searchParams.set('url', url);
        microlinkUrl.searchParams.set('screenshot', 'true');
        microlinkUrl.searchParams.set('meta', 'false');
        microlinkUrl.searchParams.set('viewport.width', '1280');
        microlinkUrl.searchParams.set('viewport.height', '800');
        microlinkUrl.searchParams.set('viewport.deviceScaleFactor', '1');
        // Wait for page animations before capture
        if (delay > 0) {
            microlinkUrl.searchParams.set('waitForTimeout', String(delay * 1000));
        }

        const response = await fetch(microlinkUrl.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Microlink API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.status === 'success' && data.data?.screenshot?.url) {
            return data.data.screenshot.url;
        }

        console.error('Microlink: No screenshot in response', data);
        return null;
    } catch (error) {
        console.error('Error fetching screenshot:', error);
        return null;
    }
}

/**
 * Fetch logo using multiple strategies:
 * 1. Google S2 Favicons (high quality)
 * 2. DuckDuckGo Icons
 * 3. Scrape HTML for apple-touch-icon or og:image
 */
async function fetchLogo(url: string): Promise<Buffer | null> {
    const domain = extractDomain(url);

    // Strategy 1: Google S2 Favicons (best quality, up to 256px)
    try {
        const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        const response = await fetch(googleUrl);

        if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            // Check if it's not a placeholder (Google returns a default icon)
            if (buffer.length > 1000) {
                console.log('Logo found via Google S2');
                return buffer;
            }
        }
    } catch (error) {
        console.error('Google S2 error:', error);
    }

    // Strategy 2: DuckDuckGo Icons
    try {
        const ddgUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
        const response = await fetch(ddgUrl);

        if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            if (buffer.length > 500) {
                console.log('Logo found via DuckDuckGo');
                return buffer;
            }
        }
    } catch (error) {
        console.error('DuckDuckGo error:', error);
    }

    // Strategy 3: Scrape HTML for better icons
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (response.ok) {
            const html = await response.text();

            // Look for apple-touch-icon (usually high quality)
            const appleTouchMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i);
            if (appleTouchMatch) {
                const iconUrl = new URL(appleTouchMatch[1], url).toString();
                const iconResponse = await fetch(iconUrl);
                if (iconResponse.ok) {
                    console.log('Logo found via apple-touch-icon');
                    return Buffer.from(await iconResponse.arrayBuffer());
                }
            }

            // Look for og:image
            const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
            if (ogImageMatch) {
                const imageUrl = new URL(ogImageMatch[1], url).toString();
                const imageResponse = await fetch(imageUrl);
                if (imageResponse.ok) {
                    console.log('Logo found via og:image');
                    return Buffer.from(await imageResponse.arrayBuffer());
                }
            }

            // Look for large favicon
            const faviconMatch = html.match(/<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["'][^>]*sizes=["'](\d+)x\d+["']/i);
            if (faviconMatch && parseInt(faviconMatch[2]) >= 64) {
                const iconUrl = new URL(faviconMatch[1], url).toString();
                const iconResponse = await fetch(iconUrl);
                if (iconResponse.ok) {
                    console.log('Logo found via favicon with size');
                    return Buffer.from(await iconResponse.arrayBuffer());
                }
            }
        }
    } catch (error) {
        console.error('HTML scraping error:', error);
    }

    return null;
}

/**
 * Process logo: center it in a 1000x1000 canvas with safe space (TRANSPARENT background)
 * - Cuadrado: logo max 500x500
 * - Muy horizontal: ajustar al ancho con padding vertical
 * - Muy vertical: ajustar al alto con padding horizontal
 */
async function processLogoWithSafeSpace(logoBuffer: Buffer): Promise<Buffer> {
    const CANVAS_SIZE = 1000;
    const MAX_LOGO_SIZE = 500; // 50% del canvas para logos cuadrados
    const PADDING = 250; // (1000 - 500) / 2

    try {
        // Get image metadata
        const metadata = await sharp(logoBuffer).metadata();
        const width = metadata.width || 100;
        const height = metadata.height || 100;
        const aspectRatio = width / height;

        let targetWidth: number;
        let targetHeight: number;

        if (aspectRatio > 1.5) {
            // Muy horizontal: ajustar al ancho disponible (con más padding)
            targetWidth = Math.min(width, CANVAS_SIZE - PADDING);
            targetHeight = Math.round(targetWidth / aspectRatio);
        } else if (aspectRatio < 0.67) {
            // Muy vertical: ajustar al alto disponible (con más padding)
            targetHeight = Math.min(height, CANVAS_SIZE - PADDING);
            targetWidth = Math.round(targetHeight * aspectRatio);
        } else {
            // Más o menos cuadrado: usar tamaño máximo
            if (width > height) {
                targetWidth = MAX_LOGO_SIZE;
                targetHeight = Math.round(MAX_LOGO_SIZE / aspectRatio);
            } else {
                targetHeight = MAX_LOGO_SIZE;
                targetWidth = Math.round(MAX_LOGO_SIZE * aspectRatio);
            }
        }

        // Resize the logo
        const resizedLogo = await sharp(logoBuffer)
            .resize(targetWidth, targetHeight, {
                fit: 'inside',
                withoutEnlargement: false,
            })
            .png()
            .toBuffer();

        // Get the actual size after resize
        const resizedMetadata = await sharp(resizedLogo).metadata();
        const finalWidth = resizedMetadata.width || targetWidth;
        const finalHeight = resizedMetadata.height || targetHeight;

        // Calculate position to center
        const left = Math.round((CANVAS_SIZE - finalWidth) / 2);
        const top = Math.round((CANVAS_SIZE - finalHeight) / 2);

        // Create TRANSPARENT canvas and composite the logo
        const result = await sharp({
            create: {
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                {
                    input: resizedLogo,
                    left,
                    top,
                },
            ])
            .png()
            .toBuffer();

        console.log(`Logo processed: ${width}x${height} -> ${finalWidth}x${finalHeight} centered in ${CANVAS_SIZE}x${CANVAS_SIZE}`);
        return result;
    } catch (error) {
        console.error('Error processing logo:', error);
        throw new Error('Failed to process logo');
    }
}

/**
 * POST /api/auto-assets
 * 
 * Body: { url: string, slug?: string }
 * 
 * Returns: { screenshotUrl?: string, logoUrl?: string, errors: string[] }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, slug, type = 'all', delay = 3 } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        const result: AutoAssetsResult = {
            errors: [],
        };

        const domain = extractDomain(url);
        const publicIdBase = slug || domain.replace(/\./g, '-');

        // Fetch screenshot
        if (type === 'all' || type === 'screenshot') {
            console.log('Fetching screenshot for:', url, 'with delay:', delay, 'seconds');
            const screenshotUrl = await fetchScreenshot(url, delay);

            if (screenshotUrl) {
                try {
                    const uploaded = await uploadUrlToCloudinary(
                        screenshotUrl,
                        'programas/screenshots',
                        `${publicIdBase}-screenshot`
                    );
                    result.screenshotUrl = uploaded.secure_url;
                    console.log('Screenshot uploaded:', result.screenshotUrl);
                } catch (error) {
                    console.error('Error uploading screenshot:', error);
                    result.errors.push('No se pudo subir el screenshot a Cloudinary');
                }
            } else {
                result.errors.push('No se pudo capturar el screenshot del sitio');
            }
        }

        // Fetch and process logo
        if (type === 'all' || type === 'icon') {
            console.log('Fetching logo for:', url);
            const logoBuffer = await fetchLogo(url);

            if (logoBuffer) {
                try {
                    const processedLogo = await processLogoWithSafeSpace(logoBuffer);
                    const uploaded = await uploadBufferToCloudinary(
                        processedLogo,
                        'programas/icons',
                        `${publicIdBase}-icon`
                    );
                    result.logoUrl = uploaded.secure_url;
                    console.log('Logo uploaded:', result.logoUrl);
                } catch (error) {
                    console.error('Error processing/uploading logo:', error);
                    result.errors.push('No se pudo procesar el logo');
                }
            } else {
                result.errors.push('No se encontró el logo del sitio');
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Auto-assets error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor', errors: [(error as Error).message] },
            { status: 500 }
        );
    }
}
