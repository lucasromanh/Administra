import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { BankingPage } from '@/pages/BankingPage';
import { BillingPage } from '@/pages/BillingPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TasksPage } from '@/pages/TasksPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { StockPage } from '@/pages/StockPage';
import { PayrollPage } from '@/pages/PayrollPage';
import { AuditPage } from '@/pages/AuditPage';
import { CashImportPage } from '@/pages/CashImportPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

function LoginRoute() {
  const { isAuthenticated, login } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <LoginPage onLogin={login} />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/banking',
    element: <ProtectedRoute><BankingPage /></ProtectedRoute>,
  },
  {
    path: '/billing',
    element: <ProtectedRoute><BillingPage /></ProtectedRoute>,
  },
  {
    path: '/expenses',
    element: <ProtectedRoute><ExpensesPage /></ProtectedRoute>,
  },
  {
    path: '/reports',
    element: <ProtectedRoute><ReportsPage /></ProtectedRoute>,
  },
  {
    path: '/tasks',
    element: <ProtectedRoute><TasksPage /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },
  {
    path: '/stock',
    element: <ProtectedRoute><StockPage /></ProtectedRoute>,
  },
  {
    path: '/payroll',
    element: <ProtectedRoute><PayrollPage /></ProtectedRoute>,
  },
  {
    path: '/audit',
    element: <ProtectedRoute><AuditPage /></ProtectedRoute>,
  },
  {
    path: '/cash-import',
    element: <ProtectedRoute><CashImportPage /></ProtectedRoute>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
