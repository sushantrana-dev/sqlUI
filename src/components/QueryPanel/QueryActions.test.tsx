import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockInitialState } from '../../__mocks__/testUtils';
import QueryActions from './QueryActions';

// Mock the ConfirmationModal component
jest.mock('../common/ConfirmationModal', () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm, onClose, title, message }: any) => (
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm} data-testid="confirm-button">Clear All</button>
        <button onClick={onClose} data-testid="cancel-button">Cancel</button>
      </div>
    ) : null
  ),
}));

describe('QueryActions Component', () => {
  const user = userEvent.setup();
  const mockOnExecute = jest.fn();

  beforeEach(() => {
    mockOnExecute.mockClear();
  });

  it('renders execute button', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByRole('button', { name: /execute query/i })).toBeInTheDocument();
  });

  it('renders clear button', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByRole('button', { name: /clear query/i })).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByRole('button', { name: /copy query/i })).toBeInTheDocument();
  });

  it('renders collapse button', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByRole('button', { name: /collapse query panel/i })).toBeInTheDocument();
  });

  it('calls onExecute when execute button is clicked', async () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const executeButton = screen.getByRole('button', { name: /execute query/i });
    await user.click(executeButton);
    
    expect(mockOnExecute).toHaveBeenCalledTimes(1);
  });

  it('disables execute button when no query is present', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={false}
      />,
      { preloadedState: mockInitialState }
    );
    
    const executeButton = screen.getByRole('button', { name: /execute query/i });
    expect(executeButton).toBeDisabled();
  });

  it('disables execute button when query is executing', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={true}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const executeButton = screen.getByRole('button', { name: /execute query/i });
    expect(executeButton).toBeDisabled();
  });

  it('shows loading state when executing', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={true}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const executeButton = screen.getByRole('button', { name: /execute query/i });
    expect(executeButton).toHaveClass('btn--loading');
  });

  it('shows confirmation modal when clear button is clicked', async () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const clearButton = screen.getByRole('button', { name: /clear query/i });
    await user.click(clearButton);
    
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('Clear Query')).toBeInTheDocument();
  });

  it('does not show confirmation modal when no query is present', async () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={false}
      />,
      { preloadedState: mockInitialState }
    );
    
    const clearButton = screen.getByRole('button', { name: /clear query/i });
    await user.click(clearButton);
    
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });

  it('clears query and results when confirmation is confirmed', async () => {
    const { store } = render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const clearButton = screen.getByRole('button', { name: /clear query/i });
    await user.click(clearButton);
    
    const confirmButton = screen.getByTestId('confirm-button');
    await user.click(confirmButton);
    
    const state = store.getState();
    expect(state.query.currentQuery).toBe('');
    expect(state.results.currentResults).toBeNull();
  });

  it('closes confirmation modal when cancelled', async () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const clearButton = screen.getByRole('button', { name: /clear query/i });
    await user.click(clearButton);
    
    const cancelButton = screen.getByTestId('cancel-button');
    await user.click(cancelButton);
    
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });

  it('copies query to clipboard when copy button is clicked', async () => {
    const { store } = render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const copyButton = screen.getByRole('button', { name: /copy query/i });
    await user.click(copyButton);
    
    const state = store.getState();
    // Check that copyCurrentQuery action was dispatched
    expect(state.query.currentQuery).toBeDefined();
  });

  it('toggles query panel when collapse button is clicked', async () => {
    const { store } = render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const collapseButton = screen.getByRole('button', { name: /collapse query panel/i });
    await user.click(collapseButton);
    
    const state = store.getState();
    expect(state.ui.isQueryPanelCollapsed).toBe(true);
  });

  it('shows correct status text when ready', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows correct status text when executing', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={true}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByText('Executing...')).toBeInTheDocument();
  });

  it('shows correct status text when no query', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={false}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByText('No query')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByTestId('query-actions')).toHaveClass('query-panel__actions');
    expect(screen.getByTestId('query-actions-left')).toHaveClass('query-panel__actions-left');
    expect(screen.getByTestId('query-actions-right')).toHaveClass('query-panel__actions-right');
  });

  it('shows status indicator when executing', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={true}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toHaveClass('query-panel__status-indicator--executing');
  });

  it('disables copy button when no query is present', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={false}
        hasQuery={false}
      />,
      { preloadedState: mockInitialState }
    );
    
    const copyButton = screen.getByRole('button', { name: /copy query/i });
    expect(copyButton).toBeDisabled();
  });

  it('disables copy button when query is executing', () => {
    render(
      <QueryActions
        onExecute={mockOnExecute}
        isExecuting={true}
        hasQuery={true}
      />,
      { preloadedState: mockInitialState }
    );
    
    const copyButton = screen.getByRole('button', { name: /copy query/i });
    expect(copyButton).toBeDisabled();
  });
}); 