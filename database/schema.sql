-- HR 360 Database Schema (PostgreSQL)
-- This file defines the core database tables required for the HR 360 management system.

-- 1. Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    avatar_url VARCHAR(255)
);

-- 2. Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave', 'wfh')),
    check_in TIME,
    check_out TIME,
    UNIQUE (employee_id, date)
);

-- 3. Create app_classifications table
CREATE TABLE IF NOT EXISTS app_classifications (
    process_name VARCHAR(100) PRIMARY KEY, -- e.g., 'Code.exe', 'slack.exe'
    display_name VARCHAR(100) NOT NULL,    -- e.g., 'VS Code', 'Slack'
    category VARCHAR(20) NOT NULL CHECK (category IN ('productive', 'neutral', 'distracting'))
);

-- 4. Create screentime_raw_logs table (records uploaded by desktop agent)
CREATE TABLE IF NOT EXISTS screentime_raw_logs (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    process_name VARCHAR(100) NOT NULL,
    window_title TEXT,
    duration_seconds INT NOT NULL, -- e.g., 30 seconds
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create screentime_daily_summary table (for aggregated dashboard metrics)
CREATE TABLE IF NOT EXISTS screentime_daily_summary (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    app_name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('productive', 'neutral', 'distracting')),
    total_minutes INT NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (employee_id, app_name, date)
);

-- 6. Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'danger', 'success')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_raw_logs_employee_time ON screentime_raw_logs(employee_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_daily_summary_employee_date ON screentime_daily_summary(employee_id, date);
