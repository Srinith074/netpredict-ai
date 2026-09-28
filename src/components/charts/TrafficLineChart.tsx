import React, { useState } from 'react';
import { TrafficDataPoint } from '../../types';

interface TrafficLineChartProps {
  data: TrafficDataPoint[];
  height?: number;
}

export const TrafficLineChart: React.FC<TrafficLineChartProps> = ({ data, height = 240 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No traffic telemetry available</div>;
  }

  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = 720;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Find max value across all three lines for Y axis scaling
  const maxIn = Math.max(...data.map((d) => d.incomingMbps));
  const maxOut = Math.max(...data.map((d) => d.outgoingMbps));
  const maxSusp = Math.max(...data.map((d) => d.suspiciousMbps));
  const rawMax = Math.max(maxIn, maxOut, maxSusp, 100);
  const yMax = Math.ceil(rawMax / 100) * 100 + 100;

  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1)) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - (val / yMax) * innerHeight;

  // Paths
  const inPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.incomingMbps).toFixed(1)}`).join(' L ');
  const outPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.outgoingMbps).toFixed(1)}`).join(' L ');
  const suspPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.suspiciousMbps).toFixed(1)}`).join(' L ');

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Clean minimal legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', fontSize: '12px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#0284c7', display: 'inline-block', borderRadius: '1px' }}></span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Incoming</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#64748b', display: 'inline-block', borderRadius: '1px' }}></span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Outgoing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#dc2626', display: 'inline-block', borderRadius: '1px' }}></span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Suspicious / Anomalous</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const val = Math.round(ratio * yMax);
          const y = getY(val);
          return (
            <g key={ratio}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                fontSize="11"
                fill="var(--text-muted)"
                textAnchor="end"
                className="num-tabular font-mono"
              >
                {val}M
              </text>
            </g>
          );
        })}

        {/* Outgoing Traffic Line */}
        <path
          d={`M ${outPoints}`}
          fill="none"
          stroke="#64748b"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Incoming Traffic Line */}
        <path
          d={`M ${inPoints}`}
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Suspicious Traffic Line */}
        <path
          d={`M ${suspPoints}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X axis labels */}
        {data.filter((_, idx) => idx % Math.max(1, Math.floor(data.length / 6)) === 0).map((d) => {
          const idx = data.indexOf(d);
          return (
            <g key={idx}>
              <line
                x1={getX(idx)}
                y1={paddingTop + innerHeight}
                x2={getX(idx)}
                y2={paddingTop + innerHeight + 4}
                stroke="#cbd5e1"
              />
              <text
                x={getX(idx)}
                y={chartHeight - 12}
                fontSize="11"
                fill="var(--text-muted)"
                textAnchor="middle"
                className="font-mono"
              >
                {d.time}
              </text>
            </g>
          );
        })}

        {/* Invisible columns for mouse hover */}
        {data.map((_, idx) => {
          const x = getX(idx);
          const colWidth = innerWidth / (data.length - 1);
          return (
            <rect
              key={idx}
              x={x - colWidth / 2}
              y={paddingTop}
              width={colWidth}
              height={innerHeight}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIndex(idx)}
            />
          );
        })}

        {/* Crosshair indicator */}
        {hoverIndex !== null && activePoint && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={paddingTop + innerHeight}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx={getX(hoverIndex)} cy={getY(activePoint.incomingMbps)} r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle cx={getX(hoverIndex)} cy={getY(activePoint.outgoingMbps)} r="4" fill="#64748b" stroke="#ffffff" strokeWidth="2" />
            <circle cx={getX(hoverIndex)} cy={getY(activePoint.suspiciousMbps)} r="4" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Hover tooltip */}
      {hoverIndex !== null && activePoint && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: `${Math.min(chartWidth - 150, Math.max(20, getX(hoverIndex) - 70))}px`,
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            padding: '8px 12px',
            fontSize: '11px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
            {activePoint.time}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#0284c7', fontWeight: 600 }}>
            <span>Incoming:</span> <span>{activePoint.incomingMbps} Mbps</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#64748b', fontWeight: 500 }}>
            <span>Outgoing:</span> <span>{activePoint.outgoingMbps} Mbps</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#dc2626', fontWeight: 700 }}>
            <span>Suspicious:</span> <span>{activePoint.suspiciousMbps} Mbps</span>
          </div>
        </div>
      )}
    </div>
  );
};
