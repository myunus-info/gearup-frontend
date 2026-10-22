'use client';

import { DashboardRevenueChart } from '@/components/dashboard/dashboard-charts';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ReviewDialog } from '@/components/dashboard/review-dialog';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentDraft } from '@/contexts/payment-draft-context';
import { useAuth, useGetMe, useMyOrders } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder, RentalOrderItem } from '@/types';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { setPaymentDraft } = usePaymentDraft();
  const { user: authUser } = useAuth();
  const { data: userQuery } = useGetMe();
  const currentUser = authUser || userQuery;
  const { data: orders, isLoading } = useMyOrders();

  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [reviewItem, setReviewItem] = useState<RentalOrderItem | null>(null);

  const activeOrders = orders?.filter(
    (o: RentalOrder) =>
      o.status === 'PLACED' ||
      o.status === 'PICKED_UP' ||
      o.status === 'CONFIRMED' ||
      o.status === 'PAID',
  );
  const completedOrders = orders?.filter((o: RentalOrder) => o.status === 'RETURNED');
  const totalSpent =
    orders?.reduce((acc: number, o: RentalOrder) => acc + Number(o.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading={`Welcome back, ${currentUser?.name?.split(' ')[0] || 'Adventurer'}!`}
        subheading="Manage your gear reservations, track live rental periods, review gear, and inspect billing history."
        action={
          <Link href="/gear">
            <Button className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer">
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
          trend="+1 ready for adventure"
          trendPositive={true}
        />
        <StatsCard
          title="Total Reservations"
          value={orders?.length ?? 0}
          description="All time orders placed"
          icon={ShoppingBag}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Completed Trips"
          value={completedOrders?.length ?? 0}
          description="Returned safely"
          icon={CheckCircle2}
          iconClassName="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Total Gear Spend"
          value={formatCurrency(totalSpent)}
          description="Rental & insurance fees"
          icon={CreditCard}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Spending & Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart rentals={orders || []} />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Explore Next Trail</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GearUp connects you to verified premium expedition gear. Check out lightweight tents,
              mountain packs, and water sports inventory ready for your next getaway.
            </p>
          </div>
          <div className="pt-6 border-t border-border mt-4">
            <Link href="/gear" className="block">
              <Button className="w-full justify-between bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer">
                <span>Browse Outdoor Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Rentals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Active & Upcoming Reservations</h2>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-500">
              {activeOrders?.length || 0} Active
            </span>
          </div>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-44 w-full rounded-3xl" />
            <Skeleton className="h-44 w-full rounded-3xl" />
          </div>
        ) : activeOrders && activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order: RentalOrder) => {
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
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">
                        {gear?.name || 'Outdoor Gear'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.startDate)} to {formatDate(order.endDate)}
                      </p>
                      <p className="text-xs font-bold text-foreground mt-1">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <StatusBadge status={order.status} />
                    {order.status === 'PLACED' && gear?.id && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setPaymentDraft({
                            gearId: gear.id,
                            startDate: order.startDate
                              ? new Date(order.startDate).toISOString().split('T')[0]
                              : '',
                            endDate: order.endDate
                              ? new Date(order.endDate).toISOString().split('T')[0]
                              : '',
                            quantity: firstItem?.quantity || 1,
                          });
                          router.push(`/dashboard/customer/orders/${gear.id}/pay`);
                        }}
                        className="text-xs gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-7"
                      >
                        <CreditCard className="h-3 w-3" />
                        <span>Pay Now</span>
                      </Button>
                    )}
                    {order.status === 'RETURNED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReviewOrder(order);
                          setReviewItem(firstItem || null);
                        }}
                        className="text-xs gap-1 rounded-xl border-border cursor-pointer h-7"
                      >
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>Write Review</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center bg-card">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-bold text-foreground">No active gear reservations</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Find top-tier camping and backpacking equipment for your next adventure.
            </p>
            <Link href="/gear" className="inline-block mt-4">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Browse Rental Equipment
              </Button>
            </Link>
          </div>
        )}
      </div>

      {reviewOrder && reviewItem && (
        <ReviewDialog
          order={reviewOrder}
          item={reviewItem}
          isOpen={!!reviewOrder}
          onClose={() => {
            setReviewOrder(null);
            setReviewItem(null);
          }}
        />
      )}
    </div>
  );
}
