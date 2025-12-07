-- API Usage Tracking for rate-limited free APIs
-- Tracks daily usage to show remaining requests

CREATE TABLE IF NOT EXISTS api_usage (
    id SERIAL PRIMARY KEY,
    api_name TEXT NOT NULL,           -- 'microlink', 'google_favicons', etc.
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    request_count INTEGER NOT NULL DEFAULT 0,
    daily_limit INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(api_name, date)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_api_usage_lookup ON api_usage(api_name, date);

-- RLS Policies
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Allow read for authenticated users
CREATE POLICY "Allow read for authenticated" ON api_usage
    FOR SELECT TO authenticated USING (true);

-- Allow insert/update for authenticated users
CREATE POLICY "Allow write for authenticated" ON api_usage
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to increment usage and return remaining
CREATE OR REPLACE FUNCTION increment_api_usage(p_api_name TEXT, p_daily_limit INTEGER DEFAULT 50)
RETURNS TABLE(remaining INTEGER, used INTEGER, limit_reached BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Insert or update the usage record
    INSERT INTO api_usage (api_name, date, request_count, daily_limit)
    VALUES (p_api_name, CURRENT_DATE, 1, p_daily_limit)
    ON CONFLICT (api_name, date) 
    DO UPDATE SET 
        request_count = api_usage.request_count + 1,
        updated_at = NOW()
    RETURNING request_count INTO v_count;

    RETURN QUERY SELECT 
        GREATEST(p_daily_limit - v_count, 0) AS remaining,
        v_count AS used,
        (v_count >= p_daily_limit) AS limit_reached;
END;
$$;

-- Function to get current usage
CREATE OR REPLACE FUNCTION get_api_usage(p_api_name TEXT)
RETURNS TABLE(remaining INTEGER, used INTEGER, daily_limit INTEGER, reset_at TIMESTAMPTZ)
LANGUAGE plpgsql
AS $$
DECLARE
    v_record api_usage%ROWTYPE;
BEGIN
    SELECT * INTO v_record
    FROM api_usage
    WHERE api_name = p_api_name AND date = CURRENT_DATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            50 AS remaining,
            0 AS used,
            50 AS daily_limit,
            (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ AS reset_at;
    ELSE
        RETURN QUERY SELECT 
            GREATEST(v_record.daily_limit - v_record.request_count, 0) AS remaining,
            v_record.request_count AS used,
            v_record.daily_limit AS daily_limit,
            (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ AS reset_at;
    END IF;
END;
$$;
