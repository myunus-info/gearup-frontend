'use client';

import { useAdminRentals } from '@/hooks/use-admin';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import { RentalOrder } from '@/types/types';

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAdminRentals();

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Platform-Wide Rental Orders"
        subheading="Audit all customer bookings, transaction amounts, and fulfillment statuses across the marketplace."
      />

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-3 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : rentals && rentals.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Gear Item(s)</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">Fulfillment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((order: RentalOrder) => {
                const firstItem = order.items?.[0];
                const gear = firstItem?.gearItem;

                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <span className="font-mono font-semibold text-xs text-slate-900 dark:text-slate-100">
                        #{order.id.slice(-8)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                            {order.customer?.name || 'Customer'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.customer?.email || 'customer@gearup.com'}
                          </span>
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
                          width={38}
                          height={38}
                          alt={gear?.name || 'Gear'}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {gear?.name || 'Equipment Rental'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                      {formatDate(order.startDate)} - {formatDate(order.endDate)}
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center bg-white dark:bg-slate-900">
          <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200">No platform rental orders yet</h4>
        </div>
      )}
    </div>
  );
}
