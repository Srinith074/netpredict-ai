import React from 'react';
import {
  X,
  ShieldAlert,
  Terminal,
  Cpu,
  CheckCircle2,
  Ban,
  Download,
  AlertTriangle,
  Globe,
  Radio,
} from 'lucide-react';
import { ThreatEvent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';

interface ThreatDetailDrawerProps {
  threat: ThreatEvent | null;
  onClose: () => void;
}

export const ThreatDetailDrawer: React.FC<ThreatDetailDrawerProps> = ({ threat, onClose }) => {
  const { updateThreatStatus, addToast } = useApp();

  if (!threat) return null;

  const handleIsolateIp = () => {
    updateThreatStatus(threat.id, 'blocked');
    addToast('Source IP Isolated', `BGP flowspec drop rule pushed for ${threat.sourceIp} to perimeter routers.`, 'warning');
  };

  const handleMarkMitigated = () => {
    updateThreatStatus(threat.id, 'mitigated');
    addToast('Threat Mitigated', `Threat ${threat.id} resolved and marked safe.`, 'success');
  };

  const handleExportPcap = () => {
    // Generate dummy pcap download file
    const element = document.createElement('a');
    const file = new Blob([threat.rawPayloadSnippet || 'NetPredict PCAP Capture Header 0x12 0x34'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${threat.id}_capture.pcap`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('PCAP Exported', `Packet capture file ${threat.id}_capture.pcap downloaded.`, 'info');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 990,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.22)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.25s var(--ease-apple)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '540px',
          maxWidth: '92vw',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          borderTopLeftRadius: '20px',
          borderBottomLeftRadius: '20px',
          overflow: 'hidden',
          animation: 'slideInRight 0.22s var(--ease-apple)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }} className="font-mono">
                {threat.id}
              </span>
              <StatusBadge value={threat.severity} />
              <StatusBadge value={threat.status} />
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {threat.threat}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Attack Type</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {threat.category}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>AI Confidence</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                {threat.confidence}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Detected At</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                {threat.timestamp}
              </div>
            </div>
          </div>

          {/* Network Connection Telemetry */}
          <div className="soc-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="var(--accent-primary)" />
              <span>Flow Telemetry & Endpoints</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Source IP & ASN</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                  {threat.sourceIp}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={11} /> {threat.sourceCountry}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Destination Target</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                  {threat.destinationIp}:{threat.destinationPort}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Protocol: <strong style={{ color: 'var(--text-secondary)' }}>{threat.protocol}</strong> ({threat.trafficSize})
                </div>
              </div>
            </div>
          </div>

          {/* Indicators of Compromise (IoCs) */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="var(--status-warning-solid)" />
              <span>Observed Indicators of Compromise</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {threat.indicators.map((indicator, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-primary)',
                    lineHeight: 1.4,
                  }}
                >
                  {indicator}
                </li>
              ))}
            </ul>
          </div>

          {/* Model Reasoning (XAI) */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} color="var(--accent-primary)" />
              <span>AI Model Explainability & Reasoning</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {threat.modelReasoning.map((reason, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--accent-primary-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-primary)',
                    lineHeight: 1.4,
                  }}
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Response */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-critical-bg)',
              border: '1px solid var(--status-critical-border)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-critical-text)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} />
              <span>Recommended Countermeasure</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--status-critical-text)', lineHeight: 1.4 }}>
              {threat.recommendedResponse}
            </div>
          </div>

          {/* Raw Payload Inspection snippet if available */}
          {threat.rawPayloadSnippet && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={13} />
                <span>Captured Packet Hex / String</span>
              </div>
              <pre
                style={{
                  backgroundColor: '#0f172a',
                  color: '#94a3b8',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  overflowX: 'auto',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {threat.rawPayloadSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <button onClick={handleExportPcap} className="btn btn-secondary btn-sm">
            <Download size={13} />
            <span>Export PCAP</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {threat.status !== 'mitigated' && (
              <button onClick={handleMarkMitigated} className="btn btn-secondary btn-sm" style={{ color: 'var(--status-healthy-text)' }}>
                <CheckCircle2 size={13} color="var(--status-healthy-solid)" />
                <span>Mitigate</span>
              </button>
            )}
            {threat.status !== 'blocked' && (
              <button onClick={handleIsolateIp} className="btn btn-danger btn-sm">
                <Ban size={13} />
                <span>Isolate Source IP</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
