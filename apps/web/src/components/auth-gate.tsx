import { useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

/** Wrap any route tree that requires a signed-in staff member. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { staff, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !staff) {
      setLocation(`/login?next=${encodeURIComponent(location)}`);
    }
  }, [isLoading, staff, location, setLocation]);

  if (isLoading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  if (!staff) return null;

  return <>{children}</>;
}
