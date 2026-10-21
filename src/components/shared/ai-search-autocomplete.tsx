'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Sparkles, Tag, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

interface AISearchAutocompleteProps {
  onSearch?: (query: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const AI_SUGGESTIONS = [
  { text: 'Ultralight waterproof tent for rain', category: 'Camping & Hiking' },
  { text: 'Red Paddle touring inflatable SUP', category: 'Water Sports' },
  { text: '4K aerial stabilized cinematography drone', category: 'Photography & Drone Gear' },
  { text: 'Downhill enduro full-suspension bike', category: 'Cycling & Mountain Biking' },
  { text: 'Alpine harness & dynamic climbing ropes', category: 'Climbing & Mountaineering' },
  { text: 'Thermal snow goggles & avalanche beacon', category: 'Winter Sports' },
  { text: 'Osprey 65L backpacking expedition pack', category: 'Camping & Hiking' },
];

export function AISearchAutocomplete({
  onSearch,
  defaultValue = '',
  placeholder = 'Search by activity, item (e.g. "waterproof tent", "4K drone", "kayak")...',
  className = '',
}: AISearchAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(AI_SUGGESTIONS);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions(AI_SUGGESTIONS.slice(0, 4));
    } else {
      const lower = query.toLowerCase();
      const matched = AI_SUGGESTIONS.filter(
        (s) => s.text.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower),
      );
      setFilteredSuggestions(
        matched.length > 0
          ? matched
          : [{ text: `Search catalog for "${query}"`, category: 'Smart Query' }],
      );
    }
  }, [query]);

  // Click outside to close
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
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/gear?search=${encodeURIComponent(searchQuery)}`);
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
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in-0 duration-150">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-border text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Search Suggestions
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">
              Press Enter to Search
            </span>
          </div>

          <div className="pt-2 space-y-1">
            {filteredSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.text);
                  executeSearch(item.text);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-left transition text-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-emerald-500 transition line-clamp-1">
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium shrink-0 ml-2">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AISearchAutocomplete;
