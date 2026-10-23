'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ReviewDialog } from '@/components/dashboard/review-dialog';
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
import { usePaymentDraft } from '@/contexts/payment-draft-context';
import { useAuth, useMyOrders } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { RentalOrder, RentalOrderItem } from '@/types';
import { CreditCard, ExternalLink, Plus, Search, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { setPaymentDraft } = usePaymentDraft();
  const { user } = useAuth();
  const { data: orders, isLoading } = useMyOrders();
  const [reviewOrder, setReviewOrder] = useState<RentalOrder | null>(null);
  const [reviewItem, setReviewItem] = useState<RentalOrderItem | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = (orders || []).filter((order: RentalOrder) => {
    const q = search.toLowerCase();
    const gearName = order.items?.[0]?.gearItem?.name?.toLowerCase() || '';
    const orderId = order.id.toLowerCase();
    const matchesSearch = gearName.includes(q) || orderId.includes(q);
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
        heading="My Rental Orders"
        subheading="Track reservation status, verify rental dates, complete pending payments, and review gear."
        action={
          <Link href="/gear">
            <Button className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Rent New Equipment</span>
            </Button>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders or equipment..."
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
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase transition cursor-pointer shrink-0 ${
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
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Order / Gear</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
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
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              gear?.images?.[0] ||
                              'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                            }
                            alt={gear?.name || 'Gear'}
                            width={44}
                            height={44}
                            className="h-11 w-11 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs truncate max-w-xs">
                              {gear?.name || 'Rental Equipment'}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              #{order.id.slice(-8)}
                            </p>
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
                        <div className="space-y-1">
                          <StatusBadge status={order.status} />
                          {order.payments?.[0]?.provider && (
                            <span className="block text-[10px] text-muted-foreground font-semibold">
                              via{' '}
                              <span className="text-foreground">
                                {order.payments[0].provider === 'STRIPE' ? 'Stripe' : 'SSLCommerz'}
                              </span>
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'PLACED' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                if (gear?.id) {
                                  const start = order.startDate
                                    ? new Date(order.startDate).toISOString().split('T')[0]
                                    : '';
                                  const end = order.endDate
                                    ? new Date(order.endDate).toISOString().split('T')[0]
                                    : '';
                                  const qty = firstItem?.quantity || 1;

                                  setPaymentDraft({
                                    gearId: gear.id,
                                    startDate: start,
                                    endDate: end,
                                    quantity: qty,
                                  });

                                  const query = new URLSearchParams({
                                    startDate: start,
                                    endDate: end,
                                    quantity: String(qty),
                                  }).toString();

                                  router.push(`/dashboard/customer/orders/${gear.id}/pay?${query}`);
                                }
                              }}
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1 cursor-pointer"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
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
                              className="h-8 text-xs gap-1 border-border rounded-xl cursor-pointer"
                            >
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              <span>Review</span>
                            </Button>
                          )}

                          {gear?.id && (
                            <Link href={`/gear/${gear.id}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          )}
                        </div>
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
            Browse our catalog to reserve high-grade outdoor and adventure gear.
          </p>
          <Link href="/gear" className="inline-block mt-4">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Explore Equipment
            </Button>
          </Link>
        </div>
      )}

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
