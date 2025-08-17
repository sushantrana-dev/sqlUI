import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

// Component that throws an error in useEffect
const AsyncErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  React.useEffect(() => {
    if (shouldThrow) {
      throw new Error('Async error');
    }
  }, [shouldThrow]);

  return <div>Async content</div>;
};

describe('ErrorBoundary Component', () => {
  const originalConsoleError = console.error;
  const mockConsoleError = jest.fn();

  beforeAll(() => {
    console.error = mockConsoleError;
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    mockConsoleError.mockClear();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please refresh the page to try again.')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls window.location.reload when refresh button is clicked', () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText('Refresh Page');
    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('has correct CSS classes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toHaveClass('error-boundary');
    expect(screen.getByTestId('error-content')).toHaveClass('error-boundary__content');
  });

  it('handles multiple errors gracefully', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender with a different error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should still show error state
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('maintains error state after error occurs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should still show error state
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles different types of errors', () => {
    const TypeErrorComponent = () => {
      throw new TypeError('Type error');
    };

    render(
      <ErrorBoundary>
        <TypeErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles nested error boundaries', () => {
    render(
      <ErrorBoundary>
        <div>Outer content</div>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundary>
    );

    // Inner error boundary should catch the error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    // Outer content should still be visible
    expect(screen.getByText('Outer content')).toBeInTheDocument();
  });

  it('handles async errors in useEffect', () => {
    render(
      <ErrorBoundary>
        <AsyncErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles null children', () => {
    render(
      <ErrorBoundary>
        {null}
      </ErrorBoundary>
    );

    // Should render without error
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('handles undefined children', () => {
    render(
      <ErrorBoundary>
        {undefined}
      </ErrorBoundary>
    );

    // Should render without error
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('handles empty children', () => {
    render(
      <ErrorBoundary>
        {[]}
      </ErrorBoundary>
    );

    // Should render without error
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('handles complex nested children', () => {
    render(
      <ErrorBoundary>
        <div>
          <span>Nested content</span>
          <div>
            <p>Deep nested content</p>
          </div>
        </div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Nested content')).toBeInTheDocument();
    expect(screen.getByText('Deep nested content')).toBeInTheDocument();
  });
}); 