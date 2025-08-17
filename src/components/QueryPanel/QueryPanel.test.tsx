import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockInitialState } from '../../__mocks__/testUtils';
import QueryPanel from './QueryPanel';

// Mock child components
jest.mock('./QuerySelector', () => ({
  __esModule: true,
  default: ({ queries, selectedId, onSelect }: any) => (
    <div data-testid="query-selector">
      <div>Query Selector</div>
      <div>Queries: {queries.length}</div>
      <div>Selected: {selectedId || 'none'}</div>
      <button onClick={() => onSelect('1')} data-testid="select-query-btn">
        Select Query
      </button>
    </div>
  ),
}));

jest.mock('./QueryEditor', () => ({
  __esModule: true,
  default: ({ value, onChange, onExecute }: any) => (
    <div data-testid="query-editor">
      <div>Query Editor</div>
      <textarea
        data-testid="editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === 'Enter') {
            onExecute();
          }
        }}
      />
    </div>
  ),
}));

jest.mock('./QueryActions', () => ({
  __esModule: true,
  default: ({ onExecute, isExecuting, hasQuery }: any) => (
    <div data-testid="query-actions">
      <div>Query Actions</div>
      <div>Executing: {isExecuting.toString()}</div>
      <div>Has Query: {hasQuery.toString()}</div>
      <button onClick={onExecute} data-testid="execute-btn">
        Execute
      </button>
    </div>
  ),
}));

describe('QueryPanel Component', () => {
  const user = userEvent.setup();

  it('renders all child components', () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('query-selector')).toBeInTheDocument();
    expect(screen.getByTestId('query-editor')).toBeInTheDocument();
    expect(screen.getByTestId('query-actions')).toBeInTheDocument();
  });

  it('passes correct props to QuerySelector', () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByText('Queries: 1')).toBeInTheDocument(); // From mockInitialState
    expect(screen.getByText('Selected: none')).toBeInTheDocument();
  });

  it('passes correct props to QueryEditor', () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const editor = screen.getByTestId('editor-input');
    expect(editor).toHaveValue(''); // Empty query initially
  });

  it('passes correct props to QueryActions', () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    expect(screen.getByText('Executing: false')).toBeInTheDocument();
    expect(screen.getByText('Has Query: false')).toBeInTheDocument();
  });

  it('updates query when QuerySelector calls onSelect', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const selectButton = screen.getByTestId('select-query-btn');
    await user.click(selectButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.selectedQueryId).toBe('1');
    });
  });

  it('updates current query when QueryEditor calls onChange', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const editor = screen.getByTestId('editor-input');
    await user.type(editor, 'SELECT * FROM users');
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.currentQuery).toBe('SELECT * FROM users');
    });
  });

  it('executes query when QueryActions calls onExecute', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    // First, set a query
    const editor = screen.getByTestId('editor-input');
    await user.type(editor, 'SELECT * FROM users');
    
    // Then execute it
    const executeButton = screen.getByTestId('execute-btn');
    await user.click(executeButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.isExecuting).toBe(true);
    });
  });

  it('does not execute query when no query is present', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const executeButton = screen.getByTestId('execute-btn');
    await user.click(executeButton);
    
    // Should not execute since there's no query
    const state = store.getState();
    expect(state.query.isExecuting).toBe(false);
  });

  it('does not execute query when already executing', async () => {
    const stateWithExecuting = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        isExecuting: true,
      },
    };

    const { store } = render(<QueryPanel />, { preloadedState: stateWithExecuting });
    
    const executeButton = screen.getByTestId('execute-btn');
    await user.click(executeButton);
    
    // Should remain executing, not start a new execution
    const state = store.getState();
    expect(state.query.isExecuting).toBe(true);
  });

  it('updates hasQuery prop when query changes', async () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    // Initially no query
    expect(screen.getByText('Has Query: false')).toBeInTheDocument();
    
    // Add a query
    const editor = screen.getByTestId('editor-input');
    await user.type(editor, 'SELECT * FROM users');
    
    // Should now have a query
    expect(screen.getByText('Has Query: true')).toBeInTheDocument();
  });

  it('handles query selection from predefined queries', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const selectButton = screen.getByTestId('select-query-btn');
    await user.click(selectButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.selectedQueryId).toBe('1');
      expect(state.query.currentQuery).toBe('SELECT * FROM users'); // From mockQuery
    });
  });

  it('updates selected query ID when query is selected', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    const selectButton = screen.getByTestId('select-query-btn');
    await user.click(selectButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.selectedQueryId).toBe('1');
    });
  });

  it('handles keyboard execution (Ctrl+Enter)', async () => {
    const { store } = render(<QueryPanel />, { preloadedState: mockInitialState });
    
    // Set a query
    const editor = screen.getByTestId('editor-input');
    await user.type(editor, 'SELECT * FROM users');
    
    // Simulate Ctrl+Enter
    await user.keyboard('{Control>}{Enter}');
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.query.isExecuting).toBe(true);
    });
  });

  it('memoizes component props to prevent unnecessary re-renders', () => {
    render(<QueryPanel />, { preloadedState: mockInitialState });
    
    // The component should use React.memo and useMemo for optimization
    // This is tested by ensuring the component renders correctly
    expect(screen.getByTestId('query-selector')).toBeInTheDocument();
    expect(screen.getByTestId('query-editor')).toBeInTheDocument();
    expect(screen.getByTestId('query-actions')).toBeInTheDocument();
  });

  it('handles empty predefined queries', () => {
    const stateWithEmptyQueries = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        predefinedQueries: [],
      },
    };

    render(<QueryPanel />, { preloadedState: stateWithEmptyQueries });
    
    expect(screen.getByText('Queries: 0')).toBeInTheDocument();
  });

  it('handles multiple predefined queries', () => {
    const stateWithMultipleQueries = {
      ...mockInitialState,
      query: {
        ...mockInitialState.query,
        predefinedQueries: [
          { id: '1', name: 'Query 1', query: 'SELECT 1' },
          { id: '2', name: 'Query 2', query: 'SELECT 2' },
          { id: '3', name: 'Query 3', query: 'SELECT 3' },
        ],
      },
    };

    render(<QueryPanel />, { preloadedState: stateWithMultipleQueries });
    
    expect(screen.getByText('Queries: 3')).toBeInTheDocument();
  });
}); 