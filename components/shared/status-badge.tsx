import { Badge } from '@/components/ui/badge';
import { RentalStatus } from '@/types/types';

export function StatusBadge({ status }: { status: RentalStatus | string }) {
  switch (status) {
    case 'PLACED':
      return (
        <Badge variant="outline" className="border-blue-200 bg-blue-500/10 text-blue-700">
          Placed
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge variant="secondary" className="border-amber-200 bg-amber-500/10 text-amber-700">
          Confirmed
        </Badge>
      );
    case 'PAID':
      return (
        <Badge variant="secondary" className="border-emerald-200 bg-emerald-500/10 text-emerald-700">
          Paid
        </Badge>
      );
    case 'PICKED_UP':
      return (
        <Badge variant="default" className="bg-violet-600/10 text-violet-700 border-violet-200">
          Picked Up
        </Badge>
      );
    case 'RETURNED':
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-500/10 text-emerald-700">
          Returned
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="destructive" className="border-red-200 bg-red-500/10 text-red-700">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
