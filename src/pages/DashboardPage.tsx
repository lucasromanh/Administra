import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/reports/KPICard';
import { useKPIs, useInvoices, useExpenses, useHotelMetrics } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Receipt, TrendingUp, Hotel, Users } from 'lucide-react';

export function DashboardPage() {
  const [kpis] = useKPIs();
  const [invoices] = useInvoices();
  const [expenses] = useExpenses();
  const [metrics] = useHotelMetrics();

  const pendingInvoices = invoices.filter((inv) => inv.status === 'pendiente' || inv.status === 'vencida');
  const pendingExpenses = expenses.filter((exp) => exp.status === 'pendiente');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Panel de control - Hotel Plaza Santiago"
      />
      <div className="flex-1 space-y-6 p-8">
        {/* Métricas Hoteleras */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Métricas Hoteleras</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>

        {/* Indicadores Operacionales */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Indicadores Operacionales</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Habitaciones Disponibles
                </CardTitle>
                <Hotel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.roomsAvailable}</div>
                <p className="text-xs text-muted-foreground">
                  Total de habitaciones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Noches Vendidas
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.roomsSold}</div>
                <p className="text-xs text-muted-foreground">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mes actual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gastos Totales
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mes actual
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumen de Tareas Pendientes */}
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

        {/* Gráfico */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-16 w-16" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(metrics.totalExpenses)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GOP</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(metrics.gop)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
