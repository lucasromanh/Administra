import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BankAccount } from '@/lib/types';
import { Landmark } from 'lucide-react';

interface BankAccountListProps {
  accounts: BankAccount[];
  selectedAccountId?: string;
  onSelectAccount?: (account: BankAccount) => void;
}

export function BankAccountList({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: BankAccountListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const isSelected = selectedAccountId === account.id;
        return (
          <Card
            key={account.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected 
                ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectAccount?.(account)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">
                {account.name}
              </CardTitle>
              <Landmark className={`h-3 w-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {formatCurrency(account.balance)}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {account.bank} • {account.accountNumber}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
