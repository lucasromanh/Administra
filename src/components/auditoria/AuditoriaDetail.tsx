import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Building2,
  AlertTriangle
} from 'lucide-react';
import type { AuditoriaCompleta } from '@/lib/types';
import { AuditoriaAlerts } from './AuditoriaAlerts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AuditoriaDetailProps {
  auditoria: AuditoriaCompleta;
  onResolverAlerta?: (id: string) => void;
}

export function AuditoriaDetail({ auditoria, onResolverAlerta }: AuditoriaDetailProps) {
  const { resultados } = auditoria;

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle>Resumen General - {auditoria.periodo.descripcion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-75">Balance Final</span>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold mt-2">
                ${resultados.resumenGeneral.balance.toLocaleString('es-AR')}
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-75">Margen Bruto</span>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold mt-2">
                {resultados.resumenGeneral.margenBruto.toFixed(1)}%
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-75">Flujo de Efectivo</span>
                <TrendingDown className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold mt-2">
                ${resultados.resumenGeneral.flujoEfectivo.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de 2 columnas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Facturación */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="bg-green-100">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <DollarSign className="h-5 w-5" />
              Facturación
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-muted-foreground">Total Ingresos</div>
                <div className="text-2xl font-bold text-green-700">
                  ${resultados.facturacion.totalIngresos.toLocaleString('es-AR')}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-muted-foreground">Pagadas</div>
                <div className="text-2xl font-bold text-green-700">
                  {resultados.facturacion.facturasPagadas}
                </div>
              </div>
            </div>

            {resultados.facturacion.facturasVencidas > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.facturacion.facturasVencidas} Facturas Vencidas
                  </span>
                </div>
              </div>
            )}

            {resultados.facturacion.discrepanciaCobranza > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    Discrepancia: ${resultados.facturacion.discrepanciaCobranza.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            )}

            {/* Tabla de facturas */}
            {resultados.facturacion.detalleFacturas.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.facturacion.detalleFacturas.slice(0, 5).map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell className="font-medium">{factura.cliente}</TableCell>
                        <TableCell>${factura.monto.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <Badge variant={factura.estado === 'pagada' ? 'default' : 'destructive'}>
                            {factura.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="bg-red-100">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <TrendingDown className="h-5 w-5" />
              Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-red-200">
                <div className="text-sm text-muted-foreground">Total Egresos</div>
                <div className="text-2xl font-bold text-red-700">
                  ${resultados.gastos.totalEgresos.toLocaleString('es-AR')}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-red-200">
                <div className="text-sm text-muted-foreground">Aprobados</div>
                <div className="text-2xl font-bold text-red-700">
                  {resultados.gastos.gastosAprobados}
                </div>
              </div>
            </div>

            {resultados.gastos.gastosSinComprobante > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.gastos.gastosSinComprobante} Sin Comprobante
                  </span>
                </div>
              </div>
            )}

            {resultados.gastos.gastosDuplicados > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.gastos.gastosDuplicados} Posibles Duplicados
                  </span>
                </div>
              </div>
            )}

            {/* Tabla de gastos */}
            {resultados.gastos.detalleGastos.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.gastos.detalleGastos.slice(0, 5).map((gasto) => (
                      <TableRow key={gasto.id}>
                        <TableCell className="font-medium">{gasto.descripcion}</TableCell>
                        <TableCell>${gasto.monto.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <Badge variant={gasto.estado === 'aprobado' ? 'default' : 'secondary'}>
                            {gasto.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="bg-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Package className="h-5 w-5" />
              Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="text-sm text-muted-foreground">Valor Total</div>
                <div className="text-2xl font-bold text-purple-700">
                  ${resultados.stock.valorTotal.toLocaleString('es-AR')}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="text-sm text-muted-foreground">Productos</div>
                <div className="text-2xl font-bold text-purple-700">
                  {resultados.stock.productosConStock}
                </div>
              </div>
            </div>

            {resultados.stock.productosStockNegativo > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.stock.productosStockNegativo} Con Stock Negativo
                  </span>
                </div>
              </div>
            )}

            {resultados.stock.productosSinMovimiento > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.stock.productosSinMovimiento} Sin Movimiento
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sueldos */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="bg-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="h-5 w-5" />
              Liquidaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-sm text-muted-foreground">Total Liquidado</div>
                <div className="text-2xl font-bold text-blue-700">
                  ${resultados.sueldos.totalLiquidado.toLocaleString('es-AR')}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-sm text-muted-foreground">Pendientes</div>
                <div className="text-2xl font-bold text-blue-700">
                  {resultados.sueldos.liquidacionesPendientes}
                </div>
              </div>
            </div>

            {resultados.sueldos.recibosFaltantes > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    {resultados.sueldos.recibosFaltantes} Recibos Faltantes
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conciliación Bancaria */}
        <Card className="border-indigo-200 bg-indigo-50/50 lg:col-span-2">
          <CardHeader className="bg-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Building2 className="h-5 w-5" />
              Conciliación Bancaria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="p-3 bg-white rounded-lg border border-indigo-200">
                <div className="text-sm text-muted-foreground">Conciliados</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {resultados.conciliacionBancaria.movimientosConciliados}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-indigo-200">
                <div className="text-sm text-muted-foreground">Pendientes</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {resultados.conciliacionBancaria.movimientosPendientes}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-indigo-200">
                <div className="text-sm text-muted-foreground">Sin Facturar</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {resultados.conciliacionBancaria.depositosSinFacturar}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-indigo-200">
                <div className="text-sm text-muted-foreground">Diferencia</div>
                <div className="text-2xl font-bold text-indigo-700">
                  ${resultados.conciliacionBancaria.diferenciaTotal.toLocaleString('es-AR')}
                </div>
              </div>
            </div>

            {resultados.conciliacionBancaria.diferenciaTotal > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">
                    Diferencia detectada en conciliación bancaria
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <AuditoriaAlerts alertas={auditoria.alertas} onResolverAlerta={onResolverAlerta} />
    </div>
  );
}
