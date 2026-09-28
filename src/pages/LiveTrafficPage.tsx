import React, { useState } from 'react';
import {
  Activity,
  HardDrive,
  Server,
  Globe,
  Cpu,
  Layers,
  FileCode,
  X,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NetworkTrafficRecord } from '../types';

export const LiveTrafficPage: React.FC = () => {
  const { liveTraffic, isSimulating, lastUpdated, trafficHistory } = useApp();
  const [inspectedFlow, setInspectedFlow] = useState<NetworkTrafficRecord | null>(null);

  // Take recent flows in reverse chronological order
  const displayFlows = [...trafficHistory].reverse().slice(0, 15);

  const ppsHistory = trafficHistory.slice(-10).map((r) => r.packetRate);
  const maxPps = Math.max(...ppsHistory, 100000);

  const connRateHistory = trafficHistory.slice(-10).map((r) => r.connectionFrequency);
  const maxConnRate = Math.max(...connRateHistory, 150);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              className={isSimulating ? 'pulse-live' : ''}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isSimulating ? 'var(--status-healthy-solid)' : 'var(--text-muted)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isSimulating ? 'Live Ring Buffer Ingestion Active' : 'Simulation Stream Idle'}
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Live Network Traffic Telemetry
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time interface monitoring on Core Edge Trunks (eth0 / eth1). Updated {lastUpdated}.
          </p>
        </div>

        <span className="badge badge-primary font-mono" style={{ padding: '6px 12px', fontSize: '12px' }}>
          INGESTION RATE: {liveTraffic.packetsPerSec.toLocaleString()} PPS
        </span>
      </div>

      {/* 5 Core Traffic Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Packets / Sec</span>
            <Activity size={16} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }} className="num-tabular font-mono">
            {liveTraffic.packetsPerSec.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-healthy-text)', marginTop: '4px' }}>
            Line rate 10 Gbps capability
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Throughput (Bytes/sec)</span>
            <HardDrive size={16} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }} className="num-tabular font-mono">
            {liveTraffic.bytesPerSec}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Aggregate duplex bandwidth
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Active Connections</span>
            <Server size={16} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }} className="num-tabular font-mono">
            {liveTraffic.activeConnections.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Concurrent TCP/UDP states
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Unique Source IPs</span>
            <Globe size={16} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }} className="num-tabular font-mono">
            {liveTraffic.uniqueSourceIps.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: liveTraffic.uniqueSourceIps > 300 ? 'var(--status-critical-text)' : 'var(--text-muted)', marginTop: '4px' }}>
            {liveTraffic.uniqueSourceIps > 300 ? 'High entropy (Swarm attack)' : 'Expected client diversity'}
          </div>
        </div>

        <div className="soc-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Unique Dest Endpoints</span>
            <Cpu size={16} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }} className="num-tabular font-mono">
            {liveTraffic.uniqueDestIps.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across internal subnets
          </div>
        </div>
      </div>

      {/* 4 Telemetry Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        
        {/* Chart 1: Packet Rate */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Packet Rate (pps)</h2>
              <div className="soc-card-subtitle">Real-time packet ingestion rate</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }} className="font-mono">
              {liveTraffic.packetsPerSec.toLocaleString()} pps
            </span>
          </div>

          <div style={{ height: '160px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {[0, 0.5, 1].map((r) => (
                <line key={r} x1="30" y1={20 + r * 90} x2="380" y2={20 + r * 90} stroke="#e2e8f0" strokeWidth="1" />
              ))}
              <polyline
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={ppsHistory
                  .map((val, i) => {
                    const x = 30 + (i / Math.max(1, ppsHistory.length - 1)) * 350;
                    const y = 110 - (val / Math.max(1, maxPps)) * 85;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Chart 2: Bandwidth Throughput */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Bandwidth (Mbps)</h2>
              <div className="soc-card-subtitle">Inbound vs Outbound utilization</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">
              {liveTraffic.currentBandwidthMbps.toFixed(1)} Mbps
            </span>
          </div>

          <div style={{ height: '160px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {[0, 0.5, 1].map((r) => (
                <line key={r} x1="30" y1={20 + r * 90} x2="380" y2={20 + r * 90} stroke="#e2e8f0" strokeWidth="1" />
              ))}
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                points="30,85 70,80 110,75 150,70 190,65 230,55 270,50 310,45 350,40 380,38"
              />
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="1.8"
                points="30,95 70,92 110,94 150,90 190,88 230,85 270,84 310,82 350,80 380,82"
              />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', marginTop: '6px' }}>
              <span style={{ color: '#0284c7', fontWeight: 600 }}>● Inbound</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>● Outbound</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Protocol Distribution */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Protocol Distribution</h2>
              <div className="soc-card-subtitle">Layer 4 protocol breakdown</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
            {[
              { name: 'TCP', pct: liveTraffic.tcpPercent, color: '#0284c7' },
              { name: 'UDP', pct: liveTraffic.udpPercent, color: '#64748b' },
              { name: 'ICMP', pct: liveTraffic.icmpPercent, color: '#d97706' },
              { name: 'Other', pct: liveTraffic.otherPercent, color: '#94a3b8' },
            ].map((item) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">{item.pct}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Connection Rate */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Connection Rate (cps)</h2>
              <div className="soc-card-subtitle">New session initiations per second</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-warning-text)' }} className="font-mono">
              {connRateHistory.slice(-1)[0] || 32} cps
            </span>
          </div>

          <div style={{ height: '160px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {[0, 0.5, 1].map((r) => (
                <line key={r} x1="30" y1={20 + r * 90} x2="380" y2={20 + r * 90} stroke="#e2e8f0" strokeWidth="1" />
              ))}
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={connRateHistory
                  .map((val, i) => {
                    const x = 30 + (i / Math.max(1, connRateHistory.length - 1)) * 350;
                    const y = 110 - (val / Math.max(1, maxConnRate)) * 85;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

      </div>

      {/* Live Ingested 24-Feature Traffic Stream Table */}
      <div className="soc-card">
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">Live Ingested Network Flows (24-Feature Dataset)</h2>
            <div className="soc-card-subtitle">
              Generated by trafficService & preprocessed by featureService (Click any flow to inspect full 24-feature vector)
            </div>
          </div>
          <span className="badge badge-healthy font-mono">
            BUFFER: {trafficHistory.length} FLOWS IN MEMORY
          </span>
        </div>

        <div className="soc-table-container">
          <table className="soc-table soc-table-clickable">
            <thead>
              <tr>
                <th>Flow ID</th>
                <th>Timestamp</th>
                <th>Source Address</th>
                <th>Destination Endpoint</th>
                <th>Protocol</th>
                <th>Flags</th>
                <th>Packets</th>
                <th>SYN / ACK</th>
                <th>Failed Conn</th>
                <th>Scenario Profile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayFlows.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: '40px 24px' }}>
                    <div className="soc-empty-state">
                      <div className="soc-empty-state-icon">
                        <Activity size={28} className="pulse-live" color="var(--accent-primary)" />
                      </div>
                      <div className="soc-empty-state-title">
                        Awaiting Ingested Telemetry Flows
                      </div>
                      <div className="soc-empty-state-desc">
                        Listening on core edge interfaces (eth0/eth1). Flow aggregator is buffering telemetry records into ring buffer memory.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                displayFlows.map((flow) => {
                const isSynSpike = flow.synCount > flow.ackCount * 3;
                return (
                  <tr
                    key={flow.id}
                    onClick={() => setInspectedFlow(flow)}
                    title="Click to inspect all 24 raw network features"
                  >
                    <td className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      {flow.id}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px' }}>
                      {flow.timestamp}
                    </td>
                    <td className="font-mono" style={{ fontWeight: 600 }}>
                      {flow.sourceIp}:{flow.sourcePort}
                    </td>
                    <td className="font-mono">
                      {flow.destinationIp}:{flow.destinationPort}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{flow.protocol}</span>
                    </td>
                    <td className="font-mono" style={{ fontSize: '11px' }}>
                      {flow.tcpFlags}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px' }}>
                      {flow.packetCount.toLocaleString()}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: isSynSpike ? 'var(--status-critical-solid)' : 'var(--text-primary)' }}>
                      {flow.synCount} / {flow.ackCount}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: flow.failedConnectionCount > 50 ? 'var(--status-critical-solid)' : 'var(--text-muted)' }}>
                      {flow.failedConnectionCount}
                    </td>
                    <td>
                      <span className={`badge ${flow.scenario === 'normal' ? 'badge-safe' : flow.scenario === 'ddos' ? 'badge-critical' : 'badge-warning'}`}>
                        {flow.scenario.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                        <Search size={12} /> Inspect
                      </span>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-FEATURE RECORD INSPECTOR MODAL */}
      {inspectedFlow && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setInspectedFlow(null)}
        >
          <div
            style={{
              width: '740px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-primary font-mono">{inspectedFlow.id}</span>
                  <span className={`badge ${inspectedFlow.scenario === 'normal' ? 'badge-safe' : 'badge-critical'}`}>
                    {inspectedFlow.scenario.toUpperCase()} SCENARIO
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  24-Feature Network Flow Inspection
                </h3>
              </div>
              <button onClick={() => setInspectedFlow(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* 24 Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1. Timestamp</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.timestamp}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2. Source IP</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.sourceIp}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3. Destination IP</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.destinationIp}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4. Source Port</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.sourcePort}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>5. Destination Port</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.destinationPort}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>6. Protocol</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inspectedFlow.protocol}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7. Packet Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.packetCount.toLocaleString()}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>8. Byte Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{(inspectedFlow.byteCount / 1024).toFixed(1)} KB</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>9. Packet Rate</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.packetRate.toLocaleString()} pps</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10. Byte Rate</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{(inspectedFlow.byteRate / 1024).toFixed(1)} KB/s</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>11. Flow Duration</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.flowDuration} ms</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12. SYN Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.synCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>13. ACK Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.ackCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>14. RST Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.rstCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>15. Connection Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.connectionCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>16. Failed Connection Count</span>
                <div style={{ fontWeight: 600, color: 'var(--status-critical-solid)' }} className="font-mono">{inspectedFlow.failedConnectionCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>17. Unique Source Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.uniqueSourceCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>18. Unique Destination Count</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.uniqueDestinationCount}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>19. Average Packet Size</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.avgPacketSize} bytes</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>20. TCP Flags</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.tcpFlags}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>21. DNS Requests</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.dnsRequests}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>22. HTTP Requests</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.httpRequests}</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>23. Connection Frequency</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.connectionFrequency} conn/sec</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24. Previous Attack Indicator</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">{inspectedFlow.previousAttackIndicator}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '20px' }}>
              <button onClick={() => setInspectedFlow(null)} className="btn btn-secondary btn-sm">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
