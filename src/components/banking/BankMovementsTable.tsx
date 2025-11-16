import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { BankMovement } from '@/lib/types';
import { getCategoryLabel, getCategoryColor } from '@/lib/bank';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface BankMovementsTableProps {
  movements: BankMovement[];
}

export function BankMovementsTable({ movements }: BankMovementsTableProps) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs">Fecha</TableHead>
            <TableHead className="text-xs">Descripción</TableHead>
            <TableHead className="text-xs">Categoría</TableHead>
            <TableHead className="text-xs">Tipo</TableHead>
            <TableHead className="text-xs text-right">Monto</TableHead>
            <TableHead className="text-xs">Estado</TableHead>
            <TableHead className="text-xs">Referencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground text-sm py-8">
                No hay movimientos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => (
              <TableRow key={movement.id} className="hover:bg-muted/50">
                <TableCell className="text-xs">
                  {formatDate(movement.date)}
                </TableCell>
                <TableCell className="max-w-xs text-sm">{movement.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getCategoryColor(movement.category)} text-xs`}>
                    {getCategoryLabel(movement.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {movement.type === 'ingreso' ? (
                      <ArrowUpCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3 text-red-600" />
                    )}
                    <span className="capitalize text-xs">{movement.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  <span className={movement.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(movement.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={movement.reconciled ? 'default' : 'secondary'} className="text-xs">
                    {movement.reconciled ? 'Conciliado' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {movement.reference || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
