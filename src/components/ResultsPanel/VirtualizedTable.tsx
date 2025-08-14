import React, { useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface VirtualizedTableProps {
  data: Record<string, any>[];
  columns: string[];
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (column: string) => void;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = React.memo(({
  data,
  columns,
  sortConfig,
  onSort
}) => {
  // Row height for virtual scrolling
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 48;
  
  // Memoized data to prevent unnecessary re-renders
  const sortedData = useMemo(() => data, [data]);

  // Memoized cell value formatter
  const formatCellValue = useCallback((value: any) => {
    if (value === null || value === undefined) {
      return <span className="cell--null">NULL</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`cell--boolean cell--boolean--${value}`}>
          {value ? 'true' : 'false'}
        </span>
      );
    }
    
    if (typeof value === 'number') {
      return <span className="cell--number">{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return <span className="cell--date">{value}</span>;
    }
    
    return <span className="cell--text">{String(value)}</span>;
  }, []);

  // Memoized sort indicator
  const getSortIndicator = useCallback((column: string) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ChevronUp size={12} className="sort-indicator sort-indicator--inactive" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={12} className="sort-indicator sort-indicator--active" />
      : <ChevronDown size={12} className="sort-indicator sort-indicator--active" />;
  }, [sortConfig]);

  // Optimized virtual row renderer with stable dependencies
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = sortedData[index];
    const isEven = index % 2 === 0;
    
    return (
      <div 
        style={style} 
        className={`virtual-table__row ${isEven ? 'virtual-table__row--even' : ''}`}
      >
        {columns.map(column => (
          <div key={column} className="virtual-table__cell">
            {formatCellValue(row[column])}
          </div>
        ))}
      </div>
    );
  }, [sortedData, columns, formatCellValue]);

  // Memoized header cells
  const headerCells = useMemo(() => {
    return columns.map(column => (
      <div
        key={column}
        className="virtualized-table__header-cell"
        onClick={() => onSort(column)}
        title={`Sort by ${column}`}
      >
        <span className="header-cell__text">{column}</span>
        {getSortIndicator(column)}
      </div>
    ));
  }, [columns, onSort, getSortIndicator]);

  // Memoized table height calculation
  const tableHeight = useMemo(() => {
    return Math.min(600, sortedData.length * ROW_HEIGHT);
  }, [sortedData.length]);

  // Memoized empty state
  const emptyState = useMemo(() => {
    if (sortedData.length === 0) {
      return (
        <div className="virtualized-table__empty">
          <div className="empty-state">
            <span className="empty-state__icon">📊</span>
            <p className="empty-state__text">No data available</p>
          </div>
        </div>
      );
    }
    return null;
  }, [sortedData.length]);

  return (
    <div className="virtualized-table">
      {/* Scrollable container for header and body */}
      <div className="virtualized-table__scroll-container">
        {/* Table Header */}
        <div className="virtualized-table__header" style={{ height: HEADER_HEIGHT }}>
          {headerCells}
        </div>
        
        {/* Virtualized List */}
          <List
            height={tableHeight}
            itemCount={sortedData.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            itemData={sortedData}
            style={{overflowX: 'visible' , overflowY: 'scroll' }}
          >
            {Row}
          </List>
      </div>
      
      {/* Empty state */}
      {emptyState}
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default VirtualizedTable; 