'use client';

import {
  DashboardCategoryPieChart,
  DashboardRevenueChart,
  DashboardTrendsAreaChart,
} from '@/components/dashboard/dashboard-charts';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminGear, useAdminRentals, useAdminUsers } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder, User } from '@/types';
import {
  ArrowRight,
  DollarSign,
  Eye,
  Layers,
  Search,
  ShoppingBag,
  UserCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function AdminDashboardPage() {
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: gears, isLoading: gearsLoading } = useAdminGear();
  const { data: rentals, isLoading: rentalsLoading } = useAdminRentals();

  const [recentSearch, setRecentSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalUsers = users?.length || 0;
  const customers = users?.filter((u: User) => u.role === 'CUSTOMER').length || 0;
  const providers = users?.filter((u: User) => u.role === 'PROVIDER').length || 0;
  const totalGears = gears?.length || 0;
  const totalRentals = rentals?.length || 0;
  const grossVolume =
    rentals?.reduce((acc: number, r: RentalOrder) => acc + Number(r.totalAmount || 0), 0) || 0;

  // Filter recent rentals
  const filteredRentals = (rentals || []).filter((r: RentalOrder) => {
    const q = recentSearch.toLowerCase();
    const gearName = r.items?.[0]?.gearItem?.name?.toLowerCase() || '';
    const custName = r.customer?.name?.toLowerCase() || '';
    const orderId = r.id.toLowerCase();
    return gearName.includes(q) || custName.includes(q) || orderId.includes(q);
  });

  const totalPages = Math.ceil(filteredRentals.length / pageSize) || 1;
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="Platform Administration"
        subheading="Real-time global metrics, dynamic throughput analytics, catalog oversight, and user governance."
        action={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/analytics">
              <Button variant="outline" className="gap-2 font-semibold border-border">
                <span>Detailed Analytics</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                <UserCheck className="h-4 w-4" />
                <span>Manage Users</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Registered Users"
          value={totalUsers}
          description={`${customers} Customers • ${providers} Providers`}
          icon={Users}
          trend="+12% growth"
          trendPositive={true}
        />
        <StatsCard
          title="Active Gear Listings"
          value={totalGears}
          description="Across all outdoor categories"
          icon={Layers}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Platform Rentals"
          value={totalRentals}
          description="Total confirmed orders"
          icon={ShoppingBag}
          iconClassName="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Gross Rental Volume"
          value={formatCurrency(grossVolume)}
          description="Total processed throughput"
          icon={DollarSign}
          trend="+24.8% YoY"
          trendPositive={true}
        />
      </div>

      {/* Dynamic Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart rentals={rentals || []} />
        </div>
        <div>
          <DashboardCategoryPieChart gears={gears || []} />
        </div>
      </div>

      <div>
        <DashboardTrendsAreaChart rentals={rentals || []} />
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">User Moderation</h3>
              <p className="text-xs text-muted-foreground">Inspect accounts & toggle access</p>
            </div>
          </div>
          <Link href="/dashboard/admin/users" className="block pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs border-border cursor-pointer"
            >
              <span>View All Users ({totalUsers})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Catalog Moderation</h3>
              <p className="text-xs text-muted-foreground">Review provider listings & gear</p>
            </div>
          </div>
          <Link href="/dashboard/admin/gear" className="block pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs border-border cursor-pointer"
            >
              <span>Inspect Gear ({totalGears})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Platform Rentals</h3>
              <p className="text-xs text-muted-foreground">Audit bookings & transactions</p>
            </div>
          </div>
          <Link href="/dashboard/admin/rentals" className="block pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs border-border cursor-pointer"
            >
              <span>View All Rentals ({totalRentals})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Platform Activity Table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Recent Rental Activity</h3>
            <p className="text-xs text-muted-foreground">
              Latest bookings with real-time status and customer details
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recent orders..."
              value={recentSearch}
              onChange={(e) => {
                setRecentSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 text-xs rounded-xl border-border bg-background"
            />
          </div>
        </div>

        {rentalsLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : paginatedRentals.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Order Ref</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Gear Item</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRentals.map((order: RentalOrder) => {
                    const firstItem = order.items?.[0];
                    const gear = firstItem?.gearItem;

                    return (
                      <TableRow key={order.id} className="border-border hover:bg-muted/40">
                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <span className="font-semibold text-foreground block">
                              {order.customer?.name || 'Customer'}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {order.customer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                gear?.images?.[0] ||
                                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                              }
                              width={32}
                              height={32}
                              alt={gear?.name || 'Gear'}
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                            <span className="text-xs font-medium text-foreground truncate max-w-xs">
                              {gear?.name || 'Outdoor Gear'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(order.startDate)} - {formatDate(order.endDate)}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-foreground">
                          {formatCurrency(order.totalAmount)}
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

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRentals.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No rental activity found matching query.
          </div>
        )}
      </div>
    </div>
  );
}
