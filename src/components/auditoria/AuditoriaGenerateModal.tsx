import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuditoriaGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'semanal' | 'mensual' | 'personalizada';
  onGenerar: (fechaDesde: string, fechaHasta: string, descripcion: string) => void;
}

export function AuditoriaGenerateModal({
  open,
  onOpenChange,
  tipo,
  onGenerar
}: AuditoriaGenerateModalProps) {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerar = async () => {
    setIsGenerating(true);
    
    // Generar fechas automáticas según tipo
    let desde = fechaDesde;
    let hasta = fechaHasta;
    let desc = descripcion;

    if (tipo === 'semanal') {
      const hoy = new Date();
      const hace7dias = new Date(hoy);
      hace7dias.setDate(hoy.getDate() - 7);
      desde = hace7dias.toISOString().split('T')[0];
      hasta = hoy.toISOString().split('T')[0];
      desc = `Auditoría Semanal - ${desde} al ${hasta}`;
    } else if (tipo === 'mensual') {
      const hoy = new Date();
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      desde = primerDia.toISOString().split('T')[0];
      hasta = ultimoDia.toISOString().split('T')[0];
      desc = `Auditoría Mensual - ${hoy.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`;
    } else if (!descripcion) {
      desc = `Auditoría Personalizada - ${desde} al ${hasta}`;
    }

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));

    onGenerar(desde, hasta, desc);
    setIsGenerating(false);
    onOpenChange(false);
    
    // Reset form
    setFechaDesde('');
    setFechaHasta('');
    setDescripcion('');
  };

  const getTipoColor = () => {
    switch (tipo) {
      case 'semanal': return 'bg-blue-600';
      case 'mensual': return 'bg-purple-600';
      case 'personalizada': return 'bg-indigo-600';
    }
  };

  const getTipoLabel = () => {
    switch (tipo) {
      case 'semanal': return 'Auditoría Semanal';
      case 'mensual': return 'Auditoría Mensual';
      case 'personalizada': return 'Auditoría Personalizada';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generar Auditoría
          </DialogTitle>
          <DialogDescription>
            <Badge className={getTipoColor()}>
              {getTipoLabel()}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {tipo === 'personalizada' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Auditoría Trimestre 1"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaDesde">Fecha Desde</Label>
                  <Input
                    id="fechaDesde"
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaHasta">Fecha Hasta</Label>
                  <Input
                    id="fechaHasta"
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-slate-100 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {tipo === 'semanal' && 'Se analizarán los últimos 7 días de operaciones.'}
                {tipo === 'mensual' && 'Se analizará el mes actual completo.'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                La auditoría incluirá análisis automático de:
              </p>
              <ul className="text-sm text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Facturación y cobranzas</li>
                <li>• Gastos y egresos</li>
                <li>• Inventario y stock</li>
                <li>• Liquidaciones de sueldos</li>
                <li>• Conciliación bancaria</li>
              </ul>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ El proceso puede tomar unos segundos dependiendo del volumen de datos.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerar}
            disabled={isGenerating || (tipo === 'personalizada' && (!fechaDesde || !fechaHasta))}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Generar Auditoría'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
