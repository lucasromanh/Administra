import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { CustomerList } from '@/components/billing/CustomerList';
import { useInvoices, useCustomers } from '@/hooks/useMockData';
import { generateBillingReport } from '@/lib/reports-pdf';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export function BillingPage() {
  const [invoices] = useInvoices();
  const [customers] = useCustomers();
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers'>('invoices');

  const handleDownloadReport = () => {
    generateBillingReport(invoices);
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Facturacion y Cobranza"
        description="Gestiona facturas y clientes"
        actions={
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Informe
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
            </Button>
          </div>
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
