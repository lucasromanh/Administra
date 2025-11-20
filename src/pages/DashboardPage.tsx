import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/reports/KPICard';
import { useKPIs, useInvoices, useExpenses, useHotelMetrics } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Receipt, TrendingUp, Hotel, Users, Download } from 'lucide-react';
import { generateDashboardReport } from '@/lib/reports-pdf';
import { getHotelConfig } from '@/lib/hotelConfig';

export function DashboardPage() {
  const [kpis] = useKPIs();
  const [invoices] = useInvoices();
  const [expenses] = useExpenses();
  const [metrics] = useHotelMetrics();
  const hotelConfig = getHotelConfig();

  const pendingInvoices = invoices.filter((inv) => inv.status === 'pendiente' || inv.status === 'vencida');
  const pendingExpenses = expenses.filter((exp) => exp.status === 'pendiente');
  
  // Calcular ocupación: (noches vendidas / (total habitaciones * días del mes)) * 100
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const maxNights = hotelConfig.totalRooms * daysInMonth;
  const occupancyRate = maxNights > 0 ? ((hotelConfig.nightsSold / maxNights) * 100).toFixed(1) : '0';

  const handleDownloadReport = () => {
    generateDashboardReport(kpis, metrics, invoices, expenses);
  };

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
        actions={
          <Button onClick={handleDownloadReport} size="sm" className="gap-2">
            <Download className="h-3 w-3" />
            Descargar Informe
          </Button>
        }
      />
      <div className="px-6 py-4 space-y-6 w-full">
        {/* Métricas Hoteleras */}
        <div>
          <h3 className="text-sm font-medium mb-3">Métricas Hoteleras</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>

        {/* Indicadores Operacionales */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Indicadores Operacionales</h3>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 Para modificar la cantidad de habitaciones o las noches vendidas del mes actual, ve a <strong>Configuración &gt; Operacional</strong>
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Habitaciones Disponibles
                </CardTitle>
                <Hotel className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{hotelConfig.totalRooms}</div>
                <p className="text-[10px] text-muted-foreground">
                  Total de habitaciones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Noches Vendidas
                </CardTitle>
                <Users className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{hotelConfig.nightsSold}</div>
                <p className="text-[10px] text-muted-foreground">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Ocupación
                </CardTitle>
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{occupancyRate}%</div>
                <p className="text-[10px] text-muted-foreground">
                  Mes actual ({daysInMonth} días)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Ingresos Totales
                </CardTitle>
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Mes actual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Gastos Totales
                </CardTitle>
                <Receipt className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(metrics.totalExpenses)}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Mes actual
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumen de Tareas Pendientes */}
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Facturas Pendientes
              </CardTitle>
              <FileText className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingInvoices.length}</div>
              <p className="text-[10px] text-muted-foreground">
                Requieren seguimiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Gastos Por Aprobar
              </CardTitle>
              <Receipt className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingExpenses.length}</div>
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
