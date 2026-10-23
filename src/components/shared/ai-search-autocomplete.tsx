'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGears } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Compass, Flame, Package, Search, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface AISearchAutocompleteProps {
  onSearch?: (query: string) => void;
  onSelect?: (gearId: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  { term: 'Tent', label: 'Alpine Backpacking Tents', category: 'Camping & Hiking' },
  { term: 'Kayak', label: 'Touring Kayaks & Water Equipment', category: 'Water Sports' },
  { term: 'Drone', label: '4K Aerial Action Drones', category: 'Photography & Drone Gear' },
  { term: 'Backpack', label: 'Expedition Trekking Packs', category: 'Camping & Hiking' },
  {
    term: 'Mountain Bike',
    label: 'Full Suspension Mountain Bikes',
    category: 'Cycling & Mountain Biking',
  },
  {
    term: 'Harness',
    label: 'Climbing Ropes & Harness Kits',
    category: 'Climbing & Mountaineering',
  },
  { term: 'Snowboard', label: 'All-Mountain Snowboards', category: 'Winter Sports' },
  { term: 'Paddleboard', label: 'Inflatable SUP Touring Boards', category: 'Water Sports' },
];

export function AISearchAutocomplete({
  onSearch,
  onSelect,
  defaultValue = '',
  placeholder = 'Search by item or activity (e.g. "tent", "kayak", "drone", "backpack")...',
  className = '',
}: AISearchAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch real in-stock catalog equipment for live matching
  const { data: catalogGears } = useGears({ limit: 30 });

  const inStockGears =
    catalogGears?.filter(
      (g) => (g.quantityAvailable === undefined || g.quantityAvailable > 0) && g.isActive !== false,
    ) || [];

  // Filter matching gear items when query is typed
  const trimmed = query.trim().toLowerCase();
  const matchingGears = trimmed
    ? inStockGears
        .filter(
          (g) =>
            g.name.toLowerCase().includes(trimmed) ||
            g.category?.name?.toLowerCase().includes(trimmed) ||
            g.brand?.toLowerCase().includes(trimmed),
        )
        .slice(0, 4)
    : [];

  // Filter matching suggestion chips
  const matchingSuggestions = trimmed
    ? POPULAR_SEARCH_SUGGESTIONS.filter(
        (s) =>
          s.term.toLowerCase().includes(trimmed) ||
          s.label.toLowerCase().includes(trimmed) ||
          s.category.toLowerCase().includes(trimmed),
      )
    : POPULAR_SEARCH_SUGGESTIONS.slice(0, 6);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (searchQuery: string) => {
    setIsOpen(false);
    const target = searchQuery.trim() || query.trim();
    if (!target) return;

    if (onSearch) {
      onSearch(target);
    } else {
      router.push(`/gear?search=${encodeURIComponent(target)}`);
    }
  };

  const handleSelectGear = (gearId: string) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(gearId);
    } else {
      router.push(`/gear/${gearId}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              executeSearch(query);
            }
          }}
          placeholder={placeholder}
          className="pl-12 pr-28 h-14 rounded-2xl border-border bg-background/95 text-foreground placeholder:text-muted-foreground text-sm shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <Button
            type="button"
            onClick={() => executeSearch(query)}
            size="sm"
            className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 text-xs cursor-pointer shadow-sm"
          >
            <span>Search</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in-0 duration-150 space-y-3">
          {/* Section 1: Live Equipment Matches (When typing) */}
          {matchingGears.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Direct Equipment Matches
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Click to View</span>
              </div>

              <div className="space-y-1">
                {matchingGears.map((gear) => {
                  const imageSrc =
                    gear.images && gear.images.length > 0
                      ? gear.images[0]
                      : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';

                  return (
                    <button
                      key={gear.id}
                      type="button"
                      onClick={() => handleSelectGear(gear.id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted text-left transition group cursor-pointer border border-transparent hover:border-border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          <Image
                            src={imageSrc}
                            alt={gear.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-xs group-hover:text-emerald-500 transition line-clamp-1">
                            {gear.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">
                            {gear.category?.name || 'Outdoor Gear'} •{' '}
                            {gear.brand || 'Verified Equipment'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(gear.pricePerDay)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">/day</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Popular / Matching Keywords */}
          <div>
            <div className="flex items-center justify-between px-2 pb-1.5 border-b border-border/60 text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                {trimmed ? <Compass className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
                {trimmed ? 'Related Catalog Searches' : 'Popular Equipment Searches'}
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                Press Enter to Search
              </span>
            </div>

            <div className="pt-2 space-y-1">
              {matchingSuggestions.map((item, idx) => (
                <button
                  key={`${item.term}-${idx}`}
                  type="button"
                  onClick={() => {
                    setQuery(item.term);
                    executeSearch(item.term);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-left transition text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-emerald-500 transition line-clamp-1">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium shrink-0 ml-2">
                    {item.category}
                  </span>
                </button>
              ))}

              {trimmed && (
                <button
                  type="button"
                  onClick={() => executeSearch(trimmed)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold transition text-xs cursor-pointer border border-emerald-500/20"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5" />
                    Search full catalog for &quot;{query}&quot;
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AISearchAutocomplete;
