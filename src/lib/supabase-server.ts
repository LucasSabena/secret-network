import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for use in API routes/Server Components
 * Uses service role key for full access (server-side only)
 */
export function supabaseRouteClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        }
    )
}
