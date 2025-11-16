import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';

interface SendReminderButtonProps {
  invoiceId: string;
  customerEmail: string;
}

export function SendReminderButton({
  invoiceId,
  customerEmail,
}: SendReminderButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendReminder = async () => {
    setIsSending(true);
    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Recordatorio enviado para factura ${invoiceId} a ${customerEmail}`);
    setIsSending(false);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleSendReminder}
      disabled={isSending}
    >
      <Mail className="mr-2 h-4 w-4" />
      {isSending ? 'Enviando...' : 'Enviar recordatorio'}
    </Button>
  );
}
