import type {
  BankAccount,
  BankMovement,
  Customer,
  Invoice,
  Expense,
  Task,
  KPI,
} from './types';

// === CUENTAS BANCARIAS ===
export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Cuenta Corriente Principal',
    bank: 'Banco de Chile',
    accountNumber: '12345678-9',
    balance: 5420000,
    currency: 'CLP',
  },
  {
    id: '2',
    name: 'Cuenta Vista',
    bank: 'Banco Estado',
    accountNumber: '98765432-1',
    balance: 1250000,
    currency: 'CLP',
  },
];

// === MOVIMIENTOS BANCARIOS ===
export const mockBankMovements: BankMovement[] = [
  {
    id: '1',
    accountId: '1',
    date: '2025-11-15',
    description: 'Pago cliente ABC',
    amount: 500000,
    type: 'ingreso',
    reconciled: true,
  },
  {
    id: '2',
    accountId: '1',
    date: '2025-11-14',
    description: 'Pago arriendo oficina',
    amount: 800000,
    type: 'egreso',
    reconciled: false,
  },
  {
    id: '3',
    accountId: '2',
    date: '2025-11-13',
    description: 'Transferencia interna',
    amount: 200000,
    type: 'ingreso',
    reconciled: true,
  },
];

// === CLIENTES ===
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Empresa ABC Ltda.',
    rut: '76.123.456-7',
    email: 'contacto@abc.cl',
    phone: '+56 9 1234 5678',
    address: 'Av. Providencia 123, Santiago',
  },
  {
    id: '2',
    name: 'Comercial XYZ S.A.',
    rut: '77.654.321-8',
    email: 'ventas@xyz.cl',
    phone: '+56 9 8765 4321',
    address: 'Av. Apoquindo 456, Las Condes',
  },
  {
    id: '3',
    name: 'Servicios DEF SpA',
    rut: '78.987.654-3',
    email: 'info@def.cl',
    phone: '+56 9 5555 6666',
    address: 'Av. Vitacura 789, Vitacura',
  },
];

// === FACTURAS ===
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'F-001-2025',
    customerId: '1',
    customerName: 'Empresa ABC Ltda.',
    date: '2025-11-01',
    dueDate: '2025-11-30',
    amount: 500000,
    status: 'pagada',
    items: [
      {
        id: '1',
        description: 'Servicio de consultoría',
        quantity: 10,
        unitPrice: 50000,
        total: 500000,
      },
    ],
  },
  {
    id: '2',
    number: 'F-002-2025',
    customerId: '2',
    customerName: 'Comercial XYZ S.A.',
    date: '2025-11-10',
    dueDate: '2025-12-10',
    amount: 1200000,
    status: 'pendiente',
    items: [
      {
        id: '2',
        description: 'Desarrollo web',
        quantity: 1,
        unitPrice: 1200000,
        total: 1200000,
      },
    ],
  },
  {
    id: '3',
    number: 'F-003-2025',
    customerId: '3',
    customerName: 'Servicios DEF SpA',
    date: '2025-10-15',
    dueDate: '2025-11-15',
    amount: 750000,
    status: 'vencida',
    items: [
      {
        id: '3',
        description: 'Soporte técnico mensual',
        quantity: 1,
        unitPrice: 750000,
        total: 750000,
      },
    ],
  },
];

// === GASTOS ===
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2025-11-14',
    description: 'Arriendo oficina noviembre',
    amount: 800000,
    category: 'oficina',
    status: 'aprobado',
    createdBy: 'Admin',
  },
  {
    id: '2',
    date: '2025-11-12',
    description: 'Licencias de software',
    amount: 150000,
    category: 'tecnologia',
    status: 'pagado',
    createdBy: 'Admin',
  },
  {
    id: '3',
    date: '2025-11-10',
    description: 'Campaña Google Ads',
    amount: 300000,
    category: 'marketing',
    status: 'pendiente',
    createdBy: 'Marketing',
  },
  {
    id: '4',
    date: '2025-11-08',
    description: 'Luz y agua',
    amount: 85000,
    category: 'servicios',
    status: 'aprobado',
    createdBy: 'Admin',
  },
];

// === TAREAS ===
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar facturas vencidas',
    description: 'Hacer seguimiento a clientes con facturas vencidas',
    dueDate: '2025-11-20',
    priority: 'alta',
    status: 'pendiente',
    assignedTo: 'Admin',
    createdAt: '2025-11-16',
  },
  {
    id: '2',
    title: 'Conciliar cuenta corriente',
    description: 'Realizar conciliación bancaria del mes de octubre',
    dueDate: '2025-11-18',
    priority: 'media',
    status: 'en-progreso',
    assignedTo: 'Contador',
    createdAt: '2025-11-15',
  },
  {
    id: '3',
    title: 'Preparar reporte mensual',
    description: 'Generar reporte de ventas y gastos de noviembre',
    dueDate: '2025-11-30',
    priority: 'media',
    status: 'pendiente',
    assignedTo: 'Admin',
    createdAt: '2025-11-16',
  },
];

// === KPIs ===
export const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Ventas del mes',
    value: 2450000,
    change: 12.5,
    period: 'Noviembre 2025',
  },
  {
    id: '2',
    name: 'Gastos del mes',
    value: 1335000,
    change: -5.2,
    period: 'Noviembre 2025',
  },
  {
    id: '3',
    name: 'Utilidad',
    value: 1115000,
    change: 28.3,
    period: 'Noviembre 2025',
  },
  {
    id: '4',
    name: 'Facturas pendientes',
    value: 1950000,
    change: -8.1,
    period: 'Noviembre 2025',
  },
];
