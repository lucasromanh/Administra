import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder - se puede implementar con Chart.js o Recharts más adelante
export function ExpensesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Gráfico de gastos por categoría
        </div>
      </CardContent>
    </Card>
  );
}
