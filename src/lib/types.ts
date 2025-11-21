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
  | 'servicios-luz'
  | 'servicios-internet'
  | 'servicios-agua'
  | 'servicios-gas'
  | 'suministros'
  | 'stock-hotel'
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

// === STOCK ===
export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string; // unidad, paquete, caja, litro, etc.
  minStock: number;
  location: string; // Bodega, Piso 1, Lavandería, etc.
  supplier?: string;
  lastRestockDate?: string;
  cost: number; // costo unitario
}

export type StockCategory = 
  | 'amenities' // jabones, shampoo, acondicionador
  | 'ropa-cama' // sábanas, fundas, protectores
  | 'toallas' // toallas baño, mano, piso
  | 'uniformes' // staff uniforms
  | 'limpieza' // productos de limpieza
  | 'lavanderia' // detergentes, suavizantes
  | 'papeleria' // papel higiénico, servilletas
  | 'alimentos' // desayuno, minibar
  | 'bebidas' // minibar, agua
  | 'mantenimiento' // herramientas, repuestos
  | 'otros';

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  date: string;
  reason: string;
  performedBy: string;
  cost?: number;
}

// === EMPLEADOS Y LIQUIDACIONES ===
export interface Employee {
  id: string;
  name: string;
  rut: string;
  position: string;
  department: 'recepcion' | 'housekeeping' | 'mantenimiento' | 'administracion' | 'cocina' | 'bar' | 'seguridad';
  startDate: string;
  salary: number; // sueldo base
  bankAccount?: string;
  email?: string;
  phone?: string;
  status: 'activo' | 'inactivo' | 'licencia' | 'vacaciones';
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // YYYY-MM (año-mes)
  baseSalary: number;
  bonuses: PayrollBonus[];
  advances: number; // adelantos
  deductions: PayrollDeduction[];
  netSalary: number;
  status: 'borrador' | 'calculado' | 'pagado';
  paymentDate?: string;
  createdAt: string;
}

export interface PayrollBonus {
  concept: string; // Aguinaldo, Bono, Horas Extra, Comisión
  amount: number;
  taxable: boolean; // true = imponible, false = no remunerativo
}

export interface PayrollDeduction {
  concept: string; // AFP, Salud, Impuestos, Préstamo
  amount: number;
  type: 'legal' | 'voluntario';
}

// === IMPORTACIÓN CAJA DIARIA ===
export interface CashRegisterImport {
  id: string;
  fecha: string;
  ingreso: string; // INGRESO o descripción
  turno: string; // Mañana, Tarde, Noche
  numeroFactura?: string;
  razonSocial?: string;
  area: string; // RECEPCION, DESAYUNO, RETIRO, etc.
  metodoPago: 'efectivo' | 'cheque' | 'tarjeta-debito' | 'tarjeta-credito' | 'cupon' | 'transferencia';
  total: number;
  cierreCaja?: string;
  creadoPor?: string;
  importedAt: string;
  processed: boolean; // Si ya se registró como gasto/ingreso
}

// === OCUPACIONES Y RESERVAS ===
export interface RoomBooking {
  id: string;
  roomNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  // Clasificación de ventas
  bookingType: 'directo' | 'booking' | 'airbnb' | 'corporativo' | 'agencia' | 'walk-in';
  rateType: 'tarifa-rack' | 'descuento' | 'promocion' | 'corporativa' | 'grupo';
  // Precios
  baseRate: number;
  discountPercent?: number;
  finalRate: number;
  totalAmount: number;
  // Comisiones
  commission?: number;
  commissionPercent?: number;
  netAmount: number;
  // Estado
  status: 'reserva' | 'checked-in' | 'checked-out' | 'cancelada' | 'no-show';
  paymentStatus: 'pendiente' | 'pagado-parcial' | 'pagado-total';
}

// === AUDITORÍA ===
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  module: AuditModule;
  entityId: string;
  entityType: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  description: string;
}

export type AuditAction = 
  | 'crear'
  | 'editar'
  | 'eliminar'
  | 'aprobar'
  | 'rechazar'
  | 'pagar'
  | 'anular';

export type AuditModule = 
  | 'facturas'
  | 'gastos'
  | 'stock'
  | 'empleados'
  | 'liquidaciones'
  | 'banco'
  | 'configuracion';

export interface AuditReport {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  type: 'facturas' | 'gastos' | 'stock' | 'liquidaciones' | 'completo';
  summary: {
    totalIngresos: number;
    totalEgresos: number;
    totalStock: number;
    totalLiquidaciones: number;
    discrepancies: number;
  };
  data: any;
}

// === NAVIGATION ===
export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  active?: boolean;
}
