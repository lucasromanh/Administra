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
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: 'Conciliación Bancaria',
      href: '/banking',
      icon: <Landmark className="h-4 w-4" />,
    },
    {
      name: 'Facturación',
      href: '/billing',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: 'Gastos',
      href: '/expenses',
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      name: 'Tareas',
      href: '/tasks',
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r bg-background overflow-hidden z-50">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        {hotelConfig.logo ? (
          <img
            src={hotelConfig.logo}
            alt="Logo del hotel"
            className="w-8 h-8 object-contain bg-white rounded p-0.5"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Hotel className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-primary truncate">{hotelConfig.name}</h1>
          <p className="text-[10px] text-muted-foreground">Administración</p>
        </div>
      </div>

      {user && (
        <div className="border-b px-4 py-3">
          <p className="text-xs font-medium truncate">{user.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul role="list" className="flex flex-col gap-y-1">
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

      <div className="border-t px-3 py-3 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={logout}
        >
          <LogOut className="mr-2 h-3 w-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
