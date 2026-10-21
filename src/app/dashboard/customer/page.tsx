'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetMe } from '@/hooks/use-auth';
import { useMyOrders } from '@/hooks/use-orders';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { ReviewDialog } from '@/components/dashboard/review-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, Clock, CheckCircle2, CreditCard, ArrowRight, Sparkles, Plus } from 'lucide-react';
import Image from 'next/image';
import { RentalOrder, RentalOrderItem } from '@/types/types';

export default function CustomerDashboardPage() {
  const { data: user } = useGetMe();
  const { data: orders, isLoading } = useMyOrders();

  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [reviewItem, setReviewItem] = useState<RentalOrderItem | null>(null);

  const activeOrders = orders?.filter(
    (o: RentalOrder) => o.status === 'PICKED_UP' || o.status === 'CONFIRMED' || o.status === 'PAID',
  );
  const completedOrders = orders?.filter((o: RentalOrder) => o.status === 'RETURNED');
  const totalSpent =
    orders?.reduce((acc: number, o: RentalOrder) => acc + Number(o.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        user={user}
        heading={`Welcome back, ${user?.name?.split(' ')[0] || 'Adventurer'}!`}
        subheading="Manage your active gear reservations, past rentals, and trail reviews."
        action={
          <Link href="/gear">
            <Button className="gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              <span>Rent New Gear</span>
            </Button>
          </Link>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Rentals"
          value={activeOrders?.length ?? 0}
          description="In hand or awaiting pickup"
          icon={Clock}
          trend="+1 this week"
          trendPositive={true}
        />
        <StatsCard
          title="Total Reservations"
          value={orders?.length ?? 0}
          description="All time orders placed"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Completed Trips"
          value={completedOrders?.length ?? 0}
          description="Returned safely"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          description="Gear rental fees"
          icon={CreditCard}
        />
      </div>

      {/* Active Rentals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Active & Upcoming Reservations
            </h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              {activeOrders?.length || 0} Active
            </span>
          </div>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        ) : activeOrders && activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeOrders.map((order: RentalOrder) => {
              const firstItem = order.items?.[0];
              const gear = firstItem?.gearItem;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          gear?.images?.[0] ||
                          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                        }
                        alt={gear?.name || 'Gear'}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                          {gear?.name || 'Outdoor Equipment'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Order #{order.id.slice(-6)} • {order.items?.length || 1} item(s)
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Rental Window:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatDate(order.startDate)} → {formatDate(order.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Order Total:</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/dashboard/customer/orders">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-10 text-center bg-white dark:bg-slate-900">
            <Sparkles className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No active rentals right now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Ready for your next hike, paddle, or ski trip? Explore thousands of items listed by local
              providers.
            </p>
            <Link href="/gear" className="mt-4 inline-block">
              <Button size="sm" className="mt-3">
                Browse Gear Catalog
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Review Dialog */}
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
