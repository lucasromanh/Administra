import type { Expense, ExpenseCategory } from './types';

// ============================================
// LÓGICA DE GASTOS
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
    oficina: 'bg-blue-100 text-blue-800',
    servicios: 'bg-green-100 text-green-800',
    marketing: 'bg-purple-100 text-purple-800',
    personal: 'bg-yellow-100 text-yellow-800',
    tecnologia: 'bg-indigo-100 text-indigo-800',
    otros: 'bg-gray-100 text-gray-800',
  };
  return colors[category];
};
