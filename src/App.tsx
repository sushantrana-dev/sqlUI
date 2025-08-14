import React, { useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './types';
import { initializePredefinedQueries } from './store/slices/querySlice';
import { toggleQueryPanel } from './store/slices/uiSlice';
import Header from './components/Layout/Header';
import StatusBar from './components/Layout/StatusBar';
import CollapsedQueryTab from './components/QueryPanel/CollapsedQueryTab';
import NotificationSystem from './components/common/NotificationSystem';

// Lazy load heavy components
const QueryPanel = lazy(() => import('./components/QueryPanel/QueryPanel'));
const ResultsPanel = lazy(() => import('./components/ResultsPanel/ResultsPanel'));

// Loading fallback components
const QueryPanelFallback = () => (
  <div className="query-panel-loading">
    <div className="loading-spinner" />
    <span>Loading Query Panel...</span>
  </div>
);

const ResultsPanelFallback = () => (
  <div className="results-panel-loading">
    <div className="loading-spinner" />
    <span>Loading Results Panel...</span>
  </div>
);

const App: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  
  // Memoized selectors
  const theme = useSelector((state: RootState) => state.ui.theme);
  const sidebarWidth = useSelector((state: RootState) => state.ui.sidebarWidth);
  const isQueryPanelCollapsed = useSelector((state: RootState) => state.ui.isQueryPanelCollapsed);

  // Stable callback references
  const handleInitializeQueries = useCallback(() => {
    dispatch(initializePredefinedQueries());
  }, [dispatch]);

  const handleToggleQueryPanel = useCallback(() => {
    dispatch(toggleQueryPanel());
  }, [dispatch]);

  const handleThemeChange = useCallback(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effects with stable dependencies
  useEffect(() => {
    handleInitializeQueries();
  }, [handleInitializeQueries]);

  useEffect(() => {
    handleThemeChange();
  }, [handleThemeChange]);

  // Memoized panel styles
  const queryPanelStyle = useMemo(() => ({
    flex: `0 0 ${sidebarWidth}%`
  }), [sidebarWidth]);

  // Memoized splitter button props
  const splitterButtonProps = useMemo(() => ({
    onClick: handleToggleQueryPanel,
    'aria-label': isQueryPanelCollapsed ? 'Expand query panel' : 'Collapse query panel',
    title: isQueryPanelCollapsed ? 'Expand query panel' : 'Collapse query panel'
  }), [handleToggleQueryPanel, isQueryPanelCollapsed]);

  // Memoized collapsed content
  const collapsedContent = useMemo(() => {
    if (isQueryPanelCollapsed) {
      return (
        <div className="query-collapsed-container">
          <CollapsedQueryTab />
        </div>
      );
    }
    return (
      <div className="query-panel" style={queryPanelStyle}>
        <Suspense fallback={<QueryPanelFallback />}>
          <QueryPanel />
        </Suspense>
      </div>
    );
  }, [isQueryPanelCollapsed, queryPanelStyle]);

  return (
    <div className="app">
      <Header />
      
      <main className="app__main">
        {collapsedContent}

        {/* Splitter with collapse/expand toggle */}
        <div className="splitter" role="separator" aria-orientation="vertical">
          <button
            className="splitter__toggle"
            {...splitterButtonProps}
          >
            {isQueryPanelCollapsed ? '›' : '‹'}
          </button>
        </div>

        <div className="results-panel">
          <Suspense fallback={<ResultsPanelFallback />}>
            <ResultsPanel />
          </Suspense>
        </div>
      </main>

      <StatusBar />
      
      {/* Global components */}
      <NotificationSystem />
    </div>
  );
});

App.displayName = 'App';

export default App; 