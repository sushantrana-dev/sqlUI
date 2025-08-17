import { useCallback, useMemo, useEffect, useState } from 'react';

// Debounced hook for search inputs
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for stable callback references
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[] = []
): T => {
  return useCallback(callback, deps);
};

// Hook for search optimization
export const useSearchOptimization = (searchTerm: string, delay: number = 300) => {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  
  const isSearching = useMemo(() => {
    return searchTerm !== debouncedSearchTerm;
  }, [searchTerm, debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    isSearching
  };
};

// Hook for data filtering optimization
export const useDataFiltering = <T>(
  data: T[],
  filterFn: (item: T, searchTerm: string) => boolean,
  searchTerm: string
) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(item => filterFn(item, searchTerm));
  }, [data, filterFn, searchTerm]);
};

// Hook for sorting optimization
export const useDataSorting = <T>(
  data: T[],
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' } | null
) => {
  return useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
}; 