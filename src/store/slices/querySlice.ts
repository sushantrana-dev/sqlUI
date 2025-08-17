import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QueryState, Query, QueryHistory, RootState } from '../../types';
import { setResults } from './resultsSlice';
import { SAMPLE_QUERIES } from '../../data/sampleQueries';
import { getDatasetColumns, measureDataGeneration } from '../../utils/dataGenerator';

// Pagination interface
interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enhanced response interface
interface QueryResult {
  data: Record<string, any>[];
  executionTime: number;
  rowCount: number;
  columns: string[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  pageSize: number;
}

// Pagination interface
interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enhanced response interface
interface QueryResult {
  data: Record<string, any>[];
  executionTime: number;
  rowCount: number;
  columns: string[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  pageSize: number;
}



// Helper function to generate random count based on query complexity
const getRandomCountForQuery = (queryText: string, complexity?: string): number => {
  const queryLength = queryText.length;
  const hasJoins = queryText.toLowerCase().includes('join');
  const hasGroupBy = queryText.toLowerCase().includes('group by');
  const hasSubquery = queryText.toLowerCase().includes('select') && (queryText.match(/select/gi) || []).length > 1;
  
  // Base count based on complexity
  let baseCount = 10;
  if (complexity === 'basic') baseCount = 8;
  else if (complexity === 'intermediate') baseCount = 15;
  else if (complexity === 'advanced') baseCount = 25;
  
  // Adjust based on query characteristics
  if (hasJoins) baseCount += 5;
  if (hasGroupBy) baseCount = Math.max(3, baseCount - 5); // Group by typically returns fewer rows
  if (hasSubquery) baseCount += 3;
  if (queryLength > 500) baseCount += 5;
  
  // Add randomness
  const variance = Math.floor(baseCount * 0.4); // 40% variance
  return Math.max(3, baseCount + Math.floor(Math.random() * variance * 2) - variance);
};

// Helper function to apply search and filters
const applySearchAndFilters = (
  data: Record<string, any>[], 
  search?: string, 
  filters?: Record<string, any>
): Record<string, any>[] => {
  let filteredData = [...data];

  // Apply global search
  if (search && search.trim()) {
    const searchTerm = search.toLowerCase();
    filteredData = filteredData.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  }

  // Apply column filters
  if (filters) {
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue && typeof filterValue === 'object') {
        const { operator, value } = filterValue;
        filteredData = filteredData.filter(row => {
          const cellValue = row[column];
          if (cellValue === null || cellValue === undefined) return false;
          
          switch (operator) {
            case 'equals':
              return String(cellValue).toLowerCase() === String(value).toLowerCase();
            case 'not_equals':
              return String(cellValue).toLowerCase() !== String(value).toLowerCase();
            case 'contains':
              return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
            case 'starts_with':
              return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'ends_with':
              return String(cellValue).toLowerCase().endsWith(String(value).toLowerCase());
            case 'greater_than':
              return Number(cellValue) > Number(value);
            case 'less_than':
              return Number(cellValue) < Number(value);
            case 'greater_than_equal':
              return Number(cellValue) >= Number(value);
            case 'less_than_equal':
              return Number(cellValue) <= Number(value);
            default:
              return true;
          }
        });
      }
    });
  }

  return filteredData;
};

// Helper function to apply sorting
const applySorting = (
  data: Record<string, any>[], 
  sortBy?: string, 
  sortOrder: 'asc' | 'desc' = 'asc'
): Record<string, any>[] => {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string values
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    if (sortOrder === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });
};

