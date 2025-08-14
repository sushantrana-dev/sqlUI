import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { Clock, Database, Zap } from 'lucide-react';

const StatusBar: React.FC = () => {
  const isExecuting = useSelector((state: RootState) => state.query.isExecuting);
  const executionTime = useSelector((state: RootState) => state.results.executionTime);
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const queryHistory = useSelector((state: RootState) => state.query.queryHistory);

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time.toFixed(0)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="app__status-bar">
      <div className="status-bar__left">
        <div className="status-bar__item">
          <Database size={14} className="status-bar__item-icon" />
          <span className="status-bar__item-label">Queries:</span>
          <span className="status-bar__item-value">{queryHistory.length}</span>
        </div>
        
        {currentResults && (
          <div className="status-bar__item">
            <Zap size={14} className="status-bar__item-icon" />
            <span className="status-bar__item-label">Rows:</span>
            <span className="status-bar__item-value">{currentResults.rowCount.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="status-bar__right">
        {isExecuting && (
          <div className="status-bar__item">
            <Clock size={14} className="status-bar__item-icon" />
            <span className="status-bar__item-label">Executing...</span>
          </div>
        )}
        
        {executionTime && !isExecuting && (
          <div className="status-bar__item">
            <Clock size={14} className="status-bar__item-icon" />
            <span className="status-bar__item-label">Time:</span>
            <span className="status-bar__item-value">{formatExecutionTime(executionTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar; 