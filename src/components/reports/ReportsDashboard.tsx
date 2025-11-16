import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportsDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ventas Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Gráfico de ventas (implementar con Chart.js o Recharts)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gastos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Gráfico de gastos (implementar con Chart.js o Recharts)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
