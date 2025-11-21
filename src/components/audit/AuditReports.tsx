import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Invoice, Expense, StockItem, PayrollItem } from '@/lib/types';

interface AuditReportsProps {
  invoices: Invoice[];
  expenses: Expense[];
  stockItems: StockItem[];
  payrollItems: PayrollItem[];
}

export function AuditReports({ invoices, expenses, stockItems, payrollItems }: AuditReportsProps) {
  const generateReport = (type: string) => {
    let data: any = {};
    
    switch(type) {
      case 'facturas':
        data = {
          tipo: 'Reporte de Facturas',
          fecha: new Date().toISOString(),
          total: invoices.length,
          pagadas: invoices.filter(i => i.status === 'pagada').length,
          pendientes: invoices.filter(i => i.status === 'pendiente').length,
          vencidas: invoices.filter(i => i.status === 'vencida').length,
          monto_total: invoices.reduce((sum, i) => sum + i.amount, 0),
        };
        break;
      case 'gastos':
        data = {
          tipo: 'Reporte de Gastos',
          fecha: new Date().toISOString(),
          total: expenses.length,
          aprobados: expenses.filter(e => e.status === 'aprobado' || e.status === 'pagado').length,
          pendientes: expenses.filter(e => e.status === 'pendiente').length,
          monto_total: expenses.reduce((sum, e) => sum + e.amount, 0),
        };
        break;
      case 'stock':
        data = {
          tipo: 'Reporte de Stock',
          fecha: new Date().toISOString(),
          productos: stockItems.length,
          alertas_bajas: stockItems.filter(i => i.quantity <= i.minStock).length,
          valor_total: stockItems.reduce((sum, i) => sum + (i.quantity * i.cost), 0),
        };
        break;
      case 'liquidaciones':
        data = {
          tipo: 'Reporte de Liquidaciones',
          fecha: new Date().toISOString(),
          total: payrollItems.length,
          pagadas: payrollItems.filter(p => p.status === 'pagado').length,
          monto_total: payrollItems.reduce((sum, p) => sum + p.netSalary, 0),
        };
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reporte de Facturas</CardTitle>
          <CardDescription>Análisis completo de facturación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Total facturas:</span>
              <span className="font-semibold">{invoices.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pagadas:</span>
              <span className="font-semibold text-green-600">{invoices.filter(i => i.status === 'pagada').length}</span>
            </div>
          </div>
          <Button onClick={() => generateReport('facturas')} size="sm" className="w-full gap-2">
            <Download className="h-3 w-3" />
            Descargar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reporte de Gastos</CardTitle>
          <CardDescription>Análisis de gastos operacionales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Total gastos:</span>
              <span className="font-semibold">{expenses.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Aprobados:</span>
              <span className="font-semibold text-green-600">{expenses.filter(e => e.status === 'aprobado' || e.status === 'pagado').length}</span>
            </div>
          </div>
          <Button onClick={() => generateReport('gastos')} size="sm" className="w-full gap-2">
            <Download className="h-3 w-3" />
            Descargar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reporte de Stock</CardTitle>
          <CardDescription>Inventario y valorización</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Productos:</span>
              <span className="font-semibold">{stockItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Stock bajo:</span>
              <span className="font-semibold text-red-600">{stockItems.filter(i => i.quantity <= i.minStock).length}</span>
            </div>
          </div>
          <Button onClick={() => generateReport('stock')} size="sm" className="w-full gap-2">
            <Download className="h-3 w-3" />
            Descargar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reporte de Liquidaciones</CardTitle>
          <CardDescription>Nómina y pagos de personal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Liquidaciones:</span>
              <span className="font-semibold">{payrollItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pagadas:</span>
              <span className="font-semibold text-green-600">{payrollItems.filter(p => p.status === 'pagado').length}</span>
            </div>
          </div>
          <Button onClick={() => generateReport('liquidaciones')} size="sm" className="w-full gap-2">
            <Download className="h-3 w-3" />
            Descargar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
