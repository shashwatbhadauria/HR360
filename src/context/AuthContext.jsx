import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * Mock user for development — authentication is not the focus of v1.
 */
const MOCK_USER = {
  id: 'hr-admin-1',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@company.com',
  role: 'HR Admin',
  avatar: null, // uses initials
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER); // auto-logged in for dev
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(MOCK_USER);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
