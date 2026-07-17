/**
 * App usage data service.
 */
import appUsageMock from '@/mocks/appUsage.json';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getOrgAppUsage() {
  await delay(500);
  return appUsageMock.orgWide;
}

export async function getCategoryTrend() {
  await delay(400);
  return appUsageMock.categoryTrend;
}

export async function getEmployeeAppUsage(employeeId) {
  await delay(400);
  // Return a subset of org apps as if it were employee-specific
  return appUsageMock.orgWide.slice(0, 8).map(app => ({
    ...app,
    totalMinutes: Math.round(app.totalMinutes / (5 + Math.random() * 10)),
  }));
}
