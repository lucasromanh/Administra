import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

// ============================================
// HOOK GENÉRICO PARA LOCALSTORAGE
// ============================================

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite pasar una función como en useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  // Sincronizar con localStorage cuando cambia en otra pestaña
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `administra_${key}` && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
