import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImportCashRegisterModal } from '@/components/cashImport/ImportCashRegisterModal';
import { Upload, FileSpreadsheet, Calendar, DollarSign, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import type { CashRegisterImport, Expense, ExpenseCategory } from '@/lib/types';

export function CashImportPage() {
  const [imports, setImports] = useState<CashRegisterImport[]>(
    storage.get<CashRegisterImport[]>('cash_imports', [])
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleImport = (records: CashRegisterImport[]) => {
    console.log('🟢 CashImportPage.handleImport recibió:', records.length, 'registros');
    const updated = [...imports, ...records];
    setImports(updated);
    storage.set('cash_imports', updated);
    toast.success(`${records.length} registros importados correctamente`, {
      description: 'Ahora puedes procesarlos como gastos'
    });
  };

  const handleProcessAsExpense = (record: CashRegisterImport) => {
    console.log('💰 Procesando como gasto:', record.id);
    const expenses = storage.get<Expense[]>('expenses', []);
    
    const category = mapAreaToCategory(record.area);
    const newExpense: Expense = {
      id: record.id,
      date: record.fecha,
      description: `${record.area}: ${record.ingreso}${record.razonSocial ? ' - ' + record.razonSocial : ''}`,
      category,
      amount: Math.abs(record.total),
      supplier: record.razonSocial || 'Hotel',
      invoiceNumber: record.numeroFactura,
      status: 'aprobado' as const,
      createdBy: record.creadoPor || 'Caja Diaria',
    };

    storage.set('expenses', [...expenses, newExpense]);
    
    // Marcar como procesado
    const updatedImports = imports.map(imp => 
      imp.id === record.id ? { ...imp, processed: true, processedAs: 'gasto' as const } : imp
    );
    setImports(updatedImports);
    storage.set('cash_imports', updatedImports);
    
    toast.success('✅ Agregado al módulo de Gastos', {
      description: `Categoría: ${category.toUpperCase()} - $${Math.abs(record.total).toLocaleString('es-CL')}`
    });
  };

  const handleUnprocess = (record: CashRegisterImport) => {
    console.log('↩️ Deshaciendo procesamiento:', record.id);
    
    // Si era gasto, eliminarlo
    if (record.processedAs === 'gasto') {
      const expenses = storage.get<Expense[]>('expenses', []);
      const filtered = expenses.filter(e => e.id !== record.id);
      storage.set('expenses', filtered);
    }
    
    // Marcar como no procesado
    const updatedImports = imports.map(imp => 
      imp.id === record.id ? { ...imp, processed: false, processedAs: undefined } : imp
    );
    setImports(updatedImports);
    storage.set('cash_imports', updatedImports);
    
    toast.info('Registro eliminado del módulo de Gastos', {
      description: 'Ahora puedes procesarlo nuevamente'
    });
  };

  const mapAreaToCategory = (area: string): ExpenseCategory => {
    const areaLower = area.toLowerCase().trim();
    
    // Mapeo de áreas del Excel a categorías del sistema de gastos
    if (areaLower === 'recepcion' || areaLower.includes('recepcion')) return 'suministros';
    if (areaLower === 'desayuno' || areaLower.includes('desayuno')) return 'f&b';
    if (areaLower === 'retiro') return 'otros';
    if (areaLower === 'mucama' || areaLower === 'limpieza') return 'housekeeping';
    if (areaLower === 'mantenimiento' || areaLower.includes('mantenimiento')) return 'mantenimiento';
    
    return 'suministros';
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
                {Object.keys(byDate).length} días
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
              <div className="text-xl font-bold break-words">
                ${totalAmount.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                Total importado
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
              <p className="text-xs text-muted-foreground truncate">
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
              <p className="text-xs text-muted-foreground truncate">
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
              <div className="text-xl font-bold break-words">
                ${Math.round(totalAmount / Math.max(Object.keys(byDate).length, 1)).toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio/día
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
                Procesa cada registro asignándolo a Gastos o Liquidación de Sueldos
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
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {imports
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((record) => {
                        const formattedTotal = record.total < 0 
                          ? `-$${Math.abs(record.total).toLocaleString('es-CL')}`
                          : `$${record.total.toLocaleString('es-CL')}`;
                        
                        return (
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
                            <TableCell className="text-sm font-medium max-w-48 truncate" title={record.ingreso}>
                              {record.ingreso}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{record.area}</Badge>
                            </TableCell>
                            <TableCell className="text-sm max-w-40 truncate" title={record.razonSocial || ''}>
                              {record.razonSocial || '-'}
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${record.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formattedTotal}
                            </TableCell>
                            <TableCell>
                              {record.processed ? (
                                <div className="flex flex-col gap-1">
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    En Gastos
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {mapAreaToCategory(record.area).toUpperCase()}
                                  </span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-orange-600">
                                  <Clock className="h-3 w-3" />
                                  Pendiente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.processed ? (
                                <div className="flex gap-2 justify-end items-center">
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    En Gastos
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUnprocess(record)}
                                    className="text-xs"
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleProcessAsExpense(record)}
                                  className="text-xs gap-1"
                                  title="Agregar a módulo de Gastos"
                                >
                                  <DollarSign className="h-3 w-3" />
                                  Agregar a Gastos
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
              
              {/* Paginación */}
              {imports.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, imports.length)} de {imports.length} registros
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(imports.length / itemsPerPage) }, (_, i) => i + 1)
                        .filter(page => {
                          // Mostrar primera, última, actual y adyacentes
                          const totalPages = Math.ceil(imports.length / itemsPerPage);
                          return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                        })
                        .map((page, idx, arr) => {
                          // Agregar "..." si hay salto
                          const prev = arr[idx - 1];
                          return (
                            <>
                              {prev && page - prev > 1 && (
                                <span key={`ellipsis-${page}`} className="px-2">...</span>
                              )}
                              <Button
                                key={page}
                                variant={page === currentPage ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-9"
                              >
                                {page}
                              </Button>
                            </>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(imports.length / itemsPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(imports.length / itemsPerPage)}
                    >
                      Siguiente
                    </Button>
                  </div>
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
