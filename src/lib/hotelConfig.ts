import { storage, STORAGE_KEYS } from './storage';

export interface HotelConfig {
  name: string;
  logo?: string; // Base64 string
}

export const getHotelConfig = (): HotelConfig => {
  const name = storage.get<string>(STORAGE_KEYS.HOTEL_NAME) || 'Hotel Plaza Santiago';
  const logo = storage.get<string>(STORAGE_KEYS.HOTEL_LOGO);
  
  return { name, logo };
};

export const setHotelLogo = (logoBase64: string) => {
  storage.set(STORAGE_KEYS.HOTEL_LOGO, logoBase64);
};

export const setHotelName = (name: string) => {
  storage.set(STORAGE_KEYS.HOTEL_NAME, name);
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
