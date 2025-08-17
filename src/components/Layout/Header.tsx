import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { setTheme, toggleHistory } from '../../store/slices/uiSlice';
import { Sun, Moon, History } from 'lucide-react';
import AtlanLogo from '../../assets/Atlan-logo-full.svg';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const showHistory = useSelector((state: RootState) => state.ui.showHistory);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleHistoryToggle = () => {
    dispatch(toggleHistory());
  };

  return (
    <header className="app__header" role="banner">
      <div className="header__brand" data-testid="header-brand">
        <img 
          src={AtlanLogo} 
          alt="Atlan" 
          className="header__brand-logo"
          width="103"
          height="32"
          loading="eager"
        />
        <h1 className="header__brand-title">SQL Viewer</h1>
      </div>
      
      <div className="header__actions" data-testid="header-actions">
        <button 
          className="btn btn--icon"
          onClick={handleThemeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          data-testid="theme-toggle"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button
          className={`btn btn--icon ${showHistory ? 'btn--active' : ''}`}
          onClick={handleHistoryToggle}
          title={showHistory ? 'Hide Query History' : 'Show Query History'}
          aria-label={showHistory ? 'Hide Query History' : 'Show Query History'}
          data-testid="history-toggle"
        >
          <History size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header; 