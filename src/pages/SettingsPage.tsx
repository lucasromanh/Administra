import { Header } from '@/components/layout/Header';
import { HotelSettings } from '@/components/settings/HotelSettings';

export function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Configuración"
        description="Personaliza tu hotel y sistema"
      />
      <div className="flex-1 p-8">
        <HotelSettings />
      </div>
    </div>
  );
}
