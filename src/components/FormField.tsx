import type { ReactNode, CSSProperties } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}

function FormField({ label, children, style }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default FormField;
