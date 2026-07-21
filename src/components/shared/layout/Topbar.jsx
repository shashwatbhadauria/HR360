import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/utils/formatters';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/attendance': 'Attendance',
  '/employees': 'Employees',
  '/leaderboard': 'Leaderboard',
  '/applications': 'Applications',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
};

function getPageTitle(pathname) {
  if (pathname.startsWith('/employees/') && pathname !== '/employees') {
    return 'Employee Detail';
  }
  return PAGE_TITLES[pathname] || 'HR ThreeSixty';
}

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const title = getPageTitle(location.pathname);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <header style={{
      height: '64px',
      background: '#22333b',
      borderBottom: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    }}>
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
        }}
        className="topbar-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#FFFFFF',
        lineHeight: '26px',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </h1>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        position: 'relative',
        maxWidth: '320px',
        width: '100%',
        height: '40px',
        margin: '0 24px',
      }}
      className="topbar-search"
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-secondary)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search employees, reports..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            padding: '0 16px 0 36px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.05)',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            color: '#FFFFFF',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        />
      </div>


      {/* Notifications */}
      <button
        onClick={() => navigate('/notifications')}
        aria-label="View notifications"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        <Bell size={20} />
        <span style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--color-danger)',
          border: '2px solid var(--color-surface)',
        }} />
      </button>

      {/* Profile dropdown */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px 4px 4px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            {initials}
          </div>
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
          }}
          className="topbar-username"
          >
            {user?.name || 'User'}
          </span>
          <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '200px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-dropdown)',
                overflow: 'hidden',
                zIndex: 50,
              }}
            >
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {user?.role}
                </div>
              </div>
              <div style={{ padding: '4px' }}>
                <DropdownItem icon={<User size={16} />} label="Profile" onClick={() => { setShowProfileMenu(false); }} />
                <DropdownItem icon={<LogOut size={16} />} label="Sign out" onClick={() => { logout(); setShowProfileMenu(false); navigate('/login'); }} />
              </div>
            </div>
          )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .topbar-menu-btn { display: flex !important; }
          .topbar-search { display: none !important; }
          .topbar-sync { display: none !important; }
          .topbar-username { display: none !important; }
        }
        @media (max-width: 1024px) {
          .topbar-sync { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function DropdownItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        width: '100%',
        background: 'none',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: '13px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-sans)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{icon}</span>
      {label}
    </button>
  );
}
