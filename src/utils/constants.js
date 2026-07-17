/**
 * Application-wide constants and enums.
 * Single source of truth for status values, categories, and default thresholds.
 */

// ── Attendance status enums ─────────────────────────────────────────────────
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ON_LEAVE: 'on_leave',
  WFH: 'wfh',
};

export const ATTENDANCE_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.HALF_DAY]: 'Half-day',
  [ATTENDANCE_STATUS.ON_LEAVE]: 'On Leave',
  [ATTENDANCE_STATUS.WFH]: 'Work From Home',
};

// Maps attendance status → design token color name
export const ATTENDANCE_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: 'var(--color-success)',
  [ATTENDANCE_STATUS.ABSENT]: 'var(--color-danger)',
  [ATTENDANCE_STATUS.LATE]: 'var(--color-warning)',
  [ATTENDANCE_STATUS.HALF_DAY]: 'var(--color-warning)',
  [ATTENDANCE_STATUS.ON_LEAVE]: 'var(--color-neutral)',
  [ATTENDANCE_STATUS.WFH]: 'var(--color-info)',
};

// ── App usage category enums ────────────────────────────────────────────────
export const APP_CATEGORY = {
  PRODUCTIVE: 'productive',
  NEUTRAL: 'neutral',
  DISTRACTING: 'distracting',
};

export const APP_CATEGORY_LABELS = {
  [APP_CATEGORY.PRODUCTIVE]: 'Productive',
  [APP_CATEGORY.NEUTRAL]: 'Neutral',
  [APP_CATEGORY.DISTRACTING]: 'Distracting',
};

export const APP_CATEGORY_COLORS = {
  [APP_CATEGORY.PRODUCTIVE]: 'var(--color-success)',
  [APP_CATEGORY.NEUTRAL]: 'var(--color-info)',
  [APP_CATEGORY.DISTRACTING]: 'var(--color-warning)',
};

// ── Hours utilization thresholds ────────────────────────────────────────────
export const UTILIZATION_THRESHOLD = {
  HIGH: 90,   // ≥ 90% → green / on-track
  MEDIUM: 70, // 70–89% → amber / needs attention
  // < 70% → red / under-utilized
};

export const DEFAULT_ALLOTTED_HOURS = {
  daily: 8,
  weekly: 40,
  monthly: 176,
};

// ── Time period filters ─────────────────────────────────────────────────────
export const TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
};

export const TIME_PERIOD_LABELS = {
  [TIME_PERIOD.DAILY]: 'Daily',
  [TIME_PERIOD.WEEKLY]: 'This Week',
  [TIME_PERIOD.MONTHLY]: 'This Month',
  [TIME_PERIOD.QUARTERLY]: 'This Quarter',
};

// ── Productivity score weights (placeholder formula per PRD) ────────────────
export const SCORE_WEIGHTS = {
  HOURS_UTILIZATION: 0.40,
  PRODUCTIVE_APP_RATIO: 0.35,
  ATTENDANCE_CONSISTENCY: 0.25,
};

// ── Sidebar navigation items ───────────────────────────────────────────────
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck' },
  { path: '/employees', label: 'Employees', icon: 'Users' },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
  { path: '/applications', label: 'Applications', icon: 'AppWindow' },
  { path: '/reports', label: 'Reports', icon: 'FileBarChart' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
  { path: '/notifications', label: 'Notifications', icon: 'Bell' },
];

// ── Departments (mock, for filter dropdowns) ────────────────────────────────
export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
];
