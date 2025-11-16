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
import type { Invoice } from '@/lib/types';
import { Eye, Download } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
}

export function InvoiceList({ invoices, onViewInvoice }: InvoiceListProps) {
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

  const getStatusLabel = (status: Invoice['status']) => {
    const labels = {
      pagada: 'Pagada',
      pendiente: 'Pendiente',
      vencida: 'Vencida',
      anulada: 'Anulada',
    };
    return labels[status];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
            <TableCell>{invoice.customerName}</TableCell>
            <TableCell>{formatDate(invoice.date)}</TableCell>
            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(invoice.amount)}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(invoice.status)}>
                {getStatusLabel(invoice.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewInvoice?.(invoice)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
