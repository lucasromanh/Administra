import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/reports/KPICard';
import { useKPIs, useInvoices, useExpenses } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Receipt, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const [kpis] = useKPIs();
  const [invoices] = useInvoices();
  const [expenses] = useExpenses();

  const pendingInvoices = invoices.filter((inv) => inv.status === 'pendiente' || inv.status === 'vencida');
  const pendingExpenses = expenses.filter((exp) => exp.status === 'pendiente');

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Resumen general del sistema"
      />
      <div className="flex-1 space-y-6 p-8">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Resúmenes rápidos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Facturas Pendientes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices.length}</div>
              <p className="text-xs text-muted-foreground">
                Requieren seguimiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gastos Por Aprobar
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingExpenses.length}</div>
              <p className="text-xs text-muted-foreground">
                Esperando revisión
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos placeholder */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-16 w-16" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <TrendingUp className="h-16 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
