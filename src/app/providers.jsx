import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

/**
 * Global providers wrapper.
 * Add new providers (QueryClient, ThemeProvider, etc.) here — not in main.jsx.
 */
export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-dropdown)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: { primary: 'var(--color-success)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  );
}
