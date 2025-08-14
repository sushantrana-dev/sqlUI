import React from 'react';
import { Database } from 'lucide-react';

const ResultsEmpty: React.FC = () => {
  return (
    <div className="results-panel__empty">
      <Database size={64} className="results-panel__empty-icon" />
      <h3 className="results-panel__empty-title">No Results</h3>
      <p className="results-panel__empty-description">
        Execute a query to see results here. Use the predefined queries or write your own SQL.
      </p>
    </div>
  );
};

export default ResultsEmpty; 