import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { AuditLog } from '@/lib/types';

interface AuditLogListProps {
  logs: AuditLog[];
}

export function AuditLogList({ logs }: AuditLogListProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay registros de auditoría</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {logs.slice(0, 50).map((log) => (
        <Card key={log.id}>
          <CardContent className="py-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{log.module}</Badge>
                  <Badge>{log.action}</Badge>
                  <span className="text-xs text-muted-foreground">{log.user}</span>
                </div>
                <p className="text-sm">{log.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString('es-CL')}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
