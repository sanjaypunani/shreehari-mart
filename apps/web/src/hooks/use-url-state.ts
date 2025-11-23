/**
 * Custom Hook: useUrlState
 *
 * Manages state via URL search params for pagination, search, and filters.
 * Provides shareable URLs and better UX.
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Get a single param value
   */
  const getParam = useCallback(
    (key: string, defaultValue?: string): string => {
      return searchParams.get(key) || defaultValue || '';
    },
    [searchParams]
  );

  /**
   * Get a number param
   */
  const getNumberParam = useCallback(
    (key: string, defaultValue: number): number => {
      const value = searchParams.get(key);
      return value ? Number(value) : defaultValue;
    },
    [searchParams]
  );

  /**
   * Get a boolean param
   */
  const getBooleanParam = useCallback(
    (key: string, defaultValue?: boolean): boolean | undefined => {
      const value = searchParams.get(key);
      if (value === null) return defaultValue;
      return value === 'true';
    },
    [searchParams]
  );

  /**
   * Set a single param
   */
  const setParam = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  /**
   * Set multiple params at once
   */
  const setParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  /**
   * Clear all params
   */
  const clearParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  /**
   * Common pattern: Pagination state
   */
  const usePagination = useCallback(() => {
    const page = getNumberParam('page', 1);
    const limit = getNumberParam('limit', 20);

    const setPage = (newPage: number) => setParam('page', newPage);
    const setLimit = (newLimit: number) => {
      setParams({ limit: newLimit, page: 1 }); // Reset to page 1 when changing limit
    };

    return { page, limit, setPage, setLimit };
  }, [getNumberParam, setParam, setParams]);

  /**
   * Common pattern: Search state
   */
  const useSearch = useCallback(() => {
    const search = getParam('search', '');

    const setSearch = (value: string) => {
      setParams({ search: value, page: 1 }); // Reset to page 1 when searching
    };

    return { search, setSearch };
  }, [getParam, setParams]);

  return {
    // Raw param access
    getParam,
    getNumberParam,
    getBooleanParam,
    setParam,
    setParams,
    clearParams,

    // Helper patterns
    usePagination,
    useSearch,

    // Direct searchParams access
    searchParams,
  };
}

/**
 * Example Usage:
 *
 * function ProductsPage() {
 *   const { usePagination, useSearch, getParam, setParam } = useUrlState();
 *   const { page, limit, setPage, setLimit } = usePagination();
 *   const { search, setSearch } = useSearch();
 *   const unitFilter = getParam('unit');
 *
 *   // Use in API call
 *   const { data } = useProducts({ page, limit, search, unit: unitFilter });
 *
 *   return (
 *     <div>
 *       <input value={search} onChange={(e) => setSearch(e.target.value)} />
 *       <select value={unitFilter} onChange={(e) => setParam('unit', e.target.value)}>
 *         <option value="">All Units</option>
 *         <option value="kg">Kilograms</option>
 *       </select>
 *     </div>
 *   );
 * }
 */
