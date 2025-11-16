import { NavigationItem } from './NavigationItem';
import {
  LayoutDashboard,
  Landmark,
  FileText,
  Receipt,
  BarChart3,
  CheckSquare,
} from 'lucide-react';

export function Sidebar() {
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
  ];

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 border-r bg-background px-6 py-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold text-primary">ADMINISTRA</h1>
      </div>
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
    </div>
  );
}
