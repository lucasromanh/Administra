import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImportCashRegisterModal } from '@/components/cashImport/ImportCashRegisterModal';
import { Upload, FileSpreadsheet, Calendar, DollarSign, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { storage } from '@/lib/storage';
import type { CashRegisterImport, Expense } from '@/lib/types';

export function CashImportPage() {
  const [imports, setImports] = useState<CashRegisterImport[]>(
    storage.get<CashRegisterImport[]>('cash_imports', [])
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImport = (records: CashRegisterImport[]) => {
    const updated = [...imports, ...records];
    setImports(updated);
    storage.set('cash_imports', updated);

    // Procesar registros como gastos/ingresos automáticamente
    processRecordsAsExpenses(records);
  };

  const processRecordsAsExpenses = (records: CashRegisterImport[]) => {
    const expenses = storage.get<Expense[]>('expenses', []);
    
    const newExpenses: Expense[] = records.map(record => ({
      id: record.id,
      date: record.fecha,
      description: `${record.ingreso} - ${record.area}`,
      category: mapAreaToCategory(record.area),
      amount: record.total,
      supplier: record.razonSocial || 'Hotel',
      invoiceNumber: record.numeroFactura,
      status: 'aprobado' as const,
      createdBy: record.creadoPor || 'Importación Automática',
    }));

    const allExpenses = [...expenses, ...newExpenses];
    storage.set('expenses', allExpenses);

    // Marcar como procesados
    const updatedImports = imports.map(imp => 
      records.find(r => r.id === imp.id) 
        ? { ...imp, processed: true } 
        : imp
    );
    setImports(updatedImports);
    storage.set('cash_imports', updatedImports);
  };

  const mapAreaToCategory = (area: string): Expense['category'] => {
    const areaUpper = area.toUpperCase();
    if (areaUpper.includes('RECEPCION') || areaUpper.includes('HABITACION')) return 'suministros';
    if (areaUpper.includes('DESAYUNO') || areaUpper.includes('COMIDA')) return 'f&b';
    if (areaUpper.includes('LIMPIEZA')) return 'housekeeping';
    if (areaUpper.includes('MANTENIMIENTO')) return 'mantenimiento';
    return 'otros';
  };

  const handleMarkAsProcessed = (id: string) => {
    const updated = imports.map(imp => 
      imp.id === id ? { ...imp, processed: true } : imp
    );
    setImports(updated);
    storage.set('cash_imports', updated);
  };

  // Estadísticas
  const totalRecords = imports.length;
  const processedRecords = imports.filter(i => i.processed).length;
  const pendingRecords = totalRecords - processedRecords;
  const totalAmount = imports.reduce((sum, i) => sum + i.total, 0);
  const processedAmount = imports.filter(i => i.processed).reduce((sum, i) => sum + i.total, 0);

  // Agrupar por fecha
  const byDate = imports.reduce((acc, imp) => {
    const date = imp.fecha;
    if (!acc[date]) acc[date] = [];
    acc[date].push(imp);
    return acc;
  }, {} as Record<string, CashRegisterImport[]>);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Importación Caja Diaria</h1>
          <p className="text-sm text-muted-foreground">
            Importa registros del Excel de Caja Diaria del hotel
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Excel
        </Button>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Registros
              </CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords}</div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(byDate).length} días importados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Monto
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalAmount.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                Suma total importada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procesados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{processedRecords}</div>
              <p className="text-xs text-muted-foreground">
                ${processedAmount.toLocaleString('es-CL')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingRecords}</div>
              <p className="text-xs text-muted-foreground">
                ${(totalAmount - processedAmount).toLocaleString('es-CL')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio Diario
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(totalAmount / Math.max(Object.keys(byDate).length, 1)).toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                Por día
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Importaciones */}
        {totalRecords === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay registros importados</h3>
                <p className="text-muted-foreground mb-4">
                  Comienza importando el archivo Excel de la Caja Diaria
                </p>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importar Primer Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Registros Importados</CardTitle>
              <CardDescription>
                Historial de todas las importaciones de caja diaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Razón Social</TableHead>
                      <TableHead>Método Pago</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {imports.slice(0, 100).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(record.fecha).toLocaleDateString('es-CL')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {record.turno}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {record.ingreso}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.area}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.razonSocial || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {record.metodoPago}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${record.total.toLocaleString('es-CL')}
                        </TableCell>
                        <TableCell>
                          {record.processed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Procesado
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsProcessed(record.id)}
                            >
                              <Clock className="h-3 w-3 text-orange-600" />
                              Pendiente
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {imports.length > 100 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Mostrando 100 de {imports.length} registros
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de importación */}
      <ImportCashRegisterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
