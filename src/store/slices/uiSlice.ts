import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Theme, Notification } from '../../types';

const initialState: UIState = {
  theme: 'light',
  sidebarWidth: 40,
  showHistory: false,
  notifications: [],
  isQueryPanelCollapsed: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = Math.max(20, Math.min(80, action.payload));
    },
    toggleHistory: (state) => {
      state.showHistory = !state.showHistory;
    },
    toggleQueryPanel: (state) => {
      state.isQueryPanelCollapsed = !state.isQueryPanelCollapsed;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        ...action.payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  setTheme,
  setSidebarWidth,
  toggleHistory,
  toggleQueryPanel,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer; 