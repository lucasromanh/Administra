// ============================================
// HELPERS PARA PERSISTENCIA EN LOCALSTORAGE
// ============================================

const STORAGE_PREFIX = 'administra_';

export const storage = {
  // Guardar datos
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
    }
  },

  // Obtener datos
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  // Eliminar datos
  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  // Limpiar todo
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

// Claves específicas del sistema
export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  AUTH_TOKEN: 'auth_token',
  BANK_ACCOUNTS: 'bank_accounts',
  BANK_MOVEMENTS: 'bank_movements',
  CUSTOMERS: 'customers',
  INVOICES: 'invoices',
  EXPENSES: 'expenses',
  TASKS: 'tasks',
  KPIS: 'kpis',
  HOTEL_METRICS: 'hotel_metrics',
} as const;
