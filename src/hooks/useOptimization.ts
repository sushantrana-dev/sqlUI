import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

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

// Memoized selector hook for Redux state
export const useMemoizedSelector = <T>(
  selector: (state: RootState) => T,
  deps: any[] = []
): T => {
  return useMemo(() => {
    return useSelector(selector);
  }, deps);
};

// Custom hook for expensive calculations
export const useExpensiveCalculation = <T>(
  calculation: () => T,
  deps: any[]
): T => {
  return useMemo(calculation, deps);
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const setElement = useCallback((element: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      }, options);

      observerRef.current.observe(element);
      elementRef.current = element;
    }
  }, [callback, options]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return setElement;
};

// Hook for stable callback references
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[] = []
): T => {
  return useCallback(callback, deps);
};

// Hook for memoized object creation
export const useMemoizedObject = <T extends object>(
  factory: () => T,
  deps: any[]
): T => {
  return useMemo(factory, deps);
};

// Hook for conditional rendering optimization
export const useConditionalRender = (
  condition: boolean,
  component: React.ReactNode,
  fallback: React.ReactNode = null
) => {
  return useMemo(() => {
    return condition ? component : fallback;
  }, [condition, component, fallback]);
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