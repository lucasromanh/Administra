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
import type { Expense } from '@/lib/types';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge.tsx';
import { Check, X, Eye, Download, FileText, Calendar, User, DollarSign, Tag } from 'lucide-react';
import { useState } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  onApprove?: (expenseId: string) => void;
  onReject?: (expenseId: string) => void;
  onChangeStatus?: (expenseId: string, newStatus: 'pendiente' | 'aprobado' | 'rechazado' | 'pagado') => void;
}

export function ExpenseList({ expenses, onApprove, onReject, onChangeStatus }: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
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

  const getStatusLabel = (status: Expense['status']) => {
    const labels = {
      aprobado: 'Aprobado',
      pendiente: 'Pendiente',
      rechazado: 'Rechazado',
      pagado: 'Pagado',
    };
    return labels[status];
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setViewDialogOpen(true);
  };

  const handleDownloadExpense = (expense: Expense) => {
    const content = `
GASTO ${expense.id}
========================

Fecha: ${formatDate(expense.date)}
Descripción: ${expense.description}
Categoría: ${expense.category}
Monto: ${formatCurrency(expense.amount)}
Creado por: ${expense.createdBy}
Estado: ${getStatusLabel(expense.status)}

Documento generado automáticamente por Sistema Administra
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gasto-${expense.id}.txt`;
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
            <DialogTitle>Detalle de Gasto</DialogTitle>
            <DialogDescription>
              Información completa del gasto {selectedExpense?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">ID de Gasto</p>
                  </div>
                  <p className="text-lg font-bold">{selectedExpense.id}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Monto</p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(selectedExpense.amount)}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="font-medium">{formatDate(selectedExpense.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Categoría</p>
                    <ExpenseCategoryBadge category={selectedExpense.category} />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Descripción</p>
                    <p className="font-medium">{selectedExpense.description}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Creado por</p>
                    <p className="font-medium">{selectedExpense.createdBy}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge variant={getStatusVariant(selectedExpense.status)}>
                    {getStatusLabel(selectedExpense.status)}
                  </Badge>
                </div>
                
                {onChangeStatus && selectedExpense.status !== 'rechazado' && (
                  <div className="flex flex-wrap gap-2">
                    {selectedExpense.status !== 'aprobado' && selectedExpense.status !== 'pagado' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => {
                          onChangeStatus(selectedExpense.id, 'aprobado');
                          setSelectedExpense({ ...selectedExpense, status: 'aprobado' });
                        }}
                        className="flex-1"
                      >
                        Aprobar Gasto
                      </Button>
                    )}
                    {selectedExpense.status === 'aprobado' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => {
                          onChangeStatus(selectedExpense.id, 'pagado');
                          setSelectedExpense({ ...selectedExpense, status: 'pagado' });
                        }}
                        className="flex-1"
                      >
                        Marcar como Pagado
                      </Button>
                    )}
                    {(selectedExpense.status === 'aprobado' || selectedExpense.status === 'pagado') && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => {
                          onChangeStatus(selectedExpense.id, 'pendiente');
                          setSelectedExpense({ ...selectedExpense, status: 'pendiente' });
                        }}
                        className="flex-1"
                      >
                        Marcar como Pendiente
                      </Button>
                    )}
                    {selectedExpense.status === 'pendiente' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          onChangeStatus(selectedExpense.id, 'rechazado');
                          setSelectedExpense({ ...selectedExpense, status: 'rechazado' });
                        }}
                        className="flex-1"
                      >
                        Rechazar Gasto
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => handleDownloadExpense(selectedExpense)}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Gasto
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
                {expense.status !== 'rechazado' && onChangeStatus ? (
                  <Badge 
                    variant={getStatusVariant(expense.status)} 
                    className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      if (expense.status === 'pendiente') {
                        onChangeStatus(expense.id, 'aprobado');
                      } else if (expense.status === 'aprobado') {
                        onChangeStatus(expense.id, 'pagado');
                      } else if (expense.status === 'pagado') {
                        onChangeStatus(expense.id, 'pendiente');
                      }
                    }}
                    title={expense.status === 'pendiente' ? 'Cambiar a aprobado' : expense.status === 'aprobado' ? 'Cambiar a pagado' : 'Cambiar a pendiente'}
                  >
                    {getStatusLabel(expense.status)}
                  </Badge>
                ) : (
                  <Badge variant={getStatusVariant(expense.status)} className="text-xs">
                    {getStatusLabel(expense.status)}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewExpense(expense)}
                    className="h-7 w-7 p-0"
                    title="Ver detalle de gasto"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadExpense(expense)}
                    className="h-7 w-7 p-0"
                    title="Descargar gasto"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {expense.status === 'pendiente' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApprove?.(expense.id)}
                        className="h-7 w-7 p-0"
                        title="Aprobar gasto"
                      >
                        <Check className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onReject?.(expense.id)}
                        className="h-7 w-7 p-0"
                        title="Rechazar gasto"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </>
                  )}
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
