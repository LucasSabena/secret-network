import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inspirations = [
  { title: 'Aventura Dental Arts', url: 'https://aventuradentalarts.com/' },
  { title: 'Doss', url: 'https://www.doss.com/' },
  { title: 'Good Fella', url: 'https://good-fella.com/' },
  { title: 'Dark Node', url: 'https://www.darknode.army/en' }
];

async function fetchScreenshotWithDelay(url: string, delaySeconds: number = 5): Promise<string | null> {
  try {
    const microlinkUrl = new URL('https://api.microlink.io');
    microlinkUrl.searchParams.set('url', url);
    microlinkUrl.searchParams.set('screenshot', 'true');
    microlinkUrl.searchParams.set('meta', 'false');
    microlinkUrl.searchParams.set('viewport.width', '1280');
    microlinkUrl.searchParams.set('viewport.height', '800');
    microlinkUrl.searchParams.set('viewport.deviceScaleFactor', '1');
    microlinkUrl.searchParams.set('waitForTimeout', String(delaySeconds * 1000));

    console.log(`Fetching screenshot for: ${url} with ${delaySeconds}s delay...`);

    const response = await fetch(microlinkUrl.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.error('Microlink API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.screenshot?.url) {
      console.log(`Screenshot captured for: ${url}`);
      return data.data.screenshot.url;
    }

    console.error('Microlink: No screenshot in response');
    return null;
  } catch (error) {
    console.error('Error fetching screenshot:', error);
    return null;
  }
}

async function uploadToCloudinary(imageUrl: string, publicId: string): Promise<string | null> {
  try {
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'inspirations',
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    console.log(`Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function addInspirations() {
  console.log('Starting to add inspirations...\n');

  for (const inspiration of inspirations) {
    console.log(`\nProcessing: ${inspiration.title}`);
    console.log(`URL: ${inspiration.url}`);

    const slug = slugify(inspiration.title);

    const screenshotUrl = await fetchScreenshotWithDelay(inspiration.url, 5);

    if (!screenshotUrl) {
      console.log(`❌ Failed to capture screenshot for ${inspiration.title}`);
      continue;
    }

    const cloudinaryUrl = await uploadToCloudinary(screenshotUrl, `${slug}-screenshot`);

    if (!cloudinaryUrl) {
      console.log(`❌ Failed to upload to Cloudinary for ${inspiration.title}`);
      continue;
    }

    const { data, error } = await supabase
      .from('inspirations')
      .insert({
        title: inspiration.title,
        url: inspiration.url,
        image_url: cloudinaryUrl
      })
      .select()
      .single();

    if (error) {
      console.log(`❌ Database insert error for ${inspiration.title}:`, error.message);
    } else {
      console.log(`✅ Successfully added: ${inspiration.title}`);
      console.log(`   Image URL: ${cloudinaryUrl}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✨ Done!');
}

addInspirations().catch(console.error);