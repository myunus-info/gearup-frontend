import { Badge } from '@/components/ui/badge';
import type { RentalStatus } from '@/types';

export function StatusBadge({ status }: { status: RentalStatus | string }) {
  const normalized = (status || '').toUpperCase();
  switch (normalized) {
    case 'PLACED':
      return (
        <Badge
          variant="outline"
          className="border-blue-300 bg-blue-50 text-blue-800 font-semibold dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300"
        >
          Placed
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-900 font-semibold dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
        >
          Confirmed
        </Badge>
      );
    case 'PAID':
      return (
        <Badge
          variant="outline"
          className="border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
        >
          Paid
        </Badge>
      );
    case 'PICKED_UP':
      return (
        <Badge
          variant="outline"
          className="border-violet-300 bg-violet-50 text-violet-800 font-semibold dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300"
        >
          Picked Up
        </Badge>
      );
    case 'RETURNED':
      return (
        <Badge
          variant="outline"
          className="border-teal-300 bg-teal-50 text-teal-800 font-semibold dark:border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-300"
        >
          Returned
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge
          variant="outline"
          className="border-rose-300 bg-rose-50 text-rose-800 font-semibold dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
        >
          Cancelled
        </Badge>
      );
    case 'ACTIVE':
    case 'COMPLETED':
      return (
        <Badge
          variant="outline"
          className="border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
        >
          {normalized === 'ACTIVE' ? 'Active' : 'Completed'}
        </Badge>
      );
    case 'BLOCKED':
    case 'FAILED':
      return (
        <Badge
          variant="outline"
          className="border-rose-300 bg-rose-50 text-rose-800 font-semibold dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
        >
          {normalized === 'BLOCKED' ? 'Blocked' : 'Failed'}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-900 font-semibold dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
        >
          Pending
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-border bg-muted/60 text-foreground font-semibold"
        >
          {status}
        </Badge>
      );
  }
}
