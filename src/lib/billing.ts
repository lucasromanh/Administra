import type { Invoice } from './types';

// ============================================
// LÓGICA DE FACTURACIÓN
// ============================================

export const getInvoicesByStatus = (
  invoices: Invoice[],
  status: Invoice['status']
): Invoice[] => {
  return invoices.filter((inv) => inv.status === status);
};

export const calculateTotalPending = (invoices: Invoice[]): number => {
  return invoices
    .filter((inv) => inv.status === 'pendiente' || inv.status === 'vencida')
    .reduce((acc, inv) => acc + inv.amount, 0);
};

export const getOverdueInvoices = (invoices: Invoice[]): Invoice[] => {
  const today = new Date().toISOString().split('T')[0];
  return invoices.filter(
    (inv) => inv.status !== 'pagada' && inv.dueDate < today
  );
};

export const markInvoiceAsPaid = (
  invoices: Invoice[],
  invoiceId: string
): Invoice[] => {
  return invoices.map((inv) =>
    inv.id === invoiceId ? { ...inv, status: 'pagada' as const } : inv
  );
};
