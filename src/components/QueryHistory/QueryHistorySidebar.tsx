import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  X, 
  Clock, 
  Play, 
  Copy, 
  Trash2,
  History
} from 'lucide-react';
import { 
  setCurrentQuery, 
  clearHistory 
} from '../../store/slices/querySlice';
import { addNotification } from '../../store/slices/uiSlice';
import { toggleHistory } from '../../store/slices/uiSlice';

const QueryHistorySidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryHistory = useAppSelector((state) => state.query.queryHistory);
  const showHistory = useAppSelector((state) => state.ui.showHistory);

  const handleClose = useCallback(() => {
    dispatch(toggleHistory());
  }, [dispatch]);

  const handleUseQuery = useCallback((query: string) => {
    dispatch(setCurrentQuery(query));
    dispatch(toggleHistory()); // Close the sidebar
    dispatch(addNotification({
      type: 'success',
      message: 'Query loaded into editor',
      duration: 3000
    }));
  }, [dispatch]);

  const handleCopyQuery = useCallback((query: string) => {
    navigator.clipboard.writeText(query);
    dispatch(toggleHistory()); // Close the sidebar
    dispatch(addNotification({
      type: 'success',
      message: 'Query copied to clipboard',
      duration: 3000
    }));
  }, [dispatch]);

  const handleClearHistory = useCallback(() => {
    dispatch(clearHistory());
    dispatch(addNotification({
      type: 'info',
      message: 'Query history cleared',
      duration: 3000
    }));
  }, [dispatch]);

  const formatTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  const formatExecutionTime = useCallback((executionTime: number) => {
    if (executionTime < 1000) {
      return `${executionTime.toFixed(0)}ms`;
    }
    return `${(executionTime / 1000).toFixed(2)}s`;
  }, []);

  const truncatedQuery = useCallback((query: string) => {
    const maxLength = 80;
    if (query.length <= maxLength) {
      return query;
    }
    return query.substring(0, maxLength) + '...';
  }, []);

  const memoizedHistoryItems = useMemo(() => {
    return queryHistory.map((item) => (
      <div key={item.id} className="query-history-item">
        <div className="query-history-item__header">
          <div className="query-history-item__timestamp">
            <Clock size={14} />
            <span>{formatTimestamp(item.timestamp)}</span>
          </div>
          {item.executionTime && (
            <div className="query-history-item__execution-time">
              {formatExecutionTime(item.executionTime)}
            </div>
          )}
        </div>
        
        <div className="query-history-item__query">
          {truncatedQuery(item.query)}
        </div>
        
        <div className="query-history-item__actions">
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => handleUseQuery(item.query)}
            title="Use this query"
            aria-label="Use this query"
          >
            <Play size={14} />
            <span>Use</span>
          </button>
          
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => handleCopyQuery(item.query)}
            title="Copy query"
            aria-label="Copy query"
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
        </div>
      </div>
    ));
  }, [queryHistory, formatTimestamp, formatExecutionTime, truncatedQuery, handleUseQuery, handleCopyQuery]);

  if (!showHistory) return null;

  return (
    <div className="query-history-sidebar" data-testid="query-history-sidebar">
      <div className="query-history-sidebar__header">
        <div className="query-history-sidebar__title">
          <History size={20} />
          <h2>Query History</h2>
        </div>
        
        <div className="query-history-sidebar__actions">
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleClearHistory}
            title="Clear history"
            aria-label="Clear history"
            disabled={queryHistory.length === 0}
          >
            <Trash2 size={16} />
          </button>
          
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleClose}
            title="Close history"
            aria-label="Close history"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="query-history-sidebar__content">
        {queryHistory.length === 0 ? (
          <div className="query-history-sidebar__empty">
            <History size={48} />
            <h3>No query history</h3>
            <p>Execute queries to see them here</p>
          </div>
        ) : (
          <div className="query-history-sidebar__list">
            {memoizedHistoryItems}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryHistorySidebar; 