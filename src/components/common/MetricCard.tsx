import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SecurityMetric } from '../../types';

interface MetricCardProps {
  metric: SecurityMetric;
  icon?: React.ReactNode;
  invertTrendColor?: boolean; // For threats/attacks, positive trend is warning/critical
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, icon, invertTrendColor = false }) => {
  const isPositive = metric.trend > 0;
  const isZero = metric.trend === 0;

  // Determine trend color:
  // Usually positive is green, but for threats/attacks detected, positive is red/warning!
  let trendColor = 'var(--text-muted)';
  let trendBg = 'var(--bg-surface-subtle)';

  if (!isZero) {
    if (invertTrendColor) {
      trendColor = isPositive ? 'var(--status-critical-text)' : 'var(--status-healthy-text)';
      trendBg = isPositive ? 'var(--status-critical-bg)' : 'var(--status-healthy-bg)';
    } else {
      trendColor = isPositive ? 'var(--status-healthy-text)' : 'var(--text-muted)';
      trendBg = isPositive ? 'var(--status-healthy-bg)' : 'var(--bg-surface-subtle)';
    }
  }

  // Mini sparkline SVG if available
  const sparklineData = metric.sparkline || [10, 12, 14, 13, 16, 18, 20];
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * 64;
      const y = 24 - ((v - minVal) / range) * 20;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="soc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {metric.label}
        </span>
        {icon && (
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }} className="num-tabular">
          {metric.value}
        </div>

        {/* Crisp mini sparkline */}
        <div style={{ width: '64px', height: '24px', opacity: 0.85 }}>
          <svg width="64" height="24" viewBox="0 0 64 24" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 5px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '11px',
            color: trendColor,
            backgroundColor: trendBg,
          }}
        >
          {isZero ? (
            <Minus size={12} />
          ) : isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {metric.trend > 0 ? `+${metric.trend}%` : `${metric.trend}%`}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          {metric.comparison}
        </span>
      </div>
    </div>
  );
};
