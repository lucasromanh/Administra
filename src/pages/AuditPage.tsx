import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuditLogList } from '@/components/audit/AuditLogList';
import { AuditReports } from '@/components/audit/AuditReports';
import type { AuditLog, Invoice, Expense, StockItem, PayrollItem } from '@/lib/types';
import { storage } from '@/lib/storage';

export function AuditPage() {
  const [auditLogs] = useState<AuditLog[]>(
    storage.get<AuditLog[]>('audit_logs', [])
  );

  // Cargar datos de todos los módulos para auditoría
  const invoices = storage.get<Invoice[]>('invoices', []);
  const expenses = storage.get<Expense[]>('expenses', []);
  const stockItems = storage.get<StockItem[]>('stock_items', []);
  const payrollItems = storage.get<PayrollItem[]>('payroll_items', []);

  // Calcular resumen
  const totalIngresos = invoices
    .filter(inv => inv.status === 'pagada')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalEgresos = expenses
    .filter(exp => exp.status === 'pagado')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalStock = stockItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  const totalLiquidaciones = payrollItems
    .filter(item => item.status === 'pagado')
    .reduce((sum, item) => sum + item.netSalary, 0);

  const balance = totalIngresos - totalEgresos - totalLiquidaciones;

  // Detectar discrepancias
  const pendingInvoices = invoices.filter(inv => 
    inv.status === 'vencida' || 
    (inv.status === 'pendiente' && new Date(inv.dueDate) < new Date())
  );
  const unapprovedExpenses = expenses.filter(exp => exp.status === 'pendiente');
  const lowStock = stockItems.filter(item => item.quantity <= item.minStock);

  const discrepancies = pendingInvoices.length + unapprovedExpenses.length + lowStock.length;

  const handleDownloadReport = () => {
    const report = {
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        ingresos: totalIngresos,
        egresos: totalEgresos,
        stock: totalStock,
        liquidaciones: totalLiquidaciones,
        balance: balance,
        discrepancias: discrepancies,
      },
      facturas: {
        total: invoices.length,
        pagadas: invoices.filter(i => i.status === 'pagada').length,
        pendientes: invoices.filter(i => i.status === 'pendiente').length,
        vencidas: invoices.filter(i => i.status === 'vencida').length,
      },
      gastos: {
        total: expenses.length,
        aprobados: expenses.filter(e => e.status === 'aprobado' || e.status === 'pagado').length,
        pendientes: expenses.filter(e => e.status === 'pendiente').length,
      },
      stock: {
        productos: stockItems.length,
        alertas: lowStock.length,
        valorTotal: totalStock,
      },
      liquidaciones: {
        total: payrollItems.length,
        pagadas: payrollItems.filter(p => p.status === 'pagado').length,
        pendientes: payrollItems.filter(p => p.status !== 'pagado').length,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Auditoría"
        description="Control y seguimiento de operaciones"
        actions={
          <Button onClick={handleDownloadReport} size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Informe
          </Button>
        }
      />

      <div className="px-6 py-4 space-y-6">
        {/* Resumen Financiero */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-900 dark:text-green-100">
                Ingresos Totales
              </CardTitle>
              <FileText className="h-3 w-3 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                ${totalIngresos.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                {invoices.filter(i => i.status === 'pagada').length} facturas
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-red-900 dark:text-red-100">
                Egresos Totales
              </CardTitle>
              <FileText className="h-3 w-3 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-900 dark:text-red-100">
                ${totalEgresos.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                {expenses.filter(e => e.status === 'pagado').length} gastos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Valor Stock
              </CardTitle>
              <FileText className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                ${totalStock.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                {stockItems.length} productos
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-purple-900 dark:text-purple-100">
                Liquidaciones
              </CardTitle>
              <FileText className="h-3 w-3 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                ${totalLiquidaciones.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                {payrollItems.filter(p => p.status === 'pagado').length} pagadas
              </p>
            </CardContent>
          </Card>

          <Card className={balance >= 0 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950' : 'border-orange-200 bg-orange-50 dark:bg-orange-950'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-xs font-medium ${balance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'}`}>
                Balance
              </CardTitle>
              <FileText className={`h-3 w-3 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${balance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'}`}>
                ${balance.toLocaleString('es-CL')}
              </div>
              <p className={`text-xs ${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                {balance >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Discrepancias y Alertas */}
        {discrepancies > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Alertas y Discrepancias ({discrepancies})
              </CardTitle>
              <CardDescription>
                Elementos que requieren tu atención
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInvoices.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="text-sm font-medium">Facturas Vencidas</span>
                  <span className="text-sm text-red-600 font-bold">{pendingInvoices.length}</span>
                </div>
              )}
              {unapprovedExpenses.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="text-sm font-medium">Gastos Sin Aprobar</span>
                  <span className="text-sm text-orange-600 font-bold">{unapprovedExpenses.length}</span>
                </div>
              )}
              {lowStock.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border">
                  <span className="text-sm font-medium">Stock Bajo</span>
                  <span className="text-sm text-yellow-600 font-bold">{lowStock.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs: Logs y Reportes */}
        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs">Registro de Actividad</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <AuditLogList logs={auditLogs} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <AuditReports
              invoices={invoices}
              expenses={expenses}
              stockItems={stockItems}
              payrollItems={payrollItems}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
