import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Expense } from '@/lib/types';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge';
import { Calendar, User, DollarSign } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{expense.description}</CardTitle>
          <Badge variant={getStatusVariant(expense.status)}>
            {expense.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ExpenseCategoryBadge category={expense.category} />
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(expense.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{expense.createdBy}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold">
            {formatCurrency(expense.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
