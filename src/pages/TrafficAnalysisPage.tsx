import React, { useState } from 'react';
import {
  BarChart3,
  Filter,
  Layers,
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Cpu,
} from 'lucide-react';
import { AnomalyScoreChart } from '../components/charts/AnomalyScoreChart';

export const TrafficAnalysisPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24H');
  const [protocol, setProtocol] = useState('ALL');
  const [sourceSubnet, setSourceSubnet] = useState('ALL');
  const [destSubnet, setDestSubnet] = useState('ALL');
  const [trafficType, setTrafficType] = useState('ALL');

  // Top Talkers Data
  const topTalkers = [
    { ip: '198.51.100.42', country: 'RU (AS45899)', packets: '2.84M', bytes: '4.8 GB', flows: 14200, threatLevel: 'critical' },
    { ip: '203.0.113.88', country: 'CN (AS4134)', packets: '840K', bytes: '1.2 GB', flows: 3820, threatLevel: 'high' },
    { ip: '10.0.0.8', country: 'Internal Cluster', packets: '14.2M', bytes: '18.4 GB', flows: 28900, threatLevel: 'safe' },
    { ip: '192.0.2.144', country: 'NL (AS60781)', packets: '320K', bytes: '890 MB', flows: 1240, threatLevel: 'high' },
    { ip: '198.51.100.19', country: 'IR (AS58224)', packets: '180K', bytes: '340 MB', flows: 5400, threatLevel: 'medium' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Deep Network Traffic Analysis
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Multidimensional flow feature extraction, anomaly trajectory, and connection behavior forensics.
        </p>
      </div>

      {/* Analytical Filter Controls */}
      <div
        className="soc-card"
        style={{
          padding: '14px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Time Range
          </label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select-input">
            <option value="1H">Past 1 Hour</option>
            <option value="6H">Past 6 Hours</option>
            <option value="24H">Past 24 Hours</option>
            <option value="7D">Past 7 Days</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Protocol
          </label>
          <select value={protocol} onChange={(e) => setProtocol(e.target.value)} className="select-input">
            <option value="ALL">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
            <option value="HTTPS">HTTPS (443)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Source Subnet
          </label>
          <select value={sourceSubnet} onChange={(e) => setSourceSubnet(e.target.value)} className="select-input">
            <option value="ALL">All Source CIDRs</option>
            <option value="EXT">External WAN (0.0.0.0/0)</option>
            <option value="DMZ">DMZ (10.0.1.0/24)</option>
            <option value="APP">Application (10.0.2.0/24)</option>
            <option value="IOT">IoT Network (10.0.3.0/24)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Destination Endpoint
          </label>
          <select value={destSubnet} onChange={(e) => setDestSubnet(e.target.value)} className="select-input">
            <option value="ALL">All Destinations</option>
            <option value="10.0.1.50">Core Gateway (10.0.1.50)</option>
            <option value="10.0.1.22">Bastion Host (10.0.1.22)</option>
            <option value="10.0.2.10">Web Ingress (10.0.2.10)</option>
            <option value="10.0.2.80">DNS Cluster (10.0.2.80)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Traffic Type
          </label>
          <select value={trafficType} onChange={(e) => setTrafficType(e.target.value)} className="select-input">
            <option value="ALL">All Traffic</option>
            <option value="INGRESS">Inbound / Ingress</option>
            <option value="EGRESS">Outbound / Egress</option>
            <option value="INTERNAL">Lateral / East-West</option>
          </select>
        </div>
      </div>

      {/* Anomaly Score Timeline (Key requirement) */}
      <div className="soc-card" style={{ padding: '20px 24px' }}>
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">
              <AlertTriangle size={17} color="var(--status-critical-solid)" />
              <span>Flow Anomaly Score Timeline</span>
            </h2>
            <div className="soc-card-subtitle">
              Calculated via Isolation Forest & Bi-LSTM Autoencoder flow reconstruction error (Anomaly threshold: 0.650)
            </div>
          </div>
          <span className="badge badge-critical font-mono">
            PEAK SCORE: 0.942
          </span>
        </div>

        <AnomalyScoreChart height={220} />
      </div>

      {/* Grid: Packet Size Distribution + Connection Behavior */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        
        {/* Packet Size Distribution Histogram */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Packet Size Distribution</h2>
              <div className="soc-card-subtitle">Payload frame length frequencies (Bytes)</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: '0 – 64 Bytes (SYN/FIN Probes)', pct: 44, count: '1.24M', note: 'Abnormal flood signature' },
              { label: '65 – 128 Bytes (TCP ACK / Control)', pct: 18, count: '520K', note: 'Handshake packets' },
              { label: '129 – 512 Bytes (DNS / Small Payloads)', pct: 14, count: '390K', note: 'Standard queries' },
              { label: '513 – 1024 Bytes (HTTP / Application)', pct: 10, count: '280K', note: 'Data frames' },
              { label: '1025 – 1500 Bytes (Jumbo / Full MTU)', pct: 14, count: '410K', note: 'File streaming' },
            ].map((b) => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{b.label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">{b.pct}% ({b.count})</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', backgroundColor: b.pct >= 40 ? 'var(--status-critical-solid)' : 'var(--accent-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Behavior Statistics */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Connection Behavior Metrics</h2>
              <div className="soc-card-subtitle">Statistical flow properties used in model inference</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Median Flow Duration</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                142 ms
              </div>
              <div style={{ fontSize: '11px', color: 'var(--status-critical-text)', marginTop: '2px' }}>
                -68% shorter than baseline
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inter-Arrival Variance</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                0.014
              </div>
              <div style={{ fontSize: '11px', color: 'var(--status-critical-text)', marginTop: '2px' }}>
                Scripted flood uniformity
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SYN / ACK Ratio</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-critical-solid)', marginTop: '2px' }} className="font-mono">
                48.2 : 1
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Severe handshake deficit
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Port Entropy Score</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">
                0.844
              </div>
              <div style={{ fontSize: '11px', color: 'var(--status-warning-text)', marginTop: '2px' }}>
                Scanning fan-out pattern
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Top Talkers Table */}
      <div className="soc-card">
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">Top Active Endpoints (By Volume)</h2>
            <div className="soc-card-subtitle">Highest volume network hosts during current analysis window</div>
          </div>
        </div>

        <div className="soc-table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Host IP Address</th>
                <th>Location / ASN</th>
                <th>Packet Count</th>
                <th>Byte Volume</th>
                <th>Flow Count</th>
                <th>Threat Risk</th>
              </tr>
            </thead>
            <tbody>
              {topTalkers.map((talker) => (
                <tr key={talker.ip}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{talker.ip}</td>
                  <td>{talker.country}</td>
                  <td className="font-mono">{talker.packets}</td>
                  <td className="font-mono">{talker.bytes}</td>
                  <td className="font-mono">{talker.flows.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${talker.threatLevel === 'critical' ? 'badge-critical' : talker.threatLevel === 'high' ? 'badge-high' : talker.threatLevel === 'medium' ? 'badge-medium' : 'badge-safe'}`}>
                      {talker.threatLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
