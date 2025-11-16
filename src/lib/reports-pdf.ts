import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BankAccount, BankMovement, Invoice, Expense, Task, KPI, HotelMetrics } from './types';
import { getHotelConfig } from './hotelConfig';
import { getCategoryLabel } from './expenses';
import { getCategoryLabel as getBankCategoryLabel } from './bank';

// Configuración de fuente para caracteres especiales
const setupPDFFont = (doc: jsPDF) => {
  // Configurar encoding para soportar caracteres especiales
  doc.setLanguage('es');
};

// Función para agregar logo y encabezado
const addHeader = (doc: jsPDF, title: string) => {
  const hotelConfig = getHotelConfig();
  
  // Agregar logo si existe
  if (hotelConfig.logo) {
    try {
      doc.addImage(hotelConfig.logo, 'PNG', 15, 10, 30, 30);
    } catch (error) {
      console.error('Error al agregar logo:', error);
    }
  }
  
  // Título del hotel
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(hotelConfig.name, hotelConfig.logo ? 50 : 15, 20);
  
  // Título del informe
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, hotelConfig.logo ? 50 : 15, 30);
  
  // Fecha
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, hotelConfig.logo ? 50 : 15, 38);
  
  return 45; // Retorna la posición Y donde termina el header
};

// Función para agregar pie de página
const addFooter = (doc: jsPDF, pageNumber: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Pagina ${pageNumber} - Generado por ADMINISTRA`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

// === INFORME DE CONCILIACIÓN BANCARIA ===
export const generateBankingReport = (
  accounts: BankAccount[],
  movements: BankMovement[],
  selectedAccountId?: string
) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe de Conciliacion Bancaria');
  
  // Filtrar movimientos si hay cuenta seleccionada
  const filteredMovements = selectedAccountId
    ? movements.filter(m => m.accountId === selectedAccountId)
    : movements;
  
  const selectedAccount = selectedAccountId
    ? accounts.find(a => a.id === selectedAccountId)
    : null;
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('INTERPRETACION:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const totalIngresos = filteredMovements
    .filter(m => m.type === 'ingreso')
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalEgresos = filteredMovements
    .filter(m => m.type === 'egreso')
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  
  const balance = totalIngresos - totalEgresos;
  
  const interpretation = [
    `Se han registrado ${filteredMovements.length} movimientos bancarios ${selectedAccount ? `en la cuenta ${selectedAccount.name}` : 'en total'}.`,
    ``,
    `Total de Ingresos: ${formatCurrency(totalIngresos)}`,
    `Total de Egresos: ${formatCurrency(totalEgresos)}`,
    `Balance Neto: ${formatCurrency(balance)}`,
    ``,
    balance > 0
      ? `El balance es POSITIVO, indicando que los ingresos superan los egresos.`
      : `El balance es NEGATIVO, se recomienda revisar la liquidez.`,
    ``,
    `Las principales fuentes de ingreso provienen de: Depositos (OTAs como Booking.com,`,
    `Expedia), transacciones POS y transferencias. Los egresos incluyen comisiones`,
    `y fees bancarios que deben ser monitoreados para optimizar costos operativos.`,
  ];
  
  interpretation.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Tabla de movimientos
  yPos += 5;
  const tableData = filteredMovements.map(m => [
    new Date(m.date).toLocaleDateString('es-CL'),
    m.description,
    getBankCategoryLabel(m.category),
    m.type === 'ingreso' ? 'Ingreso' : 'Egreso',
    formatCurrency(m.amount),
    m.reference || 'N/A',
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Fecha', 'Descripcion', 'Categoria', 'Tipo', 'Monto', 'Referencia']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_Conciliacion_Bancaria_${new Date().toISOString().split('T')[0]}.pdf`);
};

