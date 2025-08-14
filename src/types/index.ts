// Query types
export interface Query {
  id: string;
  name: string;
  query: string;
  description?: string;
  category?: string;
  datasetConfig?: {
    type: string;
    count: number;
    dateRange?: { start: string; end: string };
  };
}

export interface QueryHistory {
  id: number;
  query: string;
  timestamp: string;
  executionTime?: number;
}

// Results types
export interface QueryResult {
  data: Record<string, any>[];
  executionTime: number;
  rowCount: number;
  columns: string[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// UI types
export type Theme = 'light' | 'dark';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Store types
export interface RootState {
  query: QueryState;
  ui: UIState;
  results: ResultsState;
}

export interface QueryState {
  currentQuery: string;
  predefinedQueries: Query[];
  queryHistory: QueryHistory[];
  isExecuting: boolean;
  selectedQueryId: string | null;
}

export interface UIState {
  theme: Theme;
  sidebarWidth: number;
  showHistory: boolean;
  notifications: Notification[];
  isQueryPanelCollapsed: boolean;
}

export interface ResultsState {
  currentResults: QueryResult | null;
  executionTime: number | null;
  sortConfig: SortConfig | null;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  selectedRows: number[];
  selectedColumns: string[];
} 