import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './types';
import { initializePredefinedQueries } from './store/slices/querySlice';
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

  return (
    <ErrorBoundary data-testid="error-boundary">
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
            <div className="query-panel" style={queryPanelStyle} data-testid="query-panel">
              <Suspense fallback={<QueryPanelFallback />}>
                <QueryPanel />
              </Suspense>
            </div>
          )}
          
          <div className="results-panel" data-testid="results-panel">
            <Suspense fallback={<ResultsPanelFallback />}>
              <ResultsPanel />
            </Suspense>
          </div>
        </main>
        
        <StatusBar />
        
        {/* Query History Sidebar */}
        <QueryHistorySidebar data-testid="query-history-sidebar" />
        
        {/* Notification System */}
        <Suspense fallback={null}>
          <NotificationSystem data-testid="notification-system" />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

export default App; 