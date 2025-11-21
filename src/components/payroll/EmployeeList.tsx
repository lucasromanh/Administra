import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Edit2, Trash2 } from 'lucide-react';
import type { Employee } from '@/lib/types';

interface EmployeeListProps {
  employees: Employee[];
  onUpdate: (id: string, updates: Partial<Employee>) => void;
  onDelete: (id: string) => void;
}

export function EmployeeList({ employees, onDelete }: EmployeeListProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      licencia: 'bg-yellow-100 text-yellow-800',
      vacaciones: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || colors.activo;
  };

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay empleados registrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <Card key={employee.id}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
              <Badge className={getStatusColor(employee.status)}>
                {employee.status}
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">RUT:</span>
                <span>{employee.rut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departamento:</span>
                <span className="capitalize">{employee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sueldo Base:</span>
                <span>${employee.salary.toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="h-3 w-3 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => {
                  if (confirm(`¿Eliminar a ${employee.name}?`)) {
                    onDelete(employee.id);
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
