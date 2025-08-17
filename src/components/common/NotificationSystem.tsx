import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import { removeNotification } from '../../store/slices/uiSlice';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationSystem: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const [exitingNotifications, setExitingNotifications] = useState<Set<string>>(new Set());

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      const timeout = setTimeout(() => {
        handleRemoveNotification(notification.id);
      }, 5000); // 5 seconds
      timeouts.push(timeout);
    });

    // Cleanup timeouts when component unmounts or notifications change
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [notifications]);

  const handleRemoveNotification = useCallback((id: string) => {
    // Add to exiting set for animation
    setExitingNotifications(prev => new Set(prev).add(id));
    
    // Remove from Redux after animation completes
    setTimeout(() => {
      dispatch(removeNotification(id));
      setExitingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300); // Match animation duration
  }, [dispatch]);

  const handleClose = useCallback((id: string) => {
    handleRemoveNotification(id);
  }, [handleRemoveNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'info':
        return <Info size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'notification--success';
      case 'error':
        return 'notification--error';
      case 'warning':
        return 'notification--warning';
      case 'info':
        return 'notification--info';
      default:
        return 'notification--info';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container" data-testid="notification-system">
      {notifications.map((notification) => {
        const isExiting = exitingNotifications.has(notification.id);
        
        return (
          <div
            key={notification.id}
            className={`notification ${getNotificationClass(notification.type)} ${
              isExiting ? 'notification--exiting' : ''
            }`}
          >
            <div className="notification__icon">
              {getIcon(notification.type)}
            </div>
            <div className="notification__content">
              <div className="notification__message">
                {notification.message}
              </div>
            </div>
            <button
              className="notification__close"
              onClick={() => handleClose(notification.id)}
              aria-label="Close notification"
              title="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem; 