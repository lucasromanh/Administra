import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Package } from 'lucide-react';
import { useState } from 'react';
import { StockList } from '@/components/stock/StockList';
import { StockForm } from '@/components/stock/StockForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StockItem } from '@/lib/types';
import { storage } from '@/lib/storage';

export function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(
    storage.get<StockItem[]>('stock_items', [])
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateStock = (item: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = {
      ...item,
      id: Date.now().toString(),
    };
    const updated = [...stockItems, newItem];
    setStockItems(updated);
    storage.set('stock_items', updated);
    setIsFormOpen(false);
  };

  const handleUpdateStock = (itemId: string, updates: Partial<StockItem>) => {
    const updated = stockItems.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    setStockItems(updated);
    storage.set('stock_items', updated);
  };

  const handleDeleteStock = (itemId: string) => {
    const updated = stockItems.filter(item => item.id !== itemId);
    setStockItems(updated);
    storage.set('stock_items', updated);
  };

  // Calcular alertas de stock bajo
  const lowStockItems = stockItems.filter(item => item.quantity <= item.minStock);
  const totalStockValue = stockItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  return (
    <div className="flex flex-col">
      <Header
        title="Control de Stock"
        description="Gestión de inventario hotelero"
        actions={
          <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        }
      />

      <div className="px-6 py-4 space-y-6">
        {/* Resumen */}
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Total de Productos
              </CardTitle>
              <Package className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                En inventario
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-red-900 dark:text-red-100">
                Stock Bajo
              </CardTitle>
              <AlertTriangle className="h-3 w-3 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {lowStockItems.length}
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                Requieren reposición
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Valor Total
              </CardTitle>
              <Package className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalStockValue.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                En inventario
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de Stock Bajo */}
        {lowStockItems.length > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Productos con Stock Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-amber-700 dark:text-amber-300">
                      {item.quantity} {item.unit} (mínimo: {item.minStock})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Stock */}
        <StockList
          items={stockItems}
          onUpdate={handleUpdateStock}
          onDelete={handleDeleteStock}
        />
      </div>

      {/* Formulario de Nuevo Producto */}
      <StockForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateStock}
      />
    </div>
  );
}
