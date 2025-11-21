import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { CashRegisterImport } from '@/lib/types';

interface ImportCashRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (records: CashRegisterImport[]) => void;
}

export function ImportCashRegisterModal({ open, onClose, onImport }: ImportCashRegisterModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CashRegisterImport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('📊 Total filas en Excel:', jsonData.length);
      console.log('📋 Primera fila de datos:', jsonData[0]);
      console.log('📋 Columnas detectadas:', Object.keys(jsonData[0] || {}));

      // Mapear columnas del Excel a nuestro formato
      const records: CashRegisterImport[] = jsonData.map((row: any, index) => {
        // Convertir fecha de Excel (serial number) a fecha string
        let fecha = new Date().toISOString().split('T')[0];
        if (row['Fecha']) {
          if (typeof row['Fecha'] === 'number') {
            // Excel guarda fechas como números seriales (días desde 1900-01-01)
            const excelDate = new Date((row['Fecha'] - 25569) * 86400 * 1000);
            fecha = excelDate.toISOString().split('T')[0];
          } else if (typeof row['Fecha'] === 'string') {
            fecha = row['Fecha'];
          }
        }

        // Columna "Ingreso" contiene información de pago (ej: "$0", "$B+4000", "MUCAMA")
        const ingresoRaw = String(row['Ingreso'] || '').trim();
        
        // Columna "Pago" contiene otra información de pago
        const pagoRaw = String(row['Pago'] || '').trim();

        // Detectar método de pago combinando ambas columnas
        let metodoPago: CashRegisterImport['metodoPago'] = 'efectivo';
        const combinedPaymentInfo = `${ingresoRaw} ${pagoRaw}`.toLowerCase();
        
        if (combinedPaymentInfo.includes('cheque')) {
          metodoPago = 'cheque';
        } else if (combinedPaymentInfo.includes('debito') || combinedPaymentInfo.includes('débito')) {
          metodoPago = 'tarjeta-debito';
        } else if (combinedPaymentInfo.includes('credito') || combinedPaymentInfo.includes('crédito') || combinedPaymentInfo.includes('tarjeta')) {
          metodoPago = 'tarjeta-credito';
        } else if (combinedPaymentInfo.includes('cupon') || combinedPaymentInfo.includes('cupón')) {
          metodoPago = 'cupon';
        } else if (combinedPaymentInfo.includes('transfer')) {
          metodoPago = 'transferencia';
        }

        // Parsear total (puede venir como $35737.63 o 35737.63)
        let total = 0;
        if (row['Total']) {
          const totalStr = String(row['Total']).replace(/[$,]/g, '');
          total = parseFloat(totalStr) || 0;
        }

        // Limpiar N° Factura
        let numeroFactura = row['N° Factura'] || row['N°Factura'] || row['N° Factura'];
        if (numeroFactura) {
          numeroFactura = String(numeroFactura).trim();
        }

        // Área de operación
        const area = String(row['Área'] || 'RECEPCION').trim().toUpperCase();

        const record = {
          id: `import-${Date.now()}-${index}`,
          fecha,
          ingreso: ingresoRaw || 'Sin descripción', // Guardar el valor original de Ingreso
          turno: String(row['Turno'] || 'Juan Ramos').trim(),
          numeroFactura: numeroFactura || undefined,
          razonSocial: row['Razón Social'] ? String(row['Razón Social']).trim() : undefined,
          area,
          metodoPago,
          total,
          pago: pagoRaw || undefined, // Agregar columna Pago también
          cierreCaja: row['Cierre de Caja'] ? String(row['Cierre de Caja']) : undefined,
          creadoPor: row['Creado por'] ? String(row['Creado por']).trim() : undefined,
          importedAt: new Date().toISOString(),
          processed: false,
        };

        console.log(`✅ Registro ${index + 1}:`, {
          fecha: record.fecha,
          area: record.area,
          total: record.total,
          ingreso: record.ingreso,
        });

        return record;
      }) as CashRegisterImport[];

      console.log('📊 Registros válidos procesados:', records.length);
      console.log('📋 Primer registro completo:', records[0]);
      console.log('📋 Último registro completo:', records[records.length - 1]);

      setPreview(records);
      setLoading(false);
    } catch (err) {
      setError('Error al leer el archivo Excel. Verifica el formato.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleImport = () => {
    console.log('🔵 handleImport ejecutado');
    console.log('Preview length:', preview.length);
    if (preview.length === 0) {
      console.warn('❌ No hay registros para importar');
      return;
    }
    console.log('✅ Importando', preview.length, 'registros');
    onImport(preview);
    setFile(null);
    setPreview([]);
    onClose();
  };

  const totalAmount = preview.reduce((sum, record) => sum + record.total, 0);
  const byPaymentMethod = preview.reduce((acc, record) => {
    acc[record.metodoPago] = (acc[record.metodoPago] || 0) + record.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Caja Diaria del Hotel
          </DialogTitle>
          <DialogDescription>
            Sube el archivo Excel de la aplicación de Caja Diaria para procesar los registros
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 space-y-6">
          {/* Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Archivo Excel (.xlsx, .xls)</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && (
                <Badge variant="outline" className="gap-1">
                  <FileSpreadsheet className="h-3 w-3" />
                  {file.name}
                </Badge>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          {/* Preview */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Procesando archivo...</p>
            </div>
          )}

          {preview.length > 0 && (
            <>
              {/* Resumen */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Registros</p>
                      <p className="text-2xl font-bold">{preview.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Monto</p>
                      <p className={`text-xl font-bold break-words ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${totalAmount.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Efectivo</p>
                      <p className="text-xl font-bold">
                        ${(byPaymentMethod['efectivo'] || 0).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Tarjetas</p>
                      <p className="text-xl font-bold">
                        ${((byPaymentMethod['tarjeta-debito'] || 0) + (byPaymentMethod['tarjeta-credito'] || 0)).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  {/* Desglose por método */}
                  <div className="mt-4 grid grid-cols-6 gap-2">
                    {Object.entries(byPaymentMethod).map(([method, amount]) => (
                      <div key={method} className="text-center p-2 bg-secondary rounded">
                        <p className="text-xs text-muted-foreground capitalize">
                          {method.replace('-', ' ')}
                        </p>
                        <p className="text-sm font-medium">
                          ${amount.toLocaleString('es-CL')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de preview - Más compacta para ver más registros */}
              <div className="border rounded-lg">
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs">
                        <TableHead className="w-24">Fecha</TableHead>
                        <TableHead className="w-32">Turno</TableHead>
                        <TableHead className="w-24">Ingreso</TableHead>
                        <TableHead className="w-28">Área</TableHead>
                        <TableHead className="w-40">Razón Social</TableHead>
                        <TableHead className="w-28">N° Factura</TableHead>
                        <TableHead className="w-24">Pago</TableHead>
                        <TableHead className="w-24 text-right">Total</TableHead>
                        <TableHead className="w-32">Cierre Caja</TableHead>
                        <TableHead className="w-32">Creado Por</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((record) => {
                        const formattedTotal = record.total < 0 
                          ? `-$${Math.abs(Math.round(record.total)).toLocaleString('es-CL')}`
                          : `$${Math.round(record.total).toLocaleString('es-CL')}`;
                        
                        return (
                          <TableRow key={record.id} className="text-xs">
                            <TableCell className="font-mono">{record.fecha}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{record.turno}</Badge>
                            </TableCell>
                            <TableCell className="truncate max-w-24" title={record.ingreso}>
                              {record.ingreso}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{record.area}</Badge>
                            </TableCell>
                            <TableCell className="truncate max-w-40" title={record.razonSocial || ''}>
                              {record.razonSocial || '-'}
                            </TableCell>
                            <TableCell className="font-mono">{record.numeroFactura || '-'}</TableCell>
                            <TableCell className="truncate max-w-24" title={record.pago || ''}>
                              {record.pago || '-'}
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${record.total < 0 ? 'text-red-600' : ''}`}>
                              {formattedTotal}
                            </TableCell>
                            <TableCell className="truncate max-w-32" title={record.cierreCaja || ''}>
                              {record.cierreCaja || '-'}
                            </TableCell>
                            <TableCell className="truncate max-w-32" title={record.creadoPor || ''}>
                              {record.creadoPor || '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {preview.length > 100 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    Mostrando todos los {preview.length} registros (scroll para ver más)
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Archivo procesado correctamente
                  </p>
                  <p className="text-xs text-blue-700">
                    Los registros se agregarán como ingresos/gastos según corresponda
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport}
            disabled={preview.length === 0}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar {preview.length} Registros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
