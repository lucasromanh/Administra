import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/reports/KPICard';
import { ReportsDashboard } from '@/components/reports/ReportsDashboard';
import { SalesChart } from '@/components/reports/SalesChart';
import { ExpensesChart } from '@/components/reports/ExpensesChart';
import { useKPIs } from '@/hooks/useMockData';

export function ReportsPage() {
  const [kpis] = useKPIs();

  return (
    <div className="flex flex-col">
      <Header
        title="Reportes Gerenciales"
        description="Visualiza el desempeño de tu negocio"
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
