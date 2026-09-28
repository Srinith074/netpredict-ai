import React from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Radar,
  Cpu,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ExecutivePostureSummaryProps {
  onInspectReasoning?: () => void;
  showExplanation?: boolean;
}

export const ExecutivePostureSummary: React.FC<ExecutivePostureSummaryProps> = ({
  onInspectReasoning,
  showExplanation = false,
}) => {
  const {
    networkStatus,
    overviewMetrics,
    forecastData,
    latestExplanation,
    liveTraffic,
    latestAnomaly,
    threats,
  } = useApp();

  const isCritical = networkStatus === 'Under Attack' || forecastData.attackProbability >= 75;
  const isElevated = networkStatus === 'Elevated Warning' || forecastData.attackProbability >= 50;

  const topFactor = latestExplanation?.contributingFactors?.[0] || {
    feature: 'Packet Rate',
    contributionPercent: 32,
  };
  const topBaseline = latestExplanation?.baselineComparison?.[0] || {
    feature: 'Packet Rate',
    change: '+156%',
  };

  const anomalyScore = latestAnomaly?.anomalyScore ?? (isCritical ? 0.94 : isElevated ? 0.68 : 0.18);

  return (
    <div
      className="soc-card"
      style={{
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: `4px solid ${
          isCritical
            ? 'var(--status-critical-solid)'
            : isElevated
            ? 'var(--status-warning-solid)'
            : 'var(--status-healthy-solid)'
        }`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SOC Executive Threat Posture
          </span>
          <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>
            Real-Time Assessment
          </span>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Continuous Multi-Sensor Ingestion • 4-Pillar Incident Assessment
        </div>
      </div>

      {/* The 4-Pillar Grid Answering the 4 Core Security Questions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
        }}
      >
        {/* PILLAR 1: What is happening on the network? */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={13} color="var(--accent-primary)" />
              1. Network Activity
            </span>
            <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>
              Line Rate
            </span>
          </div>

          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }} className="num-tabular font-mono">
              {overviewMetrics.networkTraffic.value} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>({liveTraffic.packetsPerSec.toLocaleString()} pps)</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <strong>{overviewMetrics.activeConnections.value}</strong> active sessions • {liveTraffic.uniqueSourceIps} source IPs
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
            Core trunks (eth0/eth1) nominal line rate
          </div>
        </div>

        {/* PILLAR 2: Is there an active threat? */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {isCritical ? (
                <ShieldAlert size={13} color="var(--status-critical-solid)" />
              ) : isElevated ? (
                <AlertTriangle size={13} color="var(--status-warning-solid)" />
              ) : (
                <ShieldCheck size={13} color="var(--status-healthy-solid)" />
              )}
              2. Active Threat Status
            </span>
            <span
              className={`badge ${
                isCritical ? 'badge-critical' : isElevated ? 'badge-warning' : 'badge-safe'
              } font-mono`}
              style={{ fontSize: '10px' }}
            >
              {networkStatus.toUpperCase()}
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: isCritical
                  ? 'var(--status-critical-solid)'
                  : isElevated
                  ? 'var(--status-warning-solid)'
                  : 'var(--status-healthy-solid)',
              }}
            >
              {isCritical
                ? 'Critical Threat Detected'
                : isElevated
                ? 'Elevated Suspicious Flows'
                : 'Perimeter Safe & Protected'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Anomaly Score: <strong className="font-mono">{anomalyScore.toFixed(2)}</strong> (Threshold: 0.65)
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
            {threats.filter((t) => t.severity === 'critical' || t.severity === 'high').length} high/critical threats monitored
          </div>
        </div>

        {/* PILLAR 3: What attack does the AI expect? */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Radar size={13} color="var(--accent-primary)" />
              3. AI Attack Forecast
            </span>
            <span className="badge badge-primary font-mono" style={{ fontSize: '10px' }}>
              {forecastData.attackProbability}% RISK
            </span>
          </div>

          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {forecastData.predictedAttackCategory}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {forecastData.expectedTimeWindow} • {forecastData.predictedAttackSubtype}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
            Confidence: <strong className="font-mono">{forecastData.forecastConfidence}%</strong> (Lead: +{forecastData.leadTimeMinutes}m)
          </div>
        </div>

        {/* PILLAR 4: Why does the AI expect it? */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={13} color="var(--accent-primary)" />
              4. AI Root Cause
            </span>
            <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>
              XAI Attribution
            </span>
          </div>

          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{topFactor.feature}</span>
              <span
                className="font-mono"
                style={{
                  fontSize: '13px',
                  color: isCritical ? 'var(--status-critical-text)' : 'var(--accent-primary)',
                  fontWeight: 700,
                }}
              >
                +{topFactor.contributionPercent}%
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {topBaseline.feature}: <strong className="font-mono">{topBaseline.change}</strong> vs baseline
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heuristic deviation</span>
            {onInspectReasoning && (
              <button
                onClick={onInspectReasoning}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--accent-primary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: 0,
                }}
              >
                <span>{showExplanation ? 'Collapse' : 'Explain'}</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
