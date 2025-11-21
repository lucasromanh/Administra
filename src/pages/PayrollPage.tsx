import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Plus, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeList } from '@/components/payroll/EmployeeList';
import { PayrollList } from '@/components/payroll/PayrollList';
import { EmployeeForm } from '@/components/payroll/EmployeeForm';
import { PayrollForm } from '@/components/payroll/PayrollForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Employee, PayrollItem } from '@/lib/types';
import { storage } from '@/lib/storage';

export function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>(
    storage.get<Employee[]>('employees', [])
  );
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>(
    storage.get<PayrollItem[]>('payroll_items', [])
  );
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isPayrollFormOpen, setIsPayrollFormOpen] = useState(false);

  const handleCreateEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    storage.set('employees', updated);
    setIsEmployeeFormOpen(false);
  };

  const handleUpdateEmployee = (id: string, updates: Partial<Employee>) => {
    const updated = employees.map(emp =>
      emp.id === id ? { ...emp, ...updates } : emp
    );
    setEmployees(updated);
    storage.set('employees', updated);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    storage.set('employees', updated);
  };

  const handleCreatePayroll = (payroll: Omit<PayrollItem, 'id' | 'createdAt'>) => {
    const newPayroll: PayrollItem = {
      ...payroll,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...payrollItems, newPayroll];
    setPayrollItems(updated);
    storage.set('payroll_items', updated);
    setIsPayrollFormOpen(false);
  };

  const handleUpdatePayroll = (id: string, updates: Partial<PayrollItem>) => {
    const updated = payrollItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setPayrollItems(updated);
    storage.set('payroll_items', updated);
  };

  const activeEmployees = employees.filter(emp => emp.status === 'activo');
  const totalPayroll = payrollItems
    .filter(item => item.status === 'pagado')
    .reduce((sum, item) => sum + item.netSalary, 0);
  const pendingPayroll = payrollItems.filter(item => item.status !== 'pagado').length;

  return (
    <div className="flex flex-col">
      <Header
        title="Liquidación de Sueldos"
        description="Gestión de empleados y nómina"
      />

      <div className="px-6 py-4 space-y-6">
        {/* Resumen */}
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Empleados Activos
              </CardTitle>
              <Users className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees.length}</div>
              <p className="text-xs text-muted-foreground">
                De {employees.length} totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Liquidaciones Pendientes
              </CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayroll}</div>
              <p className="text-xs text-muted-foreground">
                Por procesar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                Total Pagado
              </CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalPayroll.toLocaleString('es-CL')}
              </div>
              <p className="text-xs text-muted-foreground">
                Este período
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Empleados y Liquidaciones */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Empleados
            </TabsTrigger>
            <TabsTrigger value="payroll" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Liquidaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsEmployeeFormOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Empleado
              </Button>
            </div>
            <EmployeeList
              employees={employees}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteEmployee}
            />
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsPayrollFormOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Liquidación
              </Button>
            </div>
            <PayrollList
              items={payrollItems}
              employees={employees}
              onUpdate={handleUpdatePayroll}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Formularios */}
      <EmployeeForm
        open={isEmployeeFormOpen}
        onOpenChange={setIsEmployeeFormOpen}
        onSubmit={handleCreateEmployee}
      />
      <PayrollForm
        open={isPayrollFormOpen}
        onOpenChange={setIsPayrollFormOpen}
        employees={activeEmployees}
        onSubmit={handleCreatePayroll}
      />
    </div>
  );
}
