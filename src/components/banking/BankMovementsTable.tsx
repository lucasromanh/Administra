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
    return new Date(date).toLocaleDateString('es-CL');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Referencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No hay movimientos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-medium">
                  {formatDate(movement.date)}
                </TableCell>
                <TableCell className="max-w-xs">{movement.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(movement.category)}>
                    {getCategoryLabel(movement.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {movement.type === 'ingreso' ? (
                      <ArrowUpCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="capitalize">{movement.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className={movement.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(movement.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={movement.reconciled ? 'default' : 'secondary'}>
                    {movement.reconciled ? 'Conciliado' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
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
