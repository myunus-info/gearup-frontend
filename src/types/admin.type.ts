export interface IDashboardStats {
  totalUsers: number;
  totalGears: number;
  totalRentals: number;
  totalRevenue: number;
  activeRentals: number;
  revenueByMonth?: { month: string; revenue: number }[];
  categoryDistribution?: { name: string; count: number }[];
}

export interface IAdminUserFilters {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}
