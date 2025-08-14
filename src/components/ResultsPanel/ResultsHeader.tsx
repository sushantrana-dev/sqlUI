import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { Download, Settings } from 'lucide-react';
import { downloadData, generateFilename } from '../../utils/dataExport';
import { addNotification } from '../../store/slices/uiSlice';
import DownloadOptions from './DownloadOptions';

const ResultsHeader: React.FC = () => {
  const dispatch = useDispatch();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const executionTime = useSelector((state: RootState) => state.results.executionTime);
  const selectedRows = useSelector((state: RootState) => state.results.selectedRows);
  const currentQuery = useSelector((state: RootState) => state.query.currentQuery);

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time.toFixed(0)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  const handleQuickDownload = useCallback(async () => {
    if (!currentResults) {
      dispatch(addNotification({
        type: 'warning',
        message: 'No data available to export',
        duration: 3000
      }));
      return;
    }

    try {
      // Generate filename based on current query or default
      const queryName = currentQuery.trim() ? 'query_result' : 'sql_report';
      const filename = generateFilename(queryName, 'csv');
      
      // Download CSV with current data
      await downloadData(currentResults.data, currentResults.columns, {
        filename,
        selectedRows: selectedRows.length > 0 ? selectedRows : undefined,
        format: 'csv'
      });

      // Show success notification
      const rowCount = selectedRows.length > 0 ? selectedRows.length : currentResults.rowCount;
      const columnCount = currentResults.columns.length;
      
      dispatch(addNotification({
        type: 'success',
        message: `Exported ${rowCount.toLocaleString()} rows and ${columnCount} columns to ${filename}`,
        duration: 5000
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to export CSV file',
        duration: 5000
      }));
    }
  }, [currentResults, selectedRows, currentQuery, dispatch]);

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
              onClick={handleQuickDownload}
              title="Quick Download CSV"
              aria-label="Quick Download CSV"
            >
              <Download size={16} />
              <span className="btn__text">Download CSV</span>
            </button>
            
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowDownloadOptions(true)}
              title="Advanced Export Options"
              aria-label="Advanced Export Options"
            >
              <Settings size={16} />
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