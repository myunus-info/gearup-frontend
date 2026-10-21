'use client';

import { useMyPayments } from '@/hooks/use-orders';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, Receipt } from 'lucide-react';
import { useGetMe } from '@/hooks/use-auth';
import { Payment } from '@/types/types';

export default function CustomerPaymentsPage() {
  const { data: payments, isLoading } = useMyPayments();
  const { data: user } = useGetMe();

  return (
    <div className="space-y-6">
      <DashboardHeader
        user={user}
        heading="Payment Transactions"
        subheading="Receipts and transaction records for gear rental reservations."
      />

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-3 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : payments && payments.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Gateway / Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p: Payment) => (
                <TableRow key={p.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {p.transactionId || `TXN-PENDING-${p.id.slice(-4)}`}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-slate-500">#{p.rentalOrderId.slice(-8)}</span>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs">
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">
                        {p.provider}
                      </span>
                      <span className="text-slate-400">{p.method || 'Card Payment'}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                    {formatDate(p.paidAt || p.createdAt)}
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
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
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center bg-white dark:bg-slate-900">
          <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Payment Records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            When you confirm and pay for rental orders, your transaction receipts and invoices will be listed
            here.
          </p>
        </div>
      )}
    </div>
  );
}
