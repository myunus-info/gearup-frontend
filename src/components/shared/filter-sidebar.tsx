'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/types';
import { DollarSign, Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface FilterSidebarProps {
  categories: Category[] | undefined;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  minPrice?: string;
  maxPrice?: string;
  onPriceChange?: (min: string, max: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  selectedCondition,
  onSelectCondition,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onReset,
}: FilterSidebarProps) {
  const brands = [
    'All Brands',
    'MSR',
    'Red Paddle Co',
    'Santa Cruz',
    'Burton',
    'Petzl',
    'DJI',
    'Osprey',
    'Oru Kayak',
  ];

  const conditions: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'NEW' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
    { label: 'Worn', value: 'WORN' },
  ];

  const activeFilterCount =
    (selectedCategory && selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand && selectedBrand !== 'all' && selectedBrand !== 'All Brands' ? 1 : 0) +
    (selectedCondition && selectedCondition !== 'all' ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <aside className="w-full space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Filter className="h-4 w-4 text-emerald-500" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Search Equipment
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tent, kayak, bike, drone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs rounded-xl border-input bg-background h-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Category
        </Label>
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${
              selectedCategory === 'all' || !selectedCategory
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Price Range ($/day)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onPriceChange?.(e.target.value, maxPrice)}
              className="pl-6 h-9 text-xs rounded-xl border-input bg-background"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onPriceChange?.(minPrice, e.target.value)}
              className="pl-6 h-9 text-xs rounded-xl border-input bg-background"
            />
          </div>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Brand
        </Label>
        <Select
          value={selectedBrand || 'All Brands'}
          onValueChange={(val) => onSelectBrand(val === 'All Brands' ? '' : val)}
        >
          <SelectTrigger className="w-full text-xs font-medium rounded-xl border-input bg-background h-10">
            <SelectValue placeholder="Filter by Brand" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card border-border">
            {brands.map((b) => (
              <SelectItem key={b} value={b} className="text-xs rounded-lg cursor-pointer">
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Gear Condition
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {conditions.map((c) => (
            <button
              key={c.value}
              onClick={() => onSelectCondition(c.value)}
              className={`rounded-xl border p-2 text-[11px] font-semibold transition cursor-pointer text-center ${
                selectedCondition === c.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2 pt-2 border-t border-border">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sort By
        </Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full text-xs font-medium rounded-xl border-input bg-background h-10">
            <SelectValue placeholder="Sort gear" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card border-border">
            <SelectItem value="newest" className="text-xs rounded-lg cursor-pointer">
              Featured & Newest
            </SelectItem>
            <SelectItem value="price_asc" className="text-xs rounded-lg cursor-pointer">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price_desc" className="text-xs rounded-lg cursor-pointer">
              Price: High to Low
            </SelectItem>
            <SelectItem value="name" className="text-xs rounded-lg cursor-pointer">
              Name (A - Z)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}

export default FilterSidebar;
