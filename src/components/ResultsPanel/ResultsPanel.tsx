import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import ResultsHeader from './ResultsHeader';
import DataTable from './DataTable';
import ResultsEmpty from './ResultsEmpty';

const ResultsPanel: React.FC = () => {
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const isExecuting = useSelector((state: RootState) => state.query.isExecuting);

  if (isExecuting) {
    return (
      <div className="results-panel">
        <ResultsHeader />
        <div className="results-panel__table-container">
          <div className="data-table__loading">
            <div className="data-table__loading-spinner" />
            <div className="data-table__loading-text">Executing query...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResults) {
    return (
      <div className="results-panel">
        <ResultsHeader />
        <div className="results-panel__table-container">
          <ResultsEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <ResultsHeader />
      <div className="results-panel__table-container">
        <DataTable />
      </div>
    </div>
  );
};

export default ResultsPanel; 