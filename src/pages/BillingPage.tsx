import { Header } from '@/components/layout/Header';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { CustomerList } from '@/components/billing/CustomerList';
import { useInvoices, useCustomers } from '@/hooks/useMockData';
import { generateBillingReport } from '@/lib/reports-pdf';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Invoice } from '@/lib/types';

export function BillingPage() {
  const [invoices, setInvoices] = useInvoices();
  const [customers, setCustomers] = useCustomers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(21);
  const [total, setTotal] = useState(0);

  const handleDownloadReport = () => {
    generateBillingReport(invoices);
  };

  // Detectar facturas vencidas automáticamente
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedInvoices = invoices.map(invoice => {
      if (invoice.status === 'pendiente') {
        const dueDate = new Date(invoice.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return { ...invoice, status: 'vencida' as const };
        }
      }
      return invoice;
    });

    // Solo actualizar si hay cambios
    const hasChanges = updatedInvoices.some((inv, idx) => inv.status !== invoices[idx].status);
    if (hasChanges) {
      setInvoices(updatedInvoices);
    }
  }, [invoices, setInvoices]);

  // Cambiar estado de factura manualmente
  const handleChangeInvoiceStatus = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    ));
  };

  // Calcular total automáticamente
  const calculateTotal = (subtotalValue: number, taxRateValue: number) => {
    const taxAmount = subtotalValue * (taxRateValue / 100);
    const totalValue = subtotalValue + taxAmount;
    setTotal(totalValue);
  };

  const handleSubtotalChange = (value: string) => {
    const subtotalValue = parseFloat(value) || 0;
    setSubtotal(subtotalValue);
    calculateTotal(subtotalValue, taxRate);
  };

  const handleTaxRateChange = (value: string) => {
    const taxRateValue = parseFloat(value) || 0;
    setTaxRate(taxRateValue);
    calculateTotal(subtotal, taxRateValue);
  };

  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let customerName = '';
    let customerId = '';

    if (isNewCustomer) {
      // Crear nuevo cliente
      customerName = formData.get('newCustomerName') as string;
      customerId = `cust-${Date.now()}`;
      
      const newCustomer = {
        id: customerId,
        name: customerName,
        rut: formData.get('newCustomerDoc') as string || '-',
        email: formData.get('newCustomerEmail') as string,
        phone: formData.get('newCustomerPhone') as string || '',
        address: formData.get('newCustomerAddress') as string || '',
        type: 'empresa' as const,
        contactPerson: customerName,
      };
      
      setCustomers([...customers, newCustomer]);
    } else {
      customerId = formData.get('customer') as string;
      const customer = customers.find(c => c.id === customerId);
      customerName = customer?.name || '';
    }

    // Generar número de factura con formato F-XXXXX-YYYY
    const currentYear = new Date().getFullYear();
    const invoiceNumber = invoices.length + 1;
    const formattedNumber = `F-${String(invoiceNumber).padStart(5, '0')}-${currentYear}`;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      number: formattedNumber,
      customerId: customerId,
      customerName: customerName,
      date: formData.get('date') as string,
      dueDate: formData.get('dueDate') as string,
      amount: total,
      status: (formData.get('status') as 'pendiente' | 'pagada' | 'vencida' | 'anulada') || 'pendiente',
      items: [{
        id: `item-${Date.now()}`,
        description: formData.get('concept') as string,
        quantity: 1,
        unitPrice: subtotal,
        total: total,
      }],
      notes: formData.get('notes') as string || undefined,
    };

    setInvoices([newInvoice, ...invoices]);
    setIsDialogOpen(false);
    
    // Reset form
    setSubtotal(0);
    setTaxRate(21);
    setTotal(0);
    setIsNewCustomer(false);
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
            <Button onClick={() => setIsDialogOpen(true)} size="sm" className="gap-2">
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
              onChangeStatus={handleChangeInvoiceStatus}
            />
          </TabsContent>
          <TabsContent value="customers" className="mt-0">
            <CustomerList customers={customers} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Factura</DialogTitle>
            <DialogDescription>
              Crea una nueva factura para un cliente. Completa todos los campos requeridos.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Cliente *</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    checked={!isNewCustomer}
                    onChange={() => setIsNewCustomer(false)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cliente Existente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    checked={isNewCustomer}
                    onChange={() => setIsNewCustomer(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cliente Nuevo (Check-in)</span>
                </label>
              </div>
            </div>

            {!isNewCustomer ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Seleccionar Cliente *</Label>
                  <Select name="customer" required>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Buscar cliente guardado" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha de Emisión *</Label>
                  <Input name="date" id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Cliente Nuevo:</strong> Ingresa los datos del huésped para crear la factura. 
                    Este cliente se guardará automáticamente para futuras facturas.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerName">Nombre Completo *</Label>
                    <Input name="newCustomerName" id="newCustomerName" placeholder="Ej: Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerEmail">Email *</Label>
                    <Input name="newCustomerEmail" id="newCustomerEmail" type="email" placeholder="ejemplo@email.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerPhone">Teléfono</Label>
                    <Input name="newCustomerPhone" id="newCustomerPhone" placeholder="+34 600 123 456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerDoc">DNI/Pasaporte</Label>
                    <Input name="newCustomerDoc" id="newCustomerDoc" placeholder="12345678X" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha de Emisión *</Label>
                    <Input name="date" id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCustomerAddress">Dirección (opcional)</Label>
                  <Input name="newCustomerAddress" id="newCustomerAddress" placeholder="Calle, número, ciudad, país" />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
                <Input name="dueDate" id="dueDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select name="status" defaultValue="pendiente">
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="pagada">Pagada</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Concepto *</Label>
              <Input name="concept" id="concept" placeholder="Ej: Hospedaje habitación 205" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal *</Label>
                <Input 
                  name="subtotal" 
                  id="subtotal" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00"
                  value={subtotal || ''}
                  onChange={(e) => handleSubtotalChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">IVA (%) *</Label>
                <Input 
                  name="tax" 
                  id="tax" 
                  type="number" 
                  step="0.01" 
                  value={taxRate}
                  onChange={(e) => handleTaxRateChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total</Label>
                <Input 
                  id="total" 
                  type="number" 
                  step="0.01" 
                  value={total.toFixed(2)}
                  disabled 
                  className="bg-muted font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA ({taxRate}%):</span>
                <span className="font-medium">${(subtotal * (taxRate / 100)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-green-300 dark:border-green-700 mt-2 pt-2">
                <span>Total:</span>
                <span className="text-green-700 dark:text-green-300">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input name="notes" id="notes" placeholder="Notas adicionales (opcional)" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setSubtotal(0);
                setTaxRate(21);
                setTotal(0);
                setIsNewCustomer(false);
              }}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Factura
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
