import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './types';
import { initializePredefinedQueries } from './store/slices/querySlice';
import { toggleQueryPanel } from './store/slices/uiSlice';
import Header from './components/Layout/Header';
import StatusBar from './components/Layout/StatusBar';
import QueryHistorySidebar from './components/QueryHistory/QueryHistorySidebar';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/main.scss';

// Lazy load components for better performance
const QueryPanel = React.lazy(() => import('./components/QueryPanel/QueryPanel'));
const ResultsPanel = React.lazy(() => import('./components/ResultsPanel/ResultsPanel'));
const CollapsedQueryTab = React.lazy(() => import('./components/QueryPanel/CollapsedQueryTab'));
const NotificationSystem = React.lazy(() => import('./components/common/NotificationSystem'));

// Fallback components
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

const CollapsedQueryTabFallback = () => (
  <div className="query-collapsed-loading">
    <div className="loading-spinner" />
    <span>Loading...</span>
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

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        
        <main className="app__main">
          {isQueryPanelCollapsed ? (
            <div className="query-collapsed-container">
              <Suspense fallback={<CollapsedQueryTabFallback />}>
                <CollapsedQueryTab />
              </Suspense>
            </div>
          ) : (
            <div className="query-panel" style={queryPanelStyle}>
              <Suspense fallback={<QueryPanelFallback />}>
                <QueryPanel />
              </Suspense>
            </div>
          )}
          
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
        
        {/* Query History Sidebar */}
        <QueryHistorySidebar />
        
        {/* Notification System */}
        <Suspense fallback={null}>
          <NotificationSystem />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

export default App; 