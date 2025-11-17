import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/reports/KPICard';
import { ReportsDashboard } from '@/components/reports/ReportsDashboard';
import { SalesChart } from '@/components/reports/SalesChart';
import { ExpensesChart } from '@/components/reports/ExpensesChart';
import { Button } from '@/components/ui/button';
import { useKPIs, useHotelMetrics } from '@/hooks/useMockData';
import { generateMetricsReport } from '@/lib/reports-pdf';
import { Download } from 'lucide-react';

export function ReportsPage() {
  const [kpis] = useKPIs();
  const [metrics] = useHotelMetrics();

  const handleDownloadReport = () => {
    generateMetricsReport(kpis, metrics);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Reportes Gerenciales"
        description="Visualiza el desempeño de tu negocio"
        actions={
          <Button onClick={handleDownloadReport} size="sm" className="gap-2">
            <Download className="h-3 w-3" />
            Descargar Informe
          </Button>
        }
      />
      <div className="px-6 py-4 space-y-6 w-full">
        <div>
          <h3 className="text-sm font-medium mb-1">Indicadores Clave de Rendimiento (KPIs)</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Métricas principales que miden el desempeño operativo y financiero del hotel. 
            El porcentaje indica la variación respecto al mes anterior.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-1">Análisis Financiero</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Visualización comparativa de ingresos, egresos y utilidad neta mensual.
          </p>
          <ReportsDashboard />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-1">Desglose Detallado</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Análisis específico de ingresos por facturación y distribución de gastos operativos.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <SalesChart />
            <ExpensesChart />
          </div>
        </div>
      </div>
    </div>
  );
}
