import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ value, onChange, options, placeholder, disabled }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="input-field"
        style={{
          appearance: 'none',
          paddingRight: '40px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          color: value ? 'white' : 'var(--text-secondary)'
        }}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-primary)', color: 'white' }}>
            {opt.label}
          </option>
        ))}
      </select>
      <div style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'var(--gold-primary)'
      }}>
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default Select;
