import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCurrentPage, setPageSize } from '../../store/slices/resultsSlice';
import { executeQueryWithPagination } from '../../store/slices/querySlice';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationControls: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const currentResults = useAppSelector((state) => state.results.currentResults);

  const pageSize = useAppSelector((state) => state.results.pageSize);
  const searchTerm = useAppSelector((state) => state.results.searchTerm);
  const filters = useAppSelector((state) => state.results.filters);
  const sortBy = useAppSelector((state) => state.results.sortBy);
  const sortOrder = useAppSelector((state) => state.results.sortOrder);
  const currentQuery = useAppSelector((state) => state.query.currentQuery);

  // Memoized pagination info
  const paginationInfo = useMemo(() => {
    if (!currentResults) {
      console.log('PaginationControls: No current results');
      return null;
    }
    
    const { totalCount, currentPage: page, totalPages, hasMore, pageSize: size } = currentResults;
    const startItem = (page - 1) * size + 1;
    const endItem = Math.min(page * size, totalCount);
    
    console.log('PaginationControls: Pagination info', {
      totalCount,
      currentPage: page,
      totalPages,
      hasMore,
      pageSize: size,
      startItem,
      endItem
    });
    
    return {
      totalCount,
      currentPage: page,
      totalPages,
      hasMore,
      pageSize: size,
      startItem,
      endItem
    };
  }, [currentResults]);

  // Page size options
  const pageSizeOptions = [10, 25, 50, 100];

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (!currentQuery.trim() || !paginationInfo) return;
    
    dispatch(setCurrentPage(newPage));
    
    // Execute query with new pagination
    dispatch(executeQueryWithPagination({
      queryText: currentQuery,
      paginationParams: {
        page: newPage,
        limit: pageSize,
        search: searchTerm || undefined,
        filters: Object.keys(filters || {}).length > 0 ? filters : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || 'asc'
      }
    }));
  }, [dispatch, currentQuery, paginationInfo, pageSize, searchTerm, filters, sortBy, sortOrder]);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (!currentQuery.trim() || !paginationInfo) return;
    
    dispatch(setPageSize(newPageSize));
    
    // Execute query with new page size (reset to page 1)
    dispatch(executeQueryWithPagination({
      queryText: currentQuery,
      paginationParams: {
        page: 1,
        limit: newPageSize,
        search: searchTerm || undefined,
        filters: Object.keys(filters || {}).length > 0 ? filters : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || 'asc'
      }
    }));
  }, [dispatch, currentQuery, paginationInfo, searchTerm, filters, sortBy, sortOrder]);

  // Generate page numbers
  const getPageNumbers = useCallback(() => {
    if (!paginationInfo) return [];
    
    const { currentPage, totalPages } = paginationInfo;
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and neighbors
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [paginationInfo]);

  if (!paginationInfo) {
    console.log('PaginationControls: No pagination info, not rendering');
    return null;
  }

  console.log('PaginationControls: Rendering with pagination info:', paginationInfo);

  const { totalCount, currentPage: page, totalPages, startItem, endItem } = paginationInfo;

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span>
          Showing {startItem}-{endItem} of {totalCount.toLocaleString()} results
        </span>
      </div>
      
      <div className="pagination-navigation">
        {/* First page */}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft size={16} />
        </button>
        
        {/* Previous page */}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={16} />
        </button>
        
        {/* Page numbers */}
        <div className="pagination-pages">
          {getPageNumbers().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="pagination-ellipsis">...</span>
              ) : (
                <button
                  className={`btn btn--sm ${
                    pageNum === page ? 'btn--primary' : 'btn--ghost'
                  }`}
                  onClick={() => handlePageChange(pageNum as number)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pageNum === page ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next page */}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight size={16} />
        </button>
        
        {/* Last page */}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
      
      <div className="pagination-size">
        <label htmlFor="page-size" className="pagination-size-label">
          Rows per page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="pagination-size-select"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationControls; 