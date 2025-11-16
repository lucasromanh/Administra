import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder - se puede implementar con Chart.js o Recharts más adelante
export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas del Año</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Gráfico de ventas por mes
        </div>
      </CardContent>
    </Card>
  );
}
