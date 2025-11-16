import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Invoice } from '@/lib/types';
import { Calendar, User, DollarSign } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  onView?: () => void;
}

export function InvoiceCard({ invoice, onView }: InvoiceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'pagada':
        return 'default';
      case 'pendiente':
        return 'secondary';
      case 'vencida':
        return 'destructive';
      case 'anulada':
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{invoice.number}</CardTitle>
          <Badge variant={getStatusVariant(invoice.status)}>
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{invoice.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Vence: {formatDate(invoice.dueDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold">
            {formatCurrency(invoice.amount)}
          </span>
        </div>
        {onView && (
          <Button className="w-full" onClick={onView}>
            Ver detalles
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
