import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import type { User, AuthState } from '@/lib/types';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => 
    authService.getAuthState()
  );

  useEffect(() => {
    // Verificar autenticación al cargar
    setAuthState(authService.getAuthState());
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = authService.login(username, password);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setAuthState({ user: null, isAuthenticated: false });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
