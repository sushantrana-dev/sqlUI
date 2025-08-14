import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ 
  component, 
  fallback = <div className="lazy-load-fallback">Loading...</div>,
  props = {}
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Predefined lazy components for common use cases
export const LazyQueryEditor = () => (
  <LazyLoad
    component={() => import('../QueryPanel/QueryEditor')}
    fallback={<div className="query-editor-loading">Loading Editor...</div>}
  />
);

export const LazyVirtualizedTable = (props: any) => (
  <LazyLoad
    component={() => import('../ResultsPanel/VirtualizedTable')}
    fallback={<div className="table-loading">Loading Table...</div>}
    props={props}
  />
);

export const LazyResultsPanel = () => (
  <LazyLoad
    component={() => import('../ResultsPanel/ResultsPanel')}
    fallback={<div className="results-loading">Loading Results...</div>}
  />
);

export const LazyQueryPanel = () => (
  <LazyLoad
    component={() => import('../QueryPanel/QueryPanel')}
    fallback={<div className="query-panel-loading">Loading Query Panel...</div>}
  />
);

export default LazyLoad; 