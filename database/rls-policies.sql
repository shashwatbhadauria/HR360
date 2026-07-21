-- Run this script in the Supabase SQL Editor to allow the web app to read and write data

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE screentime_raw_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screentime_daily_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- 2. Create policies to allow public (anon) access for all operations
-- Note: This is for development purposes so the dashboard works without authentication.

-- Drop existing policies if any to avoid errors
DROP POLICY IF EXISTS "Allow public read access on employees" ON employees;
DROP POLICY IF EXISTS "Allow public insert on employees" ON employees;
DROP POLICY IF EXISTS "Allow public update on employees" ON employees;
DROP POLICY IF EXISTS "Allow public delete on employees" ON employees;

DROP POLICY IF EXISTS "Allow public read access on attendance_records" ON attendance_records;
DROP POLICY IF EXISTS "Allow public insert on attendance_records" ON attendance_records;
DROP POLICY IF EXISTS "Allow public update on attendance_records" ON attendance_records;
DROP POLICY IF EXISTS "Allow public delete on attendance_records" ON attendance_records;

DROP POLICY IF EXISTS "Allow public read access on app_classifications" ON app_classifications;
DROP POLICY IF EXISTS "Allow public insert on app_classifications" ON app_classifications;
DROP POLICY IF EXISTS "Allow public update on app_classifications" ON app_classifications;
DROP POLICY IF EXISTS "Allow public delete on app_classifications" ON app_classifications;

DROP POLICY IF EXISTS "Allow public read access on screentime_raw_logs" ON screentime_raw_logs;
DROP POLICY IF EXISTS "Allow public insert on screentime_raw_logs" ON screentime_raw_logs;
DROP POLICY IF EXISTS "Allow public update on screentime_raw_logs" ON screentime_raw_logs;
DROP POLICY IF EXISTS "Allow public delete on screentime_raw_logs" ON screentime_raw_logs;

DROP POLICY IF EXISTS "Allow public read access on screentime_daily_summary" ON screentime_daily_summary;
DROP POLICY IF EXISTS "Allow public insert on screentime_daily_summary" ON screentime_daily_summary;
DROP POLICY IF EXISTS "Allow public update on screentime_daily_summary" ON screentime_daily_summary;
DROP POLICY IF EXISTS "Allow public delete on screentime_daily_summary" ON screentime_daily_summary;

DROP POLICY IF EXISTS "Allow public read access on alerts" ON alerts;
DROP POLICY IF EXISTS "Allow public insert on alerts" ON alerts;
DROP POLICY IF EXISTS "Allow public update on alerts" ON alerts;
DROP POLICY IF EXISTS "Allow public delete on alerts" ON alerts;

-- Create Policies
CREATE POLICY "Allow public read access on employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert on employees" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on employees" ON employees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on employees" ON employees FOR DELETE USING (true);

CREATE POLICY "Allow public read access on attendance_records" ON attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance_records" ON attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance_records" ON attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on attendance_records" ON attendance_records FOR DELETE USING (true);

CREATE POLICY "Allow public read access on app_classifications" ON app_classifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on app_classifications" ON app_classifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on app_classifications" ON app_classifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on app_classifications" ON app_classifications FOR DELETE USING (true);

CREATE POLICY "Allow public read access on screentime_raw_logs" ON screentime_raw_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on screentime_raw_logs" ON screentime_raw_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on screentime_raw_logs" ON screentime_raw_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on screentime_raw_logs" ON screentime_raw_logs FOR DELETE USING (true);

CREATE POLICY "Allow public read access on screentime_daily_summary" ON screentime_daily_summary FOR SELECT USING (true);
CREATE POLICY "Allow public insert on screentime_daily_summary" ON screentime_daily_summary FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on screentime_daily_summary" ON screentime_daily_summary FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on screentime_daily_summary" ON screentime_daily_summary FOR DELETE USING (true);

CREATE POLICY "Allow public read access on alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on alerts" ON alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on alerts" ON alerts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on alerts" ON alerts FOR DELETE USING (true);
