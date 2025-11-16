// ============================================
// TIPOS GLOBALES DEL SISTEMA ADMINISTRA
// ============================================

// === BANKING ===
export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

export interface BankMovement {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  reconciled: boolean;
}

export interface ReconciliationResult {
  matched: number;
  unmatched: number;
  differences: ReconciliationDifference[];
}

export interface ReconciliationDifference {
  id: string;
  description: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
}

// === BILLING ===
export interface Customer {
  id: string;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// === EXPENSES ===
export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'pagado';
  receipt?: string;
  createdBy: string;
}

export type ExpenseCategory = 
  | 'oficina' 
  | 'servicios' 
  | 'marketing' 
  | 'personal' 
  | 'tecnologia' 
  | 'otros';

// === REPORTS ===
export interface KPI {
  id: string;
  name: string;
  value: number;
  change: number;
  period: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

// === TASKS ===
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'baja' | 'media' | 'alta';
  status: 'pendiente' | 'en-progreso' | 'completada';
  assignedTo?: string;
  createdAt: string;
}

// === NAVIGATION ===
export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  active?: boolean;
}
