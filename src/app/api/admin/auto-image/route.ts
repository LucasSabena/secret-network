
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleImgScrap } from 'google-img-scrap';
import * as cheerio from 'cheerio';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Priority 2: Google Images Scraper (Library)
async function searchGoogleScraper(query: string): Promise<string | null> {
    try {
        console.log(`[AutoImage] Trying Google Scraper Lib for "${query}"`);
        const result = await GoogleImgScrap({
            keyword: query,
            limit: 5,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });

        if (result && result.length > 0) {
            // Find first valid high-res URL
            const valid = result.find((item: any) => item.url && !item.url.includes('lookaside'));
            return valid ? valid.url : result[0].url;
        }
        return null;
    } catch (e) {
        console.error('[AutoImage] Google Scraper Lib Error:', e);
        return null;
    }
}

// Priority 3: DuckDuckGo Scraper (Fallback)
async function searchDuckDuckGo(query: string): Promise<string | null> {
    try {
        console.log(`[AutoImage] Fallback to DDG for "${query}"`);
        // Simple HTML scraping for "Lite" connectivity
        const simpleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&gbv=1`;
        const simpleRes = await fetch(simpleUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0" }
        });
        const simpleHtml = await simpleRes.text();
        const $ = cheerio.load(simpleHtml);

        let firstImg: string | null = null;
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && src.startsWith('http') && !src.includes('logos') && !firstImg) {
                firstImg = src;
            }
        });
        return firstImg;
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

        // 2. Try Google Scraper Lib
        if (!imageUrl) {
            imageUrl = await searchGoogleScraper(query);
            if (imageUrl) strategyUsed = 'Google Scraper';
        }

        // 3. Try Fallback (HTML Scraping)
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
        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload(imageUrl!, {
                folder: 'blog-auto-images',
                access_mode: 'public',
                resource_type: 'image',
                transformation: [
                    { width: 1200, crop: "limit" },
                    { quality: "auto", fetch_format: "auto" }
                ]
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url,
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
