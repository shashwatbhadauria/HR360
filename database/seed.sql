-- HR 360 Database Initial Seed Data
-- This file populates the database tables with mock employees, default app classifications, and initial records matching the frontend mocks.

-- 1. Seed employees
INSERT INTO employees (id, name, email, department, role, status, join_date) VALUES
('emp-001', 'Alex Thompson', 'alex.thompson@company.com', 'Engineering', 'Senior Developer', 'active', '2023-03-15'),
('emp-002', 'Priya Sharma', 'priya.sharma@company.com', 'Engineering', 'Full Stack Developer', 'active', '2022-08-01'),
('emp-003', 'Marcus Chen', 'marcus.chen@company.com', 'Design', 'UI/UX Designer', 'active', '2023-06-20'),
('emp-004', 'Sarah Williams', 'sarah.williams@company.com', 'Marketing', 'Marketing Manager', 'active', '2021-11-10'),
('emp-005', 'James O''Brien', 'james.obrien@company.com', 'Sales', 'Account Executive', 'active', '2023-01-05'),
('emp-006', 'Aisha Patel', 'aisha.patel@company.com', 'Engineering', 'DevOps Engineer', 'active', '2022-04-18'),
('emp-007', 'David Kim', 'david.kim@company.com', 'Finance', 'Financial Analyst', 'active', '2023-09-01'),
('emp-008', 'Elena Rodriguez', 'elena.rodriguez@company.com', 'Human Resources', 'HR Coordinator', 'active', '2022-02-14'),
('emp-009', 'Ryan Foster', 'ryan.foster@company.com', 'Engineering', 'Backend Developer', 'active', '2023-07-22'),
('emp-010', 'Mia Johnson', 'mia.johnson@company.com', 'Design', 'Product Designer', 'active', '2022-10-03'),
('emp-011', 'Chris Anderson', 'chris.anderson@company.com', 'Customer Support', 'Support Lead', 'active', '2021-06-15'),
('emp-012', 'Nadia Hassan', 'nadia.hassan@company.com', 'Engineering', 'QA Engineer', 'active', '2023-04-10'),
('emp-013', 'Tyler Brooks', 'tyler.brooks@company.com', 'Sales', 'Sales Representative', 'active', '2022-12-01'),
('emp-014', 'Olivia Wang', 'olivia.wang@company.com', 'Marketing', 'Content Strategist', 'on_leave', '2023-02-28'),
('emp-015', 'Daniel Martinez', 'daniel.martinez@company.com', 'Operations', 'Operations Manager', 'active', '2021-09-20'),
('emp-016', 'Sophie Turner', 'sophie.turner@company.com', 'Engineering', 'Frontend Developer', 'active', '2023-05-15'),
('emp-017', 'Raj Kapoor', 'raj.kapoor@company.com', 'Engineering', 'Tech Lead', 'active', '2021-03-01'),
('emp-018', 'Emma Clark', 'emma.clark@company.com', 'Finance', 'Accountant', 'active', '2022-07-10'),
('emp-019', 'Lucas Nguyen', 'lucas.nguyen@company.com', 'Design', 'Graphic Designer', 'active', '2023-08-14'),
('emp-020', 'Isabella Scott', 'isabella.scott@company.com', 'Customer Support', 'Support Specialist', 'active', '2022-11-22'),
('emp-021', 'Kevin Wright', 'kevin.wright@company.com', 'Sales', 'Sales Manager', 'active', '2021-05-08'),
('emp-022', 'Hannah Lee', 'hannah.lee@company.com', 'Human Resources', 'Recruiter', 'active', '2023-10-01'),
('emp-023', 'Andre Jackson', 'andre.jackson@company.com', 'Engineering', 'Mobile Developer', 'inactive', '2022-01-18'),
('emp-024', 'Rachel Green', 'rachel.green@company.com', 'Marketing', 'Digital Marketer', 'active', '2023-03-22'),
('emp-025', 'Tom Baker', 'tom.baker@company.com', 'Operations', 'Logistics Coordinator', 'active', '2022-06-05')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed default app classifications
INSERT INTO app_classifications (process_name, display_name, category) VALUES
('Code.exe', 'VS Code', 'productive'),
('Cursor.exe', 'Cursor IDE', 'productive'),
('idea64.exe', 'IntelliJ IDEA', 'productive'),
('slack.exe', 'Slack', 'neutral'),
('chrome.exe', 'Google Chrome', 'neutral'),
('msedge.exe', 'Microsoft Edge', 'neutral'),
('Figma.exe', 'Figma', 'productive'),
('Jira.exe', 'Jira', 'productive'),
('EXCEL.EXE', 'Microsoft Excel', 'productive'),
('WINWORD.EXE', 'Microsoft Word', 'productive'),
('Zoom.exe', 'Zoom', 'neutral'),
('Teams.exe', 'Microsoft Teams', 'neutral'),
('youtube.exe', 'YouTube', 'distracting'),
('twitter.exe', 'Twitter/X', 'distracting'),
('reddit.exe', 'Reddit', 'distracting'),
('spotify.exe', 'Spotify', 'neutral'),
('notion.exe', 'Notion', 'productive'),
('gmail.exe', 'Gmail', 'productive')
ON CONFLICT (process_name) DO NOTHING;

-- 3. Seed default alerts
INSERT INTO alerts (id, type, message, timestamp, read) VALUES
('alert-1', 'warning', '3 employees below 60% utilization for 3+ consecutive days', NOW() - INTERVAL '2 hours', false),
('alert-2', 'info', 'Engineering team averaged 88.5% utilization this week — up 3.2%', NOW() - INTERVAL '4 hours', false),
('alert-3', 'warning', '5 employees logged under 70% hours this week', NOW() - INTERVAL '1 day', true),
('alert-4', 'danger', 'Andre Jackson has been inactive for 5+ working days', NOW() - INTERVAL '1 day', false),
('alert-5', 'success', 'Raj Kapoor achieved 100% utilization for 4 consecutive weeks', NOW() - INTERVAL '2 days', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed attendance records for the last 14 days for all employees
INSERT INTO attendance_records (employee_id, date, status, check_in, check_out)
SELECT 
    e.id,
    d.date::date,
    (ARRAY['present', 'present', 'present', 'present', 'late', 'wfh', 'absent', 'on_leave', 'half_day'])[floor(random() * 9 + 1)::int] AS status,
    '09:00:00'::time + (random() * interval '60 minutes') AS check_in,
    '17:00:00'::time + (random() * interval '60 minutes') AS check_out
FROM employees e
CROSS JOIN generate_series(CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE, '1 day'::interval) d(date)
WHERE extract(dow from d.date) NOT IN (0, 6) -- skip weekends
ON CONFLICT (employee_id, date) DO NOTHING;

-- 5. Seed daily app summaries for the last 14 days
INSERT INTO screentime_daily_summary (employee_id, app_name, category, total_minutes, date)
SELECT
    e.id,
    c.display_name,
    c.category,
    (random() * 120 + 20)::int AS total_minutes,
    d.date::date
FROM employees e
CROSS JOIN (
    SELECT DISTINCT ON (category) display_name, category 
    FROM app_classifications 
    ORDER BY category, random()
) c
CROSS JOIN generate_series(CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE, '1 day'::interval) d(date)
WHERE extract(dow from d.date) NOT IN (0, 6)
ON CONFLICT (employee_id, app_name, date) DO NOTHING;

