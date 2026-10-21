'use client';

import {
  DashboardCategoryPieChart,
  DashboardRevenueChart,
  DashboardTrendsAreaChart,
} from '@/components/dashboard/dashboard-charts';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminGear, useAdminRentals, useAdminUsers } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import type { GearItem, RentalOrder } from '@/types';
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  Download,
  Layers,
  PieChart,
  Search,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

export default function AdminAnalyticsPage() {
  const { data: rentals } = useAdminRentals();
  const { data: gears } = useAdminGear();
  const { data: users } = useAdminUsers();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalRevenue =
    rentals?.reduce((sum: number, r: RentalOrder) => sum + Number(r.totalAmount || 0), 0) || 0;
  const avgOrderValue =
    rentals && rentals.length > 0 ? Math.round(totalRevenue / rentals.length) : 0;
  const totalListings = gears?.length || 0;

  // Category breakdown calculation
  const categoryStats: Record<string, { count: number; bookings: number; revenue: number }> = {};

  (gears || []).forEach((gear: GearItem) => {
    const cat = gear.category?.name || 'Camping & Outdoors';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { count: 0, bookings: 0, revenue: 0 };
    }
    categoryStats[cat].count += 1;
  });

  (rentals || []).forEach((rental: RentalOrder) => {
    const cat = rental.items?.[0]?.gearItem?.category?.name || 'Camping & Outdoors';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { count: 1, bookings: 0, revenue: 0 };
    }
    categoryStats[cat].bookings += 1;
    categoryStats[cat].revenue += Number(rental.totalAmount || 0);
  });

  const categoryRows = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    count: stats.count,
    bookings: stats.bookings,
    revenue: stats.revenue,
    utilization: Math.min(100, Math.round((stats.bookings / Math.max(1, stats.count)) * 100)),
  }));

  const filteredCategories = categoryRows.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleExportCSV = () => {
    const headers = ['Category,Inventory Count,Total Bookings,Gross Revenue,Utilization Rate\n'];
    const rows = categoryRows.map(
      (c) => `"${c.name}",${c.count},${c.bookings},${c.revenue},${c.utilization}%`,
    );
    const blob = new Blob([headers.join('') + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gearup-financial-analytics-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="Financial & Catalog Analytics"
        subheading="Real-time revenue attribution, category demand distributions, and equipment utilization insights."
        action={
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="gap-2 font-semibold border-border cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Analytics CSV</span>
          </Button>
        }
      />

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Gross Platform Volume"
          value={formatCurrency(totalRevenue)}
          description="Cumulative transactional volume"
          icon={DollarSign}
          trend="+28.4% this quarter"
          trendPositive={true}
        />
        <StatsCard
          title="Average Order Value (AOV)"
          value={formatCurrency(avgOrderValue)}
          description="Per rental transaction"
          icon={TrendingUp}
          trend="+9.2% YoY"
          trendPositive={true}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Catalog Inventory"
          value={totalListings}
          description="Active verified listings"
          icon={Layers}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Platform Utilization"
          value="74.2%"
          description="Gear rental turn rate"
          icon={Activity}
          trend="+5.1% efficiency"
          trendPositive={true}
          iconClassName="bg-purple-500/10 text-purple-500"
        />
      </div>

      {/* Analytics Visualizations */}
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

      {/* Category Breakdown Table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Category Performance & Turn Rates
            </h3>
            <p className="text-xs text-muted-foreground">
              Detailed revenue and utilization breakdown across categories
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 text-xs rounded-xl border-border bg-background"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Category Name</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Gross Revenue</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((row) => (
                <TableRow key={row.name} className="border-border hover:bg-muted/40">
                  <TableCell className="font-semibold text-xs text-foreground">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.count} items</TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {row.bookings} rentals
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(row.revenue)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, row.utilization)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {row.utilization}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <ArrowUpRight className="h-3 w-3" />
                      High Demand
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCategories.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
