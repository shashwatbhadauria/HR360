-- Supabase RPC for logging screentime
CREATE OR REPLACE FUNCTION log_screentime(
    p_employee_id VARCHAR,
    p_process_name VARCHAR,
    p_window_title TEXT,
    p_duration_seconds INT
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_category VARCHAR(20);
    v_app_name VARCHAR(100);
    v_date DATE := CURRENT_DATE;
BEGIN
    -- 1. Insert raw log
    INSERT INTO screentime_raw_logs (employee_id, process_name, window_title, duration_seconds)
    VALUES (p_employee_id, p_process_name, p_window_title, p_duration_seconds);

    -- 2. Determine category (default to 'neutral' if not found)
    SELECT category, display_name INTO v_category, v_app_name
    FROM app_classifications 
    WHERE process_name = p_process_name 
    LIMIT 1;

    IF v_category IS NULL THEN
        v_category := 'neutral';
        v_app_name := p_process_name;
    END IF;

    -- 3. Upsert into daily summary
    
    INSERT INTO screentime_daily_summary (employee_id, app_name, category, total_minutes, date)
    VALUES (p_employee_id, v_app_name, v_category, GREATEST(1, p_duration_seconds / 60), CURRENT_DATE)
    ON CONFLICT (employee_id, app_name, date)
    DO UPDATE SET total_minutes = screentime_daily_summary.total_minutes + EXCLUDED.total_minutes;

END;
$$;

-- Seed some basic app classifications for testing
INSERT INTO app_classifications (process_name, display_name, category)
VALUES 
    ('Code.exe', 'VS Code', 'productive'),
    ('chrome.exe', 'Google Chrome', 'neutral'),
    ('slack.exe', 'Slack', 'neutral'),
    ('msedge.exe', 'Microsoft Edge', 'neutral'),
    ('ApplicationFrameHost.exe', 'System', 'neutral'),
    ('explorer.exe', 'File Explorer', 'productive')
ON CONFLICT (process_name) DO NOTHING;
