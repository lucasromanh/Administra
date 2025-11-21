import { useState } from "react";
import type { Employee, PayrollItem, PayrollBonus, PayrollDeduction } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator, AlertCircle } from "lucide-react";

interface PayrollFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payroll: Omit<PayrollItem, "id" | "createdAt" | "status">) => void;
  employees: Employee[];
}

export function PayrollForm({ open, onOpenChange, employees, onSubmit }: PayrollFormProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [period, setPeriod] = useState("");
  const [bonuses, setBonuses] = useState<PayrollBonus[]>([]);
  const [advances, setAdvances] = useState(0);
  const [deductions, setDeductions] = useState<PayrollDeduction[]>([]);
  const [newBonusConcept, setNewBonusConcept] = useState("");
  const [newBonusAmount, setNewBonusAmount] = useState("");
  const [newBonusTaxable, setNewBonusTaxable] = useState(true);
  const [newDeductionConcept, setNewDeductionConcept] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");
  const [newDeductionType, setNewDeductionType] = useState<"legal" | "voluntario">("voluntario");

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Cálculos automáticos
  const baseSalary = selectedEmployee?.salary || 0;
  const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const taxableBonuses = bonuses.filter(b => b.taxable).reduce((sum, b) => sum + b.amount, 0);
  const taxableIncome = baseSalary + taxableBonuses;
  
  // Deducciones legales automáticas (AFP 10%, Salud 7%)
  const afpDeduction = Math.round(taxableIncome * 0.10);
  const saludDeduction = Math.round(taxableIncome * 0.07);
  
  const totalLegalDeductions = afpDeduction + saludDeduction;
  const totalVoluntaryDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const totalDeductions = totalLegalDeductions + totalVoluntaryDeductions;
  
  const netSalary = baseSalary + totalBonuses - totalDeductions - advances;

  const handleAddBonus = () => {
    if (newBonusConcept && newBonusAmount && parseFloat(newBonusAmount) > 0) {
      setBonuses([...bonuses, {
        concept: newBonusConcept,
        amount: parseFloat(newBonusAmount),
        taxable: newBonusTaxable
      }]);
      setNewBonusConcept("");
      setNewBonusAmount("");
      setNewBonusTaxable(true);
    }
  };

  const handleRemoveBonus = (index: number) => {
    setBonuses(bonuses.filter((_, i) => i !== index));
  };

  const handleAddDeduction = () => {
    if (newDeductionConcept && newDeductionAmount && parseFloat(newDeductionAmount) > 0) {
      setDeductions([...deductions, {
        concept: newDeductionConcept,
        amount: parseFloat(newDeductionAmount),
        type: newDeductionType
      }]);
      setNewDeductionConcept("");
      setNewDeductionAmount("");
      setNewDeductionType("voluntario");
    }
  };

  const handleRemoveDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !period || !selectedEmployee) return;

    // Agregar deducciones legales automáticas al array
    const allDeductions: PayrollDeduction[] = [
      { concept: "AFP (10%)", amount: afpDeduction, type: "legal" },
      { concept: "Salud (7%)", amount: saludDeduction, type: "legal" },
      ...deductions
    ];

    onSubmit({
      employeeId: selectedEmployeeId,
      employeeName: selectedEmployee.name,
      period,
      baseSalary,
      bonuses,
      advances,
      deductions: allDeductions,
      netSalary,
    });

    // Reset form
    setSelectedEmployeeId("");
    setPeriod("");
    setBonuses([]);
    setAdvances(0);
    setDeductions([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Liquidación de Sueldo</DialogTitle>
          <DialogDescription>
            Complete los datos para generar la liquidación mensual del empleado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Básicos */}
          {employees.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>No hay empleados activos. Primero crea un empleado en la pestaña "Empleados".</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Empleado *</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período *</Label>
              <Input
                id="period"
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                required
              />
            </div>
          </div>

          {selectedEmployee && (
            <>
              {/* Sueldo Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sueldo Base</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    ${baseSalary.toLocaleString('es-CL')}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEmployee.name} - {selectedEmployee.position}
                  </p>
                </CardContent>
              </Card>

              {/* Bonos y Aguinaldos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Bonos y Aguinaldos
                  </CardTitle>
                  <CardDescription>
                    Agregar bonos haberes (aguinaldos, horas extra, comisiones, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de bonos */}
                  {bonuses.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{bonus.concept}</span>
                              {bonus.taxable ? (
                                <Badge variant="outline">Imponible</Badge>
                              ) : (
                                <Badge variant="secondary">No imponible</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ${bonus.amount.toLocaleString('es-CL')}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBonus(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para agregar bono */}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        placeholder="Concepto (ej: Aguinaldo)"
                        value={newBonusConcept}
                        onChange={(e) => setNewBonusConcept(e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={newBonusAmount}
                        onChange={(e) => setNewBonusAmount(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={newBonusTaxable ? "taxable" : "non-taxable"}
                        onValueChange={(value) => setNewBonusTaxable(value === "taxable")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="taxable">Imponible</SelectItem>
                          <SelectItem value="non-taxable">No imponible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddBonus}
                        disabled={!newBonusConcept || !newBonusAmount}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {totalBonuses > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Bonos:</span>
                        <span className="font-bold text-green-600">
                          +${totalBonuses.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Adelantos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Adelantos
                  </CardTitle>
                  <CardDescription>
                    Monto de adelantos de sueldo otorgados durante el mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="advances">Monto de Adelantos</Label>
                    <Input
                      id="advances"
                      type="number"
                      value={advances}
                      onChange={(e) => setAdvances(parseFloat(e.target.value) || 0)}
                      min="0"
                      placeholder="0"
                    />
                    {advances > 0 && (
                      <p className="text-sm text-orange-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Se descontará ${advances.toLocaleString('es-CL')} del sueldo líquido
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Otras Deducciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Otras Deducciones</CardTitle>
                  <CardDescription>
                    Las deducciones legales (AFP 10%, Salud 7%) se calculan automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de deducciones */}
                  {deductions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {deductions.map((deduction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{deduction.concept}</span>
                              <Badge variant={deduction.type === "legal" ? "default" : "secondary"}>
                                {deduction.type === "legal" ? "Legal" : "Voluntario"}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ${deduction.amount.toLocaleString('es-CL')}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDeduction(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para agregar deducción */}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        placeholder="Concepto (ej: Préstamo)"
                        value={newDeductionConcept}
                        onChange={(e) => setNewDeductionConcept(e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={newDeductionAmount}
                        onChange={(e) => setNewDeductionAmount(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={newDeductionType}
                        onValueChange={(value: "legal" | "voluntario") => setNewDeductionType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voluntario">Voluntario</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddDeduction}
                        disabled={!newDeductionConcept || !newDeductionAmount}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de Cálculo */}
              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Resumen de Liquidación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sueldo Base:</span>
                      <span className="font-medium">${baseSalary.toLocaleString('es-CL')}</span>
                    </div>
                    {totalBonuses > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>+ Total Bonos:</span>
                        <span className="font-medium">${totalBonuses.toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 space-y-1">
                      <div className="flex justify-between text-red-600">
                        <span>- AFP (10%):</span>
                        <span className="font-medium">${afpDeduction.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>- Salud (7%):</span>
                        <span className="font-medium">${saludDeduction.toLocaleString('es-CL')}</span>
                      </div>
                      {totalVoluntaryDeductions > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>- Otras Deducciones:</span>
                          <span className="font-medium">${totalVoluntaryDeductions.toLocaleString('es-CL')}</span>
                        </div>
                      )}
                      {advances > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>- Adelantos:</span>
                          <span className="font-medium">${advances.toLocaleString('es-CL')}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Líquido a Pagar:</span>
                      <span className="text-primary">${netSalary.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t text-xs text-muted-foreground">
                    <p>Base imponible: ${taxableIncome.toLocaleString('es-CL')}</p>
                    <p>Total descuentos legales: ${totalLegalDeductions.toLocaleString('es-CL')}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedEmployeeId || !period}>
              Generar Liquidación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
