import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KPI } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const isPositive = kpi.change > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(kpi.value)}</div>
        <p className="text-xs text-muted-foreground">
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}
            {kpi.change}%
          </span>{' '}
          desde el mes anterior
        </p>
      </CardContent>
    </Card>
  );
}
