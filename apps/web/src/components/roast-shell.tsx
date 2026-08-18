import { BarChart3, CalendarDays, ClipboardList, Coffee, FileText, Heart, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Users, X, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { initials } from '@/lib/format';

const primary = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu & recipes', icon: Menu },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/scheduling', label: 'Scheduling', icon: CalendarDays },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/loyalty', label: 'Loyalty', icon: Heart },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const floor = [
  { href: '/pos', label: 'Point of sale', icon: ShoppingBag, tag: 'LIVE' },
  { href: '/pos/prep', label: 'Prep display', icon: ClipboardList },
  { href: '/pos/drawer', label: 'Drawer close', icon: FileText },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const { staff, logout } = useAuth();
  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <button className="fixed left-4 top-4 z-40 rounded-md bg-sidebar p-3 text-sidebar-foreground shadow-lg md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button>
      {open && <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" data-testid="button-close-navigation-overlay" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar px-6 py-7 text-sidebar-foreground transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-roastline-logo">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-sidebar-primary/40 bg-sidebar-primary text-sidebar-primary-foreground"><Coffee size={18} strokeWidth={2.2} /></span>
            <span>
              <strong className="block font-serif text-2xl italic tracking-tight">Roastline</strong>
              <small className="block font-mono text-[9px] uppercase tracking-[.28em] text-sidebar-foreground/45">Cafe command deck</small>
            </span>
          </Link>
          <button className="rounded-md p-1 text-sidebar-foreground/60 md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
        </div>

        <nav aria-label="Command center">
          <div className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.28em] text-sidebar-foreground/40">
            <span>Command center</span><span className="h-px flex-1 bg-sidebar-border" />
          </div>
          <ul className="space-y-0.5">
            {primary.map(({ href, label, icon: Icon }, i) => {
              const isActive = location === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex items-center gap-3 border-l-2 py-2.5 pl-3 pr-2 text-sm font-semibold transition-colors ${isActive ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-foreground' : 'border-transparent text-sidebar-foreground/65 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`}
                    data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and')}`}
                  >
                    <span className={`font-mono text-[10px] tabular-nums ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/35'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label="On the floor" className="mt-8">
          <div className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.28em] text-sidebar-foreground/40">
            <span>On the floor</span><span className="h-px flex-1 bg-sidebar-border" />
          </div>
          <ul className="space-y-0.5">
            {floor.map(({ href, label, icon: Icon, tag }) => {
              const isActive = location === href;
              return (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)} aria-current={isActive ? 'page' : undefined} className={`flex items-center gap-3 border-l-2 py-2.5 pl-3 pr-2 text-sm font-semibold transition-colors ${isActive ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-foreground' : 'border-transparent text-sidebar-foreground/65 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                    <Icon size={16} strokeWidth={1.8} />
                    <span className="flex-1">{label}</span>
                    {tag && <span className="rounded-sm bg-sidebar-primary px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-sidebar-primary-foreground">{tag}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-sidebar-border pt-5">
          <Link href="/admin/settings" className="flex items-center gap-3 border-l-2 border-transparent py-2.5 pl-3 pr-2 text-sm font-semibold text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground" data-testid="link-nav-settings"><Settings size={16} strokeWidth={1.8} /><span>Settings</span></Link>
          {staff && (
            <div className="mt-4 flex items-center gap-3 pl-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-primary font-mono text-[11px] font-bold text-sidebar-primary-foreground">{initials(staff.name)}</span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-xs">{staff.name}</strong><small className="text-[11px] capitalize text-sidebar-foreground/45">{staff.role}</small></span>
              <button
                onClick={async () => { await logout(); setLocation('/login'); }}
                className="rounded-md p-2 text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label="Sign out"
                data-testid="button-sign-out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="md:pl-[272px]">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.24em] text-secondary"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />{eyebrow || 'Roastline / Today'}</div>
        <h1 className="font-serif text-[2.75rem] italic leading-[0.95] tracking-tight text-foreground sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm not-italic leading-6 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function LoadingRows({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => <div className="h-14 animate-pulse rounded-md bg-muted" key={i} />)}
    </div>
  );
}

export function ErrorState({ message = 'The workspace could not be loaded.', retry }: { message?: string; retry?: () => void }) {
  return (
    <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-7 text-center">
      <p className="font-semibold text-destructive">{message}</p>
      {retry && <button onClick={retry} className="mt-3 rounded-md bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground" data-testid="button-retry">Try again</button>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-border bg-muted text-muted-foreground"><Icon size={22} strokeWidth={1.6} /></span>
        <h3 className="mt-5 font-serif text-2xl italic text-foreground">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm not-italic leading-6 text-muted-foreground">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, note, accent = false }: { label: string; value: string; note?: string; accent?: boolean }) {
  return (
    <div className={`rounded-md border p-5 ${accent ? 'border-primary bg-primary text-primary-foreground' : 'border-card-border bg-card shadow-sm'}`}>
      <div className={`font-mono text-[10px] uppercase tracking-[.2em] ${accent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{label}</div>
      <div className="mt-3 font-serif text-3xl font-medium italic tracking-tight">{value}</div>
      {note && <div className={`mt-2 text-xs ${accent ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{note}</div>}
    </div>
  );
}
