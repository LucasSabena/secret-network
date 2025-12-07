import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '@/lib/supabase-server';

/**
 * GET /api/api-usage
 * Returns the current usage for tracked APIs (microlink screenshots)
 */
export async function GET() {
    try {
        const supabase = supabaseRouteClient();

        // Get usage for microlink
        const { data, error } = await supabase
            .rpc('get_api_usage', { p_api_name: 'microlink' });

        if (error) {
            console.error('Error fetching API usage:', error);
            // Return default values if table doesn't exist yet
            return NextResponse.json({
                microlink: {
                    remaining: 50,
                    used: 0,
                    daily_limit: 50,
                    reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            });
        }

        const usage = data?.[0] || { remaining: 50, used: 0, daily_limit: 50 };

        return NextResponse.json({
            microlink: {
                remaining: usage.remaining,
                used: usage.used,
                daily_limit: usage.daily_limit,
                reset_at: usage.reset_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        });
    } catch (error) {
        console.error('API usage error:', error);
        return NextResponse.json({
            microlink: {
                remaining: 50,
                used: 0,
                daily_limit: 50,
                reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        });
    }
}
