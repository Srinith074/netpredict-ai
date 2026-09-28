import React, { useState } from 'react';
import { ForecastPoint } from '../../types';

interface ForecastAreaChartProps {
  timeline: ForecastPoint[];
  height?: number;
  showConfidenceBands?: boolean;
  leadTimeMinutes?: number;
}

export const ForecastAreaChart: React.FC<ForecastAreaChartProps> = ({
  timeline,
  height = 240,
  showConfidenceBands = true,
  leadTimeMinutes = 21,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No forecast data available</div>;
  }

  // Dimensions
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const chartWidth = 720;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Scale functions
  const getX = (index: number) => paddingLeft + (index / (timeline.length - 1)) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - (val / 100) * innerHeight;

  // Line & Area path strings
  const mainPoints = timeline.map((p, i) => `${getX(i).toFixed(1)},${getY(p.probability).toFixed(1)}`);
  const linePath = `M ${mainPoints.join(' L ')}`;
  const areaPath = `M ${getX(0)},${getY(0)} L ${mainPoints.join(' L ')} L ${getX(timeline.length - 1)},${getY(0)} Z`;

  // Confidence interval band
  const upperPoints = timeline.map((p, i) => `${getX(i).toFixed(1)},${getY(p.upperBound).toFixed(1)}`);
  const lowerPoints = [...timeline].reverse().map((p, i) => {
    const origIndex = timeline.length - 1 - i;
    return `${getX(origIndex).toFixed(1)},${getY(p.lowerBound).toFixed(1)}`;
  });
  const confidenceBandPath = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

  // Threshold Y positions
  const yWarning = getY(50);
  const yCritical = getY(75);

  // Lead time peak marker
  const leadIndex = timeline.findIndex((p) => p.minute >= leadTimeMinutes);
  const leadPoint = leadIndex >= 0 ? timeline[leadIndex] : null;
  const leadX = leadIndex >= 0 ? getX(leadIndex) : null;
  const leadY = leadPoint ? getY(leadPoint.probability) : null;

  const activePoint = hoverIndex !== null ? timeline[hoverIndex] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="forecastAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => (
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
              fontSize="11"
              fill="var(--text-muted)"
              textAnchor="end"
              className="num-tabular font-mono"
            >
              {val}%
            </text>
          </g>
        ))}

        {/* Warning threshold line (50%) */}
        <line
          x1={paddingLeft}
          y1={yWarning}
          x2={chartWidth - paddingRight}
          y2={yWarning}
          stroke="#d97706"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <text
          x={chartWidth - paddingRight - 4}
          y={yWarning - 5}
          fontSize="10"
          fill="#b45309"
          textAnchor="end"
          fontWeight="500"
        >
          Warning 50%
        </text>

        {/* Critical threshold line (75%) */}
        <line
          x1={paddingLeft}
          y1={yCritical}
          x2={chartWidth - paddingRight}
          y2={yCritical}
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <text
          x={chartWidth - paddingRight - 4}
          y={yCritical - 5}
          fontSize="10"
          fill="#b91c1c"
          textAnchor="end"
          fontWeight="600"
        >
          Critical 75%
        </text>

        {/* Confidence Interval band */}
        {showConfidenceBands && (
          <path
            d={confidenceBandPath}
            fill="#e2e8f0"
            fillOpacity="0.5"
            stroke="none"
          />
        )}

        {/* Area under curve */}
        <path d={areaPath} fill="url(#forecastAreaFill)" />

        {/* Main probability line */}
        <path
          d={linePath}
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Expected Attack Lead Time Marker */}
        {leadX !== null && leadY !== null && (
          <g>
            <line
              x1={leadX}
              y1={paddingTop}
              x2={leadX}
              y2={paddingTop + innerHeight}
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle
              cx={leadX}
              cy={leadY}
              r="4.5"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <rect
              x={leadX - 44}
              y={paddingTop - 14}
              width="88"
              height="18"
              rx="3"
              fill="#dc2626"
            />
            <text
              x={leadX}
              y={paddingTop - 2}
              fill="#ffffff"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
            >
              Peak +{leadTimeMinutes}m
            </text>
          </g>
        )}

        {/* X-axis time marks */}
        {timeline.filter((_, idx) => idx % 4 === 0).map((p) => {
          const idx = timeline.findIndex((x) => x.minute === p.minute);
          return (
            <g key={p.minute}>
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
                +{p.minute}m
              </text>
            </g>
          );
        })}

        {/* Transparent hover capture zones */}
        {timeline.map((_, idx) => {
          const x = getX(idx);
          const colWidth = innerWidth / (timeline.length - 1);
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

        {/* Active hover indicator */}
        {hoverIndex !== null && activePoint && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={paddingTop + innerHeight}
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle
              cx={getX(hoverIndex)}
              cy={getY(activePoint.probability)}
              r="5"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Floating Tooltip */}
      {hoverIndex !== null && activePoint && (
        <div
          style={{
            position: 'absolute',
            top: `${Math.max(10, getY(activePoint.probability) - 75)}px`,
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
          <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            +{activePoint.minute}m ({activePoint.timeLabel})
          </div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>
            Probability: <span style={{ color: activePoint.probability >= 75 ? 'var(--status-critical-solid)' : activePoint.probability >= 50 ? 'var(--status-warning-solid)' : 'var(--accent-primary)' }}>{activePoint.probability}%</span>
          </div>
          {showConfidenceBands && (
            <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
              95% CI: [{activePoint.lowerBound}% - {activePoint.upperBound}%]
            </div>
          )}
        </div>
      )}
    </div>
  );
};
