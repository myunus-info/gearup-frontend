'use client';

import { useState } from 'react';
import { useProviderOrders } from '@/hooks/use-provider';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { OrderStatusModal } from '@/components/dashboard/order-status-modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, User, Mail, ChevronRight } from 'lucide-react';
import { RentalOrder } from '@/types/types';
import Image from 'next/image';

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Provider Rental Orders"
        subheading="Review incoming reservation requests, confirm bookings, and manage equipment pickup & return handoffs."
      />

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-3 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order / Customer</TableHead>
                <TableHead>Equipment Item(s)</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Payout Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: RentalOrder) => {
                const firstItem = order.items?.[0];
                const gear = firstItem?.gearItem;

                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                          #{order.id.slice(-8)}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">{order.customer?.name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Mail className="h-3 w-3" />
                          <span>{order.customer?.email || 'customer@gearup.com'}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={
                            gear?.images?.[0] ||
                            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                          }
                          width={40}
                          height={40}
                          alt={gear?.name || 'Gear'}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block truncate max-w-xs">
                            {gear?.name || 'Equipment'}
                          </span>
                          <span className="text-[11px] text-slate-400">Qty: {firstItem?.quantity || 1}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">
                          {formatDate(order.startDate)}
                        </span>
                        <span className="text-slate-400">to {formatDate(order.endDate)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-semibold gap-1"
                      >
                        <span>Manage Status</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center bg-white dark:bg-slate-900">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Rental Requests Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Incoming reservations from customers will appear here in real-time.
          </p>
        </div>
      )}

      {/* Order Status Modal */}
      <OrderStatusModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
