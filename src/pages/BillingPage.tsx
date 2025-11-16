import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { CustomerList } from '@/components/billing/CustomerList';
import { useInvoices, useCustomers } from '@/hooks/useMockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function BillingPage() {
  const [invoices] = useInvoices();
  const [customers] = useCustomers();
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers'>('invoices');

  return (
    <div className="flex flex-col">
      <Header
        title="Facturación y Cobranza"
        description="Gestiona facturas y clientes"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        }
      />
      <div className="flex-1 p-8">
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-2 px-4 ${
              activeTab === 'invoices'
                ? 'border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            Facturas
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2 px-4 ${
              activeTab === 'customers'
                ? 'border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            Clientes
          </button>
        </div>

        {activeTab === 'invoices' ? (
          <InvoiceList
            invoices={invoices}
            onViewInvoice={(invoice) => console.log('Ver factura:', invoice)}
          />
        ) : (
          <CustomerList customers={customers} />
        )}
      </div>
    </div>
  );
}
