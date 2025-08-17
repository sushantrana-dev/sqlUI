import React, { useCallback, useMemo, useState } from 'react';
import { useAppDispatch } from '../../store';
import { 
  Play, 
  Trash2, 
  Copy,
  ChevronLeft
} from 'lucide-react';
import { 
  copyCurrentQuery,
  clearQuery
} from '../../store/slices/querySlice';
import { clearResults } from '../../store/slices/resultsSlice';
import { addNotification, toggleQueryPanel } from '../../store/slices/uiSlice';
import ConfirmationModal from '../common/ConfirmationModal';

interface QueryActionsProps {
  onExecute: () => void;
  isExecuting: boolean;
  hasQuery: boolean;
}

const QueryActions: React.FC<QueryActionsProps> = React.memo(({ 
  onExecute, 
  isExecuting, 
  hasQuery 
}) => {
  const dispatch = useAppDispatch();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  


  // Stable callback references
  const handleExecute = useCallback(() => {
    if (hasQuery && !isExecuting) {
      onExecute();
    }
  }, [onExecute, hasQuery, isExecuting]);

  const handleClearClick = useCallback(() => {
    if (hasQuery && !isExecuting) {
      setShowClearConfirmation(true);
    }
  }, [hasQuery, isExecuting]);

  const handleClearConfirm = useCallback(() => {
    // Clear both query and results
    dispatch(clearQuery());
    dispatch(clearResults());
    dispatch(addNotification({
      type: 'info',
      message: 'Query and results cleared',
      duration: 3000
    }));
  }, [dispatch]);

  const handleClearCancel = useCallback(() => {
    setShowClearConfirmation(false);
  }, []);

  const handleCopyQuery = useCallback(() => {
    if (hasQuery) {
      dispatch(copyCurrentQuery());
      dispatch(addNotification({
        type: 'success',
        message: 'Query copied to clipboard',
        duration: 3000
      }));
    } else {
      dispatch(addNotification({
        type: 'warning',
        message: 'No query to copy',
        duration: 3000
      }));
    }
  }, [dispatch, hasQuery]);

  const handleCollapse = useCallback(() => {
    dispatch(toggleQueryPanel());
  }, [dispatch]);

  // Memoized button states
  const executeButtonDisabled = useMemo(() => {
    return !hasQuery || isExecuting;
  }, [hasQuery, isExecuting]);

  const clearButtonDisabled = useMemo(() => {
    return !hasQuery || isExecuting;
  }, [hasQuery, isExecuting]);

  // Memoized status text
  const statusText = useMemo(() => {
    if (isExecuting) return 'Executing...';
    if (hasQuery) return 'Ready';
    return 'No query';
  }, [isExecuting, hasQuery]);

  return (
    <>
      <div className="query-panel__actions">
        <div className="query-panel__actions-left">
          <button 
            className={`btn btn--primary ${isExecuting ? 'btn--loading' : ''}`}
            onClick={handleExecute}
            disabled={executeButtonDisabled}
            aria-label="Execute query"
            title="Execute query"
          >
            <div className="btn--content">
              <Play size={16} />
              Execute
            </div>
          </button>
          
          <button 
            className="btn btn--secondary"
            onClick={handleClearClick}
            disabled={clearButtonDisabled}
            aria-label="Clear query"
            title="Clear query"
          >
            <Trash2 size={16} />
            Clear
          </button>

          <div className="query-panel__actions-divider" />

          <button 
            className="btn btn--secondary btn--sm"
            onClick={handleCopyQuery}
            disabled={!hasQuery || isExecuting}
            aria-label="Copy query"
            title="Copy query to clipboard"
          >
            <Copy size={14} />
          </button>
        </div>
        
        <div className="query-panel__actions-right">
          <div className="query-panel__status">
            <div 
              className={`query-panel__status-indicator ${
                isExecuting ? 'query-panel__status-indicator--executing' : ''
              }`}
            />
            <span>{statusText}</span>
          </div>
          
          <div className="query-panel__actions-divider" />
          
          <button 
            className="btn btn--ghost btn--sm"
            onClick={handleCollapse}
            aria-label="Collapse query panel"
            title="Collapse query panel"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={handleClearCancel}
        onConfirm={handleClearConfirm}
        title="Clear Query"
        message="This will clear the current query and all results from the table. This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
});

QueryActions.displayName = 'QueryActions';

export default QueryActions; 