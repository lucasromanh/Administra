import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import type { PayrollItem, Employee } from '@/lib/types';

interface PayrollListProps {
  items: PayrollItem[];
  employees: Employee[];
  onUpdate: (id: string, updates: Partial<PayrollItem>) => void;
}

export function PayrollList({ items }: PayrollListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay liquidaciones registradas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.employeeName}</h3>
                <p className="text-sm text-muted-foreground">Período: {item.period}</p>
              </div>
              <Badge>{item.status}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Sueldo Base</p>
                <p className="font-semibold">${item.baseSalary.toLocaleString('es-CL')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Adelantos</p>
                <p className="font-semibold text-red-600">-${item.advances.toLocaleString('es-CL')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Líquido</p>
                <p className="font-semibold text-green-600">${item.netSalary.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
