import React from 'react';
import { useDispatch } from 'react-redux';
import { Database, ChevronRight } from 'lucide-react';
import { toggleQueryPanel } from '../../store/slices/uiSlice';

const CollapsedQueryTab: React.FC = () => {
  const dispatch = useDispatch();

  const handleExpand = () => dispatch(toggleQueryPanel());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleExpand();
    }
  };

  return (
    <div 
      className="query-collapsed-tab" 
      role="button"
      tabIndex={0}
      onClick={handleExpand}
      onKeyDown={handleKeyDown}
      aria-label="Expand query editor"
      data-testid="collapsed-query-tab"
    >
      <div className="query-collapsed-tab__content">
        <div className="query-collapsed-tab__icon">
          <Database size={20} />
        </div>
        <div className="query-collapsed-tab__text">
          <span className="query-collapsed-tab__title">Query Editor</span>
          <span className="query-collapsed-tab__subtitle">Click to expand</span>
        </div>
        <div className="query-collapsed-tab__arrow">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default CollapsedQueryTab;

