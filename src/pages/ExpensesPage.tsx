import { Header } from '@/components/layout/Header';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useExpenses } from '@/hooks/useMockData';
import { approveExpense, rejectExpense } from '@/lib/expenses';
import type { Expense } from '@/lib/types';

export function ExpensesPage() {
  const [expenses, setExpenses] = useExpenses();

  const handleApprove = (expenseId: string) => {
    setExpenses(approveExpense(expenses, expenseId));
  };

  const handleReject = (expenseId: string) => {
    setExpenses(rejectExpense(expenses, expenseId));
  };

  const handleCreateExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: String(Date.now()),
    };
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Gastos y Rendiciones"
        description="Administra y aprueba gastos"
      />
      <div className="flex-1 p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Lista de Gastos</h3>
            <ExpenseList
              expenses={expenses}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
          <div>
            <ExpenseForm onSubmit={handleCreateExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}
