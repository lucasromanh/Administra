import type { Invoice, Expense, ChartData } from './types';

// ============================================
// CÁLCULOS DE REPORTES
// ============================================

export const calculateMonthlySales = (invoices: Invoice[]): ChartData => {
  // Agrupa por mes
  const salesByMonth: Record<string, number> = {};

  invoices.forEach((invoice) => {
    const month = invoice.date.substring(0, 7); // YYYY-MM
    salesByMonth[month] = (salesByMonth[month] || 0) + invoice.amount;
  });

  const labels = Object.keys(salesByMonth).sort();
  const data = labels.map((month) => salesByMonth[month]);

  return {
    labels,
    datasets: [
      {
        label: 'Ventas',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
    ],
  };
};

export const calculateMonthlyExpenses = (expenses: Expense[]): ChartData => {
  const expensesByMonth: Record<string, number> = {};

  expenses.forEach((expense) => {
    const month = expense.date.substring(0, 7);
    expensesByMonth[month] = (expensesByMonth[month] || 0) + expense.amount;
  });

  const labels = Object.keys(expensesByMonth).sort();
  const data = labels.map((month) => expensesByMonth[month]);

  return {
    labels,
    datasets: [
      {
        label: 'Gastos',
        data,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      },
    ],
  };
};

export const calculateExpensesByCategory = (expenses: Expense[]): ChartData => {
  const categories = [...new Set(expenses.map((e) => e.category))];
  const data = categories.map((cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  );

  return {
    labels: categories,
    datasets: [
      {
        label: 'Gastos por categoría',
        data,
      },
    ],
  };
};
