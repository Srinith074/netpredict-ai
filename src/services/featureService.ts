import { NetworkTrafficRecord, NormalizedFeatureVector } from '../types';

/**
 * Feature Extraction & Preprocessing Service
 * Normalizes numerical attributes, computes asymmetric ratios,
 * and prepares statistical feature tensors for anomaly detection and ML classification.
 */
export class FeatureService {
  // Baseline enterprise statistics (mean & standard deviation for scaling)
  private readonly baseline = {
    packetRateMean: 24000,
    packetRateStd: 6000,
    byteRateMean: 15000000,
    byteRateStd: 4000000,
    flowDurationMean: 450,
    flowDurationStd: 200,
    avgPacketSizeMean: 620,
    avgPacketSizeStd: 180,
    connFrequencyMean: 20,
    connFrequencyStd: 8,
  };

  /**
   * Transforms a raw 24-feature traffic record into a normalized statistical feature vector
   */
  public extractFeatures(record: NetworkTrafficRecord): NormalizedFeatureVector {
    // 1. Asymmetry & Flag Ratios
    const synToAckRatio = record.synCount / Math.max(1, record.ackCount);
    const rstRatio = record.rstCount / Math.max(1, record.packetCount);
    const failureRate = record.failedConnectionCount / Math.max(1, record.connectionCount);

    // 2. Entropy & Diversity Indexes
    const sourceEntropy = record.uniqueSourceCount / Math.max(1, record.connectionCount);
    const destPortDiversity = record.uniqueDestinationCount / Math.max(1, record.connectionCount);

    // 3. Min-Max & Standard Normalizations (bounded [0, 1] for stable neural/statistical inference)
    // Normalized packet rate: 0 at normal baseline, scaling up towards 1.0 at high flood volume
    const normPacketRate = Math.min(1.0, Math.max(0.0, (record.packetRate - 15000) / 185000));
    const normByteRate = Math.min(1.0, Math.max(0.0, record.byteRate / 50000000));

    // Flow duration: normal ~0.5, very low during syn floods (<0.1), long during persistent sessions
    const flowDurationNorm = Math.min(1.0, Math.max(0.0, record.flowDuration / 1500));

    // Average packet size: 0.0 for tiny 40-64 byte probe frames, 1.0 for MTU 1500 bytes
    const avgPacketSizeNorm = Math.min(1.0, Math.max(0.0, record.avgPacketSize / 1500));

    // Connection frequency normalized
    const connFrequencyNorm = Math.min(1.0, Math.max(0.0, record.connectionFrequency / 200));

    // DNS-to-HTTP query ratio (identifies DNS amplification or DGA tunneling)
    const dnsToHttpRatio = record.dnsRequests / Math.max(1, record.httpRequests + record.dnsRequests);

    // Exponential decay of prior attack indicator
    const previousAttackDecay = Math.min(1.0, Math.max(0.0, record.previousAttackIndicator));

    return {
      normPacketRate,
      normByteRate,
      synToAckRatio,
      rstRatio,
      failureRate,
      sourceEntropy,
      destPortDiversity,
      flowDurationNorm,
      avgPacketSizeNorm,
      connFrequencyNorm,
      dnsToHttpRatio,
      previousAttackDecay,
      rawRecord: record,
    };
  }

  /**
   * Preprocesses a batch of records (useful for sliding-window temporal aggregations)
   */
  public extractBatch(records: NetworkTrafficRecord[]): NormalizedFeatureVector[] {
    return records.map((r) => this.extractFeatures(r));
  }
}

export const featureService = new FeatureService();
