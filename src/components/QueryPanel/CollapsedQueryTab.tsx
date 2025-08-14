import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleQueryPanel } from '../../store/slices/uiSlice';

const CollapsedQueryTab: React.FC = () => {
  const dispatch = useDispatch();

  const handleExpand = () => dispatch(toggleQueryPanel());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleExpand();
    }
  };

  return (
    <div className="query-collapsed-tab" role="navigation" aria-label="Collapsed query panel">
      <button
        type="button"
        className="query-collapsed-tab__button"
        onClick={handleExpand}
        onKeyDown={handleKeyDown}
        aria-label="Expand Query Editor"
        data-testid="collapsed-query-tab"
      >
        <span className="query-collapsed-tab__text">QUERY EDITOR</span>
      </button>
    </div>
  );
};

export default CollapsedQueryTab;

