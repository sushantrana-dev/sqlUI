import React, { useCallback, useMemo, useState } from 'react';
import { Query } from '../../types';

interface QuerySelectorProps {
  queries: Query[];
  selectedId: string | null;
  onSelect: (queryId: string) => void;
}

const QuerySelector: React.FC<QuerySelectorProps> = React.memo(({ 
  queries, 
  selectedId, 
  onSelect 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Stable callback reference
  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const queryId = event.target.value;
    if (queryId) {
      onSelect(queryId);
    }
  }, [onSelect]);

  // Memoized selected query
  const selectedQuery = useMemo(() => {
    return queries.find(q => q.id === selectedId);
  }, [queries, selectedId]);

  // Memoized filtered and organized queries
  const { filteredQueries, categories } = useMemo(() => {
    let filtered = queries;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    // Get unique categories
    const cats = Array.from(new Set(queries.map(q => q.category).filter(Boolean)));
    
    return { filteredQueries: filtered, categories: cats };
  }, [queries, selectedCategory]);

  // Memoized options
  const options = useMemo(() => {
    return filteredQueries.map(query => (
      <option key={query.id} value={query.id}>
        {query.name}
      </option>
    ));
  }, [filteredQueries]);

  // Memoized category options
  const categoryOptions = useMemo(() => {
    return [
      <option key="all" value="all">All Categories</option>,
      ...categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))
    ];
  }, [categories]);

  return (
    <div className="query-panel__selector">
      <div className="query-panel__selector-header">
        <label className="query-panel__selector-label">
          Predefined Queries
        </label>
        
        <div className="query-panel__selector-controls">
          <select
            className="query-panel__selector-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            title="Filter by category"
          >
            {categoryOptions}
          </select>
        </div>
      </div>

      <select 
        className="query-panel__selector-select"
        value={selectedId || ''}
        onChange={handleSelectChange}
      >
        <option value="">Select a predefined query...</option>
        {options}
      </select>

      {selectedQuery && (
        <div className="query-panel__selector-details">
          <div className="query-panel__selector-description">
            {selectedQuery.description}
          </div>
          
          <div className="query-panel__selector-meta">
            {selectedQuery.category && (
              <span className="query-category">{selectedQuery.category}</span>
            )}
          </div>
        </div>
      )}

      {filteredQueries.length === 0 && (
        <div className="query-panel__selector-empty">
          No queries found
        </div>
      )}
    </div>
  );
});

QuerySelector.displayName = 'QuerySelector';

export default QuerySelector; 