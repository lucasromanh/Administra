import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, History, Download, TrendingUp } from 'lucide-react';

interface AuditoriaActionsProps {
  onGenerarSemanal: () => void;
  onGenerarMensual: () => void;
  onGenerarPersonalizada: () => void;
  onVerHistorial: () => void;
  onExportar: () => void;
}

export function AuditoriaActions({
  onGenerarSemanal,
  onGenerarMensual,
  onGenerarPersonalizada,
  onVerHistorial,
  onExportar,
}: AuditoriaActionsProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-950 to-slate-900 border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5" />
          Acciones de Auditoría
        </CardTitle>
        <CardDescription className="text-blue-200">
          Genere auditorías automáticas y acceda al historial
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-5">
        <Button
          onClick={onGenerarSemanal}
          className="bg-blue-600 hover:bg-blue-700 flex flex-col h-auto py-4 gap-2"
        >
          <Calendar className="h-6 w-6" />
          <span className="text-sm font-medium">Auditoría Semanal</span>
          <span className="text-xs opacity-75">Última semana</span>
        </Button>

        <Button
          onClick={onGenerarMensual}
          className="bg-purple-600 hover:bg-purple-700 flex flex-col h-auto py-4 gap-2"
        >
          <Calendar className="h-6 w-6" />
          <span className="text-sm font-medium">Auditoría Mensual</span>
          <span className="text-xs opacity-75">Último mes</span>
        </Button>

        <Button
          onClick={onGenerarPersonalizada}
          className="bg-indigo-600 hover:bg-indigo-700 flex flex-col h-auto py-4 gap-2"
        >
          <FileText className="h-6 w-6" />
          <span className="text-sm font-medium">Personalizada</span>
          <span className="text-xs opacity-75">Rango custom</span>
        </Button>

        <Button
          onClick={onVerHistorial}
          variant="outline"
          className="flex flex-col h-auto py-4 gap-2 border-blue-600 text-blue-100 hover:bg-blue-900/50"
        >
          <History className="h-6 w-6" />
          <span className="text-sm font-medium">Ver Historial</span>
          <span className="text-xs opacity-75">Auditorías previas</span>
        </Button>

        <Button
          onClick={onExportar}
          variant="outline"
          className="flex flex-col h-auto py-4 gap-2 border-green-600 text-green-100 hover:bg-green-900/50"
        >
          <Download className="h-6 w-6" />
          <span className="text-sm font-medium">Exportar</span>
          <span className="text-xs opacity-75">PDF / Excel</span>
        </Button>
      </CardContent>
    </Card>
  );
}
