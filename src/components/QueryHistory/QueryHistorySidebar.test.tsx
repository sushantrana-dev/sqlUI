import React from 'react';
import { render, screen } from '@testing-library/react';
import { render as customRender } from '../../__mocks__/testUtils';
import QueryHistorySidebar from './QueryHistorySidebar';

const mockHistory = [
  {
    id: 1,
    query: 'SELECT * FROM users',
    timestamp: '2023-01-01T10:00:00Z',
    executionTime: 150
  },
  {
    id: 2,
    query: 'SELECT * FROM orders WHERE status = "pending"',
    timestamp: '2023-01-01T11:00:00Z',
    executionTime: 200
  },
  {
    id: 3,
    query: 'SELECT COUNT(*) FROM products',
    timestamp: '2023-01-01T12:00:00Z',
    executionTime: 50
  }
];

describe('QueryHistorySidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock clipboard without redefining the property
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true,
      });
    } else {
      // If clipboard exists, just mock the writeText method
      jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders when showHistory is true', () => {
    customRender(<QueryHistorySidebar />, {
      preloadedState: {
        ui: { showHistory: true },
        query: { queryHistory: mockHistory }
      }
    });

    expect(screen.getByText('Query History')).toBeInTheDocument();
  });

  it('does not render when showHistory is false', () => {
    customRender(<QueryHistorySidebar />, {
      preloadedState: {
        ui: { showHistory: false },
        query: { queryHistory: mockHistory }
      }
    });

    expect(screen.queryByText('Query History')).not.toBeInTheDocument();
  });

  it('displays query history items', () => {
    customRender(<QueryHistorySidebar />, {
      preloadedState: {
        ui: { showHistory: true },
        query: { queryHistory: mockHistory }
      }
    });

    expect(screen.getByText('SELECT * FROM users')).toBeInTheDocument();
    expect(screen.getByText('SELECT * FROM orders WHERE status = "pending"')).toBeInTheDocument();
    expect(screen.getByText('SELECT COUNT(*) FROM products')).toBeInTheDocument();
  });

  it('shows empty state when no history', () => {
    customRender(<QueryHistorySidebar />, {
      preloadedState: {
        ui: { showHistory: true },
        query: { queryHistory: [] }
      }
    });

    expect(screen.getByText('No query history')).toBeInTheDocument();
  });

  it('formats execution time correctly', () => {
    customRender(<QueryHistorySidebar />, {
      preloadedState: {
        ui: { showHistory: true },
        query: { queryHistory: mockHistory }
      }
    });

    expect(screen.getByText('150ms')).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();
    expect(screen.getByText('50ms')).toBeInTheDocument();
  });
}); 