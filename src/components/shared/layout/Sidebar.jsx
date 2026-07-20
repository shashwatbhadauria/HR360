import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Trophy,
  AppWindow,
  FileBarChart,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ICON_MAP = {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Trophy,
  AppWindow,
  FileBarChart,
  Settings,
  Bell,
};



const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck' },
  { path: '/employees', label: 'Employees', icon: 'Users' },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
  { path: '/applications', label: 'Applications', icon: 'AppWindow' },
  { path: '/reports', label: 'Reports', icon: 'FileBarChart' },
];

const NAV_BOTTOM = [
  { path: '/settings', label: 'Settings', icon: 'Settings' },
  { path: '/notifications', label: 'Notifications', icon: 'Bell' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? (isMobile ? 0 : 72) : 256 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          background: 'var(--color-sidebar-bg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo / Brand */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 20px',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--color-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Activity size={18} color="#fff" style={{ position: 'relative', zIndex: 1 }} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                style={{ whiteSpace: 'nowrap' }}
              >
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                  HR ThreeSixty
                </div>
                <div style={{ color: 'var(--color-sidebar-text)', fontSize: '11px', marginTop: '-2px' }}>
                  Employee Monitor
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          <div style={{ padding: collapsed ? '0' : '0 8px', marginBottom: '8px' }}>
            {!collapsed && (
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.3)' }}>
                Menu
              </span>
            )}
          </div>
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              collapsed={collapsed}
              active={isActive(item.path)}
              onNavigate={isMobile ? onToggle : undefined}
            />
          ))}

          <div style={{ flex: 1 }} />

          {/* Bottom nav */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_BOTTOM.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                collapsed={collapsed}
                active={isActive(item.path)}
                onNavigate={isMobile ? onToggle : undefined}
              />
            ))}
          </div>
        </nav>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-end',
              padding: collapsed ? '0' : '0 20px',
              background: 'none',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--color-sidebar-text)',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-sidebar-text)'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </motion.aside>
    </>
  );
}

function SidebarLink({ item, collapsed, active, onNavigate }) {
  const Icon = ICON_MAP[item.icon];

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: collapsed ? '10px 0' : '10px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
        background: active ? 'var(--color-sidebar-active-bg)' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: active ? 500 : 400,
        transition: 'background 0.15s, color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'var(--color-sidebar-hover)';
          e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--color-sidebar-text)';
        }
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '20px',
            borderRadius: '0 4px 4px 0',
            background: 'var(--color-brand)',
          }}
        />
      )}
      {Icon && <Icon size={20} style={{ flexShrink: 0 }} />}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}
