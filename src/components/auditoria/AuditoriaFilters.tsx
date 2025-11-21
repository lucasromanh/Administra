import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuditoriaFiltersProps {
  onFilterChange?: (filters: AuditoriaFilterState) => void;
}

export interface AuditoriaFilterState {
  fechaDesde: string;
  fechaHasta: string;
  tipo: 'todas' | 'semanal' | 'mensual' | 'personalizada';
  estado: 'todos' | 'pendiente' | 'aprobada' | 'observada';
}

export function AuditoriaFilters({ onFilterChange }: AuditoriaFiltersProps) {
  const [filters, setFilters] = useState<AuditoriaFilterState>({
    fechaDesde: '',
    fechaHasta: '',
    tipo: 'todas',
    estado: 'todos'
  });

  const handleFilterChange = (key: keyof AuditoriaFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: AuditoriaFilterState = {
      fechaDesde: '',
      fechaHasta: '',
      tipo: 'todas',
      estado: 'todos'
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rango de Fechas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fechaDesde" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Desde
            </Label>
            <Input
              id="fechaDesde"
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaHasta" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hasta
            </Label>
            <Input
              id="fechaHasta"
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
            />
          </div>
        </div>

        {/* Tipo de Auditoría */}
        <div className="space-y-2">
          <Label>Tipo de Auditoría</Label>
          <div className="flex flex-wrap gap-2">
            {(['todas', 'semanal', 'mensual', 'personalizada'] as const).map((tipo) => (
              <Badge
                key={tipo}
                variant={filters.tipo === tipo ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterChange('tipo', tipo)}
              >
                {tipo === 'todas' ? 'Todas' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <div className="flex flex-wrap gap-2">
            {(['todos', 'pendiente', 'aprobada', 'observada'] as const).map((estado) => (
              <Badge
                key={estado}
                variant={filters.estado === estado ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterChange('estado', estado)}
              >
                {estado === 'todos' ? 'Todos' : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Botón Reset */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          Limpiar Filtros
        </Button>
      </CardContent>
    </Card>
  );
}
