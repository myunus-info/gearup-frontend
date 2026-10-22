import { Badge } from '@/components/ui/badge';
import type { RentalStatus } from '@/types';

export function StatusBadge({ status }: { status: RentalStatus | string }) {
  switch (status) {
    case 'PLACED':
      return (
        <Badge
          variant="outline"
          className="border-blue-200 dark:border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400"
        >
          Placed
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge
          variant="secondary"
          className="border-amber-200 dark:border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          Confirmed
        </Badge>
      );
    case 'PAID':
      return (
        <Badge
          variant="secondary"
          className="border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          Paid
        </Badge>
      );
    case 'PICKED_UP':
      return (
        <Badge
          variant="default"
          className="bg-violet-600/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/30"
        >
          Picked Up
        </Badge>
      );
    case 'RETURNED':
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          Returned
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge
          variant="destructive"
          className="border-red-200 dark:border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
