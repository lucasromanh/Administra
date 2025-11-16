import { Header } from '@/components/layout/Header';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/hooks/useMockData';
import { approveExpense, rejectExpense } from '@/lib/expenses';
import { generateExpensesReport } from '@/lib/reports-pdf';
import { Download, Plus } from 'lucide-react';
import type { Expense } from '@/lib/types';

export function ExpensesPage() {
  const [expenses, setExpenses] = useExpenses();

  const handleDownloadReport = () => {
    generateExpensesReport(expenses);
  };

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
        actions={
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Descargar Informe
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  Nuevo Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                </DialogHeader>
                <ExpenseForm onSubmit={handleCreateExpense} />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="px-6 py-4 w-full">
        <ExpenseList
          expenses={expenses}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
