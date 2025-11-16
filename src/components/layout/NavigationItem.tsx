import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export function NavigationItem({ name, href, icon }: NavigationItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {icon}
      <span>{name}</span>
    </Link>
  );
}
