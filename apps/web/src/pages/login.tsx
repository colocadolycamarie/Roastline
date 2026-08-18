import { useState, type FormEvent, type ReactNode } from 'react';
import { Coffee, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

export function LoginPage() {
  const { login, register, isSubmitting, error, clearError } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'sign-in' | 'set-up'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (mode === 'sign-in') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      const next = new URLSearchParams(window.location.search).get('next');
      setLocation(next && next.startsWith('/') ? next : '/admin');
    } catch {
      // Error state is already surfaced via `error` from useAuth.
    }
  };

  return (
    <div className="grid min-h-[100dvh] bg-background text-foreground md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-sidebar px-12 py-14 text-sidebar-foreground md:flex md:flex-col md:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(circle at 20% 15%, hsl(19 76% 40% / .35), transparent 55%), radial-gradient(circle at 85% 80%, hsl(43 61% 45% / .25), transparent 50%)' }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md border border-sidebar-primary/40 bg-sidebar-primary text-sidebar-primary-foreground"><Coffee size={20} strokeWidth={2.2} /></span>
          <span className="font-mono text-[10px] uppercase tracking-[.3em] text-sidebar-foreground/50">Roastline</span>
        </div>
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[.3em] text-secondary">Cafe command deck</p>
          <h1 className="mt-4 max-w-md font-serif text-6xl italic leading-[0.95] tracking-tight">Run the floor like it's the only thing that matters.</h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-sidebar-foreground/60">
            Register, prep queue, inventory, scheduling, and loyalty — one login, everything live.
          </p>
        </div>
        <p className="relative font-mono text-[10px] uppercase tracking-[.24em] text-sidebar-foreground/35">Est. wherever you brew it</p>
      </div>

      <div className="grid place-items-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-sidebar text-sidebar-primary"><Coffee size={20} strokeWidth={2.2} /></span>
          </div>
          <h2 className="font-serif text-4xl italic tracking-tight text-foreground">{mode === 'sign-in' ? 'Sign in' : 'Set up your café'}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'sign-in' ? 'Enter the command deck.' : 'Create the first owner account for this location.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            {mode === 'set-up' && (
              <Field label="Your name" htmlFor="name">
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm"
                  data-testid="input-name"
                />
              </Field>
            )}
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm"
                data-testid="input-email"
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <input
                id="password"
                type="password"
                required
                minLength={mode === 'set-up' ? 8 : undefined}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm"
                data-testid="input-password"
              />
            </Field>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[.98] disabled:opacity-60"
              data-testid="button-submit-auth"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {mode === 'sign-in' ? 'Sign in' : 'Create owner account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              clearError();
              setMode(mode === 'sign-in' ? 'set-up' : 'sign-in');
            }}
            className="mt-5 w-full text-center text-xs font-semibold text-secondary underline-offset-4 hover:underline"
            data-testid="button-toggle-auth-mode"
          >
            {mode === 'sign-in' ? 'First time here? Set up your café' : 'Already set up? Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
