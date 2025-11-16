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
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs">Número</TableHead>
            <TableHead className="text-xs">Cliente</TableHead>
            <TableHead className="text-xs">Fecha</TableHead>
            <TableHead className="text-xs">Vencimiento</TableHead>
            <TableHead className="text-xs text-right">Monto</TableHead>
            <TableHead className="text-xs">Estado</TableHead>
            <TableHead className="text-xs text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-semibold text-sm">{invoice.number}</TableCell>
              <TableCell className="text-sm">{invoice.customerName}</TableCell>
              <TableCell className="text-xs">{formatDate(invoice.date)}</TableCell>
              <TableCell className="text-xs">{formatDate(invoice.dueDate)}</TableCell>
              <TableCell className="text-right font-semibold text-sm">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invoice.status)} className="text-xs">
                  {getStatusLabel(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewInvoice?.(invoice)}
                    className="h-7 w-7 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
