import React from 'react';

interface ThreatDistributionItem {
  category: string;
  count: number;
  percentage: number;
  severity: string;
  color?: string;
}

interface ThreatBarChartProps {
  data: ThreatDistributionItem[];
  onSelectCategory?: (category: string) => void;
}

export const ThreatBarChart: React.FC<ThreatBarChartProps> = ({ data, onSelectCategory }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((item) => {
        let barColor = 'var(--accent-primary)';
        if (item.category === 'DDoS' || item.category === 'Botnet' || item.category === 'Malware') {
          barColor = 'var(--status-critical-solid)';
        } else if (item.category === 'Brute Force' || item.category === 'Web Attack') {
          barColor = 'var(--status-warning-solid)';
        } else if (item.category === 'Port Scan') {
          barColor = 'var(--accent-primary)';
        } else if (item.category === 'Normal Traffic') {
          barColor = 'var(--status-healthy-solid)';
        }

        return (
          <div
            key={item.category}
            onClick={() => onSelectCategory && onSelectCategory(item.category)}
            style={{
              cursor: onSelectCategory ? 'pointer' : 'default',
              padding: '4px 6px',
              borderRadius: 'var(--radius-sm)',
              transition: 'background-color 0.12s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '13px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }} className="font-mono">
                  {item.count} flows
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)', width: '36px', textAlign: 'right' }} className="num-tabular font-mono">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Horizontal progress bar */}
            <div
              style={{
                width: '100%',
                height: '7px',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: '3px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  backgroundColor: barColor,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
