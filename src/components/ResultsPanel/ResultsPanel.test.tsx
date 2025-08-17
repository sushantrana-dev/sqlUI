import React from 'react';
import { screen } from '@testing-library/react';
import { render, mockInitialState, mockQueryResult } from '../../__mocks__/testUtils';
import ResultsPanel from './ResultsPanel';

// Mock child components
jest.mock('./ResultsHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="results-header">Results Header</div>,
}));

jest.mock('./DataTable', () => ({
  __esModule: true,
  default: () => <div data-testid="data-table">Data Table</div>,
}));

jest.mock('./ResultsEmpty', () => ({
  __esModule: true,
  default: () => <div data-testid="results-empty">No Results</div>,
}));

jest.mock('./PaginationControls', () => ({
  __esModule: true,
  default: () => <div data-testid="pagination-controls">Pagination Controls</div>,
}));

describe('ResultsPanel Component', () => {
  it('renders results panel container', () => {
    render(<ResultsPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('results-panel')).toBeInTheDocument();
  });

  it('always renders ResultsHeader', () => {
    render(<ResultsPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('results-header')).toBeInTheDocument();
  });

  it('shows loading state when query is executing', () => {
    const stateWithExecuting = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithExecuting });
    
    expect(screen.getByText('Executing query...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-empty')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination-controls')).not.toBeInTheDocument();
  });

  it('shows empty state when no results are available', () => {
    render(<ResultsPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('results-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination-controls')).not.toBeInTheDocument();
  });

  it('shows data table and pagination when results are available', () => {
    const stateWithResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: mockQueryResult,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithResults });
    
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
    expect(screen.queryByTestId('results-empty')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<ResultsPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('results-panel')).toHaveClass('results-panel');
    expect(screen.getByTestId('table-container')).toHaveClass('results-panel__table-container');
  });

  it('shows loading spinner with correct classes', () => {
    const stateWithExecuting = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithExecuting });
    
    const loadingContainer = screen.getByTestId('loading-container');
    const spinner = screen.getByTestId('loading-spinner');
    const loadingText = screen.getByTestId('loading-text');
    
    expect(loadingContainer).toHaveClass('data-table__loading');
    expect(spinner).toHaveClass('data-table__loading-spinner');
    expect(loadingText).toHaveClass('data-table__loading-text');
  });

  it('handles null results correctly', () => {
    const stateWithNullResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: null,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithNullResults });
    
    expect(screen.getByTestId('results-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('handles undefined results correctly', () => {
    const stateWithUndefinedResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: undefined,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithUndefinedResults });
    
    expect(screen.getByTestId('results-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('prioritizes loading state over results', () => {
    const stateWithExecutingAndResults = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
      results: {
        ...mockInitialState.results,
        currentResults: mockQueryResult,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithExecutingAndResults });
    
    // Should show loading state even if results exist
    expect(screen.getByText('Executing query...')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('renders table container in all states', () => {
    render(<ResultsPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('table-container')).toBeInTheDocument();
  });

  it('handles large result sets', () => {
    const largeResult = {
      ...mockQueryResult,
      data: Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
      })),
      rowCount: 1000,
      totalCount: 1000,
    };

    const stateWithLargeResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: largeResult,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithLargeResults });
    
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
  });

  it('handles empty result sets', () => {
    const emptyResult = {
      ...mockQueryResult,
      data: [],
      rowCount: 0,
      totalCount: 0,
    };

    const stateWithEmptyResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: emptyResult,
      },
    };

    render(<ResultsPanel />, { preloadedState: stateWithEmptyResults });
    
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
  });
}); 