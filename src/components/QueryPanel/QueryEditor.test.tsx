import React from 'react';
import { screen } from '@testing-library/react';
import { render, mockInitialState } from '../../__mocks__/testUtils';
import QueryEditor from './QueryEditor';

describe('QueryEditor Component', () => {
  it('renders query editor container', () => {
    render(
      <QueryEditor
        value="SELECT * FROM users"
        onChange={() => {}}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByTestId('query-editor-container')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(
      <QueryEditor
        value="SELECT * FROM users"
        onChange={() => {}}
      />,
      { preloadedState: mockInitialState }
    );
    
    expect(screen.getByTestId('query-editor-container')).toHaveClass('query-panel__editor');
  });
}); 