import {
  AnomalyResult,
  AttackCategory,
  ClassificationResult,
  ExplainableFactor,
  ForecastPoint,
  ForecastResult,
  NormalizedFeatureVector,
  PredictedAttackType,
} from '../types';

/**
 * Attack Forecasting Service
 * Temporal forecasting engine estimating impending attack probability
 * within 15-min, 30-min, and 60-min forward horizons with Explainable AI (XAI).
 */
export class ForecastService {
  private recentAnomalyHistory: number[] = [];

  /**
   * Generates a dynamic 60-minute attack forecast based on incoming traffic telemetry
   */
  public generateForecast(
    vector: NormalizedFeatureVector,
    anomaly: AnomalyResult,
    classification: ClassificationResult
  ): ForecastResult {
    const raw = vector.rawRecord;

    // Track anomaly momentum
    this.recentAnomalyHistory.push(anomaly.anomalyScore);
    if (this.recentAnomalyHistory.length > 10) {
      this.recentAnomalyHistory.shift();
    }

    // Baseline current probability
    const currentProb = Math.max(5, Math.min(96, Math.round(anomaly.anomalyScore * 100)));

    // Calculate trajectory momentum
    let delta = 0;
    if (this.recentAnomalyHistory.length >= 2) {
      const first = this.recentAnomalyHistory[0];
      const last = this.recentAnomalyHistory[this.recentAnomalyHistory.length - 1];
      delta = (last - first) / this.recentAnomalyHistory.length;
    }

    let forecast15m = currentProb;
    let forecast30m = currentProb;
    let forecast60m = currentProb;
    let leadTimeMinutes = 0;
    let attackProbability = currentProb;
    let status: 'Critical Alert' | 'Elevated Warning' | 'Guarded' | 'Normal' = 'Normal';
    let expectedTimeWindow = 'N/A (All clear)';

    if (classification.predictedCategory === 'Normal') {
      forecast15m = Math.max(5, Math.min(22, Math.round(currentProb + 2)));
      forecast30m = Math.max(5, Math.min(20, Math.round(currentProb + 1)));
      forecast60m = Math.max(5, Math.min(18, Math.round(currentProb - 1)));
      attackProbability = Math.max(forecast15m, forecast30m);
      status = 'Normal';
      expectedTimeWindow = 'Normal baseline traffic';
      leadTimeMinutes = 0;
    } else {
      // Impending attack trajectory
      if (classification.predictedCategory === 'DDoS') {
        forecast15m = Math.min(94, Math.round(currentProb + 18 + delta * 20));
        forecast30m = Math.min(96, Math.round(currentProb + 28 + delta * 30));
        forecast60m = Math.max(35, Math.round(forecast30m - 32));
        attackProbability = Math.max(currentProb, forecast30m);
        status = attackProbability >= 75 ? 'Critical Alert' : 'Elevated Warning';
        leadTimeMinutes = 21;
        expectedTimeWindow = '14–28 minutes';
      } else if (classification.predictedCategory === 'Port Scan') {
        forecast15m = Math.min(75, Math.round(currentProb + 14));
        forecast30m = Math.min(68, Math.round(currentProb + 8));
        forecast60m = Math.max(25, Math.round(currentProb - 15));
        attackProbability = Math.max(currentProb, forecast15m);
        status = 'Elevated Warning';
        leadTimeMinutes = 12;
        expectedTimeWindow = '8–16 minutes';
      } else if (classification.predictedCategory === 'Brute Force') {
        forecast15m = Math.min(78, Math.round(currentProb + 12));
        forecast30m = Math.min(84, Math.round(currentProb + 22));
        forecast60m = Math.max(40, Math.round(forecast30m - 18));
        attackProbability = Math.max(currentProb, forecast30m);
        status = 'Elevated Warning';
        leadTimeMinutes = 30;
        expectedTimeWindow = '25–40 minutes';
      } else {
        forecast15m = Math.min(82, Math.round(currentProb + 15));
        forecast30m = Math.min(88, Math.round(currentProb + 20));
        forecast60m = Math.max(45, Math.round(forecast30m - 20));
        attackProbability = Math.max(currentProb, forecast30m);
        status = 'Critical Alert';
        leadTimeMinutes = 18;
        expectedTimeWindow = '15–30 minutes';
      }
    }

    // Build continuous 60-minute timeline curve
    const timeline: ForecastPoint[] = [];
    const now = new Date(raw.epochMs);

    for (let minute = 0; minute <= 60; minute += 3) {
      const time = new Date(now.getTime() + minute * 60 * 1000);
      const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let prob = currentProb;
      if (classification.predictedCategory === 'Normal') {
        prob = currentProb + Math.sin(minute / 5) * 4;
      } else if (leadTimeMinutes > 0) {
        if (minute <= leadTimeMinutes) {
          const progress = minute / leadTimeMinutes;
          prob = currentProb + progress * (attackProbability - currentProb);
        } else {
          const decayProgress = (minute - leadTimeMinutes) / (60 - leadTimeMinutes);
          prob = attackProbability - decayProgress * (attackProbability - forecast60m);
        }
      }
      prob = Math.max(5, Math.min(96, Math.round(prob)));
      const spread = Math.round(4 + (minute / 15) * 2.2);

      timeline.push({
        minute,
        timeLabel,
        probability: prob,
        lowerBound: Math.max(0, prob - spread),
        upperBound: Math.min(100, prob + spread),
        thresholdWarning: 50,
        thresholdCritical: 75,
      });
    }

    // Predicted Attack Types distribution
    const predictedAttackTypes: PredictedAttackType[] = (
      ['DDoS', 'Port Scan', 'Brute Force', 'Botnet', 'Web Attack', 'Malware'] as AttackCategory[]
    )
      .map((cat) => ({
        category: cat,
        probability: classification.probabilities[cat] || 5,
        confidence: classification.confidence,
        trend: (classification.probabilities[cat] > 20 ? 'rising' : 'stable') as 'rising' | 'stable' | 'declining',
        estimatedVectors: this.getEstimatedVectors(cat),
      }))
      .sort((a, b) => b.probability - a.probability);

    // Compute Explainable AI (XAI) factors dynamically from raw telemetry vs normal baseline
    const ppsPct = Math.round(((raw.packetRate - 24000) / 24000) * 100);
    const synPct = Math.round(((vector.synToAckRatio - 1.0) / 1.0) * 100);
    const entropyPct = Math.round(((raw.uniqueSourceCount - 42) / 42) * 100);
    const freqPct = Math.round(((raw.connectionFrequency - 18) / 18) * 100);

    const explainableFactors: ExplainableFactor[] = [
      {
        id: 'xai-1',
        factor: 'Sudden increase in packet rate',
        changePercent: Math.max(2, Math.min(85, ppsPct)),
        featureName: 'flow_packets_per_sec_ratio',
        description: `Ingested rate of ${raw.packetRate.toLocaleString()} pps exceeded normal diurnal baseline.`,
        importanceScore: 0.38,
        direction: ppsPct >= 0 ? 'increase' : 'decrease',
      },
      {
        id: 'xai-2',
        factor: 'Increase in SYN packets',
        changePercent: Math.max(1, Math.min(90, Math.round(vector.synToAckRatio * 20))),
        featureName: 'tcp_syn_to_ack_asymmetry',
        description: `Unacknowledged SYN packet ratio at ${vector.synToAckRatio.toFixed(1)}:1 vs standard 1.0:1 handshake.`,
        importanceScore: 0.29,
        direction: 'increase',
      },
      {
        id: 'xai-3',
        factor: 'Unusual source IP diversity',
        changePercent: Math.max(2, Math.min(75, entropyPct > 0 ? entropyPct : 18)),
        featureName: 'src_ip_entropy_score',
        description: `Shannon entropy of source IPs flagged ${raw.uniqueSourceCount} distinct origins.`,
        importanceScore: 0.19,
        direction: 'increase',
      },
      {
        id: 'xai-4',
        factor: 'Abnormal connection frequency',
        changePercent: Math.max(1, Math.min(65, freqPct > 0 ? freqPct : 14)),
        featureName: 'inter_arrival_time_variance',
        description: `Connection burst frequency at ${raw.connectionFrequency} conn/sec with low inter-arrival variance.`,
        importanceScore: 0.14,
        direction: 'increase',
      },
    ];

    const recommendedMitigations = this.getRecommendedMitigations(classification.predictedCategory);

    return {
      currentProbability: currentProb,
      forecast15m,
      forecast30m,
      forecast60m,
      attackProbability,
      forecastConfidence: classification.confidence,
      predictedAttackCategory: classification.predictedCategory,
      predictedAttackSubtype: classification.subtype,
      expectedTimeWindow,
      leadTimeMinutes,
      status,
      timeline,
      predictedAttackTypes,
      explainableFactors,
      recommendedMitigations,
    };
  }

