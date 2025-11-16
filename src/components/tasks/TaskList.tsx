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
    return new Date(date).toLocaleDateString('es-CL');
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
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={task.status === 'completada'}
                onCheckedChange={() => onToggleComplete?.(task.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      task.status === 'completada'
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <Badge variant={getPriorityVariant(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
