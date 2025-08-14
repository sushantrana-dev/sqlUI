import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { toggleQueryPanel } from '../../store/slices/uiSlice';
import { PanelLeft } from 'lucide-react';

const CollapsedQueryBar: React.FC = () => {
  const dispatch = useDispatch();
  const currentQuery = useSelector((s: RootState) => s.query.currentQuery);

  const preview = useMemo(() => {
    const text = (currentQuery || '').trim();
    if (!text) return 'No query';
    const firstLine = text.split('\n')[0];
    return firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine;
  }, [currentQuery]);

  const handleExpand = () => {
    dispatch(toggleQueryPanel());
  };

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleExpand();
    }
  };

  return (
    <div className="query-bar query-bar--collapsed" aria-label="Collapsed query panel">
      <button
        type="button"
        className="query-bar__button"
        onClick={handleExpand}
        onKeyDown={handleKey}
        aria-label="Expand query panel"
        data-testid="expand-query-panel"
        title={preview}
      >
        <PanelLeft size={16} />
        <span className="query-bar__label">Query</span>
      </button>
      <div className="query-bar__preview" aria-hidden>
        {preview}
      </div>
    </div>
  );
};

export default CollapsedQueryBar;

