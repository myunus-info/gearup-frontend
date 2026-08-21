'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminGear } from '@/hooks/use-admin';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Search, Layers, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { GearItem } from '@/types/types';

export default function AdminGearPage() {
  const { data: gears, isLoading } = useAdminGear();
  const [search, setSearch] = useState('');

  const filtered = gears?.filter(
    (g: GearItem) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.brand?.toLowerCase().includes(search.toLowerCase()) ||
      g.category?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Global Gear Catalog Oversight"
        subheading="Inspect all equipment listings, daily rates, and provider shops platform-wide."
      />

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Filter equipment or shop..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-3 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
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
              {filtered.map((gear: GearItem) => (
                <TableRow key={gear.id} className="hover:bg-slate-50/60">
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
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs block truncate max-w-xs">
                          {gear.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{gear.condition || 'GOOD'}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {gear.provider?.providerProfile?.shopName || gear.provider?.name || 'Provider'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs">
                      <span>{gear.category?.name || 'Equipment'}</span>
                      <span className="text-slate-400 block">{gear.brand || 'Pro Gear'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(gear.pricePerDay)}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-semibold">
                    <span className="text-emerald-600">{gear.quantityAvailable}</span> / {gear.quantityTotal}
                  </TableCell>

                  <TableCell>
                    <Badge variant={gear.isActive ? 'secondary' : 'destructive'} className="text-[11px]">
                      {gear.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      href={`/gear/${gear.id}`}
                      target="_blank"
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
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
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center bg-white dark:bg-slate-900">
          <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200">No equipment listings found</h4>
        </div>
      )}
    </div>
  );
}
