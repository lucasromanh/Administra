import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { AuditoriaCompleta } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditoriaHistoryProps {
  auditorias: AuditoriaCompleta[];
  onVerDetalle: (id: string) => void;
  onExportar: (id: string, formato: 'pdf' | 'excel') => void;
  onCambiarEstado?: (id: string, nuevoEstado: 'pendiente' | 'aprobada' | 'observada') => void;
}

export function AuditoriaHistory({ auditorias, onVerDetalle, onExportar, onCambiarEstado }: AuditoriaHistoryProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'observada':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendiente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return <CheckCircle className="h-4 w-4" />;
      case 'observada':
        return <AlertCircle className="h-4 w-4" />;
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'semanal':
        return 'bg-blue-600';
      case 'mensual':
        return 'bg-purple-600';
      case 'personalizada':
        return 'bg-indigo-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (auditorias.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay auditorías generadas aún</p>
          <p className="text-sm mt-2">Genere una auditoría para comenzar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historial de Auditorías ({auditorias.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {auditorias.map((auditoria) => (
          <Card key={auditoria.id} className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Encabezado */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getTipoColor(auditoria.tipo)} text-white`}>
                        {auditoria.tipo.toUpperCase()}
                      </Badge>
                      {onCambiarEstado ? (
                        <Select
                          value={auditoria.estado}
                          onValueChange={(value) => onCambiarEstado(auditoria.id, value as 'pendiente' | 'aprobada' | 'observada')}
                        >
                          <SelectTrigger className="w-32 h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Pendiente
                              </span>
                            </SelectItem>
                            <SelectItem value="aprobada">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Aprobada
                              </span>
                            </SelectItem>
                            <SelectItem value="observada">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Observada
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getEstadoColor(auditoria.estado)}>
                          <span className="flex items-center gap-1">
                            {getEstadoIcon(auditoria.estado)}
                            {auditoria.estado}
                          </span>
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg">{auditoria.periodo.descripcion}</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(auditoria.periodo.desde).toLocaleDateString('es-AR')} - {' '}
                          {new Date(auditoria.periodo.hasta).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>Generada por: {auditoria.usuarioGenerador}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(auditoria.fechaGeneracion).toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen de alertas */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {auditoria.resultados.resumenGeneral.alertasCriticas}
                    </div>
                    <div className="text-xs text-muted-foreground">Críticas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {auditoria.resultados.resumenGeneral.alertasAdvertencia}
                    </div>
                    <div className="text-xs text-muted-foreground">Advertencias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {auditoria.resultados.resumenGeneral.alertasInfo}
                    </div>
                    <div className="text-xs text-muted-foreground">Información</div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => onVerDetalle(auditoria.id)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalle
                  </Button>
                  <Button
                    onClick={() => onExportar(auditoria.id, 'pdf')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => onExportar(auditoria.id, 'excel')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
