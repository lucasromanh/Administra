import type { Expense, ExpenseCategory } from './types';

// ============================================
// LÓGICA DE GASTOS HOTELEROS
// ============================================

export const getExpensesByCategory = (
  expenses: Expense[],
  category: ExpenseCategory
): Expense[] => {
  return expenses.filter((exp) => exp.category === category);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((acc, exp) => acc + exp.amount, 0);
};

export const getExpensesByStatus = (
  expenses: Expense[],
  status: Expense['status']
): Expense[] => {
  return expenses.filter((exp) => exp.status === status);
};

export const approveExpense = (
  expenses: Expense[],
  expenseId: string
): Expense[] => {
  return expenses.map((exp) =>
    exp.id === expenseId ? { ...exp, status: 'aprobado' as const } : exp
  );
};

export const rejectExpense = (
  expenses: Expense[],
  expenseId: string
): Expense[] => {
  return expenses.map((exp) =>
    exp.id === expenseId ? { ...exp, status: 'rechazado' as const } : exp
  );
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    mantenimiento: 'bg-orange-100 text-orange-800',
    housekeeping: 'bg-blue-100 text-blue-800',
    'f&b': 'bg-green-100 text-green-800',
    lavanderia: 'bg-cyan-100 text-cyan-800',
    rrhh: 'bg-purple-100 text-purple-800',
    'servicios-basicos': 'bg-yellow-100 text-yellow-800',
    'servicios-luz': 'bg-amber-100 text-amber-800',
    'servicios-internet': 'bg-blue-100 text-blue-800',
    'servicios-agua': 'bg-cyan-100 text-cyan-800',
    'servicios-gas': 'bg-orange-100 text-orange-800',
    suministros: 'bg-lime-100 text-lime-800',
    'stock-hotel': 'bg-teal-100 text-teal-800',
    marketing: 'bg-pink-100 text-pink-800',
    tecnologia: 'bg-indigo-100 text-indigo-800',
    administracion: 'bg-gray-100 text-gray-800',
    proveedores: 'bg-red-100 text-red-800',
    otros: 'bg-slate-100 text-slate-800',
  };
  return colors[category];
};

export const getCategoryLabel = (category: ExpenseCategory): string => {
  const labels: Record<ExpenseCategory, string> = {
    mantenimiento: 'Mantenimiento',
    housekeeping: 'Housekeeping',
    'f&b': 'F&B',
    lavanderia: 'Lavandería',
    rrhh: 'RRHH',
    'servicios-basicos': 'Servicios Básicos',
    'servicios-luz': 'Luz/Electricidad',
    'servicios-internet': 'Internet',
    'servicios-agua': 'Agua',
    'servicios-gas': 'Gas',
    suministros: 'Suministros',
    'stock-hotel': 'Stock Hotel',
    marketing: 'Marketing',
    tecnologia: 'Tecnología',
    administracion: 'Administración',
    proveedores: 'Proveedores',
    otros: 'Otros',
  };
  return labels[category];
};
