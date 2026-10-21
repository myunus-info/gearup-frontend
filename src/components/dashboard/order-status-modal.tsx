'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateOrderStatus } from '@/hooks';
import type { RentalOrder, RentalStatus } from '@/types';
import { ArrowRight, CheckCircle2, RotateCcw, Truck, XCircle } from 'lucide-react';

interface OrderStatusModalProps {
  order: RentalOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderStatusModal({ order, isOpen, onClose }: OrderStatusModalProps) {
  const updateStatusMutation = useUpdateOrderStatus();

  if (!order) return null;

  const handleUpdate = async (statusToSet: RentalStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        status: statusToSet,
      });
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const getAvailableActions = () => {
    switch (order.status) {
      case 'PLACED':
        return [
          {
            status: 'CONFIRMED' as RentalStatus,
            label: 'Confirm Rental Order',
            description: 'Accept the reservation and notify customer to pay.',
            icon: CheckCircle2,
            variant: 'default' as const,
            btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
          },
          {
            status: 'CANCELLED' as RentalStatus,
            label: 'Decline / Cancel Order',
            description: 'Reject if equipment is unavailable.',
            icon: XCircle,
            variant: 'destructive' as const,
            btnClass: 'bg-red-600 hover:bg-red-700 text-white',
          },
        ];
      case 'CONFIRMED':
      case 'PAID':
        return [
          {
            status: 'PICKED_UP' as RentalStatus,
            label: 'Mark Gear as Picked Up',
            description: 'Customer has received the equipment.',
            icon: Truck,
            variant: 'default' as const,
            btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          },
          {
            status: 'CANCELLED' as RentalStatus,
            label: 'Cancel Order',
            description: 'Cancel reservation.',
            icon: XCircle,
            variant: 'destructive' as const,
            btnClass: 'bg-red-600 hover:bg-red-700 text-white',
          },
        ];
      case 'PICKED_UP':
        return [
          {
            status: 'RETURNED' as RentalStatus,
            label: 'Mark Gear as Returned',
            description: 'Gear returned safely and inspected.',
            icon: RotateCcw,
            variant: 'default' as const,
            btnClass: 'bg-slate-800 hover:bg-slate-900 text-white',
          },
        ];
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            Update Order #{order.id.slice(-6)}
          </DialogTitle>
          <DialogDescription>
            Change rental order state to trigger customer alerts and inventory updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900 border space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Current Status:</span>
              <StatusBadge status={order.status} />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {order.customer?.name || 'Customer'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Rental Items:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {order.items?.length || 1} gear item(s)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Action:
            </p>

            {actions.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-2">
                This order is in a final state ({order.status}) and cannot be modified.
              </p>
            ) : (
              actions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.status}
                    type="button"
                    onClick={() => handleUpdate(act.status)}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${act.btnClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          {act.label}
                        </h4>
                        <p className="text-xs text-slate-500">{act.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
