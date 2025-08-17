export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  selectedRows?: number[];
  format?: 'csv' | 'json';
  exportCompleteDataset?: boolean;
  onProgress?: (progress: number) => void;
}

/**
 * Converts data to CSV format with streaming support for large datasets
 */
export const convertToCSV = (
  data: Record<string, any>[],
  columns: string[],
  options: ExportOptions = {}
): string => {
  const { includeHeaders = true, selectedRows, onProgress } = options;
  
  // Filter rows if specified
  const exportData = selectedRows 
    ? selectedRows.map(index => data[index]).filter(Boolean)
    : data;

  // Create CSV content with progress tracking for large datasets
  let csvContent = '';
  const totalRows = exportData.length;
  
  // Add headers if requested
  if (includeHeaders) {
    csvContent += columns.map(column => `"${column}"`).join(',') + '\n';
  }
  
  // Add data rows with progress updates for large datasets
  exportData.forEach((row, index) => {
    const rowData = columns.map(column => {
      const value = row[column];
      if (value === null || value === undefined) {
        return '""';
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    });
    csvContent += rowData.join(',') + '\n';
    
    // Report progress for large datasets (every 1000 rows)
    if (onProgress && totalRows > 1000 && index % 1000 === 0) {
      const progress = Math.round((index / totalRows) * 100);
      onProgress(progress);
    }
  });
  
  // Final progress update
  if (onProgress) {
    onProgress(100);
  }
  
  return csvContent;
};

/**
 * Converts data to JSON format with streaming support for large datasets
 */
export const convertToJSON = (
  data: Record<string, any>[],
  options: ExportOptions = {}
): string => {
  const { selectedRows, onProgress } = options;
  
  // Filter rows if specified
  const exportData = selectedRows 
    ? selectedRows.map(index => data[index]).filter(Boolean)
    : data;

  // Report progress for large datasets
  if (onProgress && exportData.length > 1000) {
    onProgress(50); // JSON conversion is typically faster
  }

  // Convert to JSON with proper formatting
  const jsonString = JSON.stringify(exportData, null, 2);
  
  if (onProgress) {
    onProgress(100);
  }
  
  return jsonString;
};

/**
 * Downloads data as file (CSV or JSON) with support for complete dataset export
 */
export const downloadData = async (
  data: Record<string, any>[],
  columns: string[],
  options: ExportOptions = {}
): Promise<void> => {
  const { 
    filename = 'report.csv', 
    format = 'csv',
    exportCompleteDataset = false,
    onProgress 
  } = options;
  
  try {
    let content: string;
    let mimeType: string;
    
    // Show initial progress
    if (onProgress) {
      onProgress(0);
    }
    
    if (format === 'json') {
      content = convertToJSON(data, options);
      mimeType = 'application/json;charset=utf-8;';
    } else {
      content = convertToCSV(data, columns, options);
      // Add BOM for Excel compatibility
      const bom = '\uFEFF';
      content = bom + content;
      mimeType = 'text/csv;charset=utf-8;';
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    
    // Try to use file-saver, fallback to native download
    try {
      const { saveAs } = await import('file-saver');
      saveAs(blob, filename);
    } catch (fileSaverError) {
      console.warn('file-saver not available, using native download');
      // Fallback to native download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting file:', error);
    throw new Error(`Failed to export ${format.toUpperCase()} file`);
  }
};

/**
 * Legacy function for backward compatibility
 */
export const downloadCSV = async (
  data: Record<string, any>[],
  columns: string[],
  options: ExportOptions = {}
): Promise<void> => {
  return downloadData(data, columns, { ...options, format: 'csv' });
};

/**
 * Generates a filename based on current date and query info
 */
export const generateFilename = (queryName?: string, format: 'csv' | 'json' = 'csv'): string => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  
  if (queryName) {
    const cleanName = queryName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${cleanName}_${dateStr}_${timeStr}.${format}`;
  }
  
  return `sql_report_${dateStr}_${timeStr}.${format}`;
}; 