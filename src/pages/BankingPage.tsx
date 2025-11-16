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
        actions={<UploadBankFileModal />}
      />
      <div className="flex-1 space-y-6 p-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Cuentas Bancarias</h3>
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Informe Bancario
          </Button>
        </div>
        <div>
          <BankAccountList
            accounts={accounts}
            onSelectAccount={setSelectedAccount}
          />
        </div>

        {selectedAccount && (
          <>
            <div>
              <h3 className="text-lg font-medium mb-4">
                Resultado de Conciliación - {selectedAccount.name}
              </h3>
              {reconciliationResult && (
                <ReconciliationResultComponent result={reconciliationResult} />
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Movimientos</h3>
              <BankMovementsTable movements={filteredMovements} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
