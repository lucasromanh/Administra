import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StockItem, StockCategory } from '@/lib/types';

interface StockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<StockItem, 'id'>) => void;
}

export function StockForm({ open, onOpenChange, onSubmit }: StockFormProps) {
  const [formData, setFormData] = useState<Omit<StockItem, 'id'>>({
    name: '',
    category: 'amenities',
    quantity: 0,
    unit: 'unidad',
    minStock: 10,
    location: '',
    cost: 0,
    supplier: '',
    lastRestockDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      category: 'amenities',
      quantity: 0,
      unit: 'unidad',
      minStock: 10,
      location: '',
      cost: 0,
      supplier: '',
      lastRestockDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Producto en Stock</DialogTitle>
          <DialogDescription>
            Agrega un nuevo producto al inventario del hotel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Shampoo 30ml, Toalla baño, Sábana queen"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: StockCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amenities">Amenities</SelectItem>
                  <SelectItem value="ropa-cama">Ropa de Cama</SelectItem>
                  <SelectItem value="toallas">Toallas</SelectItem>
                  <SelectItem value="uniformes">Uniformes</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="lavanderia">Lavandería</SelectItem>
                  <SelectItem value="papeleria">Papelería</SelectItem>
                  <SelectItem value="alimentos">Alimentos</SelectItem>
                  <SelectItem value="bebidas">Bebidas</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Bodega Principal, Piso 2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad Actual *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidad de Medida *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="paquete">Paquete</SelectItem>
                  <SelectItem value="caja">Caja</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                  <SelectItem value="kg">Kilogramo</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="par">Par</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Stock Mínimo *</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                min="0"
                required
              />
              <p className="text-xs text-muted-foreground">
                Se alertará cuando esté por debajo de este valor
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Costo Unitario *</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Ej: Distribuidora ABC"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastRestockDate">Última Reposición</Label>
              <Input
                id="lastRestockDate"
                type="date"
                value={formData.lastRestockDate}
                onChange={(e) => setFormData({ ...formData, lastRestockDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
