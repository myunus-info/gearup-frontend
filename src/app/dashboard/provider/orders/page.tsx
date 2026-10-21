'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { OrderStatusModal } from '@/components/dashboard/order-status-modal';
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
import { useProviderOrders } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder } from '@/types';
import { ChevronRight, Mail, Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = (orders || []).filter((order: RentalOrder) => {
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

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Provider Rental Orders"
        subheading="Review incoming reservation requests, confirm bookings, and manage equipment pickup & return handoffs."
      />

      {/* Filter Bar */}
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
          {['all', 'PLACED', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED'].map((s) => (
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
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Order / Customer</TableHead>
                  <TableHead>Equipment Item(s)</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Payout Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order: RentalOrder) => {
                  const firstItem = order.items?.[0];
                  const gear = firstItem?.gearItem;

                  return (
                    <TableRow key={order.id} className="border-border hover:bg-muted/40">
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            #{order.id.slice(-8)}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {order.customer?.name || 'Customer'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{order.customer?.email || 'customer@gearup.com'}</span>
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
                            width={40}
                            height={40}
                            alt={gear?.name || 'Gear'}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-foreground text-xs block truncate max-w-xs">
                              {gear?.name || 'Equipment'}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Qty: {firstItem?.quantity || 1}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs">
                          <span className="font-medium text-foreground block">
                            {formatDate(order.startDate)}
                          </span>
                          <span className="text-muted-foreground">
                            to {formatDate(order.endDate)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-foreground text-sm">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 text-xs font-semibold rounded-xl border-border cursor-pointer"
                        >
                          <span>Manage</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
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
            totalItems={filteredOrders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No matching rental orders</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            When customers book your listed gear, their order details and handoff steps will appear
            here.
          </p>
        </div>
      )}

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
