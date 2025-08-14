import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResultsState, QueryResult, SortConfig } from '../../types';

const initialState: ResultsState = {
  currentResults: null,
  executionTime: null,
  sortConfig: null,
  currentPage: 1,
  pageSize: 50,
  searchTerm: '',
  selectedRows: [],
  selectedColumns: []
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<QueryResult>) => {
      state.currentResults = action.payload;
      state.executionTime = action.payload.executionTime;
      state.currentPage = 1;
      state.searchTerm = '';
      state.selectedRows = [];
      state.selectedColumns = action.payload.columns;
    },
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedRows: (state, action: PayloadAction<number[]>) => {
      state.selectedRows = action.payload;
    },
    setSelectedColumns: (state, action: PayloadAction<string[]>) => {
      state.selectedColumns = action.payload;
    },
    toggleRowSelection: (state, action: PayloadAction<number>) => {
      const rowIndex = action.payload;
      const index = state.selectedRows.indexOf(rowIndex);
      if (index > -1) {
        state.selectedRows.splice(index, 1);
      } else {
        state.selectedRows.push(rowIndex);
      }
    },
    toggleColumnSelection: (state, action: PayloadAction<string>) => {
      const column = action.payload;
      const index = state.selectedColumns.indexOf(column);
      if (index > -1) {
        state.selectedColumns.splice(index, 1);
      } else {
        state.selectedColumns.push(column);
      }
    },
    clearResults: (state) => {
      state.currentResults = null;
      state.executionTime = null;
      state.sortConfig = null;
      state.currentPage = 1;
      state.searchTerm = '';
      state.selectedRows = [];
      state.selectedColumns = [];
    }
  }
});

export const {
  setResults,
  setSortConfig,
  setCurrentPage,
  setPageSize,
  setSearchTerm,
  setSelectedRows,
  setSelectedColumns,
  toggleRowSelection,
  toggleColumnSelection,
  clearResults
} = resultsSlice.actions;

export default resultsSlice.reducer; 