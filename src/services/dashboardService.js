/**
 * Dashboard data service — fetches KPIs, trends, department comparison, and alerts.
 * Falls back to mock data when no backend is available.
 */
import dashboardMock from '@/mocks/dashboard.json';

// Simulate async fetch with realistic delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardSummary() {
  await delay(600);
  return dashboardMock;
}

export async function getDashboardKpis() {
  await delay(400);
  return dashboardMock.kpis;
}

export async function getHoursTrend() {
  await delay(500);
  return dashboardMock.hoursTrend;
}

export async function getDepartmentComparison() {
  await delay(450);
  return dashboardMock.departmentComparison;
}

export async function getAppCategorySplit() {
  await delay(350);
  return dashboardMock.appCategorySplit;
}

export async function getAlerts() {
  await delay(300);
  return dashboardMock.alerts;
}
