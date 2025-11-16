import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/lib/types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'media' as Task['priority'],
    category: 'otro' as Task['category'],
    assignedTo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pendiente',
    });
    setFormData({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'media',
      category: 'otro',
      assignedTo: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title" className="text-sm">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ej: Revisar cuentas bancarias"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-sm">Descripción *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe la tarea..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm">Fecha de vencimiento</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm">Prioridad</Label>
          <select
            id="priority"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as Task['priority'],
              })
            }
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm">Categoría</Label>
          <select
            id="category"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as Task['category'],
              })
            }
          >
            <option value="auditoria">Auditoría</option>
            <option value="conciliacion">Conciliación</option>
            <option value="reporte">Reporte</option>
            <option value="pago">Pago</option>
            <option value="vencimiento">Vencimiento</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo" className="text-sm">Asignado a</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value })
            }
            placeholder="Nombre de la persona"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="w-full md:w-auto">
          Crear Tarea
        </Button>
      </div>
    </form>
  );
}
