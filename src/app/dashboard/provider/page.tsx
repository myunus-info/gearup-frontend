'use client';

import {
  DashboardCategoryPieChart,
  DashboardRevenueChart,
} from '@/components/dashboard/dashboard-charts';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { OrderStatusModal } from '@/components/dashboard/order-status-modal';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useProviderGear, useProviderOrders } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder } from '@/types';
import {
  ArrowRight,
  Clock,
  DollarSign,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { data: gears, isLoading: gearsLoading } = useProviderGear();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();

  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);

  const totalGears = gears?.length || 0;
  const pendingOrders = (orders || []).filter((o: RentalOrder) => o.status === 'PLACED');
  const activeRentals = (orders || []).filter((o: RentalOrder) => o.status === 'PICKED_UP');
  const totalRevenue = (orders || []).reduce(
    (acc: number, o: RentalOrder) => acc + Number(o.totalAmount || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading={`${user?.providerProfile?.shopName || 'Provider'} Portal`}
        subheading="Manage rental gear inventory, review incoming reservation requests, and track shop payouts."
        action={
          <Link href="/dashboard/provider/gear/new">
            <Button className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer">
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
          iconClassName="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Active Rentals"
          value={activeRentals.length}
          description="Gear currently out on trail"
          icon={ShoppingBag}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Gross Revenue"
          value={formatCurrency(totalRevenue)}
          description="Total booking receipts"
          icon={DollarSign}
          trend="+18.4% this month"
          trendPositive={true}
        />
      </div>

      {/* Dynamic Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart rentals={orders || []} />
        </div>
        <div>
          <DashboardCategoryPieChart gears={gears || []} />
        </div>
      </div>

      {/* Pending Incoming Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Incoming Orders Requiring Action</h2>
            {pendingOrders.length > 0 && (
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                {pendingOrders.length} Pending
              </span>
            )}
          </div>
          <Link
            href="/dashboard/provider/orders"
            className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Provider Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {ordersLoading || gearsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-36 w-full rounded-3xl" />
            <Skeleton className="h-36 w-full rounded-3xl" />
          </div>
        ) : pendingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((order: RentalOrder) => {
              const firstItem = order.items?.[0];
              const gear = firstItem?.gearItem;

              return (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <Image
                      src={
                        gear?.images?.[0] ||
                        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                      }
                      alt={gear?.name || 'Gear'}
                      width={60}
                      height={60}
                      className="h-15 w-15 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">
                        {gear?.name || 'Outdoor Gear'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Customer: {order.customer?.name || 'Customer'}
                      </p>
                      <p className="text-xs font-bold text-foreground mt-0.5">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full sm:w-auto text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                  >
                    Manage Handoff
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center bg-card">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-bold text-foreground">No orders currently awaiting approval</h4>
            <p className="text-xs text-muted-foreground mt-1">
              All incoming equipment bookings have been confirmed or fulfilled.
            </p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
