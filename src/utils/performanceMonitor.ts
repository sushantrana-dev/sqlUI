// Performance monitoring utilities for tracking application performance

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  rowCount: number;
  queryLength: number;
  timestamp: string;
  queryType?: string;
  datasetSize?: number;
}

export interface PageLoadMetrics {
  domContentLoaded: number;
  pageLoad: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];


  // Measure query execution performance
  static measureQueryExecution(queryText: string, queryType?: string) {
    const startTime = performance.now();
    const startMemory = 0; // performance.memory not available in all browsers

    return {
      end: (rowCount: number, datasetSize?: number) => {
        const endTime = performance.now();
        const endMemory = 0; // performance.memory not available in all browsers
        
        const metrics: PerformanceMetrics = {
          executionTime: Math.round(endTime - startTime),
          memoryUsage: Math.round((endMemory - startMemory) / 1024 / 1024), // MB
          rowCount,
          queryLength: queryText.length,
          timestamp: new Date().toISOString(),
          queryType,
          datasetSize
        };

        this.metrics.push(metrics);
        this.logPerformance(metrics);
        
        return metrics;
      }
    };
  }

  // Measure page load performance
  static measurePageLoad(): PageLoadMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const layoutShift = performance.getEntriesByType('layout-shift');

    const metrics: PageLoadMetrics = {
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      pageLoad: navigation?.loadEventEnd || 0,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: this.getLargestContentfulPaint(),
      cumulativeLayoutShift: layoutShift.reduce((sum, entry: any) => sum + entry.value, 0)
    };

    this.logPageLoad(metrics);
    return metrics;
  }

  // Measure component render performance
  static measureComponentRender(componentName: string) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 16) { // Log slow renders (> 16ms = 60fps threshold)
          console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      }
    };
  }

  // Measure data generation performance
  static measureDataGeneration(datasetType: string, rowCount: number) {
    const startTime = performance.now();
    const startMemory = 0; // performance.memory not available in all browsers
    
    return {
      end: () => {
        const endTime = performance.now();
        const endMemory = 0; // performance.memory not available in all browsers
        
        const metrics = {
          datasetType,
          rowCount,
          generationTime: Math.round(endTime - startTime),
          memoryUsage: Math.round((endMemory - startMemory) / 1024 / 1024),
          rowsPerSecond: Math.round(rowCount / ((endTime - startTime) / 1000))
        };

        this.logDataGeneration(metrics);
        return metrics;
      }
    };
  }

  // Get performance summary
  static getPerformanceSummary() {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        averageExecutionTime: 0,
        totalMemoryUsage: 0,
        fastestQuery: null,
        slowestQuery: null
      };
    }

    const totalQueries = this.metrics.length;
    const averageExecutionTime = this.metrics.reduce((sum, m) => sum + m.executionTime, 0) / totalQueries;
    const totalMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0);
    const fastestQuery = this.metrics.reduce((min, m) => m.executionTime < min.executionTime ? m : min);
    const slowestQuery = this.metrics.reduce((max, m) => m.executionTime > max.executionTime ? m : max);

    return {
      totalQueries,
      averageExecutionTime: Math.round(averageExecutionTime),
      totalMemoryUsage,
      fastestQuery,
      slowestQuery,
      averageQueryLength: Math.round(this.metrics.reduce((sum, m) => sum + m.queryLength, 0) / totalQueries)
    };
  }

  // Clear performance metrics
  static clearMetrics() {
    this.metrics = [];
  }

  // Export performance data
  static exportPerformanceData() {
    return {
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
      pageLoad: this.measurePageLoad(),
      timestamp: new Date().toISOString()
    };
  }

  // Private helper methods
  private static logPerformance(metrics: PerformanceMetrics) {
    const { executionTime, rowCount, memoryUsage, queryType } = metrics;
    
    console.log(`Query executed in ${executionTime}ms | ${rowCount.toLocaleString()} rows | ${memoryUsage}MB memory | Type: ${queryType || 'Unknown'}`);
    
    // Warn about slow queries
    if (executionTime > 1000) {
      console.warn(`Slow query detected: ${executionTime}ms execution time`);
    }
    
    // Warn about high memory usage
    if (memoryUsage > 100) {
      console.warn(`High memory usage detected: ${memoryUsage}MB`);
    }
  }

  private static logPageLoad(metrics: PageLoadMetrics) {
    const { domContentLoaded, pageLoad, firstPaint, firstContentfulPaint } = metrics;
    
    console.log(`Page Load Metrics:
      - DOM Content Loaded: ${domContentLoaded}ms
      - Page Load: ${pageLoad}ms
      - First Paint: ${firstPaint}ms
      - First Contentful Paint: ${firstContentfulPaint}ms`);
    
    // Warn about slow page loads
    if (pageLoad > 3000) {
      console.warn(`Slow page load detected: ${pageLoad}ms`);
    }
  }

  private static logDataGeneration(metrics: any) {
    const { datasetType, rowCount, generationTime, memoryUsage, rowsPerSecond } = metrics;
    
    console.log(`Data Generation: ${datasetType} | ${rowCount.toLocaleString()} rows | ${generationTime}ms | ${memoryUsage}MB | ${rowsPerSecond} rows/sec`);
  }

  private static getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
  }
}

// Performance observer for automatic monitoring
export class PerformanceObserver {
  private static observer: any;

  static startMonitoring() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor long tasks
      this.observer = new (window as any).PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Log tasks longer than 50ms
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
          }
        }
      });
      
      this.observer.observe({ entryTypes: ['longtask'] });
    }
  }

  static stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Memoize expensive calculations
  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map();
    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },

  // Check if element is in viewport
  isInViewport: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}; 