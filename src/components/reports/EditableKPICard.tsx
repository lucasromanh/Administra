import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Edit2, Info } from 'lucide-react';
import { useState } from 'react';

interface EditableKPICardProps {
  name: string;
  value: number;
  change: number;
  format?: 'currency' | 'percentage' | 'number';
  isCalculated?: boolean;
  calculationInfo?: string;
  onEdit?: (value: number) => void;
  editable?: boolean;
}

export function EditableKPICard({ 
  name, 
  value, 
  change, 
  format = 'number',
  isCalculated = false,
  calculationInfo,
  onEdit,
  editable = true
}: EditableKPICardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const formatValue = (val: number, fmt?: string) => {
    switch (fmt) {
      case 'currency':
        // Usar notación compacta para valores grandes
        if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `$${(val / 1000).toFixed(0)}K`;
        }
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        // Redondear a entero para evitar decimales largos
        return `${Math.round(val)}%`;
      case 'number':
        return val.toLocaleString('es-CL', { maximumFractionDigits: 0 });
      default:
        return val.toLocaleString('es-CL', { maximumFractionDigits: 0 });
    }
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue) || 0;
    onEdit?.(numValue);
    setIsOpen(false);
  };

  const isPositive = change > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className={editable ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-medium">{name}</CardTitle>
            {isCalculated && (
              <div title="Valor calculado automáticamente">
                <Info className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
          {editable && !isCalculated && (
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Edit2 className="h-3 w-3" />
              </Button>
            </DialogTrigger>
          )}
          {!editable && (
            isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )
          )}
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{formatValue(value, format)}</div>
          {isCalculated && calculationInfo ? (
            <p className="text-[10px] text-muted-foreground">{calculationInfo}</p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {isPositive ? '+' : ''}
                {change.toFixed(1)}%
              </span>{' '}
              vs mes anterior
            </p>
          )}
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {name}</DialogTitle>
          <DialogDescription>
            Actualiza el valor de este indicador
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kpi-value">Valor</Label>
            <Input
              id="kpi-value"
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
