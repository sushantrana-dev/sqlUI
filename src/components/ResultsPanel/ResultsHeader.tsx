import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { Download } from 'lucide-react';
import DownloadOptions from './DownloadOptions';

const ResultsHeader: React.FC = () => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const executionTime = useSelector((state: RootState) => state.results.executionTime);
  const selectedRows = useSelector((state: RootState) => state.results.selectedRows);

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time.toFixed(0)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <>
      <div className="results-panel__header">
        <div className="results-panel__header-info">
          {currentResults && (
            <>
              <div className="info-item">
                <span className="info-item__label">Rows:</span>
                <span className="info-item__value">
                  {currentResults.rowCount.toLocaleString()}
                  {selectedRows.length > 0 && (
                    <span className="info-item__selected">
                      ({selectedRows.length} selected)
                    </span>
                  )}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-item__label">Columns:</span>
                <span className="info-item__value">
                  {currentResults.columns.length}
                </span>
              </div>
              
              {executionTime && (
                <div className="info-item">
                  <span className="info-item__label">Time:</span>
                  <span className="info-item__value">
                    {formatExecutionTime(executionTime)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        {currentResults && (
          <div className="results-panel__header-actions">
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setShowDownloadOptions(true)}
              title="Export Data"
              aria-label="Export Data"
            >
              <Download size={16} />
              <span className="btn__text">Export</span>
            </button>
          </div>
        )}
      </div>
      
      <DownloadOptions 
        isOpen={showDownloadOptions} 
        onClose={() => setShowDownloadOptions(false)} 
      />
    </>
  );
};

export default ResultsHeader; 