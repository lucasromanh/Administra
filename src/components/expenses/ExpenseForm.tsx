import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Expense, ExpenseCategory } from '@/lib/types';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'otros' as ExpenseCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: formData.date,
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category,
      status: 'pendiente',
      createdBy: 'Usuario actual',
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: 'otros',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-xs">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="h-9"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs">Monto</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="Ej: 50000"
            className="h-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Descripción detallada del gasto"
          className="resize-none"
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs">Categoría</Label>
        <select
          id="category"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as ExpenseCategory,
            })
          }
        >
          <option value="mantenimiento">Mantenimiento</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="f&b">F&B</option>
          <option value="lavanderia">Lavandería</option>
          <option value="rrhh">RRHH</option>
          <option value="servicios-basicos">Servicios Básicos</option>
          <option value="marketing">Marketing</option>
          <option value="tecnologia">Tecnología</option>
          <option value="administracion">Administración</option>
          <option value="proveedores">Proveedores</option>
          <option value="otros">Otros</option>
        </select>
      </div>
      
      <Button type="submit" className="w-full">
        Crear Gasto
      </Button>
    </form>
  );
}
