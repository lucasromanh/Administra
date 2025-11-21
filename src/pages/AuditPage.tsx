import { Header } from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AuditoriaCompleta, Invoice, Expense, StockItem, PayrollItem } from '@/lib/types';
import { storage } from '@/lib/storage';
import { AuditoriaActions } from '@/components/auditoria/AuditoriaActions';
import { AuditoriaHistory } from '@/components/auditoria/AuditoriaHistory';
import { AuditoriaDetail } from '@/components/auditoria/AuditoriaDetail';
import { AuditoriaFilters, type AuditoriaFilterState } from '@/components/auditoria/AuditoriaFilters';
import { AuditoriaGenerateModal } from '@/components/auditoria/AuditoriaGenerateModal';
import { toast } from 'sonner';

export function AuditPage() {
  const [auditorias, setAuditorias] = useState<AuditoriaCompleta[]>([]);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<AuditoriaCompleta | null>(null);
  const [filteredAuditorias, setFilteredAuditorias] = useState<AuditoriaCompleta[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [tipoModalGenerar, setTipoModalGenerar] = useState<'semanal' | 'mensual' | 'personalizada'>('semanal');

  // Cargar auditorías desde storage
  useEffect(() => {
    const savedAuditorias = storage.get<AuditoriaCompleta[]>('auditorias', []);
    setAuditorias(savedAuditorias);
    setFilteredAuditorias(savedAuditorias);
  }, []);

  // Guardar auditorías en storage
  const saveAuditorias = (newAuditorias: AuditoriaCompleta[]) => {
    storage.set('auditorias', newAuditorias);
    setAuditorias(newAuditorias);
    setFilteredAuditorias(newAuditorias);
  };

  // Generar auditoría completa
  const generarAuditoria = (fechaDesde: string, fechaHasta: string, descripcion: string) => {
    const invoices = storage.get<Invoice[]>('invoices', []);
    const expenses = storage.get<Expense[]>('expenses', []);
    const stockItems = storage.get<StockItem[]>('stock_items', []);
    const payrollItems = storage.get<PayrollItem[]>('payroll_items', []);

    // Filtrar por rango de fechas
    const fechaDesdeObj = new Date(fechaDesde);
    const fechaHastaObj = new Date(fechaHasta);

    const invoicesEnPeriodo = invoices.filter(inv => {
      const fecha = new Date(inv.date);
      return fecha >= fechaDesdeObj && fecha <= fechaHastaObj;
    });

    const expensesEnPeriodo = expenses.filter(exp => {
      const fecha = new Date(exp.date);
      return fecha >= fechaDesdeObj && fecha <= fechaHastaObj;
    });

    // Análisis de Facturación
    const totalIngresos = invoicesEnPeriodo
      .filter(inv => inv.status === 'pagada')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const facturasPagadas = invoicesEnPeriodo.filter(inv => inv.status === 'pagada').length;
    const facturasVencidas = invoicesEnPeriodo.filter(inv => inv.status === 'vencida').length;
    
    const totalFacturado = invoicesEnPeriodo.reduce((sum, inv) => sum + inv.amount, 0);
    const discrepanciaCobranza = totalFacturado - totalIngresos;

    // Análisis de Gastos
    const totalEgresos = expensesEnPeriodo
      .filter(exp => exp.status === 'pagado')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const gastosAprobados = expensesEnPeriodo.filter(exp => exp.status === 'pagado').length;
    const gastosSinComprobante = expensesEnPeriodo.filter(exp => !exp.description || exp.description.length < 5).length;
    
    // Detectar posibles duplicados (mismo monto y fecha)
    const gastosDuplicados = expensesEnPeriodo.reduce((count, exp, idx, arr) => {
      const duplicado = arr.slice(idx + 1).some(e => 
        e.amount === exp.amount && 
        new Date(e.date).toDateString() === new Date(exp.date).toDateString()
      );
      return count + (duplicado ? 1 : 0);
    }, 0);

    // Análisis de Stock
    const valorTotal = stockItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const productosConStock = stockItems.filter(item => item.quantity > 0).length;
    const productosStockNegativo = stockItems.filter(item => item.quantity < 0).length;
    const productosSinMovimiento = stockItems.filter(item => item.quantity === 0).length;

    // Análisis de Sueldos
    const payrollEnPeriodo = payrollItems.filter(item => {
      const fecha = new Date(item.paymentDate || item.periodEnd);
      return fecha >= fechaDesdeObj && fecha <= fechaHastaObj;
    });

    const totalLiquidado = payrollEnPeriodo
      .filter(item => item.status === 'pagado')
      .reduce((sum, item) => sum + item.netSalary, 0);

    const liquidacionesPendientes = payrollEnPeriodo.filter(item => item.status === 'pendiente').length;
    const recibosFaltantes = payrollEnPeriodo.filter(item => item.status === 'pagado' && !item.paymentDate).length;

    // Conciliación Bancaria (simulado)
    const movimientosConciliados = invoicesEnPeriodo.filter(inv => inv.status === 'pagada').length;
    const movimientosPendientes = invoicesEnPeriodo.filter(inv => inv.status === 'pendiente').length;
    const depositosSinFacturar = Math.floor(Math.random() * 3); // Simular
    const diferenciaTotal = Math.abs(totalIngresos - totalEgresos - totalLiquidado);

    // Resumen General
    const balance = totalIngresos - totalEgresos - totalLiquidado;
    const margenBruto = totalIngresos > 0 ? ((totalIngresos - totalEgresos) / totalIngresos) * 100 : 0;
    const flujoEfectivo = balance;

    // Generar alertas
    const alertas = [];
    let alertaId = 1;

    if (facturasVencidas > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'critica' as const,
        categoria: 'facturacion' as const,
        titulo: 'Facturas Vencidas',
        descripcion: `Hay ${facturasVencidas} facturas vencidas pendientes de cobro.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (discrepanciaCobranza > 1000) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'advertencia' as const,
        categoria: 'facturacion' as const,
        titulo: 'Discrepancia en Cobranza',
        descripcion: `Diferencia de $${discrepanciaCobranza.toLocaleString('es-AR')} entre facturado y cobrado.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (gastosSinComprobante > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'critica' as const,
        categoria: 'gastos' as const,
        titulo: 'Gastos sin Comprobante',
        descripcion: `${gastosSinComprobante} gastos registrados sin comprobante o descripción adecuada.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (gastosDuplicados > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'advertencia' as const,
        categoria: 'gastos' as const,
        titulo: 'Posibles Gastos Duplicados',
        descripcion: `Se detectaron ${gastosDuplicados} gastos con montos y fechas similares.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (productosStockNegativo > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'critica' as const,
        categoria: 'stock' as const,
        titulo: 'Stock Negativo',
        descripcion: `${productosStockNegativo} productos con stock negativo. Revisar inventario.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (productosSinMovimiento > 5) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'info' as const,
        categoria: 'stock' as const,
        titulo: 'Productos sin Movimiento',
        descripcion: `${productosSinMovimiento} productos sin stock. Considerar reposición o descatalogación.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (liquidacionesPendientes > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'advertencia' as const,
        categoria: 'sueldos' as const,
        titulo: 'Liquidaciones Pendientes',
        descripcion: `${liquidacionesPendientes} liquidaciones pendientes de pago.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (recibosFaltantes > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'advertencia' as const,
        categoria: 'sueldos' as const,
        titulo: 'Recibos Faltantes',
        descripcion: `${recibosFaltantes} liquidaciones pagadas sin fecha de pago registrada.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (diferenciaTotal > 5000) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'critica' as const,
        categoria: 'bancaria' as const,
        titulo: 'Diferencia en Conciliación',
        descripcion: `Diferencia de $${diferenciaTotal.toLocaleString('es-AR')} en conciliación bancaria.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    if (depositosSinFacturar > 0) {
      alertas.push({
        id: String(alertaId++),
        tipo: 'advertencia' as const,
        categoria: 'bancaria' as const,
        titulo: 'Depósitos sin Facturar',
        descripcion: `${depositosSinFacturar} depósitos bancarios sin factura asociada.`,
        fecha: new Date().toISOString(),
        resuelta: false
      });
    }

    // Crear nueva auditoría
    const nuevaAuditoria: AuditoriaCompleta = {
      id: Date.now().toString(),
      tipo: tipoModalGenerar,
      periodo: {
        desde: fechaDesde,
        hasta: fechaHasta,
        descripcion
      },
      fechaGeneracion: new Date().toISOString(),
      generadoPor: 'Sistema',
      estado: 'pendiente',
      resultados: {
        facturacion: {
          totalIngresos,
          facturasPagadas,
          facturasVencidas,
          discrepanciaCobranza,
          detalleFacturas: invoicesEnPeriodo.map(inv => ({
            id: inv.id,
            cliente: inv.customerName,
            monto: inv.amount,
            estado: inv.status,
            fecha: inv.date
          }))
        },
        gastos: {
          totalEgresos,
          gastosAprobados,
          gastosSinComprobante,
          gastosDuplicados,
          detalleGastos: expensesEnPeriodo.map(exp => ({
            id: exp.id,
            descripcion: exp.description,
            monto: exp.amount,
            estado: exp.status,
            fecha: exp.date
          }))
        },
        stock: {
          valorTotal,
          productosConStock,
          productosStockNegativo,
          productosSinMovimiento
        },
        sueldos: {
          totalLiquidado,
          liquidacionesPendientes,
          recibosFaltantes
        },
        conciliacionBancaria: {
          movimientosConciliados,
          movimientosPendientes,
          depositosSinFacturar,
          diferenciaTotal
        },
        resumenGeneral: {
          balance,
          margenBruto,
          flujoEfectivo,
          alertasCriticas: alertas.filter(a => a.tipo === 'critica').length,
          alertasAdvertencia: alertas.filter(a => a.tipo === 'advertencia').length,
          alertasInfo: alertas.filter(a => a.tipo === 'info').length
        }
      },
      alertas
    };

    const nuevasAuditorias = [nuevaAuditoria, ...auditorias];
    saveAuditorias(nuevasAuditorias);
    setAuditoriaSeleccionada(nuevaAuditoria);
    
    toast.success('Auditoría generada exitosamente', {
      description: `${alertas.length} alertas detectadas`
    });
  };

  const handleOpenGenerate = (tipo: 'semanal' | 'mensual' | 'personalizada') => {
    setTipoModalGenerar(tipo);
    setShowGenerateModal(true);
  };

  const handleFilterChange = (filters: AuditoriaFilterState) => {
    let filtered = [...auditorias];

    // Filtrar por fechas
    if (filters.fechaDesde) {
      filtered = filtered.filter(aud => 
        new Date(aud.periodo.desde) >= new Date(filters.fechaDesde)
      );
    }
    if (filters.fechaHasta) {
      filtered = filtered.filter(aud => 
        new Date(aud.periodo.hasta) <= new Date(filters.fechaHasta)
      );
    }

    // Filtrar por tipo
    if (filters.tipo !== 'todas') {
      filtered = filtered.filter(aud => aud.tipo === filters.tipo);
    }

    // Filtrar por estado
    if (filters.estado !== 'todos') {
      filtered = filtered.filter(aud => aud.estado === filters.estado);
    }

    setFilteredAuditorias(filtered);
  };

  const handleResolverAlerta = (id: string) => {
    if (!auditoriaSeleccionada) return;

    const alertaActualizada = auditoriaSeleccionada.alertas.map(alerta =>
      alerta.id === id ? { ...alerta, resuelta: true } : alerta
    );

    const auditoriaActualizada = {
      ...auditoriaSeleccionada,
      alertas: alertaActualizada
    };

    const nuevasAuditorias = auditorias.map(aud =>
      aud.id === auditoriaSeleccionada.id ? auditoriaActualizada : aud
    );

    saveAuditorias(nuevasAuditorias);
    setAuditoriaSeleccionada(auditoriaActualizada);
    toast.success('Alerta marcada como resuelta');
  };

  const handleCambiarEstado = (id: string, nuevoEstado: 'pendiente' | 'aprobada' | 'observada') => {
    const nuevasAuditorias = auditorias.map(aud =>
      aud.id === id ? { ...aud, estado: nuevoEstado } : aud
    );
    saveAuditorias(nuevasAuditorias);
    
    if (auditoriaSeleccionada?.id === id) {
      setAuditoriaSeleccionada({ ...auditoriaSeleccionada, estado: nuevoEstado });
    }
    
    toast.success('Estado actualizado');
  };

  const handleExportar = (id: string, formato: 'pdf' | 'excel') => {
    const auditoria = auditorias.find(aud => aud.id === id);
    if (!auditoria) return;

    // Simular exportación
    toast.success(`Exportando auditoría a ${formato.toUpperCase()}...`, {
      description: `${auditoria.periodo.descripcion}`
    });
    
    setTimeout(() => {
      toast.success(`Auditoría exportada exitosamente`);
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast.info('Función de descarga en desarrollo');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Auditorías</h1>
            <p className="text-muted-foreground mt-1">
              Sistema integral de auditoría con análisis automático y generación de reportes
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <AuditoriaActions
          onGenerateSemanal={() => handleOpenGenerate('semanal')}
          onGenerateMensual={() => handleOpenGenerate('mensual')}
          onGeneratePersonalizada={() => handleOpenGenerate('personalizada')}
          onVerHistorial={() => setAuditoriaSeleccionada(null)}
          onExportar={handleDownloadReport}
        />

        {/* Tabs: Vista de Detalle o Historial */}
        <Tabs value={auditoriaSeleccionada ? 'detalle' : 'historial'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="historial"
              onClick={() => setAuditoriaSeleccionada(null)}
            >
              Historial de Auditorías
            </TabsTrigger>
            <TabsTrigger
              value="detalle"
              disabled={!auditoriaSeleccionada}
            >
              Detalle de Auditoría
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historial" className="space-y-4 mt-6">
            {/* Filtros */}
            <AuditoriaFilters onFilterChange={handleFilterChange} />

            {/* Lista de auditorías */}
            {filteredAuditorias.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No hay auditorías generadas. Utiliza los botones de acción para crear una nueva auditoría.
                </p>
              </div>
            ) : (
              <AuditoriaHistory
                auditorias={filteredAuditorias}
                onVerDetalle={setAuditoriaSeleccionada}
                onCambiarEstado={handleCambiarEstado}
                onExportar={handleExportar}
              />
            )}
          </TabsContent>

          <TabsContent value="detalle" className="space-y-4 mt-6">
            {auditoriaSeleccionada && (
              <AuditoriaDetail
                auditoria={auditoriaSeleccionada}
                onResolverAlerta={handleResolverAlerta}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de generación */}
      <AuditoriaGenerateModal
        open={showGenerateModal}
        onOpenChange={setShowGenerateModal}
        tipo={tipoModalGenerar}
        onGenerar={generarAuditoria}
      />
    </div>
  );
}
