import { NavigationItem } from './NavigationItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getHotelConfig } from '@/lib/hotelConfig';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Landmark,
  FileText,
  Receipt,
  BarChart3,
  CheckSquare,
  LogOut,
  Hotel,
  Settings,
} from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const [hotelConfig, setHotelConfig] = useState(getHotelConfig());

  // Actualizar config cuando cambie
  useEffect(() => {
    const handleStorageChange = () => {
      setHotelConfig(getHotelConfig());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Conciliación Bancaria',
      href: '/banking',
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      name: 'Facturación',
      href: '/billing',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Gastos',
      href: '/expenses',
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Tareas',
      href: '/tasks',
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 border-r bg-background px-6 py-4">
      <div className="flex h-16 shrink-0 items-center gap-3">
        {hotelConfig.logo ? (
          <img
            src={hotelConfig.logo}
            alt="Logo del hotel"
            className="w-10 h-10 object-contain bg-white rounded-lg p-1"
          />
        ) : (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hotel className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-primary">{hotelConfig.name}</h1>
          <p className="text-xs text-muted-foreground">Administración</p>
        </div>
      </div>

      {user && (
        <div className="border-b pb-4">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        </div>
      )}

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavigationItem
                name={item.name}
                href={item.href}
                icon={item.icon}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
