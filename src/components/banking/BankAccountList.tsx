import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BankAccount } from '@/lib/types';
import { Landmark } from 'lucide-react';

interface BankAccountListProps {
  accounts: BankAccount[];
  onSelectAccount?: (account: BankAccount) => void;
}

export function BankAccountList({
  accounts,
  onSelectAccount,
}: BankAccountListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => onSelectAccount?.(account)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {account.name}
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(account.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {account.bank} • {account.accountNumber}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
