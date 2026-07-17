import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';

// ── Lazy-loaded page components (route-level code splitting) ──────────────
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const AttendancePage = lazy(() => import('@/pages/attendance/AttendancePage'));
const EmployeeDirectoryPage = lazy(() => import('@/pages/employees/EmployeeDirectoryPage'));
const EmployeeDetailPage = lazy(() => import('@/pages/employees/EmployeeDetailPage'));
const LeaderboardPage = lazy(() => import('@/pages/leaderboard/LeaderboardPage'));
const ApplicationsPage = lazy(() => import('@/pages/applications/ApplicationsPage'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

/**
 * Page loading fallback — lightweight skeleton, not a spinner.
 */
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-brand)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: '13px' }}>Loading…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'dashboard', element: <Navigate to="/" replace /> },
      { path: 'attendance', element: withSuspense(AttendancePage) },
      { path: 'employees', element: withSuspense(EmployeeDirectoryPage) },
      { path: 'employees/:id', element: withSuspense(EmployeeDetailPage) },
      { path: 'leaderboard', element: withSuspense(LeaderboardPage) },
      { path: 'applications', element: withSuspense(ApplicationsPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
    ],
  },
]);
