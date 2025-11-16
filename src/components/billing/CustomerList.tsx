import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Customer } from '@/lib/types';

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs">Nombre</TableHead>
            <TableHead className="text-xs">RUT</TableHead>
            <TableHead className="text-xs">Email</TableHead>
            <TableHead className="text-xs">Teléfono</TableHead>
            <TableHead className="text-xs">Dirección</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-sm">{customer.name}</TableCell>
              <TableCell className="text-xs">{customer.rut}</TableCell>
              <TableCell className="text-xs">{customer.email}</TableCell>
              <TableCell className="text-xs">{customer.phone}</TableCell>
              <TableCell className="text-xs">{customer.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
