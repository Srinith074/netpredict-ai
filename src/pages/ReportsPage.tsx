import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Shield,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { forecastData, overviewMetrics, threats, user, addToast } = useApp();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportDateRange, setReportDateRange] = useState('Today (24 Hours)');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = `NETPREDICT AI - EXECUTIVE NETWORK SECURITY & FORECASTING REPORT
Evaluation Benchmark: SIH 2026 AI Network Security
Generated: ${new Date().toLocaleString()}
Operator: ${user?.name} (${user?.role})

1. EXECUTIVE SUMMARY
Network Perimeter Status: PROTECTED
Active Flows Monitored: ${overviewMetrics.networkTraffic.value} packets/min
Active Connections: ${overviewMetrics.activeConnections.value}
Threats Detected (24h): ${threats.length}
Predicted Imminent Attacks: ${overviewMetrics.predictedAttacks.value}

2. FORECASTING INTELLIGENCE (NEXT 60 MINUTES)
Imminent Attack Probability: ${forecastData.attackProbability}%
Forecast Confidence: ${forecastData.forecastConfidence}%
Predicted Category: ${forecastData.predictedAttackCategory} (${forecastData.predictedAttackSubtype})
Expected Window: ${forecastData.expectedTimeWindow}
Projected Saturation Peak: +${forecastData.leadTimeMinutes} min

3. PRIMARY MITIGATION PLAYBOOK
${forecastData.recommendedMitigations.map((m, i) => `${i + 1}. ${m}`).join('\n')}

CONFIDENTIAL - SOC OPERATIONS`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NetPredict_Executive_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Executive Report Exported', 'Report saved as text file.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Security Intelligence & Audit Reports
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Periodic SOC assessments, predictive threat summaries, and compliance audit exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setReportModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <FileText size={14} />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* 1. Daily Security Summary */}
      <div className="soc-card" style={{ padding: '20px 24px' }}>
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">
              <Shield size={17} color="var(--accent-primary)" />
              <span>Daily Security Posture Summary</span>
            </h2>
            <div className="soc-card-subtitle">
              Comprehensive telemetry aggregate for period: <strong>{reportDateRange}</strong>
            </div>
          </div>

          <span className="badge badge-safe font-mono">
            POSTURE: PROTECTED (DEFCON 4)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Perimeter Defense Status
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All 12 distributed probe sensors reported uninterrupted telemetry. Peak anomalous traffic peaked at <strong>842.6 MB/s</strong>, with 94.2% of malicious payloads successfully quarantined prior to core application tier ingestion.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Forecasting Model Impact
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The Bi-LSTM and TFT temporal model provided an average early warning lead time of <strong>21 minutes</strong>. Proactive rate limiting on upstream border gateways reduced expected downtime impact to <strong>0.00%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Attack Statistics + Traffic Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        
        {/* Attack Statistics */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Attack Vector Breakdown</h2>
              <div className="soc-card-subtitle">Classified incidents in last 24h</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { type: 'Distributed Denial of Service (DDoS)', count: 18, severity: 'Critical', pct: 38 },
              { type: 'Port & Service Reconnaissance (Port Scan)', count: 11, severity: 'Medium', pct: 23 },
              { type: 'Authentication Password Spraying (Brute Force)', count: 7, severity: 'High', pct: 15 },
              { type: 'Botnet Command & Control (Mirai variant)', count: 5, severity: 'Critical', pct: 11 },
              { type: 'SQL Injection & Web Exploits', count: 4, severity: 'High', pct: 8 },
              { type: 'Exploit Probes (EternalBlue pattern)', count: 2, severity: 'Critical', pct: 5 },
            ].map((stat) => (
              <div key={stat.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stat.type}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Severity: {stat.severity}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }} className="font-mono">{stat.count} events</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.pct}% total</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Summary */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Forecast Lead-Time Summary</h2>
              <div className="soc-card-subtitle">AI early warning verification performance</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Average Pre-Attack Warning Window</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }} className="font-mono">
                18.4 minutes
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Allows autonomous BGP flowspec and firewall rule injection</div>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forecast True Positive Ratio</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-healthy-solid)', marginTop: '2px' }} className="font-mono">
                93.7%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attacks successfully anticipated before peak packet rates</div>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>False Alarm Rate (Over-prediction)</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }} className="font-mono">
                1.2%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Minimal operator fatigue from inaccurate predictions</div>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Hardening Actions */}
      <div className="soc-card" style={{ padding: '20px 24px' }}>
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">
              <CheckCircle2 size={17} color="var(--status-healthy-solid)" />
              <span>Recommended Security Posture Hardening</span>
            </h2>
            <div className="soc-card-subtitle">
              Prioritized countermeasures based on forecasted attack patterns
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 1, action: 'Enable BGP Flowspec rate-limiting on AS45899 prefix', priority: 'High', reason: 'Repeated source IP cluster staging DDoS attacks over last 48 hours.' },
            { id: 2, action: 'Transition Bastion Host 10.0.1.22 to Certificate / FIDO2 authentication', priority: 'High', reason: 'High incidence of distributed brute force password sprays targeting Port 22.' },
            { id: 3, action: 'Segment IoT Surveillance VLAN 3 into isolated micro-perimeter', priority: 'Medium', reason: 'Mirai variant command-and-control beaconing flagged from host 10.0.3.45.' },
            { id: 4, action: 'Rotate API access tokens for /api/v2/authenticate endpoint', priority: 'Medium', reason: 'Anomalous SQL tautology probes observed targeting user login parameters.' },
          ].map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.action}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Rationale: {item.reason}
                </div>
              </div>
              <span className={`badge ${item.priority === 'High' ? 'badge-critical' : 'badge-warning'}`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Executive Report Modal */}
      {reportModalOpen && (
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
          onClick={() => setReportModalOpen(false)}
        >
          <div
            style={{
              width: '680px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '28px',
              border: '1px solid var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-primary font-mono">SOC EXECUTIVE AUDIT</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SIH 2026 Evaluation</span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Network Attack Forecasting & Threat Intelligence Report
                </h2>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Report Content Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', backgroundColor: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assessor / Analyst</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Organization</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CERT-In / NCCC</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Timestamp</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  1. Executive Assessment
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '12px' }}>
                  The NetPredict AI system successfully inspected <strong>1.84M packets/min</strong>. A predicted <strong>{forecastData.predictedAttackCategory}</strong> attack is forecasted with <strong>{forecastData.attackProbability}% probability</strong> within a lead-time window of <strong>{forecastData.expectedTimeWindow}</strong>. Model confidence is established at <strong>{forecastData.forecastConfidence}%</strong>.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  2. Top Observed Threats
                </h4>
                <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {threats.slice(0, 4).map((t) => (
                    <li key={t.id}>
                      <strong>{t.threat}</strong> from <code>{t.sourceIp}</code> targeting <code>{t.destinationIp}:{t.destinationPort}</code> ({t.confidence}% conf) — Status: <em>{t.status.toUpperCase()}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  3. Autonomous Preemptive Mitigations
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {forecastData.recommendedMitigations.map((m, i) => (
                    <div key={i} style={{ fontSize: '12px', padding: '6px 10px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      {i + 1}. {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '20px' }}>
              <button onClick={handlePrint} className="btn btn-secondary btn-sm">
                <Printer size={13} />
                <span>Print Document</span>
              </button>
              <button onClick={handleDownloadReport} className="btn btn-primary btn-sm">
                <Download size={13} />
                <span>Download Report (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
