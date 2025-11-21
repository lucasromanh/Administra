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
  HOTEL_LOGO: 'hotel_logo',
  HOTEL_NAME: 'hotel_name',
  ADMIN_NAME: 'admin_name',
  ADMIN_EMAIL: 'admin_email',
  ADMIN_PHONE: 'admin_phone',
  HOTEL_ADDRESS: 'hotel_address',
  HOTEL_RUT: 'hotel_rut',
  HOTEL_TOTAL_ROOMS: 'hotel_total_rooms',
  HOTEL_ROOM_CATEGORIES: 'hotel_room_categories',
  HOTEL_CHECKIN_TIME: 'hotel_checkin_time',
  HOTEL_CHECKOUT_TIME: 'hotel_checkout_time',
  HOTEL_NIGHTS_SOLD: 'hotel_nights_sold',
  HOTEL_NIGHTS_SOLD_PERIOD: 'hotel_nights_sold_period',
  HOTEL_OCCUPIED_ROOMS: 'hotel_occupied_rooms',
} as const;
