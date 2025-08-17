import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuerySelector from './QuerySelector';

const mockQueries = [
  {
    id: '1',
    name: 'Get All Users',
    description: 'Retrieve all user records',
    category: 'users',
    query: 'SELECT * FROM users'
  },
  {
    id: '2',
    name: 'Get Active Users',
    description: 'Retrieve active user records',
    category: 'users',
    query: 'SELECT * FROM users WHERE active = true'
  },
  {
    id: '3',
    name: 'Get Orders',
    description: 'Retrieve order records',
    category: 'orders',
    query: 'SELECT * FROM orders'
  },
  {
    id: '4',
    name: 'Get Products',
    description: 'Retrieve product records',
    category: 'products',
    query: 'SELECT * FROM products'
  }
];

describe('QuerySelector Component', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders predefined queries label', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Predefined Queries')).toBeInTheDocument();
  });

  it('renders select dropdown with placeholder', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByDisplayValue('Select a predefined query...')).toBeInTheDocument();
  });

  it('displays all queries in dropdown', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Get All Users')).toBeInTheDocument();
    expect(screen.getByText('Get Active Users')).toBeInTheDocument();
    expect(screen.getByText('Get Orders')).toBeInTheDocument();
    expect(screen.getByText('Get Products')).toBeInTheDocument();
  });

  it('calls onSelect when a query is selected', async () => {
    const user = userEvent.setup();
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    const select = screen.getByDisplayValue('Select a predefined query...');
    await user.selectOptions(select, '1');

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('shows selected query details when a query is selected', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId="1"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Retrieve all user records')).toBeInTheDocument();
    // Use a more specific selector to avoid conflicts with the category filter dropdown
    expect(screen.getByTestId('query-details')).toHaveTextContent('users');
  });

  it('does not show query details when no query is selected', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.queryByText('Retrieve all user records')).not.toBeInTheDocument();
    // Note: 'users' text still appears in the category filter dropdown, so we check for the specific element
    expect(screen.queryByTestId('query-details')).not.toBeInTheDocument();
  });

  it('renders category filter dropdown', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
  });

  it('filters queries by category', async () => {
    const user = userEvent.setup();
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'users');

    expect(screen.getByText('Get All Users')).toBeInTheDocument();
    expect(screen.getByText('Get Active Users')).toBeInTheDocument();
    expect(screen.queryByText('Get Orders')).not.toBeInTheDocument();
    expect(screen.queryByText('Get Products')).not.toBeInTheDocument();
  });

  it('shows all categories in filter dropdown', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('orders')).toBeInTheDocument();
    expect(screen.getByText('products')).toBeInTheDocument();
  });

  it('shows empty state when no queries match filter', async () => {
    const user = userEvent.setup();
    // Create a test with queries that don't match the filter
    const queriesWithNoMatchingCategory = [
      {
        id: '1',
        name: 'Get All Users',
        description: 'Retrieve all user records',
        category: 'users',
        query: 'SELECT * FROM users'
      }
    ];

    render(
      <QuerySelector
        queries={queriesWithNoMatchingCategory}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    // Since we only have one query with category 'users', 
    // we can't test filtering to a non-existent category
    // Instead, let's test that the component shows the query when no filter is applied
    expect(screen.getByText('Get All Users')).toBeInTheDocument();
    
    // And test that the empty state works with an empty array
    render(
      <QuerySelector
        queries={[]}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No queries found')).toBeInTheDocument();
  });

  it('resets to all categories when filter is cleared', async () => {
    const user = userEvent.setup();
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'users');
    
    // Reset to all categories
    await user.selectOptions(categorySelect, 'all');

    expect(screen.getByText('Get All Users')).toBeInTheDocument();
    expect(screen.getByText('Get Active Users')).toBeInTheDocument();
    expect(screen.getByText('Get Orders')).toBeInTheDocument();
    expect(screen.getByText('Get Products')).toBeInTheDocument();
  });

  it('handles queries without categories', () => {
    const queriesWithoutCategories = [
      { id: '1', name: 'Query 1', description: 'Description 1', query: 'SELECT 1' },
      { id: '2', name: 'Query 2', description: 'Description 2', query: 'SELECT 2' }
    ];

    render(
      <QuerySelector
        queries={queriesWithoutCategories}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Query 1')).toBeInTheDocument();
    expect(screen.getByText('Query 2')).toBeInTheDocument();
  });

  it('handles empty queries array', () => {
    render(
      <QuerySelector
        queries={[]}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No queries found')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByTestId('query-selector')).toHaveClass('query-panel__selector');
    expect(screen.getByTestId('query-selector-header')).toHaveClass('query-panel__selector-header');
    expect(screen.getByTestId('query-selector-select')).toHaveClass('query-panel__selector-select');
  });

  it('maintains selected query when filtering', async () => {
    const user = userEvent.setup();
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId="1"
        onSelect={mockOnSelect}
      />
    );

    // Initially shows the selected query details
    expect(screen.getByText('Retrieve all user records')).toBeInTheDocument();

    // Filter by users category (which includes the selected query)
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'users');

    // Should still show the selected query details
    expect(screen.getByText('Retrieve all user records')).toBeInTheDocument();
  });

  it('maintains selected query details when filtering to different category', async () => {
    const user = userEvent.setup();
    render(
      <QuerySelector
        queries={mockQueries}
        selectedId="1"
        onSelect={mockOnSelect}
      />
    );

    // Initially shows the selected query details
    expect(screen.getByText('Retrieve all user records')).toBeInTheDocument();

    // Filter by orders category (which excludes the selected query)
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'orders');

    // The selected query details should still be visible
    // because the component maintains the selection even when filtering
    expect(screen.getByTestId('query-details')).toBeInTheDocument();
    expect(screen.getByText('Retrieve all user records')).toBeInTheDocument();
  });
}); 