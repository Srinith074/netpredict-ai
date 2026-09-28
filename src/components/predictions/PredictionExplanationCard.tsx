import React from 'react';
import {
  Cpu,
  Layers,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { PredictionExplanation } from '../../types';

interface PredictionExplanationCardProps {
  explanation: PredictionExplanation | null;
  compact?: boolean;
}

export const PredictionExplanationCard: React.FC<PredictionExplanationCardProps> = ({
  explanation,
  compact = false,
}) => {
  if (!explanation) {
    return (
      <div className="soc-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
        <p>Awaiting live telemetry ingestion for model explanation...</p>
      </div>
    );
  }

  const isCritical = explanation.probability >= 75;
  const isElevated = explanation.probability >= 50;

  return (
    <div className="soc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* 1. COMPONENT HEADER */}
      <div className="soc-card-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Explainable AI (XAI)
            </span>
            <span className="badge badge-primary font-mono" style={{ fontSize: '10px' }}>
              Interpretable Model Layer
            </span>
          </div>
          <h2 className="soc-card-title" style={{ fontSize: '18px', fontWeight: 700 }}>
            <Cpu size={19} color="var(--accent-primary)" />
            <span>Prediction Explanation</span>
          </h2>
          <div className="soc-card-subtitle" style={{ fontSize: '12px', marginTop: '2px' }}>
            Transparent attribution breakdown and heuristic deduction for cybersecurity analysts
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-neutral font-mono" style={{ fontSize: '11px' }}>
            Telemetry: {explanation.generatedTimestamp}
          </span>
        </div>
      </div>

      {/* 2. PRIMARY DISPLAY: Prediction, Probability, Confidence Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          backgroundColor: 'var(--bg-surface-subtle)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Prediction */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Prediction
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: isCritical ? 'var(--status-critical-solid)' : isElevated ? 'var(--status-warning-solid)' : 'var(--text-primary)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {explanation.prediction}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {explanation.subtype}
          </div>
        </div>

        {/* Probability */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Probability
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: isCritical ? 'var(--status-critical-solid)' : isElevated ? 'var(--status-warning-solid)' : 'var(--status-healthy-solid)',
              marginTop: '4px',
            }}
            className="num-tabular font-mono"
          >
            {explanation.probability}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Threat Tier: <strong>{explanation.riskLevel}</strong>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Confidence
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              marginTop: '4px',
            }}
            className="num-tabular font-mono"
          >
            {explanation.confidence}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Empirical Calibration (95% CI)
          </div>
        </div>
      </div>

      {/* 3. SECTION: MODEL FEATURE CONTRIBUTIONS (Horizontal Contribution Visualization) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} color="var(--accent-primary)" />
              <span>Model Feature Contributions</span>
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Top contributing factors calculated dynamically from current simulated traffic
            </div>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
            Relative Weight Attribution
          </span>
        </div>

        {/* Horizontal Contribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {explanation.contributingFactors.map((factor) => {
            const isPositive = factor.contributionPercent > 0;
            const barWidthPercent = Math.min(100, Math.round((factor.contributionPercent / 40) * 100));

            return (
              <div
                key={factor.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {factor.feature}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isPositive ? 'var(--status-critical-text)' : 'var(--status-healthy-text)',
                      backgroundColor: isPositive ? 'var(--status-critical-bg)' : 'var(--status-healthy-bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isPositive ? 'var(--status-critical-border)' : 'var(--status-healthy-border)'}`,
                    }}
                    className="num-tabular font-mono"
                  >
                    {isPositive ? `+${factor.contributionPercent}%` : `${factor.contributionPercent}%`}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {factor.description}
                </div>

                {/* Clean Horizontal Contribution Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '2px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '7px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: `${barWidthPercent}%`,
                        height: '100%',
                        backgroundColor: isPositive ? 'var(--accent-primary)' : 'var(--status-healthy-solid)',
                        borderRadius: '3px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-subtle)',
                      width: '60px',
                      textAlign: 'right',
                    }}
                    className="font-mono"
                  >
                    wt: {factor.relativeWeight.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: DETECTION REASONING */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={15} color="var(--accent-primary)" />
            <span>Detection Reasoning</span>
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Automated analytical deduction explaining why the model predicted this state
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {explanation.detectionReasoning.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
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
                  marginTop: '1px',
                }}
                className="font-mono"
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECTION: BASELINE VS CURRENT COMPARISON */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={15} color="var(--accent-primary)" />
            <span>Baseline vs Current</span>
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Direct telemetry variance calculated dynamically against diurnal SOC baselines
          </div>
        </div>

        <div
          style={{
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ffffff',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12.5px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                <th style={{ padding: '10px 14px' }}>Feature</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Baseline</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Current</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {explanation.baselineComparison.map((item, index) => {
                const isCriticalRow = item.status === 'critical';
                const isWarningRow = item.status === 'warning';

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: index < explanation.baselineComparison.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : 'rgba(248, 250, 252, 0.6)',
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.feature}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)' }} className="num-tabular font-mono">
                      {item.baseline}
                    </td>
                    <td
                      style={{
                        padding: '10px 14px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: isCriticalRow ? 'var(--status-critical-solid)' : isWarningRow ? 'var(--status-warning-solid)' : 'var(--text-primary)',
                      }}
                      className="num-tabular font-mono"
                    >
                      {item.current}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isCriticalRow
                            ? 'var(--status-critical-bg)'
                            : isWarningRow
                            ? 'var(--status-warning-bg)'
                            : 'var(--bg-surface-subtle)',
                          color: isCriticalRow
                            ? 'var(--status-critical-text)'
                            : isWarningRow
                            ? 'var(--status-warning-text)'
                            : 'var(--text-secondary)',
                          border: `1px solid ${
                            isCriticalRow
                              ? 'var(--status-critical-border)'
                              : isWarningRow
                              ? 'var(--status-warning-border)'
                              : 'var(--border-subtle)'
                          }`,
                        }}
                        className="num-tabular font-mono"
                      >
                        {item.change}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TRANSPARENCY DISCLAIMER (Enterprise Standards) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}
      >
        <Info size={15} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Model Feature Contributions:</strong> Feature weights represent empirical variance contributions derived from the model's multi-variate decision boundaries. This XAI layer provides transparent, verifiable reasoning for SOC analysts rather than a black-box forecast.
        </span>
      </div>

    </div>
  );
};
