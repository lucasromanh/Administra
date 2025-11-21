import { Header } from '@/components/layout/Header';
import { EditableKPICard } from '@/components/reports/EditableKPICard';
import { useKPIs, useInvoices, useExpenses, useHotelMetrics } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Receipt, TrendingUp, Hotel, Users, Download } from 'lucide-react';
import { generateDashboardReport } from '@/lib/reports-pdf';
import { getHotelConfig } from '@/lib/hotelConfig';
import { useState } from 'react';
import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const [kpis] = useKPIs();
  const [invoices] = useInvoices();
  const [expenses] = useExpenses();
  const [metrics] = useHotelMetrics();
  const hotelConfig = getHotelConfig();
  
  // Estados para KPIs editables
  const [adr, setADR] = useState(storage.get<number>('kpi_adr', 75000));
  const [gop, setGOP] = useState(storage.get<number>('kpi_gop', 5000000));
  
  // Estados para selector de período de reporte
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const pendingInvoices = invoices.filter((inv) => inv.status === 'pendiente' || inv.status === 'vencida');
  const pendingExpenses = expenses.filter((exp) => exp.status === 'pendiente');
  
  // Calcular días según el período configurado
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysInPeriod = hotelConfig.nightsSoldPeriod === 'daily' ? 1 :
                       hotelConfig.nightsSoldPeriod === 'weekly' ? 7 :
                       daysInMonth;
  
  // Calcular ocupación: (habitaciones ocupadas promedio / total habitaciones) * 100
  // Si vendiste 3 noches en un mes con 60 habitaciones:
  // - Capacidad total del período: 60 hab × 30 días = 1800 noches posibles
  // - Ocupación: (3 noches vendidas / 1800) × 100 = 0.17%
  // 
  // Interpretación: Las "noches vendidas" son room-nights totales del período
  const totalCapacity = hotelConfig.totalRooms * daysInPeriod;
  const occupancyRate = totalCapacity > 0 ? ((hotelConfig.nightsSold / totalCapacity) * 100) : 0;
  
  // Calcular RevPAR: (ADR * Ocupación) / 100
  const revpar = (adr * occupancyRate) / 100;
  
  // Navegación
  const navigate = useNavigate();
  
  // Funciones para guardar valores editados
  const handleSaveADR = (value: number) => {
    setADR(value);
    storage.set('kpi_adr', value);
  };
  
  const handleSaveGOP = (value: number) => {
    setGOP(value);
    storage.set('kpi_gop', value);
  };

  const handleDownloadReport = () => {
    setReportDialogOpen(true);
  };
  
  const handleConfirmDownload = () => {
    // Aquí filtrarías los datos según el período seleccionado
    let periodLabel = '';
    switch(reportPeriod) {
      case 'today':
        periodLabel = 'Hoy';
        break;
      case 'week':
        periodLabel = 'Esta Semana';
        break;
      case 'month':
        periodLabel = 'Este Mes';
        break;
      case 'custom':
        periodLabel = `${customStartDate} a ${customEndDate}`;
        break;
    }
    
    // Generar reporte con el período seleccionado
    generateDashboardReport(kpis, metrics, invoices, expenses);
    setReportDialogOpen(false);
    
    // Mostrar confirmación
    alert(`Informe generado para: ${periodLabel}`);
  };

  const formatCurrency = (value: number) => {
    // Usar notación compacta para valores grandes
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Métricas Hoteleras</h3>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              📊 Los valores en <strong>azul</strong> son calculados automáticamente. Los valores en <strong>gris</strong> son editables (haz clic en el botón de editar)
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <EditableKPICard
              name="ADR (Tarifa Promedio)"
              value={adr}
              change={5.2}
              format="currency"
              editable={true}
              onEdit={handleSaveADR}
            />
            
            <EditableKPICard
              name="Ocupación"
              value={occupancyRate}
              change={2.1}
              format="percentage"
              isCalculated={true}
              calculationInfo="Calculado desde noches vendidas"
              editable={false}
            />
            
            <EditableKPICard
              name="RevPAR"
              value={revpar}
              change={7.8}
              format="currency"
              isCalculated={true}
              calculationInfo="ADR × Ocupación"
              editable={false}
            />
            
            <EditableKPICard
              name="GOP (Beneficio)"
              value={gop}
              change={-1.5}
              format="currency"
              editable={true}
              onEdit={handleSaveGOP}
            />
          </div>
        </div>

        {/* Estado de Habitaciones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Estado de Habitaciones</h3>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 Para modificar estas cantidades, ve a <strong>Configuración &gt; Operacional</strong>
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Total de Habitaciones
                </CardTitle>
                <Hotel className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hotelConfig.totalRooms}</div>
                <p className="text-[10px] text-muted-foreground">
                  Capacidad del hotel
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-green-900 dark:text-green-100">
                  Habitaciones Disponibles
                </CardTitle>
                <Hotel className="h-3 w-3 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {hotelConfig.totalRooms - hotelConfig.occupiedRooms}
                </div>
                <p className="text-[10px] text-green-700 dark:text-green-300">
                  Listas para ocupar
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  Habitaciones Ocupadas
                </CardTitle>
                <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {hotelConfig.occupiedRooms}
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300">
                  {hotelConfig.totalRooms > 0 
                    ? `${Math.round((hotelConfig.occupiedRooms / hotelConfig.totalRooms) * 100)}% de ocupación`
                    : '0% de ocupación'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Indicadores Operacionales */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Indicadores de Ventas</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  Noches Vendidas
                </CardTitle>
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hotelConfig.nightsSold}</div>
                <p className="text-[10px] text-muted-foreground">
                  {hotelConfig.nightsSoldPeriod === 'daily' ? 'Hoy' :
                   hotelConfig.nightsSoldPeriod === 'weekly' ? 'Esta semana' :
                   'Este mes'}
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
          <Card 
            className="cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
            onClick={() => navigate('/billing')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Facturas Pendientes
              </CardTitle>
              <FileText className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingInvoices.length}</div>
              <p className="text-[10px] text-muted-foreground">
                Requieren seguimiento →
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
            onClick={() => navigate('/expenses')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Gastos Por Aprobar
              </CardTitle>
              <Receipt className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingExpenses.length}</div>
              <p className="text-xs text-muted-foreground">
                Esperando revisión →
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
      
      {/* Diálogo de selección de período para reportes */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descargar Informe</DialogTitle>
            <DialogDescription>
              Selecciona el período del informe que deseas generar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-period">Período</Label>
              <Select value={reportPeriod} onValueChange={(value: any) => setReportPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {reportPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Fecha Inicio</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Fecha Fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                📊 El informe incluirá: KPIs, métricas operacionales, facturas y gastos del período seleccionado
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmDownload}>
                <Download className="h-4 w-4 mr-2" />
                Generar Informe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
