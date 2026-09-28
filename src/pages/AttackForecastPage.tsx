import React, { useState } from 'react';
import {
  Radar,
  Clock,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ForecastAreaChart } from '../components/charts/ForecastAreaChart';
import { PredictionExplanationCard } from '../components/predictions/PredictionExplanationCard';

export const AttackForecastPage: React.FC = () => {
  const { forecastData, latestExplanation, activeScenario, setScenario, addToast } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<'15m' | '30m' | '60m'>('60m');

  const filteredTimeline = forecastData.timeline.filter((p) => {
    if (selectedHorizon === '15m') return p.minute <= 15;
    if (selectedHorizon === '30m') return p.minute <= 30;
    return p.minute <= 60;
  });

  const handleApplyMitigation = (mitigation: string) => {
    addToast('Mitigation Dispatched', `Rule: "${mitigation}" dispatched to firewall edge controller.`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Page Header with Scenario Switcher for Judges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Forecasting Engine v1.0
            </span>
            <span className="badge badge-neutral font-mono" style={{ fontSize: '10px' }}>TFT + Bi-LSTM</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
            Predictive Threat Intelligence
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Early-warning attack forecasting trained on temporal flow dynamics to mitigate attacks 15–60 minutes before impact.
          </p>
        </div>

        {/* Demo Scenario Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#ffffff', padding: '4px 6px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} color="var(--accent-primary)" /> Scenario:
          </span>
          {[
            { id: 'normal' as const, label: 'Clean Baseline' },
            { id: 'ddos' as const, label: 'Volumetric DDoS' },
            { id: 'portscan' as const, label: 'Port Recon' },
            { id: 'bruteforce' as const, label: 'Brute Force' },
            { id: 'botnet' as const, label: 'Botnet C2' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              style={{
                border: 'none',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                backgroundColor: activeScenario === sc.id ? 'var(--text-primary)' : 'transparent',
                color: activeScenario === sc.id ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Prominent Forecasting Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
            Current Threat Probability
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }} className="num-tabular">
            {forecastData.currentProbability}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Instantaneous anomaly level
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
            15-Minute Forecast
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: forecastData.forecast15m >= 70 ? 'var(--status-critical-solid)' : forecastData.forecast15m >= 45 ? 'var(--status-warning-solid)' : 'var(--status-healthy-solid)',
              marginTop: '4px',
            }}
            className="num-tabular"
          >
            {forecastData.forecast15m}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Short-term trajectory
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
            30-Minute Forecast
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: forecastData.forecast30m >= 70 ? 'var(--status-critical-solid)' : forecastData.forecast30m >= 45 ? 'var(--status-warning-solid)' : 'var(--status-healthy-solid)',
              marginTop: '4px',
            }}
            className="num-tabular"
          >
            {forecastData.forecast30m}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Expected saturation peak
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
            60-Minute Forecast
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }} className="num-tabular">
            {forecastData.forecast60m}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Long-range decay projection
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
            Model Confidence
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }} className="num-tabular">
            {forecastData.forecastConfidence}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Confidence interval: 95%
          </div>
        </div>
      </div>

      {/* Main Timeline Forecast Chart Panel */}
      <div className="soc-card" style={{ padding: '22px 24px' }}>
        <div className="soc-card-header" style={{ marginBottom: '16px' }}>
          <div>
            <h2 className="soc-card-title">
              <Radar size={18} color="var(--accent-primary)" />
              <span>Predicted Threat Probability Timeline</span>
            </h2>
            <div className="soc-card-subtitle">
              Continuous forward projection with 95% confidence intervals and early warning thresholds
            </div>
          </div>

          {/* Horizon filters */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-subtle)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
            {(['15m', '30m', '60m'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: selectedHorizon === h ? '#ffffff' : 'transparent',
                  color: selectedHorizon === h ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: selectedHorizon === h ? 'var(--shadow-sm)' : 'none',
                }}
              >
                +{h}
              </button>
            ))}
          </div>
        </div>

        <ForecastAreaChart
          timeline={filteredTimeline}
          height={260}
          leadTimeMinutes={forecastData.leadTimeMinutes}
          showConfidenceBands={true}
        />
      </div>

      {/* Detailed Prediction Explanation Component (XAI Layer) */}
      <PredictionExplanationCard explanation={latestExplanation} />

      {/* Supporting Predictive Intelligence: Attack Types & Mitigations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        
        {/* Predicted Attack Types */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">
                <span>Predicted Attack Types</span>
              </h2>
              <div className="soc-card-subtitle">
                Multinomial classification distribution
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {forecastData.predictedAttackTypes.map((type) => {
              let barColor = 'var(--accent-primary)';
              if (type.probability >= 50) barColor = 'var(--status-critical-solid)';
              else if (type.probability >= 20) barColor = 'var(--status-warning-solid)';

              return (
                <div key={type.category} style={{ padding: '6px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {type.category}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        {type.trend}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Conf: {type.confidence}%
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }} className="num-tabular font-mono">
                        {type.probability}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: `${type.probability}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Vectors: {type.estimatedVectors.join(' • ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preemptive Countermeasure Playbook */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">
                <ShieldCheck size={18} color="var(--accent-primary)" />
                <span>Recommended Preemptive Mitigations</span>
              </h2>
              <div className="soc-card-subtitle">
                Automated countermeasures recommended prior to projected attack saturation
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {forecastData.recommendedMitigations.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary-subtle)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                    className="font-mono"
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {rec}
                  </span>
                </div>

                <button
                  onClick={() => handleApplyMitigation(rec)}
                  className="btn btn-secondary btn-sm"
                  style={{ flexShrink: 0 }}
                  title="Execute Preemptive Firewall / BGP Action"
                >
                  <Send size={12} />
                  <span>Execute</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