// Enhanced mock query execution function with pagination
const mockQueryExecution = async (
  queryText: string, 
  selectedQueryId?: string | null,
  paginationParams?: PaginationParams
): Promise<QueryResult> => {
  const startTime = performance.now();
  
  // Default pagination parameters
  const {
    page = 1,
    limit = 25,
    search,
    filters,
    sortBy,
    sortOrder = 'asc'
  } = paginationParams || {};
  
  // Simulate execution delay based on query complexity
  const baseDelay = 200;
  const complexityDelay = queryText.length * 0.5; // Longer queries take more time
  const totalDelay = baseDelay + complexityDelay + Math.random() * 600;
  
  await new Promise(resolve => setTimeout(resolve, totalDelay));
  
  let data: Record<string, any>[];
  let columns: string[];
  
  // First, try to find the selected query by ID
  let matchedQuery = selectedQueryId ? SAMPLE_QUERIES.find(q => q.id === selectedQueryId) : null;
  
  // If no selected query, try to match by exact query text
  if (!matchedQuery) {
    matchedQuery = SAMPLE_QUERIES.find(q => q.query.trim() === queryText.trim());
  }
  
  // If still no match, try to match by query name or ID in the query text
  if (!matchedQuery) {
    matchedQuery = SAMPLE_QUERIES.find(q => 
      queryText.toLowerCase().includes(q.name.toLowerCase()) ||
      queryText.toLowerCase().includes(q.id.toLowerCase()) ||
      queryText.toLowerCase().includes('employee') ||
      queryText.toLowerCase().includes('employees')
    );
  }
  
  // Additional matching for other data types
  if (!matchedQuery) {
    if (queryText.toLowerCase().includes('sales') || queryText.toLowerCase().includes('revenue')) {
      matchedQuery = SAMPLE_QUERIES.find(q => q.datasetConfig?.type === 'salesData');
    } else if (queryText.toLowerCase().includes('inventory') || queryText.toLowerCase().includes('stock')) {
      matchedQuery = SAMPLE_QUERIES.find(q => q.datasetConfig?.type === 'inventory');
    } else if (queryText.toLowerCase().includes('customer') || queryText.toLowerCase().includes('order')) {
      matchedQuery = SAMPLE_QUERIES.find(q => q.datasetConfig?.type === 'customerOrders');
    } else if (queryText.toLowerCase().includes('user') || queryText.toLowerCase().includes('analytics')) {
      matchedQuery = SAMPLE_QUERIES.find(q => q.datasetConfig?.type === 'userAnalytics');
    } else if (queryText.toLowerCase().includes('financial') || queryText.toLowerCase().includes('profit')) {
      matchedQuery = SAMPLE_QUERIES.find(q => q.datasetConfig?.type === 'financialMetrics');
    }
  }
  
  console.log('Query execution debug:', {
    selectedQueryId,
    queryText: queryText.substring(0, 100) + '...',
    matchedQuery: matchedQuery?.name,
    datasetType: matchedQuery?.datasetConfig?.type,
    paginationParams
  });
  
  if (matchedQuery && matchedQuery.datasetConfig) {
    // Use the enhanced data generator with dynamic count
    const dynamicCount = matchedQuery.datasetConfig.count;
    const result = measureDataGeneration(matchedQuery.datasetConfig.type, dynamicCount);
    data = result.data;
    columns = getDatasetColumns(matchedQuery.datasetConfig.type);
  } else {
    // Fallback to random data type with intelligent randomized count
    const dataTypes: Array<'employees' | 'salesData' | 'inventory' | 'customerOrders' | 'userAnalytics' | 'financialMetrics'> = [
      'employees', 'salesData', 'inventory', 'customerOrders', 'userAnalytics', 'financialMetrics'
    ];
    const randomDataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    const fallbackCount = getRandomCountForQuery(queryText);
    const result = measureDataGeneration(randomDataType, fallbackCount);
    data = result.data;
    columns = getDatasetColumns(randomDataType);
  }

  // Apply search and filters
  const filteredData = applySearchAndFilters(data, search, filters);
  
  // Apply sorting
  const sortedData = applySorting(filteredData, sortBy, sortOrder);
  
  // Calculate pagination
  const totalCount = sortedData.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  
  console.log('mockQueryExecution: Pagination calculation', {
    totalCount,
    totalPages,
    currentPage: page,
    limit,
    startIndex,
    endIndex,
    paginatedDataLength: paginatedData.length,
    hasMore: page < totalPages
  });
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    data: paginatedData,
    executionTime,
    rowCount: paginatedData.length,
    columns,
    totalCount,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
    pageSize: limit
  };
};

