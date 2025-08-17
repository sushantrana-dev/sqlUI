import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import querySlice from '../store/slices/querySlice';
import uiSlice from '../store/slices/uiSlice';
import resultsSlice from '../store/slices/resultsSlice';

// Create a custom render function that includes providers
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      query: querySlice,
      ui: uiSlice,
      results: resultsSlice,
    },
    preloadedState,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, createTestStore };

// Mock data for tests
export const mockQuery = {
  id: '1',
  name: 'Test Query',
  query: 'SELECT * FROM users',
  description: 'A test query',
  category: 'test',
};

export const mockQueryHistory = {
  id: 1,
  query: 'SELECT * FROM users',
  timestamp: '2023-01-01T00:00:00Z',
  executionTime: 100,
};

export const mockQueryResult = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
  executionTime: 150,
  rowCount: 2,
  columns: ['id', 'name', 'email'],
  totalCount: 2,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  pageSize: 10,
};

export const mockInitialState = {
  query: {
    currentQuery: '',
    predefinedQueries: [mockQuery],
    queryHistory: [mockQueryHistory],
    isExecuting: false,
    selectedQueryId: null,
  },
  ui: {
    theme: 'light' as const,
    sidebarWidth: 40,
    showHistory: false,
    notifications: [],
    isQueryPanelCollapsed: false,
  },
  results: {
    currentResults: null,
    executionTime: null,
    sortConfig: null,
    currentPage: 1,
    pageSize: 10,
    searchTerm: '',
    selectedRows: [],
    selectedColumns: [],
  },
}; 