import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  X,
  Gauge,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';

export const FloatingDemoControl: React.FC = () => {
  const {
    demoState,
    startDemoScenario,
    pauseDemo,
    resumeDemo,
    resetDemo,
    stepDemoNext,
    setDemoSpeed,
    toggleDemoMode,
    isDemoMode,
    networkStatus,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDemoMode) return null;

  const scenarios: {
    id: DemoScenarioId;
    stepNumber: number;
    name: string;
    badge: string;
    isCritical?: boolean;
  }[] = [
    { id: 'normal', stepNumber: 1, name: 'Normal Network', badge: 'STABLE' },
    { id: 'portscan', stepNumber: 2, name: 'Port Scan', badge: 'RECON' },
    { id: 'bruteforce', stepNumber: 3, name: 'Brute Force', badge: 'AUTH SPRAY' },
    { id: 'ddos', stepNumber: 4, name: 'DDoS Attack', badge: 'CRITICAL', isCritical: true },
  ];

  const currentStep = demoState.timeline[demoState.currentStepIndex];

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: isMinimized ? '10px 18px' : '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.25s var(--ease-apple)',
        marginBottom: '4px',
      }}
    >
      {/* Header bar with controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={14} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Guided Live Demonstration
              </span>
              <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>
                SIH 2026
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
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
                }}
              >
                ● {networkStatus}
              </span>
            </div>
            {!isMinimized && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {demoState.statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Action button cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {demoState.isRunning ? (
            demoState.isPaused ? (
              <button
                onClick={resumeDemo}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <Play size={12} />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={pauseDemo}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <Pause size={12} />
                <span>Pause</span>
              </button>
            )
          ) : (
            <button
              onClick={() => startDemoScenario(demoState.activeScenarioId)}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Play size={12} />
              <span>Run Scenario</span>
            </button>
          )}

          <button
            onClick={stepDemoNext}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
            title="Step Forward"
          >
            <SkipForward size={12} />
            <span>Next</span>
          </button>

          <button
            onClick={() => setDemoSpeed(demoState.autoPlaySpeed === 'normal' ? 'fast' : 'normal')}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '11px' }}
            title="Toggle Speed"
          >
            <Gauge size={12} />
            <span>{demoState.autoPlaySpeed === 'fast' ? '1.2s' : '2.5s'}</span>
          </button>

          <button
            onClick={resetDemo}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
            title="Reset to Clean Baseline"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn-icon"
            style={{ width: '26px', height: '26px' }}
            title={isMinimized ? 'Expand' : 'Collapse'}
          >
            {isMinimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          <button
            onClick={() => toggleDemoMode(false)}
            className="btn-icon"
            style={{ width: '26px', height: '26px' }}
            title="Close Demo Mode"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 4 Clean Scenario Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {scenarios.map((sc) => {
              const isSelected = demoState.activeScenarioId === sc.id;

              return (
                <button
                  key={sc.id}
                  onClick={() => startDemoScenario(sc.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--text-primary)' : 'rgba(0, 0, 0, 0.06)',
                    backgroundColor: isSelected ? 'var(--text-primary)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.18s var(--ease-apple)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : 'var(--bg-surface-subtle)',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
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
                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>{sc.name}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-surface-subtle)',
                      color: isSelected ? '#ffffff' : sc.isCritical ? 'var(--status-critical-solid)' : 'var(--text-muted)',
                    }}
                    className="font-mono"
                  >
                    {sc.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 6-Stage Timeline Track */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            {demoState.timeline.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--status-healthy-text)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isActive
                        ? 'var(--text-primary)'
                        : isCompleted
                        ? 'var(--status-healthy-solid)'
                        : 'var(--border-subtle)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9.5px',
                      fontWeight: 700,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={10} /> : step.stepNumber}
                  </span>
                  <span>{step.title}</span>
                  {idx < demoState.timeline.length - 1 && (
                    <span style={{ color: 'var(--text-subtle)', margin: '0 4px' }}>→</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
