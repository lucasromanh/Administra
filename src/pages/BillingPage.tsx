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
import { useState } from 'react';

export function BillingPage() {
  const [invoices] = useInvoices();
  const [customers] = useCustomers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

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
          <form className="space-y-4">
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
                  <Select>
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
                  <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
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
                    <Input id="newCustomerName" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerEmail">Email *</Label>
                    <Input id="newCustomerEmail" type="email" placeholder="ejemplo@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerPhone">Teléfono</Label>
                    <Input id="newCustomerPhone" placeholder="+34 600 123 456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCustomerDoc">DNI/Pasaporte</Label>
                    <Input id="newCustomerDoc" placeholder="12345678X" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha de Emisión *</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCustomerAddress">Dirección (opcional)</Label>
                  <Input id="newCustomerAddress" placeholder="Calle, número, ciudad, país" />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue="pending">
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagada</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Concepto *</Label>
              <Input id="concept" placeholder="Ej: Hospedaje habitación 205" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal *</Label>
                <Input id="subtotal" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">IVA (%) *</Label>
                <Input id="tax" type="number" step="0.01" defaultValue="21" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total</Label>
                <Input id="total" type="number" step="0.01" placeholder="0.00" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input id="notes" placeholder="Notas adicionales (opcional)" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                // Aquí iría la lógica para crear la factura
              }}>
                Crear Factura
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
