import React from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowRight,
  Zap,
  X,
  Gauge,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';

export const GuidedDemoBar: React.FC = () => {
  const {
    demoState,
    startDemoScenario,
    pauseDemo,
    resumeDemo,
    resetDemo,
    stepDemoNext,
    setDemoSpeed,
    toggleDemoMode,
    currentRecord,
    latestAnomaly,
    forecastData,
    networkStatus,
  } = useApp();

  const scenarios: {
    id: DemoScenarioId;
    stepNumber: number;
    name: string;
    badge: string;
    summary: string;
    details: string;
    isCritical?: boolean;
  }[] = [
    {
      id: 'normal',
      stepNumber: 1,
      name: 'Normal Network',
      badge: 'STABLE BASELINE',
      summary: 'Stable diurnal traffic, low anomaly score, nominal probability.',
      details: 'Status remains Protected • Standard 3-way handshakes',
    },
    {
      id: 'portscan',
      stepNumber: 2,
      name: 'Port Scan',
      badge: 'RECONNAISSANCE',
      summary: 'Connection attempts & failed connections escalate across diverse ports.',
      details: 'Target port diversity rises • Gradual probability climb',
    },
    {
      id: 'bruteforce',
      stepNumber: 3,
      name: 'Brute Force',
      badge: 'AUTH SPRAY',
      summary: 'Repeated connections concentrated toward Port 22 SSH Bastion.',
      details: '92% authentication failure rate • Rapid TCP RST flood',
    },
    {
      id: 'ddos',
      stepNumber: 4,
      name: 'DDoS Attack',
      badge: 'VOLUMETRIC FLOOD',
      summary: 'Rapid surge in packet rate, SYN traffic, source IPs, and connections.',
      details: 'Packet rate >145K pps • Forecast rapidly surges to 82%',
      isCritical: true,
    },
  ];

  return (
    <div
      className="soc-card"
      style={{
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--accent-primary-border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '4px',
        position: 'relative',
      }}
    >
      {/* 1. TOP HEADER & PLAYBACK CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Guided Live Demonstration Mode
              </span>
              <span className="badge badge-primary font-mono" style={{ fontSize: '10px' }}>
                SIH 2026 Presentation Engine
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor:
                    networkStatus === 'Under Attack'
                      ? 'var(--status-critical-bg)'
                      : networkStatus === 'Elevated Warning'
                      ? 'var(--status-warning-bg)'
                      : 'var(--status-healthy-bg)',
                  color:
                    networkStatus === 'Under Attack'
                      ? 'var(--status-critical-text)'
                      : networkStatus === 'Elevated Warning'
                      ? 'var(--status-warning-text)'
                      : 'var(--status-healthy-text)',
                  border: `1px solid ${
                    networkStatus === 'Under Attack'
                      ? 'var(--status-critical-border)'
                      : networkStatus === 'Elevated Warning'
                      ? 'var(--status-warning-border)'
                      : 'var(--status-healthy-border)'
                  }`,
                }}
              >
                ● Status: {networkStatus}
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {demoState.statusMessage}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Pause / Resume Button */}
          {demoState.isRunning ? (
            demoState.isPaused ? (
              <button
                onClick={resumeDemo}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Resume Progressive Simulation"
              >
                <Play size={13} />
                <span>Resume Demo</span>
              </button>
            ) : (
              <button
                onClick={pauseDemo}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Pause Simulation to Explain to Judges"
              >
                <Pause size={13} />
                <span>Pause</span>
              </button>
            )
          ) : (
            <button
              onClick={() => startDemoScenario(demoState.activeScenarioId)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              title="Start Progressive Transition"
            >
              <Play size={13} />
              <span>Run Scenario</span>
            </button>
          )}

          {/* Manual Step Button for presenter */}
          <button
            onClick={stepDemoNext}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            title="Advance One Step Manually"
          >
            <SkipForward size={13} />
            <span>Next Step</span>
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setDemoSpeed(demoState.autoPlaySpeed === 'normal' ? 'fast' : 'normal')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}
            title="Toggle Demo Transition Speed"
          >
            <Gauge size={13} />
            <span>Speed: {demoState.autoPlaySpeed === 'fast' ? 'Fast (1.2s)' : 'Normal (2.5s)'}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemo}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
            title="Reset Everything to Clean Baseline"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>

          {/* Exit Demo Mode */}
          <button
            onClick={() => toggleDemoMode(false)}
            className="btn-icon"
            style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)' }}
            title="Exit Demo Mode"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 2. CLEAN 4-SCENARIO SELECTOR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
        {scenarios.map((sc) => {
          const isSelected = demoState.activeScenarioId === sc.id;
          const isRunningThis = isSelected && demoState.isRunning;

          return (
            <button
              key={sc.id}
              onClick={() => startDemoScenario(sc.id)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isSelected
                  ? 'var(--accent-primary)'
                  : 'var(--border-subtle)',
                backgroundColor: isSelected
                  ? 'var(--accent-primary-subtle)'
                  : 'var(--bg-surface-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                    className="font-mono"
                  >
                    {sc.stepNumber}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {sc.name}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    color: sc.isCritical ? 'var(--status-critical-text)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  className="font-mono"
                >
                  {sc.badge}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                {sc.summary}
              </div>

              <div style={{ fontSize: '10.5px', color: isSelected ? 'var(--accent-primary)' : 'var(--text-subtle)', fontWeight: 500 }}>
                {sc.details}
              </div>

              {isRunningThis && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. PROGRESSIVE 6-STAGE TIMELINE (Small Timeline) */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          padding: '12px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={13} color="var(--accent-primary)" />
            <span>Detection &amp; Forecasting Timeline Progression</span>
          </span>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="font-mono">
            {demoState.currentStepIndex >= 0 ? `Stage ${demoState.currentStepIndex + 1} of 6` : 'Ready to start'}
          </span>
        </div>

        {/* 6 Connected Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '8px',
            position: 'relative',
          }}
        >
          {demoState.timeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isPending = step.status === 'pending';

            return (
              <div
                key={step.id}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive
                    ? '#ffffff'
                    : isCompleted
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'transparent',
                  border: `1px solid ${
                    isActive
                      ? 'var(--accent-primary)'
                      : isCompleted
                      ? 'var(--status-healthy-border)'
                      : 'var(--border-subtle)'
                  }`,
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: isActive
                          ? 'var(--accent-primary)'
                          : isCompleted
                          ? 'var(--status-healthy-solid)'
                          : 'var(--bg-surface-hover)',
                        color: isPending ? 'var(--text-muted)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                      className="font-mono"
                    >
                      {isCompleted ? <CheckCircle2 size={12} /> : step.stepNumber}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                        color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                      }}
                    >
                      {step.title}
                    </span>
                  </div>

                  {isActive && (
                    <span
                      className="pulse-live"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  )}
                </div>

                {step.metricHighlight && (isActive || isCompleted) && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: isActive ? 'var(--accent-primary)' : 'var(--status-healthy-text)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    className="font-mono"
                  >
                    {step.metricHighlight}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. THE COMPLETE CONCEPT FLOW BANNER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '10.5px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Pipeline Architecture:
          </span>
          {[
            { label: 'NETWORK TRAFFIC', activeOn: [0] },
            { label: 'FEATURE EXTRACTION', activeOn: [1] },
            { label: 'ANOMALY DETECTION', activeOn: [1, 2] },
            { label: 'ATTACK CLASSIFICATION', activeOn: [2, 3] },
            { label: 'TIME-SERIES FORECASTING', activeOn: [3, 4] },
            { label: 'EARLY WARNING', activeOn: [4, 5] },
            { label: 'EXPLAINABLE ALERT', activeOn: [5] },
          ].map((item, idx, arr) => {
            const isStageActive = item.activeOn.includes(demoState.currentStepIndex);
            return (
              <React.Fragment key={item.label}>
                <span
                  style={{
                    fontWeight: isStageActive ? 700 : 500,
                    color: isStageActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    backgroundColor: isStageActive ? 'var(--accent-primary-subtle)' : 'transparent',
                    padding: isStageActive ? '1px 6px' : '0',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.15s ease',
                  }}
                  className="font-mono"
                >
                  {item.label}
                </span>
                {idx < arr.length - 1 && <span style={{ color: 'var(--text-subtle)' }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }} className="font-mono">
          Deterministic SIH 2026 Pipeline
        </div>
      </div>

    </div>
  );
};
