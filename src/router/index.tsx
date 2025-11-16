import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { BankingPage } from '@/pages/BankingPage';
import { BillingPage } from '@/pages/BillingPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TasksPage } from '@/pages/TasksPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><DashboardPage /></AppLayout>,
  },
  {
    path: '/banking',
    element: <AppLayout><BankingPage /></AppLayout>,
  },
  {
    path: '/billing',
    element: <AppLayout><BillingPage /></AppLayout>,
  },
  {
    path: '/expenses',
    element: <AppLayout><ExpensesPage /></AppLayout>,
  },
  {
    path: '/reports',
    element: <AppLayout><ReportsPage /></AppLayout>,
  },
  {
    path: '/tasks',
    element: <AppLayout><TasksPage /></AppLayout>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
