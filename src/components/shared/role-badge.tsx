import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';

export function RoleBadge({ role = 'CUSTOMER' }: { role?: Role | string }) {
  const normalized = (role || '').toUpperCase();
  switch (normalized) {
    case 'ADMIN':
      return (
        <Badge
          variant="outline"
          className="border-rose-300 bg-rose-50 text-rose-800 font-bold dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
        >
          Admin
        </Badge>
      );
    case 'PROVIDER':
      return (
        <Badge
          variant="outline"
          className="border-purple-300 bg-purple-50 text-purple-800 font-bold dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300"
        >
          Provider
        </Badge>
      );
    case 'CUSTOMER':
      return (
        <Badge
          variant="outline"
          className="border-sky-300 bg-sky-50 text-sky-800 font-bold dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300"
        >
          Customer
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-border bg-muted/60 text-foreground font-semibold"
        >
          {role}
        </Badge>
      );
  }
}
