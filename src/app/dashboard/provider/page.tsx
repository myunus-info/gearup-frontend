'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProviderGear, useProviderOrders } from '@/hooks/use-provider';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { OrderStatusModal } from '@/components/dashboard/order-status-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RentalOrder } from '@/types/types';
import { Package, ShoppingBag, DollarSign, PlusCircle, Clock, ArrowRight } from 'lucide-react';
import { useGetMe } from '@/hooks/use-auth';

export default function ProviderDashboardPage() {
  const { data: gears, isLoading: gearsLoading } = useProviderGear();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();
  const { data: user } = useGetMe();

  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);

  const totalGears = gears?.length || 0;
  const pendingOrders = orders?.filter((o: RentalOrder) => o.status === 'PLACED') || [];
  const activeRentals = orders?.filter((o: RentalOrder) => o.status === 'PICKED_UP') || [];
  const totalRevenue =
    orders?.reduce((acc: number, o: RentalOrder) => acc + Number(o.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        user={user}
        heading={`${user?.data?.providerProfile?.shopName || 'Provider'} Portal`}
        subheading="Manage rental gear inventory, fulfill customer orders, and track revenue."
        action={
          <Link href="/dashboard/provider/gear/new">
            <Button className="gap-2 font-semibold cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              <span>Add New Equipment</span>
            </Button>
          </Link>
        }
      />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Listed Equipment"
          value={totalGears}
          description="Active rental items"
          icon={Package}
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingOrders.length}
          description="Orders awaiting confirmation"
          icon={Clock}
          iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/50"
        />
        <StatsCard
          title="Active Rentals"
          value={activeRentals.length}
          description="Gear currently out on trail"
          icon={ShoppingBag}
          iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/50"
        />
        <StatsCard
          title="Gross Revenue"
          value={formatCurrency(totalRevenue)}
          description="Total booking receipts"
          icon={DollarSign}
          trend="+18% this month"
          trendPositive={true}
        />
      </div>

      {/* Pending Incoming Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Incoming Orders Requiring Action
            </h2>
            {pendingOrders.length > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                {pendingOrders.length} Pending
              </span>
            )}
          </div>
          <Link
            href="/dashboard/provider/orders"
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>View All Provider Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {ordersLoading || gearsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {orders.slice(0, 4).map((order: RentalOrder) => {
              const firstItem = order.items?.[0];
              const gear = firstItem?.gearItem;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-slate-400">#{order.id.slice(-8)}</span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                        {gear?.name || 'Equipment Rental'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Customer: {order.customer?.name || 'Adventurer'}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Rental Dates:</span>
                      <span className="font-semibold">
                        {formatDate(order.startDate)} - {formatDate(order.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Amount:</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs font-semibold"
                    >
                      Update Order Status
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-12 text-center bg-white dark:bg-slate-900">
            <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No orders yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add new equipment to your catalog to start receiving bookings from local adventurers.
            </p>
          </div>
        )}
      </div>

      <OrderStatusModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
