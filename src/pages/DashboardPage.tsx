import React, { useState } from 'react';
import {
  Activity,
  Users,
  ShieldAlert,
  Radar,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ForecastAreaChart } from '../components/charts/ForecastAreaChart';
import { TrafficLineChart } from '../components/charts/TrafficLineChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { getTrafficAnalyticsData } from '../services/mockData';

export const DashboardPage: React.FC = () => {
  const {
    overviewMetrics,
    forecastData,
    latestExplanation,
    threats,
    setSelectedThreat,
    setActiveNav,
    networkStatus,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('1H');
  const trafficData = getTrafficAnalyticsData(timeRange);

  const isCritical = networkStatus === 'Under Attack' || forecastData.attackProbability >= 75;
  const isWarning = networkStatus === 'Elevated Warning' || forecastData.attackProbability >= 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '80px' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: isCritical
                    ? 'var(--status-critical-solid)'
                    : isWarning
                    ? 'var(--status-warning-solid)'
                    : 'var(--status-healthy-solid)',
                }}
              >
                ● System Status: {networkStatus}
              </span>
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Network Security Overview
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-muted)',
                marginTop: '6px',
                letterSpacing: '-0.01em',
              }}
            >
              AI-powered monitoring and attack forecasting
            </p>
          </div>

          <button
            onClick={() => setActiveNav('Attack Forecast')}
            className="btn btn-secondary"
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', gap: '8px' }}
          >
            <span>Deep Threat Forecast</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Subtle Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {/* Metric 1: Network Traffic */}
          <div
            style={{
              padding: '20px 22px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Network Traffic
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '6px 0' }} className="num-tabular font-mono">
              {overviewMetrics.networkTraffic.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--status-healthy-text)', fontWeight: 500 }}>
              +{overviewMetrics.networkTraffic.trend}% vs diurnal mean
            </div>
          </div>

          {/* Metric 2: Active Connections */}
          <div
            style={{
              padding: '20px 22px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Active Connections
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '6px 0' }} className="num-tabular font-mono">
              {overviewMetrics.activeConnections.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              +{overviewMetrics.activeConnections.trend}% session velocity
            </div>
          </div>

          {/* Metric 3: Threats Detected */}
          <div
            style={{
              padding: '20px 22px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Threats Detected
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: threats.length > 0 ? 'var(--status-critical-solid)' : 'var(--text-primary)',
                letterSpacing: '-0.03em',
                margin: '6px 0',
              }}
              className="num-tabular font-mono"
            >
              {overviewMetrics.threatsDetected.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {threats.filter((t) => t.severity === 'critical' || t.severity === 'high').length} high/critical priority
            </div>
          </div>

          {/* Metric 4: Attack Probability */}
          <div
            style={{
              padding: '20px 22px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid',
              borderColor: isCritical ? 'rgba(255, 59, 48, 0.25)' : 'var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Attack Probability
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: isCritical
                  ? 'var(--status-critical-solid)'
                  : isWarning
                  ? 'var(--status-warning-solid)'
                  : 'var(--status-healthy-solid)',
                letterSpacing: '-0.03em',
                margin: '6px 0',
              }}
              className="num-tabular font-mono"
            >
              {forecastData.attackProbability}%
            </div>
            <div style={{ fontSize: '12px', color: isCritical ? 'var(--status-critical-text)' : 'var(--text-muted)', fontWeight: 500 }}>
              {isCritical ? 'Critical threat probability' : 'Nominal baseline status'}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ATTACK FORECAST (VISUAL CENTERPIECE) */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Attack Forecast
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Predicted network threat probability
            </p>
          </div>

          {/* Horizons Strip: Current Risk, 15 min, 30 min, 60 min */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Current Risk</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">
                {forecastData.currentProbability}%
              </span>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>15 min</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: forecastData.forecast15m >= 70 ? 'var(--status-critical-solid)' : 'var(--text-primary)' }} className="font-mono">
                {forecastData.forecast15m}%
              </span>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>30 min</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: forecastData.forecast30m >= 70 ? 'var(--status-critical-solid)' : 'var(--text-primary)' }} className="font-mono">
                {forecastData.forecast30m}%
              </span>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>60 min</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">
                {forecastData.forecast60m}%
              </span>
            </div>
          </div>
        </div>

        {/* Sophisticated minimal SVG forecast chart */}
        <ForecastAreaChart
          timeline={forecastData.timeline}
          height={240}
          leadTimeMinutes={forecastData.leadTimeMinutes}
          showConfidenceBands={true}
        />

        {/* Prediction summary bar placed directly below chart */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '16px 22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Predicted Attack
            </div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {forecastData.predictedAttackCategory}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {forecastData.predictedAttackSubtype}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Probability
            </div>
            <div
              style={{
                fontSize: '19px',
                fontWeight: 700,
                color: isCritical
                  ? 'var(--status-critical-solid)'
                  : isWarning
                  ? 'var(--status-warning-solid)'
                  : 'var(--status-healthy-solid)',
                marginTop: '2px',
              }}
              className="num-tabular font-mono"
            >
              {forecastData.attackProbability}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Risk Tier: {forecastData.status}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Confidence
            </div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }} className="num-tabular font-mono">
              {forecastData.forecastConfidence}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Empirical variance bounds: ±4.5%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Expected Window
            </div>
            <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--accent-primary)" />
              <span>{forecastData.expectedTimeWindow}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {forecastData.leadTimeMinutes > 0 ? `Est. Lead Time: +${forecastData.leadTimeMinutes} min` : 'Normal baseline trajectory'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLAINABILITY SECTION ("Why this prediction?") */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Why this prediction?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Top contributing network telemetry features driving the AI classification
            </p>
          </div>

          <span className="badge badge-neutral font-mono" style={{ fontSize: '11px' }}>
            Interpretable Model Layer
          </span>
        </div>

        {/* Minimal Horizontal Feature Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {(latestExplanation?.contributingFactors || [
            { id: 'f1', feature: 'Packet Rate', contributionPercent: 32, description: 'Surge in packets per second exceeding diurnal baseline' },
            { id: 'f2', feature: 'SYN Traffic', contributionPercent: 24, description: 'Abnormal ratio of TCP SYN requests without completed ACK handshakes' },
            { id: 'f3', feature: 'Connection Rate', contributionPercent: 19, description: 'Elevated rate of new session initiations per second' },
            { id: 'f4', feature: 'Source Diversity', contributionPercent: 14, description: 'High entropy across originating IP subnet ranges' },
            { id: 'f5', feature: 'Average Packet Size', contributionPercent: 7, description: 'Uniform payload dimensions consistent with flood script telemetry' },
          ]).map((factor) => {
            const isPos = factor.contributionPercent > 0;
            const barWidth = Math.min(100, Math.round((factor.contributionPercent / 36) * 100));

            return (
              <div
                key={factor.id || factor.feature}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {factor.feature}
                  </span>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: isPos ? 'var(--status-critical-solid)' : 'var(--status-healthy-solid)',
                    }}
                    className="font-mono num-tabular"
                  >
                    {isPos ? `+${factor.contributionPercent}%` : `${factor.contributionPercent}%`}
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: isPos ? 'var(--accent-primary)' : 'var(--status-healthy-solid)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s var(--ease-apple)',
                    }}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {factor.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LIVE NETWORK TRAFFIC SECTION */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Live Network
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Volumetric stream showing Incoming, Outgoing, and Suspicious traffic
            </p>
          </div>

          {/* Time range selector pills */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            {(['1H', '6H', '24H', '7D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  backgroundColor: timeRange === r ? '#ffffff' : 'transparent',
                  color: timeRange === r ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: timeRange === r ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Large traffic visualization */}
        <TrafficLineChart data={trafficData} height={230} />
      </section>

      {/* 5. THREAT EVENTS (AIRY, UNCONFINED TABLE) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Threat Events
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Select any event to view model attribution, mitigation, and PCAP header telemetry
            </p>
          </div>

          <button
            onClick={() => setActiveNav('Threat Detection')}
            className="btn btn-ghost btn-sm"
            style={{ gap: '4px' }}
          >
            <span>View All ({threats.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Clean, open table with thin separators and whitespace */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="soc-table soc-table-clickable">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Source Endpoint</th>
                  <th>Destination</th>
                  <th>Protocol</th>
                  <th>Threat Vector</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {threats.slice(0, 5).map((threat) => (
                  <tr
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    title="Open floating threat detail sheet"
                  >
                    <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {threat.timestamp}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">
                        {threat.sourceIp}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {threat.sourceCountry.split(' ')[0]}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono" style={{ fontSize: '12.5px' }}>
                        {threat.destinationIp}:{threat.destinationPort}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                        {threat.protocol}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {threat.threat}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Confidence: {threat.confidence}%
                      </div>
                    </td>
                    <td>
                      <StatusBadge value={threat.severity} />
                    </td>
                    <td>
                      <StatusBadge value={threat.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--accent-primary)',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};
