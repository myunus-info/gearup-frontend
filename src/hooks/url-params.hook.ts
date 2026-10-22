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
        current.set('page', '1');
      }

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.replace(`${pathname}${query}`, { scroll });
    },
    [pathname, router, searchParams],
  );

  return { getParam, setParams, searchParams };
}

export { useUrlParams };
