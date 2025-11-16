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
    return new Date(date).toLocaleDateString('es-CL');
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>Creado por</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{formatDate(expense.date)}</TableCell>
            <TableCell className="font-medium">{expense.description}</TableCell>
            <TableCell>
              <ExpenseCategoryBadge category={expense.category} />
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(expense.amount)}
            </TableCell>
            <TableCell>{expense.createdBy}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(expense.status)}>
                {expense.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {expense.status === 'pendiente' && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApprove?.(expense.id)}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReject?.(expense.id)}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
