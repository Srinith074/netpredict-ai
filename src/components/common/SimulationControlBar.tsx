import React from 'react';
import {
  Play,
  Pause,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationScenario } from '../../types';

export const SimulationControlBar: React.FC = () => {
  const {
    isSimulating,
    toggleSimulation,
    activeScenario,
    setScenario,
    triggerInstantAnomaly,
    currentRecord,
    latestAnomaly,
    forecastData,
  } = useApp();

  const scenarios: { id: SimulationScenario; label: string; badge: string; isDanger?: boolean }[] = [
    { id: 'normal', label: 'Normal Traffic', badge: 'BASELINE' },
    { id: 'ddos', label: 'DDoS Attack', badge: 'HIGH VOLUME', isDanger: true },
    { id: 'portscan', label: 'Port Scan', badge: 'RECON' },
    { id: 'bruteforce', label: 'Brute Force', badge: 'AUTH SPRAY' },
    { id: 'botnet', label: 'Botnet Activity', badge: 'C2 BEACON', isDanger: true },
  ];

  return (
    <div
      className="soc-card"
      style={{
        padding: '12px 18px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '4px',
      }}
    >
      {/* Left: Simulation Toggle & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={toggleSimulation}
          className={`btn ${isSimulating ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          style={{ fontWeight: 600, padding: '6px 12px' }}
        >
          {isSimulating ? (
            <>
              <Pause size={13} />
              <span>Pause Simulation</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>Start Traffic Simulation</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isSimulating ? 'var(--status-healthy-solid)' : 'var(--text-muted)',
              display: 'inline-block',
            }}
            className={isSimulating ? 'pulse-live' : ''}
          />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Pipeline Engine: {isSimulating ? 'Streaming (Every 3.5s)' : 'Idle'}
          </span>
        </div>

        {/* Live Telemetry Pill Snapshot */}
        {currentRecord && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span>
              Ingestion: <strong style={{ color: 'var(--text-primary)' }} className="font-mono">{currentRecord.packetRate.toLocaleString()} pps</strong>
            </span>
            <span>
              Anomaly Score: <strong style={{ color: latestAnomaly?.isAnomaly ? 'var(--status-critical-solid)' : 'var(--status-healthy-solid)' }} className="font-mono">{latestAnomaly?.anomalyScore.toFixed(3) || '0.120'}</strong>
            </span>
            <span>
              Predicted: <strong style={{ color: forecastData.attackProbability >= 70 ? 'var(--status-critical-solid)' : 'var(--text-primary)' }}>{forecastData.predictedAttackCategory} ({forecastData.attackProbability}%)</strong>
            </span>
          </div>
        )}
      </div>

      {/* Right: Scenario Selectors for SIH Judges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
          <Sparkles size={12} color="var(--accent-primary)" />
          <span>Demo Scenario:</span>
        </span>

        {scenarios.map((sc) => {
          const isSelected = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              style={{
                border: '1px solid',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
                color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                padding: '4px 9px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span>{sc.label}</span>
              {isSelected && <CheckCircle2 size={11} color="var(--accent-primary)" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
