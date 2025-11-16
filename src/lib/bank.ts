import type { BankMovement, ReconciliationResult } from './types';

// ============================================
// LÓGICA DE CONCILIACIÓN BANCARIA
// ============================================

export const reconcileMovements = (
  movements: BankMovement[],
  expectedBalance: number
): ReconciliationResult => {
  const matched = movements.filter((m) => m.reconciled).length;
  const unmatched = movements.filter((m) => !m.reconciled).length;

  // Calcular totales
  const totalIngresos = movements
    .filter((m) => m.type === 'ingreso')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalEgresos = movements
    .filter((m) => m.type === 'egreso')
    .reduce((acc, m) => acc + m.amount, 0);

  const actualBalance = totalIngresos - totalEgresos;
  const difference = actualBalance - expectedBalance;

  const differences = difference !== 0 ? [
    {
      id: '1',
      description: 'Diferencia en balance',
      expectedAmount: expectedBalance,
      actualAmount: actualBalance,
      difference,
    },
  ] : [];

  return {
    matched,
    unmatched,
    differences,
    totalIngresos,
    totalEgresos,
    balance: actualBalance,
  };
};

export const calculateAccountBalance = (movements: BankMovement[]): number => {
  return movements.reduce((acc, mov) => {
    return mov.type === 'ingreso' ? acc + mov.amount : acc - mov.amount;
  }, 0);
};

export const getCategoryLabel = (category: BankMovement['category']): string => {
  const labels: Record<BankMovement['category'], string> = {
    deposito: 'Depósito',
    pos: 'POS',
    transferencia: 'Transferencia',
    fee: 'Fee Bancario',
    comision: 'Comisión',
    otro: 'Otro',
  };
  return labels[category];
};

export const getCategoryColor = (category: BankMovement['category']): string => {
  const colors: Record<BankMovement['category'], string> = {
    deposito: 'bg-green-100 text-green-800',
    pos: 'bg-blue-100 text-blue-800',
    transferencia: 'bg-purple-100 text-purple-800',
    fee: 'bg-orange-100 text-orange-800',
    comision: 'bg-red-100 text-red-800',
    otro: 'bg-gray-100 text-gray-800',
  };
  return colors[category];
};
