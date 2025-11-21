import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { Employee } from '@/lib/types';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
  employee?: Employee; // Para edición
}

export function EmployeeForm({ open, onOpenChange, onSubmit, employee }: EmployeeFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    cuit: string;
    position: string;
    department: 'recepcion' | 'housekeeping' | 'mantenimiento' | 'administracion' | 'cocina' | 'bar' | 'seguridad';
    startDate: string;
    salary: number;
    status: 'activo' | 'inactivo' | 'licencia' | 'vacaciones';
  }>({
    name: employee?.name || '',
    cuit: employee?.cuit || '',
    position: employee?.position || '',
    department: employee?.department || 'recepcion',
    startDate: employee?.startDate || new Date().toISOString().split('T')[0],
    salary: employee?.salary || 0,
    status: employee?.status || 'activo',
  });

  // Actualizar formData cuando cambia el employee
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        cuit: employee.cuit,
        position: employee.position,
        department: employee.department,
        startDate: employee.startDate,
        salary: employee.salary,
        status: employee.status,
      });
    } else {
      setFormData({
        name: '',
        cuit: '',
        position: '',
        department: 'recepcion',
        startDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: 'activo',
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{employee ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre Completo</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>CUIT/CUIL</Label>
            <Input 
              value={formData.cuit} 
              onChange={(e) => setFormData({...formData, cuit: e.target.value})} 
              placeholder="XX-XXXXXXXX-X"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select value={formData.department} onValueChange={(value: any) => setFormData({...formData, department: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recepcion">Recepción</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="administracion">Administración</SelectItem>
                <SelectItem value="cocina">Cocina</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="seguridad">Seguridad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sueldo Base</Label>
            <Input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})} required />
          </div>
          
          {employee && (
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="licencia">Licencia</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {employee ? 'Guardar Cambios' : 'Crear Empleado'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
