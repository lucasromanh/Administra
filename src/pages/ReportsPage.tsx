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
        description="Visualiza el desempeno de tu negocio"
        actions={
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Informe de Metricas
          </Button>
        }
      />
      <div className="flex-1 space-y-6 p-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Indicadores Clave</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Gráficos</h3>
          <ReportsDashboard />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SalesChart />
          <ExpensesChart />
        </div>
      </div>
    </div>
  );
}
