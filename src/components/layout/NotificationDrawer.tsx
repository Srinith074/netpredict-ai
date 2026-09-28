import React from 'react';
import { X, CheckCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveNav,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.25)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '380px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              SOC Notifications
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllNotificationsRead}
              className="btn btn-secondary btn-sm"
              title="Mark All Read"
            >
              <CheckCheck size={13} />
              <span>Mark Read</span>
            </button>
            <button onClick={onClose} className="btn-icon">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No notifications at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((notif) => {
                let icon = <Info size={16} color="var(--accent-primary)" />;
                let borderCol = 'var(--border-subtle)';

                if (notif.severity === 'critical') {
                  icon = <ShieldAlert size={16} color="var(--status-critical-solid)" />;
                  borderCol = 'var(--status-critical-border)';
                } else if (notif.severity === 'medium') {
                  icon = <AlertTriangle size={16} color="var(--status-warning-solid)" />;
                  borderCol = 'var(--status-warning-border)';
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.navTarget) {
                        setActiveNav(notif.navTarget);
                        onClose();
                      }
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${notif.read ? 'var(--border-subtle)' : borderCol}`,
                      backgroundColor: notif.read ? 'var(--bg-surface)' : 'var(--bg-surface-subtle)',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s ease',
                      position: 'relative',
                    }}
                  >
                    {!notif.read && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                        }}
                      />
                    )}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '2px' }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '12px' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                          {notif.description}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }} className="font-mono">
                          {notif.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
