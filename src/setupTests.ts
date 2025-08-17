import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, theme, ...props }: any) => {
    const React = require('react');
    return React.createElement('div', {
      'data-testid': 'monaco-editor',
      'data-value': value,
      'data-theme': theme,
      ...props
    }, React.createElement('textarea', {
      'data-testid': 'monaco-textarea',
      value: value || '',
      onChange: (e: any) => onChange && onChange(e.target.value),
      style: { width: '100%', height: '200px' }
    }));
  },
}));

// Mock react-window
jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, height, itemSize, ...props }: any) => {
    const React = require('react');
    const items = Array.from({ length: itemCount }, (_, index) =>
      React.createElement('div', {
        key: index,
        style: { height: itemSize }
      }, children({ index, style: { height: itemSize } }))
    );
    return React.createElement('div', {
      'data-testid': 'virtualized-list',
      ...props
    }, ...items);
  },
  VariableSizeList: ({ children, itemCount, height, itemSize, ...props }: any) => {
    const React = require('react');
    const items = Array.from({ length: itemCount }, (_, index) =>
      React.createElement('div', {
        key: index,
        style: { height: itemSize }
      }, children({ index, style: { height: itemSize } }))
    );
    return React.createElement('div', {
      'data-testid': 'virtualized-list',
      ...props
    }, ...items);
  },
}));

// Suppress React warnings about act() and other non-critical warnings
const originalError = console.error;
console.error = (...args: any[]) => {
  const message = args[0];
  
  // Suppress specific React warnings that are not critical for our tests
  if (
    typeof message === 'string' &&
    (
      message.includes('Warning: A suspended resource finished loading inside a test') ||
      message.includes('Warning: An update to') ||
      message.includes('Warning: ReactDOM.render is no longer supported') ||
      message.includes('Warning: componentWillReceiveProps has been renamed') ||
      message.includes('Warning: componentWillUpdate has been renamed') ||
      message.includes('Warning: componentWillMount has been renamed')
    )
  ) {
    return;
  }
  
  originalError.call(console, ...args);
};

// Mock window.location.reload only if it doesn't exist
if (!window.location.reload) {
  Object.defineProperty(window, 'location', {
    value: {
      reload: jest.fn(),
    },
    writable: true,
  });
} 