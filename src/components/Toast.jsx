import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)';
  
  return (
    <div 
      className="animate-fade-up glass-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: bgColor,
        color: 'white',
        borderRadius: '8px',
        minWidth: '250px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ color: 'white', opacity: 0.8, cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
