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

      // Mapear columnas del Excel a nuestro formato
      const records: CashRegisterImport[] = jsonData.map((row: any, index) => {
        // Detectar método de pago basado en la columna "Pago"
        let metodoPago: CashRegisterImport['metodoPago'] = 'efectivo';
        const pagoStr = String(row['Pago'] || row['PAGO'] || row['Metodo Pago'] || '').toLowerCase();
        
        if (pagoStr.includes('cheque')) metodoPago = 'cheque';
        else if (pagoStr.includes('debito') || pagoStr.includes('débito')) metodoPago = 'tarjeta-debito';
        else if (pagoStr.includes('credito') || pagoStr.includes('crédito') || pagoStr.includes('tarjeta')) metodoPago = 'tarjeta-credito';
        else if (pagoStr.includes('cupon') || pagoStr.includes('cupón')) metodoPago = 'cupon';
        else if (pagoStr.includes('transfer')) metodoPago = 'transferencia';

        return {
          id: `import-${Date.now()}-${index}`,
          fecha: row['Fecha'] || row['FECHA'] || new Date().toISOString().split('T')[0],
          ingreso: row['Ingreso'] || row['INGRESO'] || row['Concepto'] || '',
          turno: row['Turno'] || row['TURNO'] || 'mañana',
          numeroFactura: row['N°Factura'] || row['Nro Factura'] || row['Factura'] || undefined,
          razonSocial: row['Razón Social'] || row['Razon Social'] || row['Cliente'] || undefined,
          area: row['Área'] || row['Area'] || row['AREA'] || 'RECEPCION',
          metodoPago,
          total: parseFloat(row['Total'] || row['TOTAL'] || row['Monto'] || 0),
          cierreCaja: row['Cierre de Caja'] || row['Cierre'] || undefined,
          creadoPor: row['Creado por'] || row['Usuario'] || undefined,
          importedAt: new Date().toISOString(),
          processed: false,
        };
      }).filter(record => record.total > 0); // Solo registros con monto

      setPreview(records);
      setLoading(false);
    } catch (err) {
      setError('Error al leer el archivo Excel. Verifica el formato.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Caja Diaria del Hotel
          </DialogTitle>
          <DialogDescription>
            Sube el archivo Excel de la aplicación de Caja Diaria para procesar los registros
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                      <p className="text-2xl font-bold text-green-600">
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

              {/* Tabla de preview */}
              <div className="border rounded-lg">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Turno</TableHead>
                        <TableHead>Ingreso/Concepto</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead>Razón Social</TableHead>
                        <TableHead>N° Factura</TableHead>
                        <TableHead>Método Pago</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.slice(0, 50).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm">{record.fecha}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.turno}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{record.ingreso}</TableCell>
                          <TableCell className="text-sm font-medium">{record.area}</TableCell>
                          <TableCell className="text-sm">{record.razonSocial || '-'}</TableCell>
                          <TableCell className="text-sm">{record.numeroFactura || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {record.metodoPago}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${record.total.toLocaleString('es-CL')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {preview.length > 50 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    Mostrando 50 de {preview.length} registros
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
