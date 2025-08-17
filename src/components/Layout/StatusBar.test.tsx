import React from 'react';
import { screen } from '@testing-library/react';
import { render, mockInitialState, mockQueryResult } from '../../__mocks__/testUtils';
import StatusBar from './StatusBar';

describe('StatusBar Component', () => {
  it('renders status bar with correct role', () => {
    render(<StatusBar />, { preloadedState: mockInitialState });
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays query count from history', () => {
    render(<StatusBar />, { preloadedState: mockInitialState });
    
    expect(screen.getByText('Queries:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // From mockInitialState
  });

  it('displays row count when results are available', () => {
    const stateWithResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: mockQueryResult,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithResults });
    
    expect(screen.getByText('Rows:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // From mockQueryResult
  });

  it('does not display row count when no results are available', () => {
    render(<StatusBar />, { preloadedState: mockInitialState });
    
    expect(screen.queryByText('Rows:')).not.toBeInTheDocument();
  });

  it('shows executing status when query is running', () => {
    const stateWithExecuting = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithExecuting });
    
    expect(screen.getByText('Executing...')).toBeInTheDocument();
  });

  it('shows execution time when query completes', () => {
    const stateWithExecutionTime = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        executionTime: 1500,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithExecutionTime });
    
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('1.50s')).toBeInTheDocument();
  });

  it('formats execution time correctly for milliseconds', () => {
    const stateWithShortExecutionTime = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        executionTime: 500,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithShortExecutionTime });
    
    expect(screen.getByText('500ms')).toBeInTheDocument();
  });

  it('formats execution time correctly for seconds', () => {
    const stateWithLongExecutionTime = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        executionTime: 2500,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithLongExecutionTime });
    
    expect(screen.getByText('2.50s')).toBeInTheDocument();
  });

  it('does not show execution time when query is executing', () => {
    const stateWithExecutingAndTime = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
      results: {
        ...mockInitialState.results,
        executionTime: 1500,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithExecutingAndTime });
    
    expect(screen.getByText('Executing...')).toBeInTheDocument();
    expect(screen.queryByText('Time:')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<StatusBar />, { preloadedState: mockInitialState });
    
    expect(screen.getByRole('status')).toHaveClass('app__status-bar');
    expect(screen.getByTestId('status-bar-left')).toHaveClass('status-bar__left');
    expect(screen.getByTestId('status-bar-right')).toHaveClass('status-bar__right');
  });

  it('displays icons for each status item', () => {
    render(<StatusBar />, { preloadedState: mockInitialState });
    
    // Database icon for queries
    const databaseIcon = screen.getByTestId('database-icon');
    expect(databaseIcon).toBeInTheDocument();
  });

  it('displays zap icon for row count when results are available', () => {
    const stateWithResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: mockQueryResult,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithResults });
    
    const zapIcon = screen.getByTestId('zap-icon');
    expect(zapIcon).toBeInTheDocument();
  });

  it('displays clock icon for execution time', () => {
    const stateWithExecutionTime = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        executionTime: 1500,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithExecutionTime });
    
    const clockIcon = screen.getByTestId('clock-icon');
    expect(clockIcon).toBeInTheDocument();
  });

  it('displays clock icon for executing status', () => {
    const stateWithExecuting = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithExecuting });
    
    const clockIcon = screen.getByTestId('clock-icon');
    expect(clockIcon).toBeInTheDocument();
  });

  it('handles empty query history', () => {
    const stateWithEmptyHistory = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        queryHistory: [],
      },
    };

    render(<StatusBar />, { preloadedState: stateWithEmptyHistory });
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles large row counts with proper formatting', () => {
    const largeResult = {
      ...mockQueryResult,
      rowCount: 1234567,
    };

    const stateWithLargeResults = {
      ...mockInitialState,
      results: {
        ...mockInitialState.results,
        currentResults: largeResult,
      },
    };

    render(<StatusBar />, { preloadedState: stateWithLargeResults });
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });
}); 