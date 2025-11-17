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
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded"></span>
            ¿Para qué sirve este módulo?
          </h3>
          <p className="text-xs text-gray-700 dark:text-blue-200 mb-3 leading-relaxed">
            <strong className="text-blue-800 dark:text-blue-300">Gestión de Tareas Operativas:</strong> Organiza y da seguimiento a todas las actividades administrativas 
            del hotel, desde auditorías nocturnas hasta pagos a proveedores y preparación de reportes gerenciales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              <div>
                <strong className="text-gray-800 dark:text-blue-200">Asignación:</strong>
                <span className="text-gray-600 dark:text-blue-300"> Delega tareas específicas a miembros del equipo</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              <div>
                <strong className="text-gray-800 dark:text-blue-200">Priorización:</strong>
                <span className="text-gray-600 dark:text-blue-300"> Marca tareas como Alta, Media o Baja prioridad</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              <div>
                <strong className="text-gray-800 dark:text-blue-200">Seguimiento:</strong>
                <span className="text-gray-600 dark:text-blue-300"> Marca tareas como completadas al finalizarlas</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              <div>
                <strong className="text-gray-800 dark:text-blue-200">Categorización:</strong>
                <span className="text-gray-600 dark:text-blue-300"> Organiza por tipo: auditoría, pago, reporte, etc.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 md:col-span-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              <div>
                <strong className="text-gray-800 dark:text-blue-200">Fechas límite:</strong>
                <span className="text-gray-600 dark:text-blue-300"> Controla vencimientos para no perder plazos importantes</span>
              </div>
            </div>
          </div>
        </div>
        <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
      </div>
    </div>
  );
}
