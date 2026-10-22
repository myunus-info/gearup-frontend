'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
}: PaginationControlsProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize || 10))) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : undefined;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border ${className}`}
    >
      {/* Information text */}
      <div className="text-xs text-muted-foreground">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <span>
            Showing <strong className="font-semibold text-foreground">{startItem}</strong> to{' '}
            <strong className="font-semibold text-foreground">{endItem}</strong> of{' '}
            <strong className="font-semibold text-foreground">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-foreground">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-foreground">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 px-2.5 rounded-lg border-border text-xs font-medium cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          <span>Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = currentPage === pageNum;

            return (
              <Button
                key={`page-${pageNum}`}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 px-2.5 rounded-lg border-border text-xs font-medium cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
