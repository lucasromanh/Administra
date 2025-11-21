import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmployeeForm } from './EmployeeForm';
import type { Employee } from '@/lib/types';

interface EmployeeListProps {
  employees: Employee[];
  onUpdate: (id: string, updates: Partial<Employee>) => void;
  onDelete: (id: string) => void;
}

export function EmployeeList({ employees, onUpdate, onDelete }: EmployeeListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
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
                <span className="text-muted-foreground">CUIT/CUIL:</span>
                <span>{employee.cuit}</span>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setEditDialogOpen(true);
                }}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Diálogo de Confirmación de Eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              ¿Eliminar Empleado?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEmployee && (
                <>
                  Estás a punto de eliminar a <strong>{selectedEmployee.name}</strong> ({selectedEmployee.position}).
                  <br />
                  <br />
                  Esta acción no se puede deshacer. Todos los datos del empleado serán eliminados permanentemente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (selectedEmployee) {
                  onDelete(selectedEmployee.id);
                  setDeleteDialogOpen(false);
                  setSelectedEmployee(null);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de Edición */}
      {selectedEmployee && (
        <EmployeeForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          employee={selectedEmployee}
          onSubmit={(updates) => {
            onUpdate(selectedEmployee.id, updates);
            setEditDialogOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}