// Async thunk for query execution
export const executeQuery = createAsyncThunk(
  'query/execute',
  async (queryText: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const selectedQueryId = state.query.selectedQueryId;
    const pageSize = state.results.pageSize;
    
    console.log('executeQuery: Starting execution with pageSize:', pageSize);
    
    const result = await mockQueryExecution(queryText, selectedQueryId, {
      page: 1,
      limit: pageSize
    });
    
    console.log('executeQuery: Result received:', {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasMore: result.hasMore
    });
    
    dispatch(setResults(result));
    return result;
  }
);

// Async thunk for paginated query execution
export const executeQueryWithPagination = createAsyncThunk(
  'query/executeWithPagination',
  async (params: { queryText: string; paginationParams: PaginationParams }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const selectedQueryId = state.query.selectedQueryId;
    const result = await mockQueryExecution(params.queryText, selectedQueryId, params.paginationParams);
    dispatch(setResults(result));
    return result;
  }
);

// Use enhanced predefined queries
const predefinedQueries: Query[] = SAMPLE_QUERIES.map(query => ({
  id: query.id,
  name: query.name,
  query: query.query,
  description: query.description,
  category: query.category,
  datasetConfig: query.datasetConfig
}));

const initialState: QueryState = {
  currentQuery: '',
  predefinedQueries,
  queryHistory: [],
  isExecuting: false,
  selectedQueryId: null
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    selectPredefinedQuery: (state, action: PayloadAction<string>) => {
      const query = state.predefinedQueries.find(q => q.id === action.payload);
      if (query) {
        state.currentQuery = query.query;
        state.selectedQueryId = action.payload;
      }
    },
    clearQuery: (state) => {
      state.currentQuery = '';
      state.selectedQueryId = null;
    },
    addToHistory: (state, action: PayloadAction<Omit<QueryHistory, 'id'>>) => {
      const historyItem: QueryHistory = {
        id: Date.now(),
        ...action.payload
      };
      state.queryHistory.unshift(historyItem);
      // Keep only last 20 queries
      state.queryHistory = state.queryHistory.slice(0, 20);
    },
    clearHistory: (state) => {
      state.queryHistory = [];
    },
    initializePredefinedQueries: (state) => {
      // This is handled in the initial state, but we keep it for consistency
      state.predefinedQueries = predefinedQueries;
    },
    // Copy current query to clipboard
    copyCurrentQuery: (state) => {
      if (state.currentQuery.trim()) {
        navigator.clipboard.writeText(state.currentQuery)
          .then(() => {
            console.log('Query copied to clipboard');
          })
          .catch(err => {
            console.error('Failed to copy query:', err);
          });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeQuery.pending, (state) => {
        state.isExecuting = true;
      })
      .addCase(executeQuery.fulfilled, (state, action) => {
        state.isExecuting = false;
        // Add to history
        state.queryHistory.unshift({
          id: Date.now(),
          query: state.currentQuery,
          timestamp: new Date().toISOString(),
          executionTime: action.payload.executionTime
        });
        // Keep only last 20 queries
        state.queryHistory = state.queryHistory.slice(0, 20);
      })
      .addCase(executeQuery.rejected, (state) => {
        state.isExecuting = false;
      });
  }
});

export const {
  setCurrentQuery,
  selectPredefinedQuery,
  clearQuery,
  addToHistory,
  clearHistory,
  initializePredefinedQueries,
  copyCurrentQuery
} = querySlice.actions;

export default querySlice.reducer; 