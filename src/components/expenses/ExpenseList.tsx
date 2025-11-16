import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Expense } from '@/lib/types';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge.tsx';
import { Check, X } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onApprove?: (expenseId: string) => void;
  onReject?: (expenseId: string) => void;
}

export function ExpenseList({ expenses, onApprove, onReject }: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusVariant = (status: Expense['status']) => {
    switch (status) {
      case 'aprobado':
        return 'default';
      case 'pendiente':
        return 'secondary';
      case 'rechazado':
        return 'destructive';
      case 'pagado':
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs">Fecha</TableHead>
            <TableHead className="text-xs">Descripción</TableHead>
            <TableHead className="text-xs">Categoría</TableHead>
            <TableHead className="text-xs text-right">Monto</TableHead>
            <TableHead className="text-xs">Creado por</TableHead>
            <TableHead className="text-xs">Estado</TableHead>
            <TableHead className="text-xs text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/50">
              <TableCell className="text-xs">{formatDate(expense.date)}</TableCell>
              <TableCell className="text-sm font-medium">{expense.description}</TableCell>
              <TableCell>
                <ExpenseCategoryBadge category={expense.category} />
              </TableCell>
              <TableCell className="text-sm text-right font-semibold">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{expense.createdBy}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(expense.status)} className="text-xs">
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {expense.status === 'pendiente' && (
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onApprove?.(expense.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReject?.(expense.id)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
