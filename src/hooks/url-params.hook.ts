'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string, defaultValue = '') => {
      return searchParams?.get(key) ?? defaultValue;
    },
    [searchParams],
  );

  const setParams = useCallback(
    (
      newParams: Record<string, string | number | undefined | null>,
      options: { resetPage?: boolean; scroll?: boolean } = {},
    ) => {
      const { resetPage = false, scroll = false } = options;
      const current = new URLSearchParams(searchParams?.toString() ?? '');

      if (resetPage && current.has('page') && !('page' in newParams)) {
        current.delete('page');
      }

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      // Normalize both search parameters for an accurate structural comparison
      const existing = new URLSearchParams(searchParams?.toString() ?? '');
      existing.sort();
      current.sort();

      if (current.toString() === existing.toString()) {
        return;
      }

      const query = current.toString() ? `?${current.toString()}` : '';
      router.replace(`${pathname}${query}`, { scroll });
    },
    [pathname, router, searchParams],
  );

  return { getParam, setParams, searchParams };
}

export { useUrlParams };
