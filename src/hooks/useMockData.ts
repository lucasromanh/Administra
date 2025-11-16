import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import {
  mockBankAccounts,
  mockBankMovements,
  mockCustomers,
  mockInvoices,
  mockExpenses,
  mockTasks,
  mockKPIs,
  mockHotelMetrics,
} from '@/lib/mockData';
import type {
  BankAccount,
  BankMovement,
  Customer,
  Invoice,
  Expense,
  Task,
  KPI,
  HotelMetrics,
} from '@/lib/types';

// ============================================
// HOOKS PARA DATOS MOCK CON PERSISTENCIA
// ============================================

export const useBankAccounts = () => {
  return useLocalStorage<BankAccount[]>(
    STORAGE_KEYS.BANK_ACCOUNTS,
    mockBankAccounts
  );
};

export const useBankMovements = () => {
  return useLocalStorage<BankMovement[]>(
    STORAGE_KEYS.BANK_MOVEMENTS,
    mockBankMovements
  );
};

export const useCustomers = () => {
  return useLocalStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, mockCustomers);
};

export const useInvoices = () => {
  return useLocalStorage<Invoice[]>(STORAGE_KEYS.INVOICES, mockInvoices);
};

export const useExpenses = () => {
  return useLocalStorage<Expense[]>(STORAGE_KEYS.EXPENSES, mockExpenses);
};

export const useTasks = () => {
  return useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, mockTasks);
};

export const useKPIs = () => {
  return useLocalStorage<KPI[]>(STORAGE_KEYS.KPIS, mockKPIs);
};

export const useHotelMetrics = () => {
  return useLocalStorage<HotelMetrics>(
    STORAGE_KEYS.HOTEL_METRICS,
    mockHotelMetrics
  );
};
