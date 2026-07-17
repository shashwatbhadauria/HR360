import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/shared/ui/Button';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sarah.mitchell@company.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    const success = await login(email, password);
    if (success) navigate('/');
    else setError('Invalid credentials');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E1E2D 0%, #2D1B69 50%, #1E1E2D 100%)',
      padding: '24px',
    }}>
      {/* Decorative bg elements */}
      <div style={{
        position: 'fixed', top: '-50%', right: '-30%',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-40%', left: '-20%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-brand), #7C3AED)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <Activity size={24} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)',
            letterSpacing: '-0.5px',
          }}>
            HR ThreeSixty
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Employee Monitoring Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)',
              display: 'block', marginBottom: '6px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div>
            <label style={{
              fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)',
              display: 'block', marginBottom: '6px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-secondary)', display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-danger-soft)', color: 'var(--color-danger)',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p style={{
          fontSize: '12px', color: 'var(--color-text-secondary)',
          textAlign: 'center', marginTop: '24px', lineHeight: '18px',
        }}>
          This system monitors work-hours activity to support productivity insights.
          <br />All data is handled per company privacy policy.
        </p>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  height: '44px',
  padding: '0 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s',
};