// === INFORME DE FACTURACIÓN ===
export const generateBillingReport = (invoices: Invoice[]) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe de Facturacion');
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('INTERPRETACION:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const totalFacturado = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const facturasVencidas = invoices.filter(inv => inv.status === 'vencida').length;
  const facturasPendientes = invoices.filter(inv => inv.status === 'pendiente').length;
  const facturasPagadas = invoices.filter(inv => inv.status === 'pagada').length;
  
  const interpretation = [
    `Se han emitido ${invoices.length} facturas con un total de ${formatCurrency(totalFacturado)}.`,
    ``,
    `Estado de Facturas:`,
    `- Pagadas: ${facturasPagadas} facturas`,
    `- Pendientes: ${facturasPendientes} facturas`,
    `- Vencidas: ${facturasVencidas} facturas`,
    ``,
    facturasVencidas > 0
      ? `ATENCION: Existen ${facturasVencidas} facturas vencidas que requieren gestion de cobranza.`
      : `Todas las facturas estan al dia o pendientes dentro del plazo.`,
    ``,
    `La facturacion se distribuye principalmente entre agencias de viaje, OTAs`,
    `(Booking.com, Expedia), empresas corporativas y eventos. Se recomienda`,
    `mantener un seguimiento activo de las cuentas por cobrar para optimizar`,
    `el flujo de caja del hotel.`,
  ];
  
  interpretation.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Tabla de facturas
  yPos += 5;
  const tableData = invoices.map(inv => [
    inv.number,
    inv.customerName,
    new Date(inv.date).toLocaleDateString('es-CL'),
    new Date(inv.dueDate).toLocaleDateString('es-CL'),
    formatCurrency(inv.amount),
    inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Numero', 'Cliente', 'Fecha Emision', 'Vencimiento', 'Monto', 'Estado']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_Facturacion_${new Date().toISOString().split('T')[0]}.pdf`);
};

// === INFORME DE GASTOS ===
export const generateExpensesReport = (expenses: Expense[]) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe de Gastos Operacionales');
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('INTERPRETACION:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const totalGastos = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const gastosPendientes = expenses.filter(exp => exp.status === 'pendiente').length;
  const gastosAprobados = expenses.filter(exp => exp.status === 'aprobado').length;
  
  // Agrupar por categoría
  const porCategoria = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const categoriaMaxima = Object.entries(porCategoria).sort((a, b) => b[1] - a[1])[0];
  
  const interpretation = [
    `Total de gastos registrados: ${formatCurrency(totalGastos)} en ${expenses.length} partidas.`,
    ``,
    `Estado de Gastos:`,
    `- Aprobados: ${gastosAprobados} gastos`,
    `- Pendientes de aprobacion: ${gastosPendientes} gastos`,
    ``,
    `La categoria con mayor gasto es "${getCategoryLabel(categoriaMaxima[0] as any)}"`,
    `con un total de ${formatCurrency(categoriaMaxima[1])}.`,
    ``,
    `RECOMENDACIONES:`,
    `- Revisar la eficiencia operativa en las categorias de mayor gasto.`,
    `- Establecer controles presupuestarios por departamento (Housekeeping,`,
    `  F&B, Mantenimiento, etc.).`,
    `- Negociar contratos con proveedores para optimizar costos recurrentes.`,
    `- Implementar KPIs de gasto por habitacion ocupada (GOPPAR).`,
  ];
  
  interpretation.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Tabla de gastos
  yPos += 5;
  const tableData = expenses.map(exp => [
    new Date(exp.date).toLocaleDateString('es-CL'),
    exp.description,
    getCategoryLabel(exp.category),
    formatCurrency(exp.amount),
    exp.status.charAt(0).toUpperCase() + exp.status.slice(1),
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Fecha', 'Descripcion', 'Categoria', 'Monto', 'Estado']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_Gastos_${new Date().toISOString().split('T')[0]}.pdf`);
};

// === INFORME DE MÉTRICAS HOTELERAS ===
export const generateMetricsReport = (kpis: KPI[], metrics: HotelMetrics) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe de Metricas Hoteleras - KPIs');
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('INTERPRETACION DE METRICAS:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const adr = kpis.find(k => k.name === 'ADR');
  const revpar = kpis.find(k => k.name === 'RevPAR');
  const occupancy = kpis.find(k => k.name === 'Ocupacion');
  const gop = kpis.find(k => k.name === 'GOP');
  
  const interpretation = [
    `INDICADORES CLAVE DE RENDIMIENTO (KPIs):`,
    ``,
    `1. ADR (Average Daily Rate): ${adr && adr.format ? formatValue(adr.value, adr.format) : 'N/A'}`,
    `   Tarifa promedio diaria por habitacion vendida. Este indicador muestra`,
    `   el precio promedio al que se estan vendiendo las habitaciones.`,
    ``,
    `2. RevPAR (Revenue Per Available Room): ${revpar && revpar.format ? formatValue(revpar.value, revpar.format) : 'N/A'}`,
    `   Ingreso por habitacion disponible. Es el KPI mas importante ya que`,
    `   combina ocupacion y tarifa. Indica la efectividad en la generacion`,
    `   de ingresos por habitacion, ocupada o no.`,
    ``,
    `3. Ocupacion: ${occupancy && occupancy.format ? formatValue(occupancy.value, occupancy.format) : 'N/A'}`,
    `   Porcentaje de habitaciones vendidas vs disponibles. Muestra la`,
    `   demanda y efectividad de las estrategias comerciales.`,
    ``,
    `4. GOP (Gross Operating Profit): ${gop && gop.format ? formatValue(gop.value, gop.format) : 'N/A'}`,
    `   Utilidad operativa bruta. Es el beneficio antes de impuestos y`,
    `   costos fijos. Mide la rentabilidad operacional del hotel.`,
    ``,
    `METRICAS OPERACIONALES:`,
    `- Habitaciones Disponibles: ${metrics.roomsAvailable}`,
    `- Noches Vendidas: ${metrics.roomsSold}`,
    `- Ingresos Totales: ${formatCurrency(metrics.totalRevenue)}`,
    `- Gastos Totales: ${formatCurrency(metrics.totalExpenses)}`,
    ``,
    `ANALISIS:`,
    occupancy && occupancy.value >= 75
      ? `La ocupacion de ${occupancy.value}% es EXCELENTE, por encima del benchmark.`
      : occupancy && occupancy.value >= 60
      ? `La ocupacion de ${occupancy.value}% es BUENA, dentro del rango esperado.`
      : `La ocupacion requiere atencion. Revisar estrategias de marketing.`,
    ``,
    `RECOMENDACIONES:`,
    `- Monitorear ADR vs competencia para mantener competitividad.`,
    `- Optimizar Revenue Management para maximizar RevPAR.`,
    `- Controlar GOP mensualmente para asegurar rentabilidad.`,
    `- Implementar estrategias dinamicas de pricing segun demanda.`,
  ];
  
  interpretation.forEach(line => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_Metricas_KPIs_${new Date().toISOString().split('T')[0]}.pdf`);
};

// === INFORME DE TAREAS ===
export const generateTasksReport = (tasks: Task[]) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe de Tareas Administrativas');
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('INTERPRETACION:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const completadas = tasks.filter(t => t.status === 'completada').length;
  const pendientes = tasks.filter(t => t.status === 'pendiente').length;
  const enProgreso = tasks.filter(t => t.status === 'en-progreso').length;
  const altaPrioridad = tasks.filter(t => t.priority === 'alta').length;
  
  const interpretation = [
    `Total de tareas registradas: ${tasks.length}`,
    ``,
    `Estado de Tareas:`,
    `- Completadas: ${completadas} tareas`,
    `- En Progreso: ${enProgreso} tareas`,
    `- Pendientes: ${pendientes} tareas`,
    ``,
    `Tareas de Alta Prioridad: ${altaPrioridad}`,
    ``,
    ...(altaPrioridad > 0
      ? [
          `ATENCION: Existen ${altaPrioridad} tareas de alta prioridad que requieren`,
          `atencion inmediata (auditorias, vencimientos, pagos, etc.).`,
        ]
      : [`No hay tareas criticas pendientes. Mantener el ritmo de trabajo.`]
    ),
    ``,
    `RECOMENDACIONES:`,
    `- Priorizar tareas de auditoria y conciliacion para mantener controles.`,
    `- Revisar vencimientos semanalmente para evitar retrasos.`,
    `- Asignar responsables claros a cada tarea administrativa.`,
    `- Establecer un calendario de tareas recurrentes (reportes mensuales).`,
  ];
  
  interpretation.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Tabla de tareas
  yPos += 5;
  const tableData = tasks.map(t => [
    t.title,
    t.category.charAt(0).toUpperCase() + t.category.slice(1),
    new Date(t.dueDate).toLocaleDateString('es-CL'),
    t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
    t.status.charAt(0).toUpperCase() + t.status.slice(1),
    t.assignedTo || 'Sin asignar',
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Tarea', 'Categoria', 'Vencimiento', 'Prioridad', 'Estado', 'Asignado a']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_Tareas_${new Date().toISOString().split('T')[0]}.pdf`);
};

// === INFORME GENERAL (Dashboard) ===
export const generateDashboardReport = (
  kpis: KPI[],
  metrics: HotelMetrics,
  invoices: Invoice[],
  expenses: Expense[]
) => {
  const doc = new jsPDF();
  setupPDFFont(doc);
  
  let yPos = addHeader(doc, 'Informe General - Dashboard Ejecutivo');
  
  // Interpretación
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPos += 10;
  doc.text('RESUMEN EJECUTIVO:', 15, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const pendingInvoices = invoices.filter(inv => inv.status === 'pendiente' || inv.status === 'vencida');
  const pendingExpenses = expenses.filter(exp => exp.status === 'pendiente');
  
  const interpretation = [
    `Este informe presenta un resumen ejecutivo del estado operacional`,
    `y financiero del hotel.`,
    ``,
    `METRICAS HOTELERAS PRINCIPALES:`,
    ...kpis.map(kpi => `- ${kpi.name}: ${kpi.format ? formatValue(kpi.value, kpi.format) : kpi.value}`),
    ``,
    `INDICADORES OPERACIONALES:`,
    `- Habitaciones Disponibles: ${metrics.roomsAvailable}`,
    `- Noches Vendidas este mes: ${metrics.roomsSold}`,
    `- Ingresos Totales: ${formatCurrency(metrics.totalRevenue)}`,
    `- Gastos Totales: ${formatCurrency(metrics.totalExpenses)}`,
    `- GOP (Utilidad Operativa): ${formatCurrency(metrics.gop)}`,
    ``,
    `ALERTAS Y PENDIENTES:`,
    `- Facturas Pendientes/Vencidas: ${pendingInvoices.length}`,
    `- Gastos por Aprobar: ${pendingExpenses.length}`,
    ``,
    `SALUD FINANCIERA:`,
    metrics.gop > 0
      ? `El GOP es POSITIVO (${formatCurrency(metrics.gop)}), indicando rentabilidad.`
      : `ATENCION: El GOP es negativo. Revisar costos operativos urgentemente.`,
    ``,
    metrics.occupancy >= 75
      ? `Ocupacion EXCELENTE (${metrics.occupancy}%). Hotel operando por encima`
      : metrics.occupancy >= 60
      ? `Ocupacion BUENA (${metrics.occupancy}%). Mantener estrategias comerciales.`
      : `Ocupacion BAJA (${metrics.occupancy}%). Requiere acciones comerciales.`,
    metrics.occupancy >= 75 ? `del benchmark de la industria.` : ``,
    ``,
    `RECOMENDACIONES ESTRATEGICAS:`,
    `1. Continuar monitoreando KPIs semanalmente (ADR, RevPAR, Ocupacion).`,
    `2. Optimizar Revenue Management con pricing dinamico.`,
    `3. Controlar gastos operativos por departamento.`,
    `4. Mantener buenas relaciones con OTAs y agencias.`,
    `5. Invertir en marketing digital para captar demanda directa.`,
  ];
  
  interpretation.forEach(line => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  addFooter(doc, 1);
  doc.save(`Informe_General_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Utilidades
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatValue = (value: number, format: 'currency' | 'percentage' | 'number'): string => {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
      return value.toLocaleString('es-CL');
    default:
      return String(value);
  }
};
