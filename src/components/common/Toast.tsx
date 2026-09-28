import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        let icon = <Info size={16} color="var(--accent-primary)" />;
        let borderColor = 'var(--border-subtle)';
        let bg = 'var(--bg-surface)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={16} color="var(--status-healthy-solid)" />;
          borderColor = 'var(--status-healthy-border)';
          bg = '#ffffff';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={16} color="var(--status-warning-solid)" />;
          borderColor = 'var(--status-warning-border)';
          bg = '#ffffff';
        } else if (toast.type === 'error') {
          icon = <AlertOctagon size={16} color="var(--status-critical-solid)" />;
          borderColor = 'var(--status-critical-border)';
          bg = '#ffffff';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: bg,
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              {toast.message && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ padding: '2px', color: 'var(--text-subtle)' }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
