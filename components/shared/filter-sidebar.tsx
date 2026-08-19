'use client';

import React from 'react';
// import { Category, GearCondition } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw, Filter, Sparkles } from 'lucide-react';
import { Category } from '@/types/types';

interface FilterSidebarProps {
  categories: Category[] | undefined;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
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
    { label: 'All Conditions', value: 'all' },
    { label: 'Brand New', value: 'NEW' },
    { label: 'Good Condition', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
    { label: 'Worn', value: 'WORN' },
  ];

  const activeFilterCount =
    (selectedCategory && selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand && selectedBrand !== 'all' && selectedBrand !== 'All Brands' ? 1 : 0) +
    (selectedCondition && selectedCondition !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <aside className="w-full space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-xs text-slate-500 hover:text-red-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Search Equipment
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tent, kayak, bike, GoPro..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</Label>
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              selectedCategory === 'all' || !selectedCategory
                ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</Label>
        <Select
          value={selectedBrand || 'All Brands'}
          onValueChange={val => onSelectBrand(val === 'All Brands' ? '' : val)}
        >
          <SelectTrigger className="w-full text-sm font-medium">
            <SelectValue placeholder="Filter by Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map(b => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Gear Condition
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {conditions.map(c => (
            <button
              key={c.value}
              onClick={() => onSelectCondition(c.value)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                selectedCondition === c.value
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2 pt-2 border-t">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full text-sm font-medium">
            <SelectValue placeholder="Sort gear" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Featured & Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name (A - Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
