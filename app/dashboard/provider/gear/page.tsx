'use client';

import Link from 'next/link';
import { useProviderGear, useUpdateGear, useDeleteGear } from '@/hooks/use-provider';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Package, PlusCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import { GearItem } from '@/types/types';
import Image from 'next/image';

export default function ProviderGearPage() {
  const { data: gears, isLoading } = useProviderGear();
  const updateGearMutation = useUpdateGear();
  const deleteGearMutation = useDeleteGear();

  const handleToggleActive = async (gear: GearItem) => {
    await updateGearMutation.mutateAsync({
      id: gear.id,
      payload: { isActive: !gear.isActive },
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your catalog?`)) {
      await deleteGearMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Gear Inventory Management"
        subheading="Add, edit, toggle availability, and manage your rental equipment stock."
        action={
          <Link href="/dashboard/provider/gear/new">
            <Button className="gap-2 font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>Add Equipment</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6 space-y-4 dark:bg-slate-900">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : gears && gears.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gear Item</TableHead>
                <TableHead>Category / Brand</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Stock (Avail / Total)</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Listing Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gears.map((gear: GearItem) => (
                <TableRow key={gear.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          gear.images?.[0] ||
                          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                        }
                        width={48}
                        height={48}
                        alt={gear.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/gear/${gear.id}`}
                          className="font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-600 block text-sm truncate max-w-xs"
                        >
                          {gear.name}
                        </Link>
                        <span className="text-xs text-slate-400 font-mono">ID: #{gear.id.slice(-6)}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                        {gear.category?.name || 'Equipment'}
                      </span>
                      <span className="text-slate-400">{gear.brand || 'Pro Gear'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {gear.condition || 'GOOD'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-semibold">
                      <span
                        className={
                          gear.quantityAvailable > 0 ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'
                        }
                      >
                        {gear.quantityAvailable}
                      </span>{' '}
                      <span className="text-slate-400">/ {gear.quantityTotal}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(gear.pricePerDay)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(gear)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                        gear.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {gear.isActive ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Active (Public)</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/dashboard/provider/gear/${gear.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-600 hover:text-slate-900"
                          title="Edit Gear"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(gear.id, gear.name)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete Gear"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center bg-white dark:bg-slate-900">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Gear Catalog is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Start listing your outdoor gear, tents, kayaks, bikes, and cameras to receive rental requests.
          </p>
          <Link href="/dashboard/provider/gear/new" className="mt-4 inline-block">
            <Button size="sm">Add First Gear Item</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
