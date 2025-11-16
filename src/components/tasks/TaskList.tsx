import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task } from '@/lib/types';
import { Calendar, User } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getPriorityVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      alta: 'Alta',
      media: 'Media',
      baja: 'Baja',
    };
    return labels[priority];
  };

  return (
    <div className="space-y-2 pb-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.status === 'completada'}
                onCheckedChange={() => onToggleComplete?.(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className={`font-medium text-sm ${
                      task.status === 'completada'
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <Badge variant={getPriorityVariant(task.priority)} className="shrink-0 text-xs">
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {task.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
