import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar />
      <main className="ml-64 min-w-0">
        {children}
      </main>
    </div>
  );
}
