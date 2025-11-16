import { storage, STORAGE_KEYS } from './storage';

export interface HotelConfig {
  name: string;
  logo?: string; // Base64 string
  adminName: string;
  email: string;
  phone: string;
  address: string;
  rut: string;
}

export const getHotelConfig = (): HotelConfig => {
  const name = storage.get<string>(STORAGE_KEYS.HOTEL_NAME) || 'Mi Hotel';
  const logo = storage.get<string>(STORAGE_KEYS.HOTEL_LOGO);
  const adminName = storage.get<string>(STORAGE_KEYS.ADMIN_NAME) || 'Administrador';
  const email = storage.get<string>(STORAGE_KEYS.ADMIN_EMAIL) || '';
  const phone = storage.get<string>(STORAGE_KEYS.ADMIN_PHONE) || '';
  const address = storage.get<string>(STORAGE_KEYS.HOTEL_ADDRESS) || '';
  const rut = storage.get<string>(STORAGE_KEYS.HOTEL_RUT) || '';
  
  return { name, logo, adminName, email, phone, address, rut };
};

export const setHotelLogo = (logoBase64: string) => {
  storage.set(STORAGE_KEYS.HOTEL_LOGO, logoBase64);
};

export const setHotelName = (name: string) => {
  storage.set(STORAGE_KEYS.HOTEL_NAME, name);
};

export const setAdminName = (name: string) => {
  storage.set(STORAGE_KEYS.ADMIN_NAME, name);
};

export const setAdminEmail = (email: string) => {
  storage.set(STORAGE_KEYS.ADMIN_EMAIL, email);
};

export const setAdminPhone = (phone: string) => {
  storage.set(STORAGE_KEYS.ADMIN_PHONE, phone);
};

export const setHotelAddress = (address: string) => {
  storage.set(STORAGE_KEYS.HOTEL_ADDRESS, address);
};

export const setHotelRUT = (rut: string) => {
  storage.set(STORAGE_KEYS.HOTEL_RUT, rut);
};

export const updateHotelConfig = (config: Partial<HotelConfig>) => {
  if (config.name !== undefined) setHotelName(config.name);
  if (config.logo !== undefined) setHotelLogo(config.logo);
  if (config.adminName !== undefined) setAdminName(config.adminName);
  if (config.email !== undefined) setAdminEmail(config.email);
  if (config.phone !== undefined) setAdminPhone(config.phone);
  if (config.address !== undefined) setHotelAddress(config.address);
  if (config.rut !== undefined) setHotelRUT(config.rut);
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
