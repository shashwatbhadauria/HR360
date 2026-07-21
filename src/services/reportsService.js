/**
 * Reports service — mock report generation and history.
 */
import { isSupabaseConfigured } from './supabaseClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockReportHistory = [
  { id: 'rpt-001', title: 'Monthly Productivity Report — June 2026', scope: 'Organization', dateRange: 'Jun 1 – Jun 30', createdAt: '2026-07-01T10:00:00Z', format: 'PDF', status: 'completed' },
  { id: 'rpt-002', title: 'Engineering Team Weekly Report', scope: 'Engineering', dateRange: 'Jun 24 – Jun 30', createdAt: '2026-07-01T09:00:00Z', format: 'CSV', status: 'completed' },
  { id: 'rpt-003', title: 'Q2 Attendance Summary', scope: 'Organization', dateRange: 'Apr 1 – Jun 30', createdAt: '2026-07-02T14:00:00Z', format: 'PDF', status: 'completed' },
  { id: 'rpt-004', title: 'Individual Report — Raj Kapoor', scope: 'Individual', dateRange: 'Jun 1 – Jun 30', createdAt: '2026-07-03T11:00:00Z', format: 'PDF', status: 'completed' },
];

export async function getReportHistory() {
  if (isSupabaseConfigured) {
    console.info('[Supabase] Fetching report history (stored locally).');
  }
  await delay(400);
  return mockReportHistory;
}

export async function generateReport(params) {
  if (isSupabaseConfigured) {
    console.info(`[Supabase] Generating ${params.scope} report.`);
  }
  await delay(1500); // simulate generation time
  const id = `rpt-${String(mockReportHistory.length + 1).padStart(3, '0')}`;
  const report = {
    id,
    title: `${params.scope} Report — ${params.dateRange || 'Custom'}`,
    scope: params.scope,
    dateRange: params.dateRange,
    createdAt: new Date().toISOString(),
    format: params.format || 'PDF',
    status: 'completed',
  };
  mockReportHistory.unshift(report);
  return report;
}

