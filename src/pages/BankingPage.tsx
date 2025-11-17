import { Header } from '@/components/layout/Header';
import { BankAccountList } from '@/components/banking/BankAccountList';
import { BankMovementsTable } from '@/components/banking/BankMovementsTable';
import { ReconciliationResultComponent } from '@/components/banking/ReconciliationResult';
import { UploadBankFileModal } from '@/components/banking/UploadBankFileModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBankAccounts, useBankMovements } from '@/hooks/useMockData';
import { reconcileMovements } from '@/lib/bank';
import { generateBankingReport } from '@/lib/reports-pdf';
import { useState } from 'react';
import { Download, Plus, CheckCircle2 } from 'lucide-react';
import type { BankAccount, BankMovement } from '@/lib/types';

export function BankingPage() {
  const [accounts, setAccounts] = useBankAccounts();
  const [movements, setMovements] = useBankMovements();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isNewAccountDialogOpen, setIsNewAccountDialogOpen] = useState(false);
  const [confirmReconcileDialog, setConfirmReconcileDialog] = useState<{
    open: boolean;
    movement: BankMovement | null;
    selectedAccountId: string | null;
  }>({ open: false, movement: null, selectedAccountId: null });
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const handleNewMovements = (newMovements: BankMovement[]) => {
    setMovements([...movements, ...newMovements]);
  };

  const handleToggleReconcile = (movementId: string) => {
    const movement = movements.find(m => m.id === movementId);
    if (!movement) return;

    // Si ya está conciliado, desconciliar directamente
    if (movement.reconciled) {
      setMovements(movements.map(m => 
        m.id === movementId 
          ? { ...m, reconciled: false }
          : m
      ));
      return;
    }

    // Si no está conciliado, mostrar diálogo de confirmación
    setConfirmReconcileDialog({ 
      open: true, 
      movement,
      selectedAccountId: movement.accountId || selectedAccount?.id || null
    });
  };

  const handleConfirmReconcile = () => {
    if (!confirmReconcileDialog.movement || !confirmReconcileDialog.selectedAccountId) return;

    // Asignar el movimiento a la cuenta seleccionada en el diálogo
    const updatedMovement = { 
      ...confirmReconcileDialog.movement, 
      reconciled: true, 
      accountId: confirmReconcileDialog.selectedAccountId 
    };

    setMovements(movements.map(m => 
      m.id === confirmReconcileDialog.movement!.id
        ? updatedMovement
        : m
    ));

    setConfirmReconcileDialog({ open: false, movement: null, selectedAccountId: null });
  };

  const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`,
      name: formData.get('name') as string,
      bank: formData.get('bank') as string,
      accountNumber: formData.get('accountNumber') as string,
      balance: parseFloat(formData.get('balance') as string) || 0,
      currency: formData.get('currency') as string || 'CLP',
      type: formData.get('type') as 'corriente' | 'vista' | 'ahorro',
    };

    setAccounts([...accounts, newAccount]);
    setIsNewAccountDialogOpen(false);
  };

  const handleSelectAccount = (account: BankAccount) => {
    // Toggle: si la cuenta ya está seleccionada, deseleccionar
    if (selectedAccount?.id === account.id) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
    }
  };

  const filteredMovements = selectedAccount
    ? movements.filter((m) => m.accountId === selectedAccount.id)
    : movements;

  // Aplicar filtro de solo pendientes si está activo
  const displayedMovements = showOnlyPending 
    ? filteredMovements.filter(m => !m.reconciled)
    : filteredMovements;

  const reconciliationResult = selectedAccount
    ? reconcileMovements(filteredMovements, selectedAccount.balance)
    : null;

  const handleDownloadReport = () => {
    generateBankingReport(accounts, movements, selectedAccount?.id);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Conciliación Bancaria"
        description="Administra tus cuentas bancarias y concilia movimientos"
        actions={
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Descargar Informe
            </Button>
            <Button onClick={() => setIsNewAccountDialogOpen(true)} variant="outline" size="sm" className="gap-2">
              <Plus className="h-3 w-3" />
              Nueva Cuenta
            </Button>
            <UploadBankFileModal 
              selectedAccountId={selectedAccount?.id}
              onMovementsProcessed={handleNewMovements}
            />
          </div>
        }
      />
      <div className="px-6 py-4 space-y-6 w-full">
        <div>
          <h3 className="text-sm font-medium mb-3">Cuentas Bancarias</h3>
          <BankAccountList
            accounts={accounts}
            selectedAccountId={selectedAccount?.id}
            onSelectAccount={handleSelectAccount}
          />
        </div>

        {selectedAccount && reconciliationResult && (
          <div>
            <h3 className="text-sm font-medium mb-3">
              Resultado de Conciliación - {selectedAccount.name}
            </h3>
            <ReconciliationResultComponent result={reconciliationResult} />
          </div>
        )}

        {movements.length > 0 && (
          <div>
            {!selectedAccount && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>💡 Tip:</strong> Haz click en una cuenta bancaria arriba para ver la conciliación específica. 
                  Haz click de nuevo en la misma cuenta para ocultar los detalles.
                </p>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">
                {selectedAccount 
                  ? `Movimientos - ${selectedAccount.name}` 
                  : `Todos los Movimientos`}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <strong>{filteredMovements.filter(m => m.reconciled).length}</strong> Conciliados
                  </span>
                  <span className="text-muted-foreground">
                    <strong>{filteredMovements.filter(m => !m.reconciled).length}</strong> Pendientes
                  </span>
                  <span className="text-muted-foreground">
                    Total: <strong>{filteredMovements.length}</strong>
                  </span>
                </div>
                {filteredMovements.some(m => m.reconciled) && (
                  <Button 
                    variant={showOnlyPending ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setShowOnlyPending(!showOnlyPending)}
                    className="text-xs h-7"
                  >
                    {showOnlyPending ? "Mostrar Todos" : "Solo Pendientes"}
                  </Button>
                )}
              </div>
            </div>
            <BankMovementsTable 
              movements={displayedMovements} 
              onToggleReconcile={handleToggleReconcile}
            />
          </div>
        )}
      </div>

      <Dialog open={isNewAccountDialogOpen} onOpenChange={setIsNewAccountDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
            <DialogDescription>
              Agrega una nueva cuenta bancaria para gestionar tus movimientos y conciliaciones.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Cuenta *</Label>
                <Input id="name" name="name" placeholder="Ej: Cuenta Corriente Operacional" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Banco *</Label>
                <Input id="bank" name="bank" placeholder="Ej: Banco de Chile" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de Cuenta *</Label>
                <Input id="accountNumber" name="accountNumber" placeholder="Ej: 00-123-456789-0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Cuenta *</Label>
                <Select name="type" defaultValue="corriente" required>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corriente">Cuenta Corriente</SelectItem>
                    <SelectItem value="vista">Cuenta Vista</SelectItem>
                    <SelectItem value="ahorro">Cuenta de Ahorro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="balance">Saldo Actual</Label>
                <Input id="balance" name="balance" type="number" step="0.01" placeholder="0.00" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select name="currency" defaultValue="CLP">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLP">CLP (Peso Chileno)</SelectItem>
                    <SelectItem value="USD">USD (Dólar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsNewAccountDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Cuenta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmReconcileDialog.open} onOpenChange={(open) => setConfirmReconcileDialog({ open, movement: null, selectedAccountId: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Conciliación</DialogTitle>
            <DialogDescription>
              Revisa la información del movimiento antes de conciliarlo.
            </DialogDescription>
          </DialogHeader>
          {confirmReconcileDialog.movement && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Descripción</p>
                  <p className="text-sm font-medium">{confirmReconcileDialog.movement.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium capitalize flex items-center gap-1">
                      {confirmReconcileDialog.movement.type === 'ingreso' ? (
                        <span className="text-green-600">↑ Ingreso</span>
                      ) : (
                        <span className="text-red-600">↓ Egreso</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className={`text-sm font-bold ${
                      confirmReconcileDialog.movement.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
                        .format(confirmReconcileDialog.movement.amount)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="text-sm font-medium">
                    {new Date(confirmReconcileDialog.movement.date).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {confirmReconcileDialog.movement.reference && (
                  <div>
                    <p className="text-xs text-muted-foreground">Referencia</p>
                    <p className="text-sm font-medium">{confirmReconcileDialog.movement.reference}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reconcileAccount">Cuenta Bancaria para Conciliar *</Label>
                <Select 
                  value={confirmReconcileDialog.selectedAccountId || undefined}
                  onValueChange={(value) => setConfirmReconcileDialog(prev => ({
                    ...prev,
                    selectedAccountId: value
                  }))}
                  required
                >
                  <SelectTrigger id="reconcileAccount">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{account.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {account.bank} • {account.accountNumber}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {confirmReconcileDialog.selectedAccountId && (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  {(() => {
                    const selectedAcc = accounts.find(a => a.id === confirmReconcileDialog.selectedAccountId);
                    return selectedAcc ? (
                      <div className="space-y-1">
                        <p className="text-xs text-green-800 dark:text-green-200">
                          <strong>✓ Se conciliará en:</strong>
                        </p>
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                          {selectedAcc.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {selectedAcc.bank} • {selectedAcc.accountNumber}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setConfirmReconcileDialog({ open: false, movement: null, selectedAccountId: null })}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  onClick={handleConfirmReconcile}
                  disabled={!confirmReconcileDialog.selectedAccountId}
                >
                  Confirmar Conciliación
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
