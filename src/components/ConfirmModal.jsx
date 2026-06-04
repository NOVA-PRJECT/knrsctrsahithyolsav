import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmStyle = {} }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(13, 25, 32, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-card animate-fade-up" style={{
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        background: 'var(--bg-card)'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: 'var(--gold-primary)' }}>{title}</h3>
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-outline-white" onClick={onCancel}>Cancel</button>
          <button 
            className="btn-primary" 
            style={{ background: 'var(--danger)', color: 'white', ...confirmStyle }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
