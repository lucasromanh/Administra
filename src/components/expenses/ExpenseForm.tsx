import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Gasto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Descripción</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Monto</label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoría</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseCategory,
                })
              }
            >
              <option value="oficina">Oficina</option>
              <option value="servicios">Servicios</option>
              <option value="marketing">Marketing</option>
              <option value="personal">Personal</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Crear Gasto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
