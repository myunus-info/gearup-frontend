'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useDeleteGear, useProviderGear, useUpdateGear } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import type { GearItem } from '@/types';
import { Check, Edit2, Package, PlusCircle, Search, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function ProviderGearPage() {
  const { data: gears, isLoading } = useProviderGear();
  const updateGearMutation = useUpdateGear();
  const deleteGearMutation = useDeleteGear();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [gearToDelete, setGearToDelete] = useState<{ id: string; name: string } | null>(null);
  const pageSize = 6;

  const handleToggleActive = async (gear: GearItem) => {
    await updateGearMutation.mutateAsync({
      id: gear.id,
      payload: { isActive: !gear.isActive },
    });
  };

  const handleConfirmDelete = async () => {
    if (!gearToDelete) return;
    try {
      await deleteGearMutation.mutateAsync(gearToDelete.id);
      setGearToDelete(null);
    } catch {
      // Handled in mutation
    }
  };

  const filteredGears = (gears || []).filter((gear: GearItem) => {
    const q = search.toLowerCase();
    const matchesSearch =
      gear.name.toLowerCase().includes(q) ||
      gear.brand?.toLowerCase().includes(q) ||
      gear.category?.name?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'active' ? gear.isActive : !gear.isActive;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredGears.length / pageSize) || 1;
  const paginatedGears = filteredGears.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Gear Inventory Management"
        subheading="Add, edit, toggle availability, and manage your rental equipment stock."
        action={
          <Link href="/dashboard/provider/gear/new">
            <Button className="gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              <span>Add Equipment</span>
            </Button>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment, brand, category..."
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
              {s === 'all' ? 'All Stock' : s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : filteredGears.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
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
                {paginatedGears.map((gear: GearItem) => (
                  <TableRow key={gear.id} className="border-border hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            gear.images?.[0] ||
                            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                          }
                          width={44}
                          height={44}
                          alt={gear.name}
                          className="h-11 w-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/gear/${gear.id}`}
                            className="font-semibold text-foreground hover:text-emerald-500 block text-xs truncate max-w-xs cursor-pointer"
                          >
                            {gear.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            ID: #{gear.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-semibold text-foreground block">
                          {gear.category?.name || 'Equipment'}
                        </span>
                        <span className="text-muted-foreground">{gear.brand || 'Pro Gear'}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[11px] border-border bg-muted/60 text-foreground font-semibold"
                      >
                        {gear.condition || 'GOOD'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs font-semibold">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {gear.quantityAvailable}
                      </span>{' '}
                      / {gear.quantityTotal}
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-foreground text-sm">
                        {formatCurrency(gear.pricePerDay)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleToggleActive(gear)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition ${
                          gear.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25'
                            : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                        }`}
                        title="Click to toggle listing status"
                      >
                        {gear.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>{gear.isActive ? 'Active' : 'Paused'}</span>
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/dashboard/provider/gear/${gear.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-xl cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setGearToDelete({ id: gear.id, name: gear.name })}
                          className="h-8 w-8 p-0 rounded-xl hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGears.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-card">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No equipment in inventory</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            List your outdoor equipment to start receiving rental requests from verified customers.
          </p>
          <Link href="/dashboard/provider/gear/new" className="inline-block mt-4">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Add Your First Item
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!gearToDelete}
        onOpenChange={(open) => {
          if (!open) setGearToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-destructive mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Remove Equipment Listing?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-foreground font-semibold">
              &quot;{gearToDelete?.name}&quot;
            </strong>{' '}
            from your catalog? Past rental records will remain archived.
          </p>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={deleteGearMutation.isPending}
              onClick={() => setGearToDelete(null)}
              className="rounded-xl border-border text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteGearMutation.isPending}
              onClick={handleConfirmDelete}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer"
            >
              {deleteGearMutation.isPending ? 'Removing...' : 'Delete Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
