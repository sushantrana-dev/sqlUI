import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { setTheme, toggleQueryPanel } from '../../store/slices/uiSlice';
import { Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react';
import AtlanLogo from '../../assets/Atlan-logo-full.svg';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isQueryPanelCollapsed = useSelector((state: RootState) => state.ui.isQueryPanelCollapsed);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="app__header">
      <div className="header__brand">
        <img src={AtlanLogo} alt="Atlan" className="header__brand-logo" />
        <h1 className="header__brand-title">SQL Runner</h1>
      </div>
      
      <div className="header__actions">
        <button
          className="btn btn--icon"
          onClick={() => dispatch(toggleQueryPanel())}
          title={isQueryPanelCollapsed ? 'Show Query Panel' : 'Hide Query Panel'}
          aria-label={isQueryPanelCollapsed ? 'Show Query Panel' : 'Hide Query Panel'}
        >
          {isQueryPanelCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <button 
          className="btn btn--icon"
          onClick={handleThemeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header; 