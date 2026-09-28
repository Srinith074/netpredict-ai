import React from 'react';
import {
  Cpu,
  ArrowDown,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileCode2,
} from 'lucide-react';
import {
  FEATURE_IMPORTANCE_LIST,
  MODEL_METADATA,
  MODEL_PERFORMANCE_METRICS,
  MODEL_PIPELINE_STAGES,
} from '../services/mockData';

export const AIModelPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-primary font-mono">v1.0-STABLE</span>
          <span className="badge badge-safe">ONLINE (FP16 ONNX)</span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          AI Model Performance & Architecture
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Evaluation metrics, deep pipeline topology, and feature importance for {MODEL_METADATA.name}.
        </p>
      </div>

      {/* MANDATORY PROMPT DISCLAIMER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <AlertCircle size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Demonstration Prototype Benchmark Disclaimer
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
            The evaluation scores below represent <strong>DEMO / MOCK benchmark metrics</strong> calibrated on industry standard datasets (CICIDS2017 & TON-IoT) for prototype demonstration purposes. When deployed in live environments, metrics reflect the active Python inference server telemetry.
          </div>
        </div>
      </div>

      {/* Model Benchmark Performance Cards (5 Core Metrics + FPR) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
        {MODEL_PERFORMANCE_METRICS.map((metric) => (
          <div key={metric.name} className="soc-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
              {metric.name}
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: metric.name === 'False Positive Rate' ? 'var(--status-healthy-solid)' : 'var(--text-primary)',
                marginTop: '4px',
              }}
              className="num-tabular font-mono"
            >
              {metric.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Target: <strong style={{ color: 'var(--accent-primary)' }}>{metric.benchmarkTarget}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Model Metadata Strip */}
      <div
        className="soc-card"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          backgroundColor: '#ffffff',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Architecture</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }}>
            {MODEL_METADATA.architecture}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Last Trained</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }} className="font-mono">
            {MODEL_METADATA.lastTrained}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Training Samples</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }} className="font-mono">
            {MODEL_METADATA.trainingSamples}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Features</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }}>
            {MODEL_METADATA.featuresCount} Network Flow Features
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Inference Latency</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '3px' }} className="font-mono">
            {MODEL_METADATA.inferenceLatencyAvg}
          </div>
        </div>
      </div>

      {/* MODEL ARCHITECTURE VISUALIZATION (Key requirement) */}
      <div className="soc-card" style={{ padding: '22px 24px' }}>
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">
              <Layers size={18} color="var(--accent-primary)" />
              <span>Model Pipeline & Inference Architecture</span>
            </h2>
            <div className="soc-card-subtitle">
              End-to-end data pipeline from wire capture to early-warning forecasting
            </div>
          </div>
        </div>

        {/* Vertical Pipeline Flow with Clean Connectors */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
          {MODEL_PIPELINE_STAGES.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary-subtle)',
                      border: '1px solid var(--accent-primary-border)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {stage.id}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {stage.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {stage.description}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                    {stage.tech}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }} className="font-mono">
                    +{stage.latencyMs} ms
                  </div>
                </div>
              </div>

              {/* Arrow Connector between steps */}
              {idx < MODEL_PIPELINE_STAGES.length - 1 && (
                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDown size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Feature Importance (Left) + Confusion Matrix (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        
        {/* Feature Importance */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Top Feature Importance (Gini / SHAP)</h2>
              <div className="soc-card-subtitle">Dominant attributes contributing to attack forecasting</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FEATURE_IMPORTANCE_LIST.map((feat) => (
              <div key={feat.feature}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="font-mono">
                    {feat.feature}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }} className="font-mono">
                    {(feat.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${feat.importance * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="soc-card">
          <div className="soc-card-header">
            <div>
              <h2 className="soc-card-title">Confusion Matrix (Holdout Test Set)</h2>
              <div className="soc-card-subtitle">120,000 evaluated network flow samples</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-healthy-bg)', border: '1px solid var(--status-healthy-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-healthy-text)', fontWeight: 600 }}>True Positives (TP)</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-healthy-text)', marginTop: '4px' }} className="font-mono">
                  34,810 flows
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Actual attacks correctly forecasted</div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-warning-text)', fontWeight: 600 }}>False Positives (FP)</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-warning-text)', marginTop: '4px' }} className="font-mono">
                  420 flows
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Normal flows flagged (FPR: 1.2%)</div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-critical-text)', fontWeight: 600 }}>False Negatives (FN)</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-critical-text)', marginTop: '4px' }} className="font-mono">
                  2,340 flows
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Missed attacks (Low volume stealth)</div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-healthy-bg)', border: '1px solid var(--status-healthy-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-healthy-text)', fontWeight: 600 }}>True Negatives (TN)</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-healthy-text)', marginTop: '4px' }} className="font-mono">
                  82,430 flows
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clean traffic verified normal</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SERVICE ARCHITECTURE BOUNDARIES (Clear modular separation for Python backend replacement) */}
      <div className="soc-card" style={{ padding: '20px 24px' }}>
        <div className="soc-card-header">
          <div>
            <h2 className="soc-card-title">
              <Cpu size={17} color="var(--accent-primary)" />
              <span>Service Architecture Boundaries (Python ML Backend Interface)</span>
            </h2>
            <div className="soc-card-subtitle">
              Strict modular separation allowing drop-in replacement with scikit-learn / PyTorch / FastAPI services
            </div>
          </div>
          <span className="badge badge-primary font-mono">
            REST & gRPC SPEC READY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              1. trafficService
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              24-Feature Telemetry Ingestion
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Generates raw packet frames (rates, SYN/ACK/RST flags, connection frequency, and duration).
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              FastAPI: <code>POST /api/v1/traffic/ingest</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              2. featureService
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Preprocessing & Normalization
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Applies RobustScaler normalization, entropy calculations, and handshake asymmetry ratios.
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              FastAPI: <code>POST /api/v1/features/extract</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              3. anomalyService
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Multi-variate Anomaly Detection
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Isolation Forest & Autoencoder flow reconstruction error against the 0.65 threshold.
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              FastAPI: <code>POST /api/v1/anomaly/score</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              4. predictionService
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Multi-Class Attack Classifier
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Softmax classifier across Normal, DDoS, Port Scan, Brute Force, Botnet, Web, Malware.
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              FastAPI: <code>POST /api/v1/classify</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              5. forecastService
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              15m / 30m / 60m Forecaster + XAI
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Temporal Fusion Transformer predicting probability trajectory, lead-time peak, and SHAP weights.
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              FastAPI: <code>GET /api/v1/forecast</code>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
