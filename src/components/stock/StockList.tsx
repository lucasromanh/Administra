import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import type { StockItem } from '@/lib/types';

interface StockListProps {
  items: StockItem[];
  onUpdate: (itemId: string, updates: Partial<StockItem>) => void;
  onDelete: (itemId: string) => void;
}

export function StockList({ items, onUpdate, onDelete }: StockListProps) {
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      amenities: 'Amenities',
      'ropa-cama': 'Ropa de Cama',
      toallas: 'Toallas',
      uniformes: 'Uniformes',
      limpieza: 'Limpieza',
      lavanderia: 'Lavandería',
      papeleria: 'Papelería',
      alimentos: 'Alimentos',
      bebidas: 'Bebidas',
      mantenimiento: 'Mantenimiento',
      otros: 'Otros',
    };
    return labels[category] || category;
  };

  const handleEdit = (item: StockItem) => {
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editItem) {
      onUpdate(editItem.id, {
        name: editItem.name,
        quantity: editItem.quantity,
        minStock: editItem.minStock,
        cost: editItem.cost,
        location: editItem.location,
        supplier: editItem.supplier,
      });
      setEditDialogOpen(false);
      setEditItem(null);
    }
  };

  const handleDelete = (item: StockItem) => {
    if (confirm(`¿Eliminar ${item.name} del inventario?`)) {
      onDelete(item.id);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay productos en stock</p>
          <p className="text-sm">Agrega tu primer producto para comenzar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className={item.quantity <= item.minStock ? 'border-red-300' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.name}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cantidad</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {item.quantity} {item.unit}
                  </span>
                  {item.quantity <= item.minStock && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Mínimo</span>
                <span className="text-sm">{item.minStock} {item.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Ubicación</span>
                <span className="text-sm">{item.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Costo Unit.</span>
                <span className="text-sm">${item.cost.toLocaleString('es-CL')}</span>
              </div>
              <div className="pt-2 border-t">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(item.category)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Actualiza la información del producto en stock
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mínimo</Label>
                  <Input
                    type="number"
                    value={editItem.minStock}
                    onChange={(e) => setEditItem({ ...editItem, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Costo Unitario</Label>
                <Input
                  type="number"
                  value={editItem.cost}
                  onChange={(e) => setEditItem({ ...editItem, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  value={editItem.location}
                  onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Input
                  value={editItem.supplier || ''}
                  onChange={(e) => setEditItem({ ...editItem, supplier: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
