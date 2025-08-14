import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { Download, X } from 'lucide-react';
import { downloadData, generateFilename } from '../../utils/dataExport';
import { addNotification } from '../../store/slices/uiSlice';

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
    customFilename: '',
    format: 'csv' as 'csv' | 'json'
  });

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
      // Generate filename
      const defaultFilename = generateFilename(currentQuery.trim() ? 'query_result' : 'sql_report', exportOptions.format);
      const filename = exportOptions.customFilename || defaultFilename;
      
      // Determine what to export
      const exportRows = exportOptions.exportSelectedRows && selectedRows.length > 0 
        ? selectedRows 
        : undefined;

      // Download file
      await downloadData(currentResults.data, currentResults.columns, {
        filename,
        includeHeaders: exportOptions.includeHeaders,
        selectedRows: exportRows,
        format: exportOptions.format
      });

      // Show success notification
      const rowCount = exportRows ? exportRows.length : currentResults.rowCount;
      const columnCount = currentResults.columns.length;
      const formatUpper = exportOptions.format.toUpperCase();
      
      dispatch(addNotification({
        type: 'success',
        message: `Exported ${rowCount.toLocaleString()} rows and ${columnCount} columns to ${filename} (${formatUpper})`,
        duration: 5000
      }));

      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: `Failed to export ${exportOptions.format.toUpperCase()} file`,
        duration: 5000
      }));
    }
  }, [currentResults, selectedRows, currentQuery, exportOptions, dispatch, onClose]);

  if (!isOpen) return null;

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
                />
                Export only selected rows ({selectedRows.length} rows)
              </label>
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
            />
          </div>
        </div>

        <div className="download-options-footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleDownload}>
            <Download size={16} />
            Export {exportOptions.format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions; 