  private getEstimatedVectors(category: AttackCategory): string[] {
    switch (category) {
      case 'DDoS':
        return ['SYN Flood', 'ACK Reflection', 'NTP Amplification'];
      case 'Port Scan':
        return ['TCP SYN Sweep', 'FIN Stealth Probe', 'Xmas Recon'];
      case 'Brute Force':
        return ['SSH Auth Spray', 'RDP Credential Storm', 'PAM Exhaustion'];
      case 'Botnet':
        return ['Mirai-variant C2 Heartbeat', 'DGA DNS Resolution'];
      case 'Web Attack':
        return ['SQL Tautology Injection', 'XSS Probe', 'API Parameter Fuzz'];
      case 'Malware':
        return ['SMB Buffer Overflow', 'Port 445 EternalBlue'];
      default:
        return ['Standard HTTPS/API'];
    }
  }

  private getRecommendedMitigations(category: AttackCategory): string[] {
    switch (category) {
      case 'DDoS':
        return [
          'Pre-scale SYN-proxy validation on Border Gateways (Edge-01, Edge-02)',
          'Activate upstream BGP Flowspec rate-limiting on target subnet 10.0.1.0/24',
          'Quarantine anomalous source autonomous systems (AS45899, AS13335)',
          'Alert Tier-2 SOC team of impending volumetric saturation (20-min buffer)',
        ];
      case 'Port Scan':
        return [
          'Enable dynamic Blackhole drop rule for persistent scanner address',
          'Enforce strict ICMP and TCP RST rate limiting on perimeter interfaces',
          'Audit open listener ports on Core DMZ host cluster',
        ];
      case 'Brute Force':
        return [
          'Enable Fail2ban progressive backoff and temporary IP jail (12h duration)',
          'Enforce mandatory FIDO2 hardware token or VPN gateway for SSH access',
          'Rate-limit new TCP handshakes on Port 22 to max 5 connections/min per CIDR',
        ];
      case 'Botnet':
        return [
          'Isolate infected endpoint from internal VLAN 3 immediately',
          'Blacklist external C2 host IP 198.51.100.12 at border gateway',
          'Flush local DNS cache and block suspicious DGA domain queries',
        ];
      default:
        return [
          'Maintain standard SOC monitoring postures',
          'Scheduled routine sensor heartbeat verification',
          'Daily threat intelligence feed sync at 00:00 UTC',
        ];
    }
  }
}

export const forecastService = new ForecastService();
