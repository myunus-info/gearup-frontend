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
import { useMyPayments } from '@/hooks/use-orders';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/authProvider';
import type { Payment } from '@/types/types';
import { CreditCard, Receipt, Search } from 'lucide-react';
import React, { useState } from 'react';

export default function CustomerPaymentsPage() {
  const { user } = useAuth();
  const { data: payments, isLoading } = useMyPayments();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredPayments = (payments || []).filter((p: Payment) => {
    const q = search.toLowerCase();
    const txn = (p.transactionId || '').toLowerCase();
    const orderId = (p.rentalOrderId || '').toLowerCase();
    const matchesSearch = txn.includes(q) || orderId.includes(q);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Payment Transactions"
        subheading="Receipts, invoices, and payment gateway confirmations for gear reservations."
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction # or order #..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-sm rounded-xl border-border bg-card"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'PAID', 'PENDING', 'FAILED'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase transition cursor-pointer ${
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
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Transaction Ref</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Gateway / Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((p: Payment) => (
                  <TableRow key={p.id} className="border-border hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {p.transactionId || `TXN-PENDING-${p.id.slice(-6)}`}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        #{p.rentalOrderId ? p.rentalOrderId.slice(-8) : '—'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-semibold block text-foreground">
                          {p.provider || 'SSLCommerz'}
                        </span>
                        <span className="text-muted-foreground">{p.method || 'Card Payment'}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(p.paidAt || p.createdAt)}
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-foreground text-sm">
                        {formatCurrency(p.amount)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <StatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPayments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No Payment Records Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            When you confirm and pay for rental orders, your transaction receipts and invoices will
            be listed here.
          </p>
        </div>
      )}
    </div>
  );
}
