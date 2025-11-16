import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KPI } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString('es-CL');
      default:
        return value.toLocaleString('es-CL');
    }
  };

  const isPositive = kpi.change > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">{kpi.name}</CardTitle>
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-green-600" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">{formatValue(kpi.value, kpi.format)}</div>
        <p className="text-[10px] text-muted-foreground">
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}
            {kpi.change.toFixed(1)}%
          </span>{' '}
          vs mes anterior
        </p>
      </CardContent>
    </Card>
  );
}
