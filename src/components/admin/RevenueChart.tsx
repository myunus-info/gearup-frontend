'use client';

import { DashboardRevenueChart } from '@/components/dashboard/dashboard-charts';

export function RevenueChart({ rentals = [] }: { rentals?: any[] }) {
  return <DashboardRevenueChart rentals={rentals} />;
}

export default RevenueChart;
