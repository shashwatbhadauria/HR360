import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/shared/layout/Sidebar';
import Topbar from '@/components/shared/layout/Topbar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Root layout shell — Sidebar + Topbar + page content (Outlet).
 * This wraps all authenticated routes.
 */
export default function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <Topbar onMenuClick={toggleSidebar} />

        <div style={{
          flex: 1,
          overflow: 'auto',
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
