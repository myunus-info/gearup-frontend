import { Badge } from '@/components/ui/badge';
import { Role } from '@/types/types';

export function RoleBadge({ role }: { role: Role | string }) {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200">
          Admin
        </Badge>
      );
    case 'PROVIDER':
      return (
        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-200">
          Provider
        </Badge>
      );
    case 'CUSTOMER':
      return (
        <Badge variant="ghost" className="bg-blue-500/10 text-blue-600 border-blue-200">
          Customer
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
