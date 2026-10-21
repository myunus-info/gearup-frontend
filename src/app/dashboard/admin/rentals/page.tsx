'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { StatusBadge } from '@/components/shared/status-badge';
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
import { useAdminRentals } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder } from '@/types';
import { Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAdminRentals();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = (rentals || []).filter((order: RentalOrder) => {
    const q = search.toLowerCase();
    const gearName = order.items?.[0]?.gearItem?.name?.toLowerCase() || '';
    const custName = order.customer?.name?.toLowerCase() || '';
    const custEmail = order.customer?.email?.toLowerCase() || '';
    const orderId = order.id.toLowerCase();

    const matchesSearch =
      gearName.includes(q) || custName.includes(q) || custEmail.includes(q) || orderId.includes(q);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedOrders = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Platform-Wide Rental Orders"
        subheading="Audit all customer bookings, transaction amounts, and fulfillment statuses across the marketplace."
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, customer, gear..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-sm rounded-xl border-border bg-card"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'PLACED', 'CONFIRMED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase transition cursor-pointer shrink-0 ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Gear Item(s)</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Fulfillment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order: RentalOrder) => {
                  const firstItem = order.items?.[0];
                  const gear = firstItem?.gearItem;

                  return (
                    <TableRow key={order.id} className="border-border hover:bg-muted/40">
                      <TableCell>
                        <span className="font-mono font-semibold text-xs text-foreground">
                          #{order.id.slice(-8)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-xs">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <span className="font-semibold text-foreground block">
                              {order.customer?.name || 'Customer'}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {order.customer?.email || 'customer@gearup.com'}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={
                              gear?.images?.[0] ||
                              'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                            }
                            width={38}
                            height={38}
                            alt={gear?.name || 'Gear'}
                            className="h-9 w-9 rounded-xl object-cover"
                          />
                          <span className="text-xs font-medium text-foreground truncate max-w-xs">
                            {gear?.name || 'Equipment Rental'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(order.startDate)} - {formatDate(order.endDate)}
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-foreground text-sm">
                          {formatCurrency(order.totalAmount)}
                        </span>
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
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
          <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">No platform rental orders match the filters</h4>
        </div>
      )}
    </div>
  );
}
