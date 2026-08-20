'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyOrders } from '@/hooks/use-orders';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { ReviewDialog } from '@/components/dashboard/review-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, Plus } from 'lucide-react';
import { RentalOrder, RentalOrderItem } from '@/types/types';
import { useGetMe } from '@/hooks/use-auth';
import Image from 'next/image';

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useMyOrders();
  const { data: user } = useGetMe();
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [reviewItem, setReviewItem] = useState<RentalOrderItem | null>(null);

  const handleOpenReview = (order: RentalOrder, item: RentalOrderItem) => {
    setReviewOrder(order);
    setReviewItem(item);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        user={user}
        heading="My Rental Orders"
        subheading="Track reservation status, complete payments, and review completed gear rentals."
        action={
          <Link href="/gear">
            <Button className="gap-2 font-semibold text-xs sm:text-sm">
              <Plus className="h-4 w-4" />
              <span>Rent New Equipment</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-4 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order / Gear</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => {
                const firstItem = order.items?.[0];
                const gear = firstItem?.gearItem;

                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            gear?.images?.[0] ||
                            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                          }
                          alt={gear?.name || 'Gear'}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-xs">
                            {gear?.name || 'Rental Equipment'}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">#{order.id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 block">
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center bg-white dark:bg-slate-900">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Rental Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            You haven&apos;t rented any equipment yet. Explore our catalog of camping, water sports, and
            mountain gear.
          </p>
          <Link href="/gear" className="mt-4 inline-block">
            <Button size="sm">Browse Equipment</Button>
          </Link>
        </div>
      )}

      {/* Review Dialog Modal */}
      <ReviewDialog
        order={reviewOrder}
        item={reviewItem}
        isOpen={!!reviewOrder}
        onClose={() => {
          setReviewOrder(null);
          setReviewItem(null);
        }}
      />
    </div>
  );
}
