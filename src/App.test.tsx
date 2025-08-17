import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockInitialState } from './__mocks__/testUtils';
import App from './App';

// Mock the lazy-loaded components
jest.mock('./components/QueryPanel/QueryPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="query-panel">Query Panel</div>,
}));

jest.mock('./components/ResultsPanel/ResultsPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="results-panel">Results Panel</div>,
}));

jest.mock('./components/QueryPanel/CollapsedQueryTab', () => ({
  __esModule: true,
  default: () => <div data-testid="collapsed-query-tab">Collapsed Query Tab</div>,
}));

jest.mock('./components/common/NotificationSystem', () => ({
  __esModule: true,
  default: () => <div data-testid="notification-system">Notification System</div>,
}));

describe('App Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Mock document.documentElement.setAttribute
    Object.defineProperty(document.documentElement, 'setAttribute', {
      value: jest.fn(),
      writable: true,
    });
  });

  it('renders without crashing', () => {
    render(<App />, { preloadedState: mockInitialState });
    
    expect(screen.getByTestId('query-panel')).toBeInTheDocument();
    expect(screen.getByTestId('results-panel')).toBeInTheDocument();
  });

  it('renders header with Atlan logo and title', () => {
    render(<App />, { preloadedState: mockInitialState });
    
    expect(screen.getByAltText('Atlan')).toBeInTheDocument();
    expect(screen.getByText('SQL Viewer')).toBeInTheDocument();
  });

  it('renders status bar', () => {
    render(<App />, { preloadedState: mockInitialState });
    
    // Status bar should be present
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies theme to document element', async () => {
    const setAttributeSpy = jest.spyOn(document.documentElement, 'setAttribute');
    
    render(<App />, { preloadedState: mockInitialState });
    
    await waitFor(() => {
      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
    });
  });

  it('handles theme changes correctly', async () => {
    const setAttributeSpy = jest.spyOn(document.documentElement, 'setAttribute');
    const stateWithDarkTheme = {
      ...mockInitialState,
      ui: {
        ...mockInitialState.ui,
        theme: 'dark' as const,
      },
    };

    render(<App />, { preloadedState: stateWithDarkTheme });
    
    await waitFor(() => {
      expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });
}); 