import { storage, STORAGE_KEYS } from './storage';

export interface RoomCategory {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
}

export interface HotelConfig {
  name: string;
  logo?: string; // Base64 string
  adminName: string;
  email: string;
  phone: string;
  address: string;
  rut: string;
  // Configuración operacional
  totalRooms: number;
  roomCategories: RoomCategory[];
  checkinTime: string;
  checkoutTime: string;
  nightsSold: number;
}

export const getHotelConfig = (): HotelConfig => {
  const name = storage.get<string>(STORAGE_KEYS.HOTEL_NAME, 'Mi Hotel');
  const logo = storage.get<string>(STORAGE_KEYS.HOTEL_LOGO, '');
  const adminName = storage.get<string>(STORAGE_KEYS.ADMIN_NAME, 'Administrador');
  const email = storage.get<string>(STORAGE_KEYS.ADMIN_EMAIL, '');
  const phone = storage.get<string>(STORAGE_KEYS.ADMIN_PHONE, '');
  const address = storage.get<string>(STORAGE_KEYS.HOTEL_ADDRESS, '');
  const rut = storage.get<string>(STORAGE_KEYS.HOTEL_RUT, '');
  const totalRooms = storage.get<number>(STORAGE_KEYS.HOTEL_TOTAL_ROOMS, 50);
  const roomCategories = storage.get<RoomCategory[]>(STORAGE_KEYS.HOTEL_ROOM_CATEGORIES, [
    { id: '1', name: 'Estándar', quantity: 20, basePrice: 50000 },
    { id: '2', name: 'Superior', quantity: 20, basePrice: 75000 },
    { id: '3', name: 'Suite', quantity: 10, basePrice: 120000 },
  ]);
  const checkinTime = storage.get<string>(STORAGE_KEYS.HOTEL_CHECKIN_TIME, '15:00');
  const checkoutTime = storage.get<string>(STORAGE_KEYS.HOTEL_CHECKOUT_TIME, '12:00');
  const nightsSold = storage.get<number>(STORAGE_KEYS.HOTEL_NIGHTS_SOLD, 0);
  
  return { 
    name, logo, adminName, email, phone, address, rut,
    totalRooms, roomCategories, checkinTime, checkoutTime, nightsSold
  };
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

export const setTotalRooms = (total: number) => {
  storage.set(STORAGE_KEYS.HOTEL_TOTAL_ROOMS, total);
};

export const setRoomCategories = (categories: RoomCategory[]) => {
  storage.set(STORAGE_KEYS.HOTEL_ROOM_CATEGORIES, categories);
};

export const setCheckinTime = (time: string) => {
  storage.set(STORAGE_KEYS.HOTEL_CHECKIN_TIME, time);
};

export const setCheckoutTime = (time: string) => {
  storage.set(STORAGE_KEYS.HOTEL_CHECKOUT_TIME, time);
};

export const setNightsSold = (nights: number) => {
  storage.set(STORAGE_KEYS.HOTEL_NIGHTS_SOLD, nights);
};

export const updateHotelConfig = (config: Partial<HotelConfig>) => {
  if (config.name !== undefined) setHotelName(config.name);
  if (config.logo !== undefined) setHotelLogo(config.logo);
  if (config.adminName !== undefined) setAdminName(config.adminName);
  if (config.email !== undefined) setAdminEmail(config.email);
  if (config.phone !== undefined) setAdminPhone(config.phone);
  if (config.address !== undefined) setHotelAddress(config.address);
  if (config.rut !== undefined) setHotelRUT(config.rut);
  if (config.totalRooms !== undefined) setTotalRooms(config.totalRooms);
  if (config.roomCategories !== undefined) setRoomCategories(config.roomCategories);
  if (config.checkinTime !== undefined) setCheckinTime(config.checkinTime);
  if (config.checkoutTime !== undefined) setCheckoutTime(config.checkoutTime);
  if (config.nightsSold !== undefined) setNightsSold(config.nightsSold);
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
