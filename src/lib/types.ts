// ============================================
// TIPOS GLOBALES DEL SISTEMA ADMINISTRA - HOTELERÍA
// ============================================

// === AUTH ===
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin';
  email?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// === BANKING ===
export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'corriente' | 'vista' | 'ahorro';
}

export interface BankMovement {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  category: 'deposito' | 'pos' | 'transferencia' | 'fee' | 'comision' | 'otro';
  reconciled: boolean;
  reference?: string;
}

export interface ReconciliationResult {
  matched: number;
  unmatched: number;
  differences: ReconciliationDifference[];
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
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
  type: 'agencia' | 'ota' | 'empresa' | 'evento' | 'convenio';
  contactPerson?: string;
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
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  roomNights?: number;
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
  supplier?: string;
  invoiceNumber?: string;
}

export type ExpenseCategory = 
  | 'mantenimiento'
  | 'housekeeping' 
  | 'f&b'
  | 'lavanderia'
  | 'rrhh'
  | 'servicios-basicos'
  | 'marketing'
  | 'tecnologia'
  | 'administracion'
  | 'proveedores'
  | 'otros';

// === REPORTS ===
export interface KPI {
  id: string;
  name: string;
  value: number;
  change: number;
  period: string;
  format?: 'currency' | 'percentage' | 'number';
}

export interface HotelMetrics {
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
  occupancy: number; // Porcentaje de ocupación
  gop: number; // Gross Operating Profit
  roomsAvailable: number;
  roomsSold: number;
  totalRevenue: number;
  totalExpenses: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  ingresos?: number;
  egresos?: number;
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
  category: 'auditoria' | 'conciliacion' | 'reporte' | 'pago' | 'vencimiento' | 'otro';
}

// === NAVIGATION ===
export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  active?: boolean;
}
