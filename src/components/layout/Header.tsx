import { ModeToggle } from '@/components/mode-toggle';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
