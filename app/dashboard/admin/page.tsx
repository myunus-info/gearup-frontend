'use client';

import Link from 'next/link';
import { useAdminUsers, useAdminGear, useAdminRentals } from '@/hooks/use-admin';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Users, Store, Layers, ShoppingBag, DollarSign, Shield, ArrowRight, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: gears, isLoading: gearsLoading } = useAdminGear();
  const { data: rentals, isLoading: rentalsLoading } = useAdminRentals();

  const totalUsers = users?.length || 0;
  const customers = users?.filter(u => u.role === 'CUSTOMER').length || 0;
  const providers = users?.filter(u => u.role === 'PROVIDER').length || 0;
  const totalGears = gears?.length || 0;
  const totalRentals = rentals?.length || 0;
  const grossVolume = rentals?.reduce((acc, r) => acc + Number(r.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="Platform Administration"
        subheading="Global system metrics, user governance, gear catalog moderation, and rental oversight."
        action={
          <Link href="/dashboard/admin/users">
            <Button className="gap-2 font-semibold">
              <UserCheck className="h-4 w-4" />
              <span>Manage Users</span>
            </Button>
          </Link>
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
          description="Across all categories"
          icon={Layers}
          iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/50"
        />
        <StatsCard
          title="Platform Rentals"
          value={totalRentals}
          description="Total orders processed"
          icon={ShoppingBag}
          iconClassName="bg-purple-50 text-purple-600 dark:bg-purple-950/50"
        />
        <StatsCard
          title="Gross Rental Volume"
          value={formatCurrency(grossVolume)}
          description="Platform throughput"
          icon={DollarSign}
          trend="+24% YoY"
          trendPositive={true}
        />
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">User Moderation</h3>
              <p className="text-xs text-slate-500">Inspect accounts & toggle Suspended status</p>
            </div>
          </div>
          <Link href="/dashboard/admin/users" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              <span>View All Users</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Gear Catalog Oversight
              </h3>
              <p className="text-xs text-slate-500">Review all listed inventory & provider shops</p>
            </div>
          </div>
          <Link href="/dashboard/admin/gear" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              <span>Inspect Gear Listings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Platform Rentals</h3>
              <p className="text-xs text-slate-500">Audit transactions, payouts, and disputes</p>
            </div>
          </div>
          <Link href="/dashboard/admin/rentals" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              <span>View Global Rentals</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
