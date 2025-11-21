import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { AuditoriaAlerta } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface AuditoriaAlertsProps {
  alertas: AuditoriaAlerta[];
  onResolverAlerta?: (id: string) => void;
}

export function AuditoriaAlerts({ alertas, onResolverAlerta }: AuditoriaAlertsProps) {
  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'advertencia':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'advertencia':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorCategoria = (categoria: string) => {
    const colores: Record<string, string> = {
      facturacion: 'bg-green-600',
      gastos: 'bg-red-600',
      stock: 'bg-purple-600',
      sueldos: 'bg-blue-600',
      bancaria: 'bg-indigo-600',
    };
    return colores[categoria] || 'bg-gray-600';
  };

  const alertasActivas = alertas.filter(a => !a.resuelta);
  const alertasResueltas = alertas.filter(a => a.resuelta);

  return (
    <div className="space-y-4">
      {/* Alertas Activas */}
      {alertasActivas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Alertas Activas ({alertasActivas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertasActivas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-lg border-2 ${getColorTipo(alerta.tipo)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getIconoTipo(alerta.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{alerta.titulo}</h4>
                        <Badge className={`text-xs ${getColorCategoria(alerta.categoria)} text-white`}>
                          {alerta.categoria}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90">{alerta.descripcion}</p>
                      {alerta.monto && (
                        <p className="text-sm font-bold mt-1">
                          Monto: ${alerta.monto.toLocaleString('es-AR')}
                        </p>
                      )}
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(alerta.fecha).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  {onResolverAlerta && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResolverAlerta(alerta.id)}
                      className="shrink-0"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alertas Resueltas */}
      {alertasResueltas.length > 0 && (
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Alertas Resueltas ({alertasResueltas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertasResueltas.map((alerta) => (
              <div
                key={alerta.id}
                className="p-3 rounded-lg bg-green-50 border border-green-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">{alerta.titulo}</span>
                  <Badge variant="outline" className="text-xs">
                    {alerta.categoria}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {alertas.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p>No se detectaron alertas en esta auditoría</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
