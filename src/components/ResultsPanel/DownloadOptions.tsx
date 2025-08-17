import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { Download, X, AlertTriangle } from 'lucide-react';
import { downloadData, generateFilename } from '../../utils/dataExport';
import { addNotification } from '../../store/slices/uiSlice';
import { executeQueryForExport } from '../../store/slices/querySlice';

interface DownloadOptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const selectedRows = useSelector((state: RootState) => state.results.selectedRows);
  const currentQuery = useSelector((state: RootState) => state.query.currentQuery);

  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    exportSelectedRows: selectedRows.length > 0,
    exportCompleteDataset: false,
    customFilename: '',
    format: 'csv' as 'csv' | 'json'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleDownload = useCallback(async () => {
    if (!currentResults) {
      dispatch(addNotification({
        type: 'warning',
        message: 'No data available to export',
        duration: 3000
      }));
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress(0);

      // Generate filename
      const defaultFilename = generateFilename(currentQuery.trim() ? 'query_result' : 'sql_report', exportOptions.format);
      const filename = exportOptions.customFilename || defaultFilename;
      
      // Determine what to export
      const exportRows = exportOptions.exportSelectedRows && selectedRows.length > 0 
        ? selectedRows 
        : undefined;

      let dataToExport = currentResults.data;
      let columnsToExport = currentResults.columns;
      let rowCount = currentResults.rowCount;

      // If exporting complete dataset, fetch all data
      if (exportOptions.exportCompleteDataset && !exportRows) {
        dispatch(addNotification({
          type: 'info',
          message: 'Fetching complete dataset for export...',
          duration: 3000
        }));

        const completeResult = await dispatch(executeQueryForExport(currentQuery) as any).unwrap();
        dataToExport = completeResult.data;
        columnsToExport = completeResult.columns;
        rowCount = completeResult.totalCount;

        dispatch(addNotification({
          type: 'success',
          message: `Fetched ${rowCount.toLocaleString()} rows for export`,
          duration: 3000
        }));
      }

      // Download file with progress tracking
      await downloadData(dataToExport, columnsToExport, {
        filename,
        includeHeaders: exportOptions.includeHeaders,
        selectedRows: exportRows,
        format: exportOptions.format,
        onProgress: (progress) => {
          setExportProgress(progress);
        }
      });

      // Show success notification
      const finalRowCount = exportRows ? exportRows.length : rowCount;
      const columnCount = columnsToExport.length;
      const formatUpper = exportOptions.format.toUpperCase();
      
      dispatch(addNotification({
        type: 'success',
        message: `Exported ${finalRowCount.toLocaleString()} rows and ${columnCount} columns to ${filename} (${formatUpper})`,
        duration: 5000
      }));

      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: `Failed to export ${exportOptions.format.toUpperCase()} file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000
      }));
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [currentResults, selectedRows, currentQuery, exportOptions, dispatch, onClose]);

  if (!isOpen) return null;

  const showCompleteDatasetWarning = exportOptions.exportCompleteDataset && currentResults?.totalCount && currentResults.totalCount > 10000;

  return (
    <div className="download-options-overlay" onClick={onClose}>
      <div className="download-options-modal" onClick={(e) => e.stopPropagation()}>
        <div className="download-options-header">
          <h3>Export Options</h3>
          <button className="download-options-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="download-options-content">
          <div className="download-option">
            <label htmlFor="export-format">Export Format:</label>
            <select
              id="export-format"
              value={exportOptions.format}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                format: e.target.value as 'csv' | 'json' 
              }))}
              disabled={isExporting}
            >
              <option value="csv">CSV (Excel compatible)</option>
              <option value="json">JSON (Structured data)</option>
            </select>
          </div>

          {exportOptions.format === 'csv' && (
            <div className="download-option">
              <label>
                <input
                  type="checkbox"
                  checked={exportOptions.includeHeaders}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                  disabled={isExporting}
                />
                Include column headers
              </label>
            </div>
          )}

          {selectedRows.length > 0 && (
            <div className="download-option">
              <label>
                <input
                  type="checkbox"
                  checked={exportOptions.exportSelectedRows}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, exportSelectedRows: e.target.checked }))}
                  disabled={isExporting}
                />
                Export only selected rows ({selectedRows.length} rows)
              </label>
            </div>
          )}

          {!exportOptions.exportSelectedRows && currentResults && (
            <div className="download-option">
              <label>
                <input
                  type="checkbox"
                  checked={exportOptions.exportCompleteDataset}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, exportCompleteDataset: e.target.checked }))}
                  disabled={isExporting}
                />
                Export complete dataset ({currentResults.totalCount?.toLocaleString() || 'Unknown'} rows)
              </label>
              {!exportOptions.exportCompleteDataset && (
                <div className="download-option-hint">
                  Currently showing {currentResults.rowCount} of {currentResults.totalCount?.toLocaleString() || 'Unknown'} rows
                </div>
              )}
            </div>
          )}

          {showCompleteDatasetWarning && (
            <div className="download-option-warning">
              <AlertTriangle size={16} />
              <span>Large dataset detected. Export may take some time and use significant memory.</span>
            </div>
          )}

          <div className="download-option">
            <label htmlFor="custom-filename">Custom filename (optional):</label>
            <input
              id="custom-filename"
              type="text"
              placeholder={`Enter custom filename... (will add .${exportOptions.format})`}
              value={exportOptions.customFilename}
              onChange={(e) => setExportOptions(prev => ({ ...prev, customFilename: e.target.value }))}
              disabled={isExporting}
            />
          </div>

          {isExporting && (
            <div className="download-option-progress">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <div className="progress-text">
                Exporting... {exportProgress}%
              </div>
            </div>
          )}
        </div>

        <div className="download-options-footer">
          <button className="btn btn--secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button 
            className="btn btn--primary" 
            onClick={handleDownload}
            disabled={isExporting}
          >
            <Download size={16} />
            {isExporting ? 'Exporting...' : `Export ${exportOptions.format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions; 