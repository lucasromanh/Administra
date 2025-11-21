import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import type { Employee } from '@/lib/types';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
}

export function EmployeeForm({ open, onOpenChange, onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    position: '',
    department: 'recepcion' as const,
    startDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'activo' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre Completo</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>RUT</Label>
            <Input value={formData.rut} onChange={(e) => setFormData({...formData, rut: e.target.value})} required />
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
          <Button type="submit" className="w-full">Crear Empleado</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
