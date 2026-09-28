export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export type ThreatStatus = 'blocked' | 'flagged' | 'investigating' | 'mitigated';

export type AlertStatus = 'open' | 'in_progress' | 'resolved';

export type SystemStatus = 'healthy' | 'warning' | 'degraded';

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';

export type AttackCategory = 
  | 'Normal'
  | 'DDoS'
  | 'Port Scan'
  | 'Brute Force'
  | 'Botnet'
  | 'Web Attack'
  | 'Malware'
  | 'Normal Traffic'; // Compatibility alias

export type SimulationScenario = 'normal' | 'ddos' | 'portscan' | 'bruteforce' | 'botnet';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface SecurityMetric {
  label: string;
  value: string;
  numericValue: number;
  trend: number; // percentage, positive or negative
  comparison: string;
  sparkline?: number[];
}

export interface SecurityOverviewMetrics {
  networkTraffic: SecurityMetric;
  activeConnections: SecurityMetric;
  threatsDetected: SecurityMetric;
  predictedAttacks: SecurityMetric;
}

export interface ForecastPoint {
  minute: number; // 0 to 60 (or time label like "14:15")
  timeLabel: string;
  probability: number; // 0 to 100
  lowerBound: number;
  upperBound: number;
  thresholdWarning: number;
  thresholdCritical: number;
}

export interface ExplainableFactor {
  id: string;
  factor: string;
  changePercent: number; // e.g. +31
  featureName: string;
  description: string;
  importanceScore: number; // 0.0 - 1.0
  direction: 'increase' | 'decrease';
}

export interface PredictedAttackType {
  category: AttackCategory;
  probability: number; // percentage
  confidence: number;
  trend: 'rising' | 'stable' | 'declining';
  estimatedVectors: string[];
}

export interface AttackForecastData {
  attackProbability: number; // e.g. 82%
  forecastConfidence: number; // e.g. 91%
  predictedAttackCategory: AttackCategory;
  predictedAttackSubtype: string; // e.g. "SYN Flood (Distributed)"
  expectedTimeWindow: string; // e.g. "14–28 minutes"
  leadTimeMinutes: number; // e.g. 18
  status: 'Critical Alert' | 'Elevated Warning' | 'Guarded' | 'Normal';
  currentProbability: number;
  forecast15m: number;
  forecast30m: number;
  forecast60m: number;
  timeline: ForecastPoint[];
  predictedAttackTypes: PredictedAttackType[];
  explainableFactors: ExplainableFactor[];
  recommendedMitigations: string[];
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  sourceCountry: string;
  destinationIp: string;
  destinationPort: number;
  protocol: ProtocolType;
  trafficSize: string; // e.g. "4.2 MB", "840 KB"
  packetCount: number;
  threat: string; // e.g. "DDoS SYN Flood Attempt"
  category: AttackCategory;
  severity: Severity;
  status: ThreatStatus;
  confidence: number; // percentage
  indicators: string[];
  modelReasoning: string[];
  recommendedResponse: string;
  rawPayloadSnippet?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  timestamp: string;
  source: string;
  attackType: AttackCategory;
  confidence: number;
  severity: Severity;
  status: AlertStatus;
  assignee?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface SystemHealthItem {
  id: string;
  name: string;
  category: string;
  status: SystemStatus;
  uptime: string;
  latency: string;
  details: string;
}

export interface TrafficDataPoint {
  time: string;
  incomingMbps: number;
  outgoingMbps: number;
  suspiciousMbps: number;
  totalPackets: number;
}

export interface LiveTrafficMetricState {
  packetsPerSec: number;
  bytesPerSec: string;
  activeConnections: number;
  uniqueSourceIps: number;
  uniqueDestIps: number;
  tcpPercent: number;
  udpPercent: number;
  icmpPercent: number;
  otherPercent: number;
  currentBandwidthMbps: number;
}

export interface LiveConnectionLog {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: ProtocolType;
  flags: string;
  bytes: number;
  durationMs: number;
  state: 'ESTABLISHED' | 'SYN_SENT' | 'SYN_RECV' | 'TIME_WAIT' | 'CLOSED';
  flaggedAnomaly: boolean;
}

export interface HistoricalAttack {
  id: string;
  date: string;
  attackType: AttackCategory;
  source: string;
  targetAsset: string;
  duration: string;
  severity: Severity;
  confidence: number;
  detectionMethod: string;
  status: 'Mitigated' | 'Blocked' | 'Neutralized';
  peakVolume: string;
  incidentSummary: string;
}

export interface ModelMetricInfo {
  name: string;
  value: string;
  score: number;
  description: string;
  benchmarkTarget: string;
}

export interface ModelPipelineStage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tech: string;
  latencyMs: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  category: string;
}

// =========================================================================
// END-TO-END ML PIPELINE DATASET & SERVICES TYPES
// =========================================================================

/**
 * Raw Simulated Network Traffic Record containing all 24 required features
 */
export interface NetworkTrafficRecord {
  id: string;
  timestamp: string;
  epochMs: number;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: ProtocolType;
  packetCount: number;
  byteCount: number;
  packetRate: number; // packets/sec
  byteRate: number; // bytes/sec
  flowDuration: number; // ms
  synCount: number;
  ackCount: number;
  rstCount: number;
  connectionCount: number;
  failedConnectionCount: number;
  uniqueSourceCount: number;
  uniqueDestinationCount: number;
  avgPacketSize: number; // bytes
  tcpFlags: string;
  dnsRequests: number;
  httpRequests: number;
  connectionFrequency: number; // conn/sec
  previousAttackIndicator: number; // 0 or 1, or decay indicator
  scenario: SimulationScenario;
}

