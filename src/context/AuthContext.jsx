import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Optional: Listen to auth state changes from Supabase (session persistence)
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchAndSetUser(session.user);
        }
      });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          fetchAndSetUser(session.user);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchAndSetUser = async (supabaseUser) => {
    const { data: empData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (empData) {
      setUser({
        id: empData.id,
        name: empData.name,
        email: empData.email,
        role: empData.role,
        avatar: empData.avatar_url,
      });
    } else {
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.email.split('@')[0],
        email: supabaseUser.email,
        role: 'Admin',
        avatar: null,
      });
    }
  };

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return { success: false, message: error.message };
      }
      if (data.user) {
        await fetchAndSetUser(data.user);
      }
      setIsLoading(false);
      return { success: true };
    }

    // Fallback if not configured
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    return { success: false, message: 'Supabase is not configured.' };
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
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
