import { Header } from '@/components/layout/Header';
import { BankAccountList } from '@/components/banking/BankAccountList';
import { BankMovementsTable } from '@/components/banking/BankMovementsTable';
import { ReconciliationResultComponent } from '@/components/banking/ReconciliationResult';
import { UploadBankFileModal } from '@/components/banking/UploadBankFileModal';
import { Button } from '@/components/ui/button';
import { useBankAccounts, useBankMovements } from '@/hooks/useMockData';
import { reconcileMovements } from '@/lib/bank';
import { generateBankingReport } from '@/lib/reports-pdf';
import { useState } from 'react';
import { Download } from 'lucide-react';
import type { BankAccount } from '@/lib/types';

export function BankingPage() {
  const [accounts] = useBankAccounts();
  const [movements] = useBankMovements();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const filteredMovements = selectedAccount
    ? movements.filter((m) => m.accountId === selectedAccount.id)
    : movements;

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
            <UploadBankFileModal />
          </div>
        }
      />
      <div className="px-6 py-4 space-y-6 w-full">
        <div>
          <h3 className="text-sm font-medium mb-3">Cuentas Bancarias</h3>
          <BankAccountList
            accounts={accounts}
            onSelectAccount={setSelectedAccount}
          />
        </div>

        {selectedAccount && (
          <>
            <div>
              <h3 className="text-sm font-medium mb-3">
                Resultado de Conciliación - {selectedAccount.name}
              </h3>
              {reconciliationResult && (
                <ReconciliationResultComponent result={reconciliationResult} />
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Movimientos</h3>
              <BankMovementsTable movements={filteredMovements} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
