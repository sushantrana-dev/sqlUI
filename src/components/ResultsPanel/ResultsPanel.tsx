import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import ResultsHeader from './ResultsHeader';
import DataTable from './DataTable';
import ResultsEmpty from './ResultsEmpty';
import PaginationControls from './PaginationControls';

const ResultsPanel: React.FC = () => {
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const isExecuting = useSelector((state: RootState) => state.query.isExecuting);

  if (isExecuting) {
    return (
      <div className="results-panel" data-testid="results-panel">
        <ResultsHeader />
        <div className="results-panel__table-container" data-testid="table-container">
          <div className="data-table__loading" data-testid="loading-container">
            <div className="data-table__loading-spinner" data-testid="loading-spinner" />
            <div className="data-table__loading-text" data-testid="loading-text">Executing query...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResults) {
    return (
      <div className="results-panel" data-testid="results-panel">
        <ResultsHeader />
        <div className="results-panel__table-container" data-testid="table-container">
          <ResultsEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel" data-testid="results-panel">
      <ResultsHeader />
      <div className="results-panel__table-container" data-testid="table-container">
        <DataTable />
      </div>
      <PaginationControls />
    </div>
  );
};

export default ResultsPanel; 