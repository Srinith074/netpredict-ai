import React, { useState } from 'react';

export const AnomalyScoreChart: React.FC<{ height?: number }> = ({ height = 200 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // 24 simulated flow anomaly points over the past 2 hours
  const points = [
    0.12, 0.15, 0.14, 0.18, 0.16, 0.22, 0.25, 0.19, 0.28, 0.35,
    0.42, 0.48, 0.62, 0.74, 0.88, 0.94, 0.89, 0.76, 0.58, 0.45,
    0.38, 0.31, 0.24, 0.20
  ];

  const chartWidth = 720;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const getX = (i: number) => paddingLeft + (i / (points.length - 1)) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - val * innerHeight;

  const threshold = 0.65;
  const yThreshold = getY(threshold);

  const pathD = points.map((p, i) => `${getX(i).toFixed(1)},${getY(p).toFixed(1)}`).join(' L ');
  const areaD = `M ${getX(0)},${getY(0)} L ${pathD} L ${getX(points.length - 1)},${getY(0)} Z`;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((val) => (
          <g key={val}>
            <line
              x1={paddingLeft}
              y1={getY(val)}
              x2={chartWidth - paddingRight}
              y2={getY(val)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={getY(val) + 4}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="end"
              className="font-mono"
            >
              {val.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Anomaly threshold line */}
        <line
          x1={paddingLeft}
          y1={yThreshold}
          x2={chartWidth - paddingRight}
          y2={yThreshold}
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <text
          x={chartWidth - paddingRight - 6}
          y={yThreshold - 5}
          fontSize="10"
          fill="#b91c1c"
          fontWeight="600"
          textAnchor="end"
        >
          Anomaly Threshold (0.65)
        </text>

        {/* Area fill */}
        <path d={areaD} fill="url(#anomalyGradient)" />

        {/* Main Line */}
        <path
          d={`M ${pathD}`}
          fill="none"
          stroke="#0284c7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight points above threshold */}
        {points.map((p, i) => {
          if (p >= threshold) {
            return (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(p)}
                r="4.5"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            );
          }
          return null;
        })}

        {/* X axis */}
        <text x={paddingLeft} y={height - 10} fontSize="10" fill="var(--text-muted)" className="font-mono">
          -120 min
        </text>
        <text x={paddingLeft + innerWidth / 2} y={height - 10} fontSize="10" fill="var(--text-muted)" textAnchor="middle" className="font-mono">
          -60 min
        </text>
        <text x={chartWidth - paddingRight} y={height - 10} fontSize="10" fill="var(--text-muted)" textAnchor="end" className="font-mono">
          Now
        </text>

        {/* Invisible columns for mouse hover */}
        {points.map((_, idx) => {
          const x = getX(idx);
          const colWidth = innerWidth / (points.length - 1);
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

        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={paddingTop + innerHeight}
              stroke="#0284c7"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={getX(hoverIndex)}
              cy={getY(points[hoverIndex])}
              r="5"
              fill={points[hoverIndex] >= threshold ? '#dc2626' : '#0284c7'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {hoverIndex !== null && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: `${Math.min(chartWidth - 140, Math.max(20, getX(hoverIndex) - 60))}px`,
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            padding: '6px 10px',
            fontSize: '11px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div style={{ color: 'var(--text-muted)' }}>Offset: -{(points.length - 1 - hoverIndex) * 5} min</div>
          <div style={{ fontWeight: 700, color: points[hoverIndex] >= threshold ? 'var(--status-critical-solid)' : 'var(--text-primary)' }}>
            Score: {points[hoverIndex].toFixed(3)}{' '}
            {points[hoverIndex] >= threshold ? '(ANOMALY)' : '(Normal)'}
          </div>
        </div>
      )}
    </div>
  );
};
