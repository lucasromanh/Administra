import type { Invoice, Expense, HotelMetrics, ChartDataPoint } from './types';

// ============================================
// CÁLCULOS DE REPORTES HOTELEROS
// ============================================

export const calculateMonthlySales = (invoices: Invoice[]): ChartDataPoint[] => {
  const salesByMonth: Record<string, number> = {};

  invoices.forEach((invoice) => {
    const month = invoice.date.substring(0, 7);
    salesByMonth[month] = (salesByMonth[month] || 0) + invoice.amount;
  });

  return Object.entries(salesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));
};

export const calculateMonthlyExpenses = (expenses: Expense[]): ChartDataPoint[] => {
  const expensesByMonth: Record<string, number> = {};

  expenses.forEach((expense) => {
    const month = expense.date.substring(0, 7);
    expensesByMonth[month] = (expensesByMonth[month] || 0) + expense.amount;
  });

  return Object.entries(expensesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));
};

export const calculateExpensesByCategory = (expenses: Expense[]): ChartDataPoint[] => {
  const categoriesMap: Record<string, number> = {};

  expenses.forEach((expense) => {
    categoriesMap[expense.category] = 
      (categoriesMap[expense.category] || 0) + expense.amount;
  });

  return Object.entries(categoriesMap).map(([name, value]) => ({ 
    name: formatCategoryName(name), 
    value 
  }));
};

export const calculateIncomeVsExpenses = (
  invoices: Invoice[],
  expenses: Expense[]
): ChartDataPoint[] => {
  const monthlyData: Record<string, { ingresos: number; egresos: number }> = {};

  invoices.forEach((invoice) => {
    const month = invoice.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { ingresos: 0, egresos: 0 };
    }
    monthlyData[month].ingresos += invoice.amount;
  });

  expenses.forEach((expense) => {
    const month = expense.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { ingresos: 0, egresos: 0 };
    }
    monthlyData[month].egresos += expense.amount;
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, data]) => ({
      name: formatMonthName(name),
      ingresos: data.ingresos,
      egresos: data.egresos,
      value: data.ingresos - data.egresos,
    }));
};

// Métricas hoteleras específicas
export const calculateHotelMetrics = (
  invoices: Invoice[],
  expenses: Expense[],
  roomsAvailable: number = 50
): HotelMetrics => {
  // Calcular noches vendidas del mes actual
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthInvoices = invoices.filter((inv) => 
    inv.date.startsWith(currentMonth)
  );

  let totalRoomNights = 0;
  let totalRoomRevenue = 0;

  monthInvoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      if (item.roomNights) {
        totalRoomNights += item.roomNights;
        totalRoomRevenue += item.total;
      }
    });
  });

  const totalRevenue = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses
    .filter((exp) => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const daysInMonth = new Date().getDate();
  const totalRoomsAvailable = roomsAvailable * daysInMonth;

  // ADR - Average Daily Rate
  const adr = totalRoomNights > 0 ? totalRoomRevenue / totalRoomNights : 0;

  // Ocupación
  const occupancy = totalRoomsAvailable > 0 
    ? (totalRoomNights / totalRoomsAvailable) * 100 
    : 0;

  // RevPAR - Revenue Per Available Room
  const revpar = totalRoomsAvailable > 0 
    ? totalRoomRevenue / roomsAvailable / daysInMonth
    : 0;

  // GOP - Gross Operating Profit
  const gop = totalRevenue - totalExpenses;

  return {
    adr,
    revpar,
    occupancy,
    gop,
    roomsAvailable,
    roomsSold: totalRoomNights,
    totalRevenue,
    totalExpenses,
  };
};

// Helpers
function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    'mantenimiento': 'Mantenimiento',
    'housekeeping': 'Housekeeping',
    'f&b': 'F&B',
    'lavanderia': 'Lavandería',
    'rrhh': 'RRHH',
    'servicios-basicos': 'Servicios Básicos',
    'marketing': 'Marketing',
    'tecnologia': 'Tecnología',
    'administracion': 'Administración',
    'proveedores': 'Proveedores',
    'otros': 'Otros',
  };
  return names[category] || category;
}

function formatMonthName(month: string): string {
  const [year, monthNum] = month.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(monthNum) - 1]} ${year.slice(2)}`;
}
