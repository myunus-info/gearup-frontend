'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGears, useCategories } from '@/hooks/use-gear';
import { useDebounce } from '@/hooks/use-debounce';
import { GearCard } from '@/components/shared/gear-card';
import { FilterSidebar } from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, SlidersHorizontal, PackageSearch, Sparkles } from 'lucide-react';

function GearCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialCondition = searchParams.get('condition') || 'all';
  const initialSort = searchParams.get('sortBy') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState(initialCondition);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: categories } = useCategories();
  const {
    data: gears,
    isLoading,
    isError,
  } = useGears({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    brand: selectedBrand || undefined,
    condition: selectedCondition === 'all' ? undefined : selectedCondition,
    search: debouncedSearch || undefined,
    sortBy: sortBy as any,
  });

  // Sync state with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedCondition && selectedCondition !== 'all') params.append('condition', selectedCondition);
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (sortBy && sortBy !== 'newest') params.append('sortBy', sortBy);

    const query = params.toString();
    router.replace(`/gear${query ? `?${query}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedBrand, selectedCondition, debouncedSearch, sortBy, router]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('');
    setSelectedCondition('all');
    setSearchTerm('');
    setSortBy('newest');
  };

  const getCategoryName = () => {
    if (!selectedCategory || selectedCategory === 'all') return 'All Categories';
    const found = categories?.find(c => c.id === selectedCategory);
    return found ? found.name : 'Selected Category';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Equipment Catalog
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Browse Sports & Outdoor Gear
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {gears?.length ?? 0} available rental items in{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{getCategoryName()}</span>
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                <span>Filters & Sort</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[380px] p-0 overflow-y-auto">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Filter Equipment</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={id => {
                    setSelectedCategory(id);
                    setMobileFilterOpen(false);
                  }}
                  selectedBrand={selectedBrand}
                  onSelectBrand={b => {
                    setSelectedBrand(b);
                    setMobileFilterOpen(false);
                  }}
                  selectedCondition={selectedCondition}
                  onSelectCondition={c => {
                    setSelectedCondition(c);
                    setMobileFilterOpen(false);
                  }}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onReset={handleResetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              selectedCondition={selectedCondition}
              onSelectCondition={setSelectedCondition}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Gear Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4 space-y-3 dark:bg-slate-900">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-300 p-12 text-center bg-red-50/50">
              <p className="font-semibold text-red-700">Failed to load equipment catalog.</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : gears && gears.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gears.map(gear => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-16 text-center dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 mb-4">
                <PackageSearch className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No matching gear found</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-md">
                Try adjusting your search keywords, clearing specific condition filters, or browsing other
                activities.
              </p>
              <Button variant="default" size="sm" onClick={handleResetFilters} className="mt-6 gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Reset All Filters</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <GearCatalogContent />
    </Suspense>
  );
}
