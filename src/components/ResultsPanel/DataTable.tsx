import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { setSortConfig, setSearchTerm } from '../../store/slices/resultsSlice';
import { 
  useSearchOptimization, 
  useDataFiltering, 
  useDataSorting,
  useStableCallback 
} from '../../hooks/useOptimization';
import { X, Search } from 'lucide-react';
import VirtualizedTable from './VirtualizedTable';

const DataTable: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  
  // Memoized selectors
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const sortConfig = useSelector((state: RootState) => state.results.sortConfig);
  const searchTerm = useSelector((state: RootState) => state.results.searchTerm);

  // Optimized search with debouncing
  const { debouncedSearchTerm, isSearching } = useSearchOptimization(searchTerm, 300);

  if (!currentResults) return null;

  // Optimized data filtering
  const filteredData = useDataFiltering(
    currentResults.data,
    (row, term) => Object.values(row).some(value => 
      String(value).toLowerCase().includes(term.toLowerCase())
    ),
    debouncedSearchTerm
  );

  // Optimized data sorting
  const sortedData = useDataSorting(filteredData, sortConfig);

  // Stable callback references
  const handleSort = useStableCallback((column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === column) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    dispatch(setSortConfig({ key: column, direction }));
  }, [sortConfig, dispatch]);

  const handleSearch = useStableCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  }, [dispatch]);

  const clearSearch = useStableCallback(() => {
    dispatch(setSearchTerm(''));
  }, [dispatch]);

  // Memoized search bar props
  const searchBarProps = useMemo(() => ({
    value: searchTerm,
    onChange: handleSearch,
    onClear: clearSearch,
    isSearching
  }), [searchTerm, handleSearch, clearSearch, isSearching]);

  // Memoized table props
  const tableProps = useMemo(() => ({
    data: sortedData,
    columns: currentResults.columns,
    sortConfig,
    onSort: handleSort
  }), [sortedData, currentResults.columns, sortConfig, handleSort]);

  return (
    <>
      {/* Optimized Search Bar */}
      <OptimizedSearchBar {...searchBarProps} />

      {/* Virtualized Table */}
      <div className="table-container">
        <VirtualizedTable {...tableProps} />
      </div>
    </>
  );
});

// Optimized Search Bar Component
const OptimizedSearchBar: React.FC<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isSearching: boolean;
}> = React.memo(({ value, onChange, onClear, isSearching }) => {
  return (
    <div className="results-panel__search">
      <Search size={16} />
      <input
        type="text"
        className="results-panel__search-input"
        placeholder="Search results..."
        value={value}
        onChange={onChange}
      />
      {isSearching && (
        <div className="search-loading-indicator">
          <div className="spinner" />
        </div>
      )}
      {value && (
        <button 
          className="results-panel__search-clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

OptimizedSearchBar.displayName = 'OptimizedSearchBar';
DataTable.displayName = 'DataTable';

export default DataTable; 