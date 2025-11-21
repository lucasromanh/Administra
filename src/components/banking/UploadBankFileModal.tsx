import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { BankMovement } from '@/lib/types';

interface UploadBankFileModalProps {
  selectedAccountId?: string;
  onMovementsProcessed?: (movements: BankMovement[]) => void;
}

export function UploadBankFileModal({ selectedAccountId, onMovementsProcessed }: UploadBankFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    records?: number;
  } | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Reset result when selecting new file
    }
  };

  const generateMovementsFromCSV = (text: string, accountId: string): BankMovement[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const records = lines.slice(1); // Skip header
    
    return records.map((line, index) => {
      const [date, description, amount] = line.split(',').map(s => s.trim());
      const parsedAmount = parseFloat(amount) || 0;
      
      return {
        id: `upload-${Date.now()}-${index}`,
        accountId: accountId,
        date: date || new Date().toISOString().split('T')[0],
        description: description || 'Movimiento importado',
        amount: Math.abs(parsedAmount),
        type: parsedAmount >= 0 ? 'ingreso' : 'egreso',
        category: parsedAmount >= 0 ? 'deposito' : 'transferencia',
        reconciled: false,
        reference: `CSV-${index + 1}`,
      } as BankMovement;
    });
  };

  const generateMovementsFromExcel = (accountId: string, recordCount: number): BankMovement[] => {
    // Simular generación de movimientos desde Excel
    const movements: BankMovement[] = [];
    const categories: Array<'deposito' | 'pos' | 'transferencia' | 'fee' | 'comision' | 'otro'> = 
      ['deposito', 'pos', 'transferencia', 'fee', 'comision', 'otro'];
    
    for (let i = 0; i < recordCount; i++) {
      const isIngreso = Math.random() > 0.5;
      const amount = Math.random() * 1000 + 100;
      
      movements.push({
        id: `upload-${Date.now()}-${i}`,
        accountId: accountId,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: isIngreso ? `Depósito #${i + 1}` : `Pago #${i + 1}`,
        amount: Math.round(amount * 100) / 100,
        type: isIngreso ? 'ingreso' : 'egreso',
        category: categories[Math.floor(Math.random() * categories.length)],
        reconciled: false,
        reference: `XLSX-${i + 1}`,
      });
    }
    
    return movements.sort((a, b) => b.date.localeCompare(a.date));
  };

  const processCSV = async (text: string, accountId: string): Promise<BankMovement[]> => {
    const lines = text.split('\n').filter(line => line.trim());
    console.log('CSV Lines:', lines.length);
    
    // Simular procesamiento con delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return generateMovementsFromCSV(text, accountId);
  };

  const processExcel = async (accountId: string): Promise<BankMovement[]> => {
    console.log('Processing Excel file...');
    
    // Simular procesamiento con delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular que se encontraron registros
    const simulatedRecords = Math.floor(Math.random() * 20) + 10;
    return generateMovementsFromExcel(accountId, simulatedRecords);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      let processedMovements: BankMovement[] = [];
      // Si no hay cuenta seleccionada, usar una cuenta por defecto o la primera disponible
      const accountId = selectedAccountId || 'default-account';

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        processedMovements = await processCSV(text, accountId);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processedMovements = await processExcel(accountId);
      } else {
        throw new Error('Formato de archivo no soportado');
      }

      // Notificar al componente padre con los nuevos movimientos
      if (onMovementsProcessed && processedMovements.length > 0) {
        onMovementsProcessed(processedMovements);
      }

      setResult({
        success: true,
        message: selectedAccountId 
          ? `Archivo procesado correctamente`
          : `Archivo procesado correctamente. Los movimientos se agregaron a la cuenta general.`,
        records: processedMovements.length,
      });

      // Reset file after successful processing
      setTimeout(() => {
        setFile(null);
        setResult(null);
        setOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Error processing file:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error al procesar el archivo',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Upload className="h-3 w-3" />
          Cargar archivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cargar archivo bancario</DialogTitle>
          <DialogDescription>
            Sube un archivo CSV o Excel con los movimientos bancarios para
            conciliar automáticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!selectedAccountId && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Si seleccionas una cuenta bancaria antes de cargar el archivo, 
                los movimientos se asociarán específicamente a esa cuenta. Si no seleccionas ninguna, 
                se cargarán en la cuenta general para que puedas revisarlos y organizarlos después.
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            {file && !result && (
              <p className="text-sm text-muted-foreground">
                📄 Archivo seleccionado: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          {result && (
            <div
              className={`p-3 rounded-lg border ${
                result.success
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    result.success
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {result.message}
                  </p>
                  {result.success && result.records !== undefined && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Se procesaron {result.records} movimientos bancarios
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Procesar archivo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
