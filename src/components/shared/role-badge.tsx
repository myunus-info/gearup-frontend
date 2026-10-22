import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';

export function RoleBadge({ role = 'CUSTOMER' }: { role?: Role | string }) {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
        >
          Admin
        </Badge>
      );
    case 'PROVIDER':
      return (
        <Badge
          variant="secondary"
          className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
        >
          Provider
        </Badge>
      );
    case 'CUSTOMER':
      return (
        <Badge
          variant="ghost"
          className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
        >
          Customer
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
