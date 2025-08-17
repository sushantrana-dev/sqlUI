import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = React.memo(({ 
  value, 
  onChange 
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme);

  const handleEditorChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  const handleEditorDidMount = useCallback(() => {
    // Store editor reference if needed for future use
    // editor.focus();
  }, []);

  return (
    <div className="query-panel__editor" data-testid="query-editor-container">
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          quickSuggestionsDelay: 10,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
            showClasses: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showWords: true,
            showUsers: true,
            showIssues: true,
          }
        }}
        data-testid="query-editor"
      />
    </div>
  );
});

export default QueryEditor; 