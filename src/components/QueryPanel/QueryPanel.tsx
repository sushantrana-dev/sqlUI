import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setCurrentQuery, 
  selectPredefinedQuery, 
  executeQuery 
} from '../../store/slices/querySlice';
import QuerySelector from './QuerySelector';
import QueryEditor from './QueryEditor';
import QueryActions from './QueryActions';

const QueryPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  
  // Memoized selectors to prevent unnecessary re-renders
  const { 
    currentQuery, 
    predefinedQueries, 
    isExecuting, 
    selectedQueryId 
  } = useAppSelector((state) => state.query);

  // Memoized computed values
  const hasQuery = useMemo(() => {
    return !!currentQuery.trim();
  }, [currentQuery]);

  // Stable callback references using useCallback
  const handleQueryChange = useCallback((value: string) => {
    dispatch(setCurrentQuery(value));
  }, [dispatch]);

  const handleExecuteQuery = useCallback(() => {
    if (currentQuery.trim() && !isExecuting) {
      dispatch(executeQuery(currentQuery));
    }
  }, [currentQuery, isExecuting, dispatch]);

  const handleQuerySelect = useCallback((queryId: string) => {
    dispatch(selectPredefinedQuery(queryId));
  }, [dispatch]);

  // Memoized component props to prevent child re-renders
  const querySelectorProps = useMemo(() => ({
    queries: predefinedQueries,
    selectedId: selectedQueryId,
    onSelect: handleQuerySelect
  }), [predefinedQueries, selectedQueryId, handleQuerySelect]);

  const queryEditorProps = useMemo(() => ({
    value: currentQuery,
    onChange: handleQueryChange,
    onExecute: handleExecuteQuery
  }), [currentQuery, handleQueryChange, handleExecuteQuery]);

  const queryActionsProps = useMemo(() => ({
    onExecute: handleExecuteQuery,
    isExecuting,
    hasQuery
  }), [handleExecuteQuery, isExecuting, hasQuery]);

  return (
    <>
      <QuerySelector {...querySelectorProps} />
      <QueryEditor {...queryEditorProps} />
      <QueryActions {...queryActionsProps} />
    </>
  );
});

QueryPanel.displayName = 'QueryPanel';

export default QueryPanel; 