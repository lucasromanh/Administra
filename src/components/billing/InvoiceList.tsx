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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Invoice } from '@/lib/types';
import { Eye, Download, FileText, Calendar, User, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface InvoiceListProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
  onChangeStatus?: (invoiceId: string, newStatus: Invoice['status']) => void;
}

export function InvoiceList({ invoices, onViewInvoice, onChangeStatus }: InvoiceListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
    onViewInvoice?.(invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Simular descarga de PDF
    const content = `
FACTURA ${invoice.number}
========================

Cliente: ${invoice.customerName}
Fecha: ${formatDate(invoice.date)}
Vencimiento: ${formatDate(invoice.dueDate)}
Monto: ${formatCurrency(invoice.amount)}
Estado: ${getStatusLabel(invoice.status)}

Documento generado automáticamente por Sistema Administra
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${invoice.number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Factura</DialogTitle>
            <DialogDescription>
              Información completa de la factura {selectedInvoice?.number}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Número de Factura</p>
                  </div>
                  <p className="text-lg font-bold">{selectedInvoice.number}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Monto Total</p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="font-semibold">{selectedInvoice.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Emisión</p>
                    <p className="font-medium">{formatDate(selectedInvoice.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Vencimiento</p>
                    <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge variant={getStatusVariant(selectedInvoice.status)}>
                    {getStatusLabel(selectedInvoice.status)}
                  </Badge>
                </div>
                
                {onChangeStatus && selectedInvoice.status !== 'anulada' && (
                  <div className="flex flex-wrap gap-2">
                    {(selectedInvoice.status === 'pendiente' || selectedInvoice.status === 'vencida') && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => {
                          onChangeStatus(selectedInvoice.id, 'pagada');
                          setSelectedInvoice({ ...selectedInvoice, status: 'pagada' });
                        }}
                        className="flex-1"
                      >
                        Marcar como Pagada
                      </Button>
                    )}
                    {selectedInvoice.status === 'pagada' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => {
                          onChangeStatus(selectedInvoice.id, 'pendiente');
                          setSelectedInvoice({ ...selectedInvoice, status: 'pendiente' });
                        }}
                        className="flex-1"
                      >
                        Marcar como Pendiente
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        onChangeStatus(selectedInvoice.id, 'anulada');
                        setSelectedInvoice({ ...selectedInvoice, status: 'anulada' });
                      }}
                      className="flex-1"
                    >
                      Anular Factura
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => handleDownloadInvoice(selectedInvoice)}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Factura
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  {(invoice.status === 'pendiente' || invoice.status === 'pagada') && onChangeStatus ? (
                    <Badge 
                      variant={getStatusVariant(invoice.status)} 
                      className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        const newStatus = invoice.status === 'pendiente' ? 'pagada' : 'pendiente';
                        onChangeStatus(invoice.id, newStatus);
                      }}
                      title={`Cambiar a ${invoice.status === 'pendiente' ? 'pagada' : 'pendiente'}`}
                    >
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  ) : (
                    <Badge variant={getStatusVariant(invoice.status)} className="text-xs">
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewInvoice(invoice)}
                      className="h-7 w-7 p-0"
                      title="Ver detalle de factura"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 w-7 p-0"
                      onClick={() => handleDownloadInvoice(invoice)}
                      title="Descargar factura"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
