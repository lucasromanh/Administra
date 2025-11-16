// ============================================
// LÓGICA DE AUTENTICACIÓN
// ============================================

import { storage, STORAGE_KEYS } from './storage';
import { mockUsers, mockPasswords } from './mockData';
import type { User, AuthState } from './types';

export const authService = {
  // Login
  login: (username: string, password: string): User | null => {
    const user = mockUsers.find((u) => u.username === username);
    
    if (!user) {
      return null;
    }

    const storedPassword = mockPasswords[username];
    if (storedPassword !== password) {
      return null;
    }

    // Guardar sesión
    storage.set(STORAGE_KEYS.AUTH_USER, user);
    storage.set(STORAGE_KEYS.AUTH_TOKEN, `token_${user.id}_${Date.now()}`);
    
    return user;
  },

  // Logout
  logout: (): void => {
    storage.remove(STORAGE_KEYS.AUTH_USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    return storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return user !== null && token !== null;
  },

  // Obtener estado de autenticación
  getAuthState: (): AuthState => {
    const user = authService.getCurrentUser();
    return {
      user,
      isAuthenticated: user !== null,
    };
  },
};
