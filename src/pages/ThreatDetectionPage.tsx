import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { AttackCategory, ProtocolType, Severity, ThreatEvent } from '../types';

export const ThreatDetectionPage: React.FC = () => {
  const { threats, setSelectedThreat, updateThreatStatus, addToast } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Counts
  const counts = useMemo(() => {
    return {
      total: threats.length,
      critical: threats.filter((t) => t.severity === 'critical').length,
      high: threats.filter((t) => t.severity === 'high').length,
      medium: threats.filter((t) => t.severity === 'medium').length,
      low: threats.filter((t) => t.severity === 'low').length,
    };
  }, [threats]);

  // Filtered threats
  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      if (selectedSeverity !== 'ALL' && t.severity !== selectedSeverity.toLowerCase()) return false;
      if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
      if (selectedProtocol !== 'ALL' && t.protocol !== selectedProtocol) return false;
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesIp = t.sourceIp.toLowerCase().includes(q) || t.destinationIp.toLowerCase().includes(q);
        const matchesThreat = t.threat.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesCountry = t.sourceCountry.toLowerCase().includes(q);
        if (!matchesIp && !matchesThreat && !matchesCat && !matchesCountry) return false;
      }
      return true;
    });
  }, [threats, selectedSeverity, selectedCategory, selectedProtocol, selectedStatus, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Source IP', 'Source Country', 'Destination IP', 'Port', 'Protocol', 'Threat', 'Category', 'Severity', 'Confidence', 'Status'];
    const rows = filteredThreats.map((t) => [
      t.id,
      t.timestamp,
      t.sourceIp,
      `"${t.sourceCountry}"`,
      t.destinationIp,
      t.destinationPort,
      t.protocol,
      `"${t.threat}"`,
      t.category,
      t.severity,
      `${t.confidence}%`,
      t.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `threat_detection_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Threats Exported', `${filteredThreats.length} threats saved as CSV.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Real-Time Threat Detection
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Ingested network flows flagged by autoencoders, isolation forests, and signature heuristics.
          </p>
        </div>

        <button onClick={handleExportCsv} className="btn btn-secondary btn-sm">
          <Download size={13} />
          <span>Export Filtered Events (CSV)</span>
        </button>
      </div>

      {/* Detection Counts Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
        <div className="soc-card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Detection Count</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
            {counts.total}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total active & monitored flows</div>
        </div>

        <div className="soc-card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--status-critical-solid)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Critical Threats</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-critical-solid)', marginTop: '2px' }} className="num-tabular">
            {counts.critical}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-critical-text)' }}>Immediate intervention required</div>
        </div>

        <div className="soc-card" style={{ padding: '14px 18px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>High Threats</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }} className="num-tabular">
            {counts.high}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Severe anomaly detected</div>
        </div>

        <div className="soc-card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--status-warning-solid)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Medium Threats</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-warning-solid)', marginTop: '2px' }} className="num-tabular">
            {counts.medium}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Suspicious behavior / Recon</div>
        </div>

        <div className="soc-card" style={{ padding: '14px 18px', borderLeft: '4px solid #64748b' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Low Threats</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }} className="num-tabular">
            {counts.low}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Informational / Low probability</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="soc-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--text-muted)' }}>
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by IP, Threat, Country, or CVE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Severity filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="select-input"
              style={{ width: '110px' }}
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Attack Type filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Type:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-input"
              style={{ width: '130px' }}
            >
              <option value="ALL">All Types</option>
              <option value="DDoS">DDoS</option>
              <option value="Port Scan">Port Scan</option>
              <option value="Brute Force">Brute Force</option>
              <option value="Botnet">Botnet</option>
              <option value="Web Attack">Web Attack</option>
              <option value="Malware">Malware</option>
            </select>
          </div>

          {/* Protocol filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Protocol:</span>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="select-input"
              style={{ width: '100px' }}
            >
              <option value="ALL">All</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="HTTPS">HTTPS</option>
            </select>
          </div>
        </div>

        {/* Reset filters button if active */}
        {(selectedSeverity !== 'ALL' || selectedCategory !== 'ALL' || selectedProtocol !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSeverity('ALL');
              setSelectedCategory('ALL');
              setSelectedProtocol('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Threats Table */}
      <div className="soc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="soc-table-container" style={{ border: 'none' }}>
          <table className="soc-table soc-table-clickable">
            <thead>
              <tr>
                <th>Threat ID</th>
                <th>Time</th>
                <th>Source IP & Geo</th>
                <th>Destination Endpoint</th>
                <th>Protocol</th>
                <th>Attack Vector</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px 24px' }}>
                    <div className="soc-empty-state">
                      <div className="soc-empty-state-icon">
                        <Filter size={28} />
                      </div>
                      <div className="soc-empty-state-title">
                        No Matching Threat Events Found
                      </div>
                      <div className="soc-empty-state-desc">
                        No real-time network flows match your active criteria (Severity: {selectedSeverity}, Type: {selectedCategory}, Protocol: {selectedProtocol}).
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSeverity('ALL');
                          setSelectedCategory('ALL');
                          setSelectedProtocol('ALL');
                          setSelectedStatus('ALL');
                          setSearchQuery('');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '8px' }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => (
                  <tr
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    title="Click row to open detailed threat telemetry and explainable reasoning"
                  >
                    <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '12px' }}>
                      {threat.id}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {threat.timestamp}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">
                        {threat.sourceIp}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {threat.sourceCountry}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono">{threat.destinationIp}:{threat.destinationPort}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{threat.protocol}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {threat.threat}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Category: {threat.category}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: threat.confidence >= 90 ? 'var(--status-critical-text)' : 'var(--accent-primary)' }} className="font-mono">
                        {threat.confidence}%
                      </span>
                    </td>
                    <td>
                      <StatusBadge value={threat.severity} />
                    </td>
                    <td>
                      <StatusBadge value={threat.status} />
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {threat.status !== 'blocked' && (
                          <button
                            onClick={() => {
                              updateThreatStatus(threat.id, 'blocked');
                              addToast('IP Isolated', `Traffic from ${threat.sourceIp} dropped at perimeter.`, 'warning');
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Block / Isolate Source IP"
                            style={{ color: 'var(--status-critical-text)', padding: '3px 6px' }}
                          >
                            <Ban size={12} />
                          </button>
                        )}
                        {threat.status !== 'mitigated' && (
                          <button
                            onClick={() => {
                              updateThreatStatus(threat.id, 'mitigated');
                              addToast('Threat Mitigated', `Threat ${threat.id} marked mitigated.`, 'success');
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Mark as Mitigated"
                            style={{ color: 'var(--status-healthy-text)', padding: '3px 6px' }}
                          >
                            <CheckCircle2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
