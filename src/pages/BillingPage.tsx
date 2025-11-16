import { Header } from '@/components/layout/Header';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { CustomerList } from '@/components/billing/CustomerList';
import { useInvoices, useCustomers } from '@/hooks/useMockData';
import { generateBillingReport } from '@/lib/reports-pdf';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download } from 'lucide-react';

export function BillingPage() {
  const [invoices] = useInvoices();
  const [customers] = useCustomers();

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
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
              <Download className="h-3 w-3" />
              Descargar Informe
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-3 w-3" />
              Nueva Factura
            </Button>
          </div>
        }
      />
      <div className="px-6 py-4 w-full">
        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="invoices" className="text-xs">Facturas</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="invoices" className="mt-0">
            <InvoiceList
              invoices={invoices}
              onViewInvoice={(invoice) => console.log('Ver factura:', invoice)}
            />
          </TabsContent>
          <TabsContent value="customers" className="mt-0">
            <CustomerList customers={customers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
