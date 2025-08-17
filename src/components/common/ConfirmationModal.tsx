import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'var(--color-error)';
      case 'warning':
        return 'var(--color-warning)';
      case 'info':
        return 'var(--color-info)';
      default:
        return 'var(--color-warning)';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn--danger';
      case 'warning':
        return 'btn--warning';
      case 'info':
        return 'btn--primary';
      default:
        return 'btn--warning';
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={onClose} data-testid="modal-overlay">
      <div 
        className="confirmation-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
        data-testid="modal-content"
      >
        <div className="confirmation-modal__header" data-testid="modal-header">
          <div className="confirmation-modal__icon">
            <AlertTriangle size={20} style={{ color: getIconColor() }} data-testid="alert-icon" />
          </div>
          <h2 
            id="confirmation-modal-title"
            className="confirmation-modal__title"
          >
            {title}
          </h2>
          <button
            className="confirmation-modal__close"
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
          >
            <X size={16} data-testid="close-icon" />
          </button>
        </div>

        <div className="confirmation-modal__content" data-testid="modal-content-text">
          <p 
            id="confirmation-modal-message"
            className="confirmation-modal__message"
          >
            {message}
          </p>
        </div>

        <div className="confirmation-modal__footer" data-testid="modal-footer">
          <button
            className="btn btn--secondary"
            onClick={onClose}
            type="button"
            data-testid="cancel-button"
          >
            {cancelText}
          </button>
          <button
            className={`btn ${getConfirmButtonClass()}`}
            onClick={handleConfirm}
            type="button"
            autoFocus
            data-testid="confirm-button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 