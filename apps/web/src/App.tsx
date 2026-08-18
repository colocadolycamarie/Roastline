import { type ComponentType, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthGate } from '@/components/auth-gate';
import { AuthProvider } from '@/lib/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { LoginPage } from '@/pages/login';
import { DashboardPage, CustomerLoyaltyPage, DrawerPage, InventoryPage, LoyaltyPage, Marketing, MenuPage, POSPage, PickupPage, PrepPage, ReportsPage, SchedulingPage, SettingsPage, StaffPage } from '@/pages/roastline-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

function Admin({ component: Component }: { component: ComponentType }) {
  return (
    <AuthGate>
      <Component />
    </AuthGate>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
          <Route path="/" component={Marketing} />
          <Route path="/login" component={LoginPage} />
          <Route path="/pos"><Admin component={POSPage} /></Route>
          <Route path="/pos/prep"><Admin component={PrepPage} /></Route>
          <Route path="/pos/drawer"><Admin component={DrawerPage} /></Route>
          <Route path="/admin"><Admin component={DashboardPage} /></Route>
          <Route path="/admin/menu"><Admin component={MenuPage} /></Route>
          <Route path="/admin/inventory"><Admin component={InventoryPage} /></Route>
          <Route path="/admin/scheduling"><Admin component={SchedulingPage} /></Route>
          <Route path="/admin/staff"><Admin component={StaffPage} /></Route>
          <Route path="/admin/loyalty"><Admin component={LoyaltyPage} /></Route>
          <Route path="/admin/reports"><Admin component={ReportsPage} /></Route>
          <Route path="/admin/settings"><Admin component={SettingsPage} /></Route>
          <Route path="/order" component={PickupPage} />
          <Route path="/loyalty" component={CustomerLoyaltyPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
