export const money = (cents = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export const compactMoney = (cents = 0) =>
  cents >= 100000 ? `$${(cents / 100000).toFixed(1)}k` : money(cents);

export const initials = (name = '') =>
  name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export const dateLabel = (value?: string) =>
  value ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—';