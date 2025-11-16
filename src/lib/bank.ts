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

  // Calcular balance actual
  const actualBalance = movements.reduce((acc, mov) => {
    return mov.type === 'ingreso' ? acc + mov.amount : acc - mov.amount;
  }, 0);

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
  };
};

export const calculateAccountBalance = (movements: BankMovement[]): number => {
  return movements.reduce((acc, mov) => {
    return mov.type === 'ingreso' ? acc + mov.amount : acc - mov.amount;
  }, 0);
};
