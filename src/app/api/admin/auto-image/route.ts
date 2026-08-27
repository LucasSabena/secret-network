
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function cloudinarySignature(params: Record<string, string>): string {
    const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    return createHash('sha1').update(sorted + process.env.CLOUDINARY_API_SECRET).digest('hex');
}

async function uploadToCloudinary(imageUrl: string): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const timestamp = String(Math.floor(Date.now() / 1000));
    const params: Record<string, string> = {
        folder: 'blog-auto-images',
        timestamp,
        transformation: 'w_1200,c_limit,q_auto,f_auto',
    };
    const signature = cloudinarySignature(params);

    const form = new FormData();
    form.append('file', imageUrl);
    form.append('folder', params.folder);
    form.append('timestamp', timestamp);
    form.append('transformation', params.transformation);
    form.append('api_key', apiKey);
    form.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
    return data.secure_url;
}

// Priority 1: Google Custom Search API (Official)
async function searchGoogleCSE(query: string): Promise<string | null> {
    const apiKey = process.env.GOOGLE_CSE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;

    if (!apiKey || !cx) return null;

    try {
        console.log(`[AutoImage] Tried Google CSE for "${query}"`);
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}&searchType=image&num=1`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        }
        return null;
    } catch (e) {
        console.error('[AutoImage] Google CSE Error:', e);
        return null;
    }
}

// Priority 2: DuckDuckGo Scraper (Fallback)
async function searchDuckDuckGo(query: string): Promise<string | null> {
    try {
        console.log(`[AutoImage] Fallback to DDG for "${query}"`);
        const simpleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&gbv=1`;
        const simpleRes = await fetch(simpleUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0" }
        });
        const simpleHtml = await simpleRes.text();

        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match: RegExpExecArray | null;
        while ((match = imgRegex.exec(simpleHtml)) !== null) {
            const src = match[1];
            if (src.startsWith('http') && !src.includes('logos')) {
                return src;
            }
        }
        return null;
    } catch (e) {
        console.error('[AutoImage] DDG Fallback Error:', e);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Missing query' }, { status: 400 });
        }

        console.log(`[AutoImage] Processing query: "${query}"`);

        // STRATEGY EXECUTION
        let imageUrl: string | null = null;
        let strategyUsed = '';

        // 1. Try Google CSE
        imageUrl = await searchGoogleCSE(query);
        if (imageUrl) strategyUsed = 'Google CSE';

        // 2. Try Fallback (HTML Scraping)
        if (!imageUrl) {
            imageUrl = await searchDuckDuckGo(query);
            if (imageUrl) strategyUsed = 'DDG/Google Lite';
        }

        if (!imageUrl) {
            return NextResponse.json({
                found: false,
                message: 'No image found via any strategy'
            });
        }

        console.log(`[AutoImage] Found image via ${strategyUsed}: ${imageUrl.substring(0, 50)}...`);

        // Upload to Cloudinary
        const secureUrl = await uploadToCloudinary(imageUrl);

        return NextResponse.json({
            success: true,
            url: secureUrl,
            strategy: strategyUsed,
            original_source: imageUrl
        });

    } catch (error: any) {
        console.error('[AutoImage] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