/**
 * Preprocessed & Normalized Feature Vector
 */
export interface NormalizedFeatureVector {
  normPacketRate: number; // [0, 1] normalized against standard deviation
  normByteRate: number;
  synToAckRatio: number; // synCount / max(1, ackCount)
  rstRatio: number; // rstCount / packetCount
  failureRate: number; // failedConnections / connectionCount
  sourceEntropy: number; // uniqueSources / connectionCount
  destPortDiversity: number; // uniqueDestinations / connectionCount
  flowDurationNorm: number;
  avgPacketSizeNorm: number;
  connFrequencyNorm: number;
  dnsToHttpRatio: number;
  previousAttackDecay: number;
  rawRecord: NetworkTrafficRecord;
}

/**
 * Anomaly Detection Result
 */
export interface AnomalyResult {
  anomalyScore: number; // 0.0 to 1.0
  threshold: number; // standard 0.65
  isAnomaly: boolean;
  reconstructionError: number;
  topContributors: {
    feature: string;
    deviation: number;
    description: string;
  }[];
}

/**
 * Attack Classification Result
 */
export interface ClassificationResult {
  predictedCategory: AttackCategory;
  subtype: string;
  confidence: number; // 0 to 100%
  probabilities: Record<AttackCategory, number>; // softmax distribution
  indicators: string[];
  modelReasoning: string[];
  recommendedResponse: string;
}

/**
 * Forecasting Component Result (15m, 30m, 60m + timeline curve)
 */
export interface ForecastResult {
  currentProbability: number;
  forecast15m: number;
  forecast30m: number;
  forecast60m: number;
  attackProbability: number; // dominant peak probability
  forecastConfidence: number;
  predictedAttackCategory: AttackCategory;
  predictedAttackSubtype: string;
  expectedTimeWindow: string;
  leadTimeMinutes: number;
  status: 'Critical Alert' | 'Elevated Warning' | 'Guarded' | 'Normal';
  timeline: ForecastPoint[];
  predictedAttackTypes: PredictedAttackType[];
  explainableFactors: ExplainableFactor[];
  recommendedMitigations: string[];
}

// =========================================================================
// EXPLAINABLE AI (XAI) LAYER TYPES
// =========================================================================

/**
 * Model Feature Contribution for Explainable AI (XAI)
 * Represents individual feature impact on model output without claiming SHAP values.
 */
export interface ModelFeatureContribution {
  id: string;
  feature: string;
  contributionPercent: number; // e.g. 32 for +32%
  direction: 'positive' | 'negative';
  description: string;
  relativeWeight: number; // 0.0 to 1.0 for bar width
}

/**
 * Baseline vs Current comparison for a network traffic telemetry feature
 */
export interface BaselineComparisonItem {
  id: string;
  feature: string;
  baseline: string; // e.g. "12,400"
  current: string; // e.g. "31,800"
  change: string; // e.g. "+156%"
  changeValue: number; // numeric percentage delta
  unit?: string; // e.g. "pps", "conn/s", "B"
  isElevated: boolean;
  status: 'critical' | 'warning' | 'normal';
}

/**
 * Complete Prediction Explanation Object
 */
export interface PredictionExplanation {
  prediction: string; // e.g. "DDoS"
  subtype: string; // e.g. "Distributed SYN Flood"
  probability: number; // e.g. 82
  confidence: number; // e.g. 91
  riskLevel: 'Critical' | 'High' | 'Elevated' | 'Guarded' | 'Normal';
  contributingFactors: ModelFeatureContribution[];
  detectionReasoning: string[]; // 5 structured analytical reasoning steps
  baselineComparison: BaselineComparisonItem[];
  generatedTimestamp: string;
  isThreatPredicted: boolean;
}

// =========================================================================
// GUIDED LIVE DEMONSTRATION MODE TYPES
// =========================================================================

export type DemoScenarioId = 'normal' | 'portscan' | 'bruteforce' | 'ddos';

export type DemoTimelineStepId =
  | 'traffic_anomaly'
  | 'feature_deviation'
  | 'threat_classification'
  | 'probability_increased'
  | 'forecast_generated'
  | 'alert_created';

export interface DemoTimelineStep {
  id: DemoTimelineStepId;
  stepNumber: number; // 1 to 6
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  timestamp?: string;
  metricHighlight?: string;
}

export interface DemoStageConfig {
  stepId: DemoTimelineStepId;
  stepNumber: number;
  title: string;
  description: string;
  metricHighlight: string;
  trafficOverrides: Partial<NetworkTrafficRecord>;
  anomalyScoreOverride: number;
  probabilityOverride: number;
  confidenceOverride: number;
  topContributingFeature: string;
}

export interface DemoState {
  isDemoModeActive: boolean;
  activeScenarioId: DemoScenarioId;
  isRunning: boolean;
  isPaused: boolean;
  currentStepIndex: number; // -1 (idle) or 0 to 5
  timeline: DemoTimelineStep[];
  statusMessage: string;
  autoPlaySpeed: 'normal' | 'fast'; // normal = 2.5s per step, fast = 1.2s per step
}


