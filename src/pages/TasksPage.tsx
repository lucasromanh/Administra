import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useMockData';
import { generateTasksReport } from '@/lib/reports-pdf';
import { Download, Plus } from 'lucide-react';
import type { Task } from '@/lib/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function TasksPage() {
  const [tasks, setTasks] = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDownloadReport = () => {
    generateTasksReport(tasks);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completada' ? 'pendiente' : 'completada',
            }
          : task
      )
    );
  };

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Tareas Administrativas"
        description="Gestiona y realiza seguimiento de tareas"
        actions={
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Informe
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Tarea
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Tarea</DialogTitle>
                </DialogHeader>
                <TaskForm onSubmit={handleCreateTask} />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="px-6 py-4 w-full">
        <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
      </div>
    </div>
  );
}
