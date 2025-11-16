import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInvoices, useExpenses } from '@/hooks/useMockData';
import { calculateIncomeVsExpenses } from '@/lib/reports';

export function ReportsDashboard() {
  const [invoices] = useInvoices();
  const [expenses] = useExpenses();
  const data = calculateIncomeVsExpenses(invoices, expenses);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ingresos vs Egresos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" />
            <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Utilidad"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
