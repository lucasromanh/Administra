import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useMockData';
import { generateTasksReport } from '@/lib/reports-pdf';
import { Download } from 'lucide-react';
import type { Task } from '@/lib/types';

export function TasksPage() {
  const [tasks, setTasks] = useTasks();

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
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Tareas Administrativas"
        description="Gestiona y realiza seguimiento de tareas"
        actions={
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Informe de Tareas
          </Button>
        }
      />
      <div className="flex-1 p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Mis Tareas</h3>
            <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
          </div>
          <div>
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
