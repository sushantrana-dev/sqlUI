import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockInitialState } from '../../__mocks__/testUtils';
import Header from './Header';

describe('Header Component', () => {
  const user = userEvent.setup();

  it('renders Atlan logo and title', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    expect(screen.getByAltText('Atlan')).toBeInTheDocument();
    expect(screen.getByText('SQL Viewer')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders history toggle button', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    const historyButton = screen.getByRole('button', { name: /show query history/i });
    expect(historyButton).toBeInTheDocument();
  });

  it('shows moon icon when theme is light', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeButton).toBeInTheDocument();
    // Moon icon should be present (lucide-react Moon component)
    expect(themeButton.querySelector('svg')).toBeInTheDocument();
  });

  it('shows sun icon when theme is dark', () => {
    const stateWithDarkTheme = {
      ...mockInitialState,
      ui: {
        ...mockInitialState.ui,
        theme: 'dark' as const,
      },
    };

    render(<Header />, { preloadedState: stateWithDarkTheme });
    
    const themeButton = screen.getByRole('button', { name: /switch to light mode/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', async () => {
    const { store } = render(<Header />, { preloadedState: mockInitialState });
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(themeButton);
    
    const state = store.getState();
    expect(state.ui.theme).toBe('dark');
  });

  it('toggles history visibility when history button is clicked', async () => {
    const { store } = render(<Header />, { preloadedState: mockInitialState });
    
    const historyButton = screen.getByRole('button', { name: /show query history/i });
    await user.click(historyButton);
    
    const state = store.getState();
    expect(state.ui.showHistory).toBe(true);
  });

  it('shows active state for history button when history is visible', () => {
    const stateWithHistoryVisible = {
      ...mockInitialState,
      ui: {
        ...mockInitialState.ui,
        showHistory: true,
      },
    };

    render(<Header />, { preloadedState: stateWithHistoryVisible });
    
    const historyButton = screen.getByRole('button', { name: /hide query history/i });
    expect(historyButton).toHaveClass('btn--active');
  });

  it('has correct accessibility attributes', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    const historyButton = screen.getByRole('button', { name: /show query history/i });
    
    expect(themeButton).toHaveAttribute('title', 'Switch to dark mode');
    expect(themeButton).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(historyButton).toHaveAttribute('title', 'Show Query History');
    expect(historyButton).toHaveAttribute('aria-label', 'Show Query History');
  });

  it('has correct CSS classes', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    expect(screen.getByRole('banner')).toHaveClass('app__header');
    expect(screen.getByTestId('header-brand')).toHaveClass('header__brand');
    expect(screen.getByTestId('header-actions')).toHaveClass('header__actions');
  });

  it('renders logo with correct dimensions', () => {
    render(<Header />, { preloadedState: mockInitialState });
    
    const logo = screen.getByAltText('Atlan');
    expect(logo).toHaveAttribute('width', '103');
    expect(logo).toHaveAttribute('height', '32');
    expect(logo).toHaveAttribute('loading', 'eager');
  });

  it('updates button text when theme changes', async () => {
    const { store } = render(<Header />, { preloadedState: mockInitialState });
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(themeButton);
    
    // Button should now show light mode option
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('updates button text when history visibility changes', async () => {
    const { store } = render(<Header />, { preloadedState: mockInitialState });
    
    const historyButton = screen.getByRole('button', { name: /show query history/i });
    await user.click(historyButton);
    
    // Button should now show hide option
    expect(screen.getByRole('button', { name: /hide query history/i })).toBeInTheDocument();
  });
}); 