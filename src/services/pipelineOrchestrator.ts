import {
  AnomalyResult,
  ClassificationResult,
  ForecastResult,
  LiveTrafficMetricState,
  NetworkTrafficRecord,
  NormalizedFeatureVector,
  SecurityOverviewMetrics,
  SimulationScenario,
  ThreatEvent,
  PredictionExplanation,
} from '../types';
import { trafficService } from './trafficService';
import { featureService } from './featureService';
import { anomalyService } from './anomalyService';
import { predictionService } from './predictionService';
import { forecastService } from './forecastService';
import { explanationService } from './explanationService';

export interface PipelineExecutionSnapshot {
  record: NetworkTrafficRecord;
  features: NormalizedFeatureVector;
  anomaly: AnomalyResult;
  classification: ClassificationResult;
  forecast: ForecastResult;
  explanation: PredictionExplanation;
  overviewMetrics: SecurityOverviewMetrics;
  liveTraffic: LiveTrafficMetricState;
  newThreatEvent?: ThreatEvent;
}

export class PipelineOrchestrator {
  private activeScenario: SimulationScenario = 'ddos';

  public setScenario(scenario: SimulationScenario): void {
    this.activeScenario = scenario;
    trafficService.setScenario(scenario);
  }

  public getScenario(): SimulationScenario {
    return this.activeScenario;
  }

  /**
   * Executes the full end-to-end ML pipeline:
   * 1. Traffic Generation (24 features)
   * 2. Preprocessing & Feature Extraction
   * 3. Anomaly Detection
   * 4. Multi-class Attack Classification
   * 5. Forward-horizon Attack Forecasting
   */
  public executeStep(
    recordOverrides?: Partial<NetworkTrafficRecord>,
    metricsOverrides?: {
      anomalyScore?: number;
      attackProbability?: number;
      confidence?: number;
    }
  ): PipelineExecutionSnapshot {
    // Step 1: Ingest next simulated traffic record
    let record = trafficService.generateNextRecord();
    if (recordOverrides) {
      record = { ...record, ...recordOverrides };
    }

    // Step 2: Preprocess & extract normalized feature vector
    const features = featureService.extractFeatures(record);

    // Step 3: Anomaly detection
    const anomaly = anomalyService.detectAnomaly(features);
    if (metricsOverrides?.anomalyScore !== undefined) {
      anomaly.anomalyScore = metricsOverrides.anomalyScore;
      anomaly.isAnomaly = anomaly.anomalyScore >= anomaly.threshold;
    }

    // Step 4: Multi-class classification
    const classification = predictionService.classifyAttack(features, anomaly);
    if (metricsOverrides?.confidence !== undefined) {
      classification.confidence = metricsOverrides.confidence;
    }

    // Step 5: Time-series forecasting (15m, 30m, 60m)
    const forecast = forecastService.generateForecast(features, anomaly, classification);
    if (metricsOverrides?.attackProbability !== undefined) {
      forecast.attackProbability = metricsOverrides.attackProbability;
      forecast.currentProbability = Math.round(metricsOverrides.attackProbability * 0.9);
      forecast.forecast15m = Math.min(99, Math.round(metricsOverrides.attackProbability * 0.85));
      forecast.forecast30m = metricsOverrides.attackProbability;
      if (metricsOverrides.attackProbability >= 75) {
        forecast.status = 'Critical Alert';
      } else if (metricsOverrides.attackProbability >= 50) {
        forecast.status = 'Elevated Warning';
      } else if (metricsOverrides.attackProbability >= 25) {
        forecast.status = 'Guarded';
      } else {
        forecast.status = 'Normal';
      }
    }

    // Step 6: Explainable AI Layer (XAI) - Model Feature Contributions & Detection Reasoning
    const explanation = explanationService.generateExplanation(record, features, anomaly, classification, forecast);

    // Construct derived metrics for dashboard
    const packetRateInM = (record.packetRate / 1000000).toFixed(2);
    const trafficStr = `${packetRateInM}M`;
    const bytesMb = (record.byteRate / (1024 * 1024)).toFixed(1);

    const overviewMetrics: SecurityOverviewMetrics = {
      networkTraffic: {
        label: 'Network Traffic',
        value: trafficStr,
        numericValue: record.packetRate,
        trend: Math.round(((record.packetRate - 24000) / 24000) * 100),
        comparison: record.packetRate > 50000 ? '+31% surge detected' : 'Normal diurnal flow',
      },
      activeConnections: {
        label: 'Active Connections',
        value: record.connectionCount.toLocaleString(),
        numericValue: record.connectionCount,
        trend: record.connectionCount > 5000 ? 18.5 : -1.2,
        comparison: `${record.failedConnectionCount} failed handshakes`,
      },
      threatsDetected: {
        label: 'Threats Detected',
        value: anomaly.isAnomaly ? '37' : '3',
        numericValue: anomaly.isAnomaly ? 37 : 3,
        trend: anomaly.isAnomaly ? 12.0 : -75.0,
        comparison: anomaly.isAnomaly ? '+4 new in past 15m' : 'Zero elevated threats',
      },
      predictedAttacks: {
        label: 'Predicted Attacks',
        value: forecast.attackProbability >= 70 ? '8' : forecast.attackProbability >= 40 ? '3' : '0',
        numericValue: forecast.attackProbability >= 70 ? 8 : forecast.attackProbability >= 40 ? 3 : 0,
        trend: forecast.attackProbability >= 70 ? 25.0 : -50.0,
        comparison: `In +${forecast.leadTimeMinutes || 15}m forecast window`,
      },
    };

    const liveTraffic: LiveTrafficMetricState = {
      packetsPerSec: record.packetRate,
      bytesPerSec: `${bytesMb} MB/s`,
      activeConnections: record.connectionCount,
      uniqueSourceIps: record.uniqueSourceCount,
      uniqueDestIps: record.uniqueDestinationCount,
      tcpPercent: record.protocol === 'TCP' ? 72 : 24,
      udpPercent: record.protocol === 'UDP' ? 68 : 20,
      icmpPercent: record.protocol === 'ICMP' ? 45 : 5,
      otherPercent: 3,
      currentBandwidthMbps: Number(((record.byteRate * 8) / 1000000).toFixed(1)),
    };

    // If an anomaly was detected, produce a threat event
    let newThreatEvent: ThreatEvent | undefined;
    if (anomaly.isAnomaly) {
      newThreatEvent = {
        id: `THR-${Math.floor(8800 + Math.random() * 100)}`,
        timestamp: record.timestamp,
        sourceIp: record.sourceIp,
        sourceCountry: record.sourceIp.startsWith('10.') ? 'Internal VLAN' : 'Foreign AS45899',
        destinationIp: record.destinationIp,
        destinationPort: record.destinationPort,
        protocol: record.protocol,
        trafficSize: `${(record.byteCount / (1024 * 1024)).toFixed(1)} MB`,
        packetCount: record.packetCount,
        threat: `${classification.predictedCategory} (${classification.subtype})`,
        category: classification.predictedCategory,
        severity: forecast.attackProbability >= 75 ? 'critical' : 'high',
        status: 'investigating',
        confidence: classification.confidence,
        indicators: classification.indicators,
        modelReasoning: classification.modelReasoning,
        recommendedResponse: classification.recommendedResponse,
      };
    }

    return {
      record,
      features,
      anomaly,
      classification,
      forecast,
      explanation,
      overviewMetrics,
      liveTraffic,
      newThreatEvent,
    };
  }
}

export const pipelineOrchestrator = new PipelineOrchestrator();
