'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Badge } from '@/components/ui/badge';
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
import { useAdminGear } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import type { GearItem } from '@/types';
import { ExternalLink, Layers, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function AdminGearPage() {
  const { data: gears, isLoading } = useAdminGear();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = (gears || []).filter((g: GearItem) => {
    const q = search.toLowerCase();
    const matchesSearch =
      g.name.toLowerCase().includes(q) ||
      g.brand?.toLowerCase().includes(q) ||
      g.category?.name?.toLowerCase().includes(q) ||
      g.provider?.name?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'active' ? g.isActive : !g.isActive;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedGear = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Global Gear Catalog Oversight"
        subheading="Inspect all equipment listings, daily rates, stock levels, and provider shops platform-wide."
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter equipment, brand, or shop..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-sm rounded-xl border-border bg-card"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'active', 'paused'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All Inventory' : s}
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
                  <TableHead>Equipment</TableHead>
                  <TableHead>Provider Shop</TableHead>
                  <TableHead>Category / Brand</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Available / Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGear.map((gear: GearItem) => (
                  <TableRow key={gear.id} className="border-border hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            gear.images?.[0] ||
                            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                          }
                          width={40}
                          height={40}
                          alt={gear.name}
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-xs block truncate max-w-xs">
                            {gear.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {gear.condition || 'GOOD'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-emerald-500">
                        {gear.provider?.providerProfile?.shopName ||
                          gear.provider?.name ||
                          'Provider'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="text-foreground">
                          {gear.category?.name || 'Equipment'}
                        </span>
                        <span className="text-muted-foreground block">
                          {gear.brand || 'Pro Gear'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-foreground text-sm">
                        {formatCurrency(gear.pricePerDay)}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs font-semibold">
                      <span className="text-emerald-500">{gear.quantityAvailable}</span> /{' '}
                      {gear.quantityTotal}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] rounded-lg font-semibold ${
                          gear.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {gear.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Link
                        href={`/gear/${gear.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-emerald-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
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
          <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">No equipment listings found</h4>
        </div>
      )}
    </div>
  );
}
