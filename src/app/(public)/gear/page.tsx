'use client';

import { FilterSidebar } from '@/components/shared/filter-sidebar';
import { GearCard, GearCardSkeleton } from '@/components/shared/gear-card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCategories, useDebounce, useGears, useUrlParams } from '@/hooks';
import type { GearCondition } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';

function GearCatalogContent() {
  const { getParam, setParams } = useUrlParams();

  const initialCategory = getParam('category') || getParam('categoryId', 'all');
  const initialSearch = getParam('search', '');
  const initialBrand = getParam('brand', '');
  const initialCondition = getParam('condition', 'all');
  const initialMinPrice = getParam('minPrice', '');
  const initialMaxPrice = getParam('maxPrice', '');
  const initialSort = (getParam('sortBy', 'newest') as SortOption) || 'newest';
  const initialPage = Number(getParam('page', '1')) || 1;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState(initialCondition);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: categories } = useCategories();

  // Keep state in sync if URL query parameter changes externally
  const urlCategory = getParam('category') || getParam('categoryId');
  useEffect(() => {
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory, selectedCategory]);

  // Resolve category name (backend matches category.name, not UUID)
  const resolvedCategory = (() => {
    if (!selectedCategory || selectedCategory === 'all' || selectedCategory === 'ALL')
      return undefined;
    const match = (categories as any[])?.find(
      (c: any) =>
        c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase(),
    );
    return match ? match.name : selectedCategory;
  })();

  const {
    data: gears,
    isLoading,
    isError,
  } = useGears({
    category: resolvedCategory,
    brand: selectedBrand && selectedBrand !== 'All Brands' ? selectedBrand : undefined,
    condition: selectedCondition === 'all' ? undefined : (selectedCondition as GearCondition),
    search: debouncedSearch || undefined,
    page,
    limit: 12,
  });

  // Sync state to URL search parameters using standard useUrlParams hook
  useEffect(() => {
    setParams(
      {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        categoryId: undefined,
        brand: selectedBrand || undefined,
        condition: selectedCondition !== 'all' ? selectedCondition : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        search: debouncedSearch || undefined,
        sortBy: sortBy !== 'newest' ? sortBy : undefined,
        page: page > 1 ? page : undefined,
      },
      { scroll: false },
    );
  }, [
    selectedCategory,
    selectedBrand,
    selectedCondition,
    minPrice,
    maxPrice,
    debouncedSearch,
    sortBy,
    page,
    setParams,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSortBy('newest');
    setPage(1);
  };

  // Client-side brand filter, price range filter, and sort fallback
  let displayGears = gears ? [...gears] : [];
  if (selectedBrand && selectedBrand !== 'All Brands') {
    displayGears = displayGears.filter(
      (g) => g.brand?.toLowerCase() === selectedBrand.toLowerCase(),
    );
  }
  if (minPrice) {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) {
      displayGears = displayGears.filter((g) => Number(g.pricePerDay) >= min);
    }
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) {
      displayGears = displayGears.filter((g) => Number(g.pricePerDay) <= max);
    }
  }
  if (sortBy === 'price_asc') {
    displayGears.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));
  } else if (sortBy === 'price_desc') {
    displayGears.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay));
  } else if (sortBy === 'name') {
    displayGears.sort((a, b) => a.name.localeCompare(b.name));
  }

  const activeCategoryName =
    (categories as any[])?.find(
      (c: any) =>
        c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase(),
    )?.name ||
    (selectedCategory !== 'all' && selectedCategory !== 'ALL'
      ? selectedCategory
      : 'All Categories');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Adventure Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Explore Outdoor Equipment
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {displayGears.length} verified listings available for on-demand reservation.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-border text-xs font-bold"
              >
                <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[320px] p-6 overflow-y-auto bg-card border-border"
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left text-foreground">Filter Equipment</SheetTitle>
              </SheetHeader>
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => {
                  setSelectedCategory(id);
                  setPage(1);
                  setMobileFilterOpen(false);
                }}
                selectedBrand={selectedBrand}
                onSelectBrand={(b) => {
                  setSelectedBrand(b);
                  setPage(1);
                }}
                selectedCondition={selectedCondition}
                onSelectCondition={(c) => {
                  setSelectedCondition(c);
                  setPage(1);
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                  setPage(1);
                }}
                searchTerm={searchTerm}
                onSearchChange={(s) => {
                  setSearchTerm(s);
                  setPage(1);
                }}
                sortBy={sortBy}
                onSortChange={(s) => setSortBy(s as SortOption)}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => {
                setSelectedCategory(id);
                setPage(1);
              }}
              selectedBrand={selectedBrand}
              onSelectBrand={(b) => {
                setSelectedBrand(b);
                setPage(1);
              }}
              selectedCondition={selectedCondition}
              onSelectCondition={(c) => {
                setSelectedCondition(c);
                setPage(1);
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
                setPage(1);
              }}
              searchTerm={searchTerm}
              onSearchChange={(s) => {
                setSearchTerm(s);
                setPage(1);
              }}
              sortBy={sortBy}
              onSortChange={(s) => setSortBy(s as SortOption)}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Catalog Items Grid (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active filter pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-semibold">Active:</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              {activeCategoryName}
            </span>
            {selectedCondition !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground font-medium border border-border">
                Condition: {selectedCondition}
              </span>
            )}
            {selectedBrand && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground font-medium border border-border">
                Brand: {selectedBrand}
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground font-medium border border-border">
                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              </span>
            )}
            {searchTerm && (
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground font-medium border border-border">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {(selectedCategory !== 'all' ||
              selectedBrand ||
              selectedCondition !== 'all' ||
              minPrice ||
              maxPrice ||
              searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-destructive underline ml-2 cursor-pointer font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Cards Grid: 3 cols when sidebar is present on desktop, 1 col mobile, 2 col tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <GearCardSkeleton key={i} />)
            ) : displayGears.length > 0 ? (
              displayGears.map((gear) => <GearCard key={gear.id} gear={gear} />)
            ) : (
              <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-border bg-card p-12 space-y-4">
                <PackageSearch className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-bold text-foreground">No equipment matching filters</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try clearing one of your filters or broadening your search terms to discover more
                  items.
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="rounded-xl border-border text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {displayGears.length > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
              <span>Showing Page {page} of Catalog</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-xl border-border text-xs cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <span className="font-bold text-foreground px-2">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={displayGears.length < 12}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-xl border-border text-xs cursor-pointer disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <GearCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <GearCatalogContent />
    </Suspense>
  );
}
