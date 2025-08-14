import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QueryState, Query, QueryHistory, RootState } from '../../types';
import { setResults } from './resultsSlice';
import { SAMPLE_QUERIES } from '../../data/sampleQueries';
import { getDatasetColumns, measureDataGeneration } from '../../utils/dataGenerator';

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

// Enhanced mock query execution function
const mockQueryExecution = async (queryText: string, selectedQueryId?: string | null) => {
  const startTime = performance.now();
  
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
    datasetType: matchedQuery?.datasetConfig?.type
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

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    data,
    executionTime,
    rowCount: data.length,
    columns
  };
};

// Async thunk for query execution
export const executeQuery = createAsyncThunk(
  'query/execute',
  async (queryText: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const selectedQueryId = state.query.selectedQueryId;
    const result = await mockQueryExecution(queryText, selectedQueryId);
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