import {
  AttackForecastData,
  FeatureImportanceItem,
  HistoricalAttack,
  LiveConnectionLog,
  LiveTrafficMetricState,
  ModelMetricInfo,
  ModelPipelineStage,
  SecurityAlert,
  SecurityOverviewMetrics,
  SystemHealthItem,
  ThreatEvent,
  TrafficDataPoint,
  User,
} from '../types';

export const CURRENT_USER: User = {
  id: 'usr-9021',
  name: 'Capt. V. Sharma',
  email: 'analyst.sharma@cert-in.gov.in',
  role: 'Senior Incident Responder (Tier 3)',
  organization: 'National Cyber Coordination Centre (NCCC)',
  lastLogin: 'Today, 21:42 IST',
};

// Overview Metrics
export const INITIAL_SECURITY_METRICS: SecurityOverviewMetrics = {
  networkTraffic: {
    label: 'Network Traffic',
    value: '1.84M',
    numericValue: 1842900,
    trend: 4.2,
    comparison: '+4.2% vs last hour',
    sparkline: [1.62, 1.68, 1.71, 1.75, 1.79, 1.82, 1.84],
  },
  activeConnections: {
    label: 'Active Connections',
    value: '12,482',
    numericValue: 12482,
    trend: -1.1,
    comparison: '-1.1% vs last hour',
    sparkline: [12900, 12820, 12650, 12510, 12450, 12490, 12482],
  },
  threatsDetected: {
    label: 'Threats Detected',
    value: '37',
    numericValue: 37,
    trend: 12.0,
    comparison: '+4 new in past 15m',
    sparkline: [21, 24, 27, 30, 32, 35, 37],
  },
  predictedAttacks: {
    label: 'Predicted Attacks',
    value: '8',
    numericValue: 8,
    trend: 25.0,
    comparison: '+2 in next 60m forecast window',
    sparkline: [3, 4, 4, 5, 6, 7, 8],
  },
};

// Generates 60 minutes timeline with confidence bounds
export function generateForecastTimeline(baseProbability: number, scenario: string) {
  const points = [];
  const now = new Date();
  
  for (let i = 0; i <= 60; i += 3) {
    const time = new Date(now.getTime() + i * 60 * 1000);
    const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let prob = baseProbability;
    if (scenario === 'ddos') {
      // Peaks around 20-30 min
      if (i < 10) prob = 45 + i * 2.5;
      else if (i <= 28) prob = 70 + (i - 10) * 0.8;
      else if (i <= 42) prob = 85 - (i - 28) * 1.5;
      else prob = 64 - (i - 42) * 1.0;
    } else if (scenario === 'portscan') {
      if (i < 15) prob = 30 + i * 2;
      else if (i <= 35) prob = 60 + Math.sin(i / 3) * 5;
      else prob = 48 - (i - 35) * 0.8;
    } else if (scenario === 'bruteforce') {
      prob = 40 + Math.min(35, i * 1.1) + Math.cos(i / 4) * 4;
    } else {
      // baseline normal
      prob = 12 + Math.sin(i / 5) * 4;
    }
    
    prob = Math.max(5, Math.min(96, Math.round(prob)));
    const spread = Math.round(4 + (i / 15) * 2.5);

    points.push({
      minute: i,
      timeLabel,
      probability: prob,
      lowerBound: Math.max(0, prob - spread),
      upperBound: Math.min(100, prob + spread),
      thresholdWarning: 50,
      thresholdCritical: 75,
    });
  }
  return points;
}

// Scenarios for demonstration to judges
export const FORECAST_SCENARIOS: Record<string, AttackForecastData> = {
  ddos: {
    attackProbability: 82,
    forecastConfidence: 91,
    predictedAttackCategory: 'DDoS',
    predictedAttackSubtype: 'Distributed SYN Flood / NTP Amplification',
    expectedTimeWindow: '14–28 minutes',
    leadTimeMinutes: 21,
    status: 'Critical Alert',
    currentProbability: 46,
    forecast15m: 74,
    forecast30m: 85,
    forecast60m: 48,
    timeline: generateForecastTimeline(82, 'ddos'),
    predictedAttackTypes: [
      { category: 'DDoS', probability: 72, confidence: 93, trend: 'rising', estimatedVectors: ['SYN Flood', 'ACK Reflection', 'NTP Amp'] },
      { category: 'Port Scan', probability: 15, confidence: 88, trend: 'stable', estimatedVectors: ['TCP SYN Sweep', 'Subnet Recon'] },
      { category: 'Brute Force', probability: 8, confidence: 82, trend: 'declining', estimatedVectors: ['SSH Auth Bomb'] },
      { category: 'Botnet', probability: 5, confidence: 79, trend: 'stable', estimatedVectors: ['Mirai-variant C2 heartbeat'] },
    ],
    explainableFactors: [
      {
        id: 'f1',
        factor: 'Sudden increase in packet rate',
        changePercent: 31,
        featureName: 'flow_packets_per_sec_ratio',
        description: 'Aggregate packets/sec exceeded 3-sigma historical baseline across edge routers',
        importanceScore: 0.38,
        direction: 'increase',
      },
      {
        id: 'f2',
        factor: 'Increase in SYN packets',
        changePercent: 24,
        featureName: 'tcp_syn_to_ack_asymmetry',
        description: 'Unanswered SYN packet count jumped 4.8x compared to normal 3-way handshake completion',
        importanceScore: 0.29,
        direction: 'increase',
      },
      {
        id: 'f3',
        factor: 'Unusual source IP diversity',
        changePercent: 18,
        featureName: 'src_ip_entropy_score',
        description: 'Shannon entropy of source IP addresses spiked, indicating coordinated botnet nodes',
        importanceScore: 0.19,
        direction: 'increase',
      },
      {
        id: 'f4',
        factor: 'Abnormal connection frequency',
        changePercent: 14,
        featureName: 'inter_arrival_time_variance',
        description: 'Packet inter-arrival variance dropped sharply towards zero, characteristic of automated flood scripts',
        importanceScore: 0.14,
        direction: 'increase',
      },
    ],
    recommendedMitigations: [
      'Pre-scale SYN-proxy validation on Border Gateways (Edge-01, Edge-02)',
      'Activate upstream BGP Flowspec rate-limiting on target subnet 10.0.4.0/24',
      'Quarantine top anomalous autonomous systems (AS45899, AS13335)',
      'Notify Tier-2 SOC team of impending volumetric saturation (20-min buffer)',
    ],
  },
  portscan: {
    attackProbability: 58,
    forecastConfidence: 88,
    predictedAttackCategory: 'Port Scan',
    predictedAttackSubtype: 'Stealth Horizontal TCP FIN & Xmas Sweep',
    expectedTimeWindow: '8–16 minutes',
    leadTimeMinutes: 12,
    status: 'Elevated Warning',
    currentProbability: 38,
    forecast15m: 62,
    forecast30m: 54,
    forecast60m: 29,
    timeline: generateForecastTimeline(58, 'portscan'),
    predictedAttackTypes: [
      { category: 'Port Scan', probability: 64, confidence: 91, trend: 'rising', estimatedVectors: ['Horizontal Subnet Scan', 'SYN/FIN Probe'] },
      { category: 'Web Attack', probability: 18, confidence: 84, trend: 'rising', estimatedVectors: ['Exposed Admin Endpoint discovery'] },
      { category: 'Brute Force', probability: 11, confidence: 80, trend: 'stable', estimatedVectors: ['SSH Password Spraying'] },
      { category: 'DDoS', probability: 7, confidence: 75, trend: 'declining', estimatedVectors: ['Low volume ACK pinging'] },
    ],
    explainableFactors: [
      {
        id: 'f1',
        factor: 'High unique destination port ratio',
        changePercent: 42,
        featureName: 'dst_port_diversity_index',
        description: 'Single source IP sequential scanning across ports 1-1024 on core DMZ hosts',
        importanceScore: 0.42,
        direction: 'increase',
      },
      {
        id: 'f2',
        factor: 'RST packet response surge',
        changePercent: 29,
        featureName: 'tcp_rst_generation_rate',
        description: 'Internal firewalls emitting high rate of TCP RST packets back to scanner',
        importanceScore: 0.31,
        direction: 'increase',
      },
      {
        id: 'f3',
        factor: 'TCP flag irregularity (FIN+URG+PSH)',
        changePercent: 19,
        featureName: 'tcp_invalid_flags_count',
        description: 'Evasion attempts using non-standard flag combinations bypassing legacy stateless filters',
        importanceScore: 0.16,
        direction: 'increase',
      },
      {
        id: 'f4',
        factor: 'Low payload byte-to-packet ratio',
        changePercent: -15,
        featureName: 'avg_packet_payload_bytes',
        description: 'Flows consist entirely of 40-54 byte probe packets with zero data payload',
        importanceScore: 0.11,
        direction: 'decrease',
      },
    ],
    recommendedMitigations: [
      'Enable dynamic Blackhole route for persistent scanner IP 198.51.100.89',
      'Enforce strict ICMP and TCP RST rate limiting on perimeter interfaces',
      'Audit open listener ports on Core DB cluster 10.0.2.15-20',
    ],
  },
  bruteforce: {
    attackProbability: 69,
    forecastConfidence: 86,
    predictedAttackCategory: 'Brute Force',
    predictedAttackSubtype: 'Distributed SSH / Kerberos Password Spraying',
    expectedTimeWindow: '25–40 minutes',
    leadTimeMinutes: 30,
    status: 'Elevated Warning',
    currentProbability: 41,
    forecast15m: 55,
    forecast30m: 72,
    forecast60m: 64,
    timeline: generateForecastTimeline(69, 'bruteforce'),
    predictedAttackTypes: [
      { category: 'Brute Force', probability: 68, confidence: 89, trend: 'rising', estimatedVectors: ['SSH Password Spraying', 'RDP Auth Flood'] },
      { category: 'Botnet', probability: 16, confidence: 82, trend: 'rising', estimatedVectors: ['Residential Proxy rotation'] },
      { category: 'Port Scan', probability: 10, confidence: 78, trend: 'stable', estimatedVectors: ['Port 22/3389 discovery'] },
      { category: 'Malware', probability: 6, confidence: 71, trend: 'declining', estimatedVectors: ['Credential dumper payload'] },
    ],
    explainableFactors: [
      {
        id: 'f1',
        factor: 'Failed authentication failure rate',
        changePercent: 54,
        featureName: 'auth_failed_attempts_slope',
        description: 'Consecutive PAM authentication failures on port 22 jumped 5.4x above threshold',
        importanceScore: 0.45,
        direction: 'increase',
      },
      {
        id: 'f2',
        factor: 'Rapid source IP hopping',
        changePercent: 33,
        featureName: 'src_ip_churn_rate',
        description: 'Attempts distributed across 140+ Tor exit nodes and residential proxy relays',
        importanceScore: 0.28,
        direction: 'increase',
      },
      {
        id: 'f3',
        factor: 'Short session duration concentration',
        changePercent: 21,
        featureName: 'session_duration_median',
        description: 'Average connection lifespan under 820ms due to immediate termination upon auth rejection',
        importanceScore: 0.17,
        direction: 'increase',
      },
      {
        id: 'f4',
        factor: 'Targeted service port concentration',
        changePercent: 12,
        featureName: 'port_22_connection_fraction',
        description: '92% of new connections focused exclusively on bastion gateway port 22',
        importanceScore: 0.10,
        direction: 'increase',
      },
    ],
    recommendedMitigations: [
      'Enable Fail2ban progressive backoff and temporary IP jail (12h duration)',
      'Enforce mandatory FIDO2 hardware token or VPN gateway for SSH access',
      'Rate-limit new TCP handshakes on Port 22 to max 5 connections/min per CIDR',
    ],
  },
  baseline: {
    attackProbability: 14,
    forecastConfidence: 95,
    predictedAttackCategory: 'Normal Traffic',
    predictedAttackSubtype: 'Expected Enterprise Traffic Baseline',
    expectedTimeWindow: 'N/A (All clear)',
    leadTimeMinutes: 0,
    status: 'Normal',
    currentProbability: 11,
    forecast15m: 13,
    forecast30m: 15,
    forecast60m: 14,
    timeline: generateForecastTimeline(14, 'baseline'),
    predictedAttackTypes: [
      { category: 'Normal Traffic', probability: 88, confidence: 96, trend: 'stable', estimatedVectors: ['Standard HTTPS/API'] },
      { category: 'Port Scan', probability: 5, confidence: 80, trend: 'declining', estimatedVectors: ['Internet background noise'] },
      { category: 'Brute Force', probability: 4, confidence: 75, trend: 'stable', estimatedVectors: ['Isolated failed logins'] },
      { category: 'DDoS', probability: 3, confidence: 85, trend: 'declining', estimatedVectors: ['Negligible anomaly'] },
    ],
    explainableFactors: [
      {
        id: 'f1',
        factor: 'Normal packet distribution stability',
        changePercent: 2,
        featureName: 'packet_rate_stability',
        description: 'Network flows adhering closely to diurnal Gaussian baseline models',
        importanceScore: 0.35,
        direction: 'increase',
      },
      {
        id: 'f2',
        factor: 'Healthy TCP handshake completion ratio',
        changePercent: -1,
        featureName: 'tcp_handshake_completion_pct',
        description: '99.4% of SYN requests successfully complete standard 3-way handshake',
        importanceScore: 0.30,
        direction: 'decrease',
      },
      {
        id: 'f3',
        factor: 'Expected TLS session duration',
        changePercent: 0,
        featureName: 'tls_session_duration_norm',
        description: 'Standard client HTTPS traffic flows to application web services',
        importanceScore: 0.20,
        direction: 'increase',
      },
      {
        id: 'f4',
        factor: 'Clean IP reputation scores',
        changePercent: -3,
        featureName: 'reputation_threat_score',
        description: 'Threat feed correlation yields < 0.2% known malicious IP addresses',
        importanceScore: 0.15,
        direction: 'decrease',
      },
    ],
    recommendedMitigations: [
      'Maintain standard SOC monitoring postures',
      'Scheduled routine sensor heartbeat verification',
      'Daily threat intelligence feed sync at 00:00 UTC',
    ],
  },
};

// Threat Events for Live Table & Threat Detection
export const INITIAL_THREAT_EVENTS: ThreatEvent[] = [
  {
    id: 'THR-8891',
    timestamp: '21:56:42 IST',
    sourceIp: '198.51.100.42',
    sourceCountry: 'RU (Autonomous System 45899)',
    destinationIp: '10.0.1.50',
    destinationPort: 80,
    protocol: 'TCP',
    trafficSize: '4.8 MB',
    packetCount: 14200,
    threat: 'DDoS SYN Flood Staging',
    category: 'DDoS',
    severity: 'critical',
    status: 'investigating',
    confidence: 94,
    indicators: [
      'Unsolicited SYN packet surge without ACK responses (ratio 48:1)',
      'Spoofed source addresses originating from known bulletproof hosting CIDR',
      'Precipitous drop in TCP sequence number entropy',
      'Targeting primary DMZ load balancer interface eth0',
    ],
    modelReasoning: [
      'Bi-LSTM time series forecaster predicted volumetric saturation in +18 min',
      'Isolation Forest anomaly score: 0.942 (Threshold: 0.650)',
      'XGBoost multi-class classifier matched SYN-flood fingerprint with 94.1% probability',
    ],
    recommendedResponse: 'Apply perimeter SYN-proxy rate-limiting and drop inbound traffic from 198.51.100.0/24 at edge firewall.',
    rawPayloadSnippet: '45 00 00 28 a1 44 40 00 40 06 72 1a c6 33 64 2a 0a 00 01 32 1f 90 00 50 00 00 00 00 70 02 20 00 4d 3b 00 00 02 04 05 b4',
  },
  {
    id: 'THR-8890',
    timestamp: '21:55:18 IST',
    sourceIp: '203.0.113.88',
    sourceCountry: 'CN (AS4134 Chinanet)',
    destinationIp: '10.0.1.22',
    destinationPort: 22,
    protocol: 'TCP',
    trafficSize: '1.2 MB',
    packetCount: 3820,
    threat: 'Distributed SSH Password Spray',
    category: 'Brute Force',
    severity: 'high',
    status: 'blocked',
    confidence: 91,
    indicators: [
      '184 rapid SSH connection attempts in 60-second sliding window',
      'Root and admin dictionary credential iteration detected',
      'Matches signature rule SID-201844: SSH Brute Force Inbound',
    ],
    modelReasoning: [
      'Flow inter-arrival time pattern matches Hydra/Medusa automation suite',
      'Classification confidence: 91.4% Brute Force, 6.2% Port Scan',
    ],
    recommendedResponse: 'Enforce automatic IP jail on Bastion Host 10.0.1.22 and invalidate session tokens.',
    rawPayloadSnippet: 'SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\\r\\nKexAlgorithms: curve25519-sha256,ecdh-sha2-nistp256',
  },
  {
    id: 'THR-8889',
    timestamp: '21:53:04 IST',
    sourceIp: '192.0.2.144',
    sourceCountry: 'NL (AS60781 LeaseWeb)',
    destinationIp: '10.0.2.10',
    destinationPort: 443,
    protocol: 'HTTPS',
    trafficSize: '890 KB',
    packetCount: 1240,
    threat: 'SQL Injection / Union Probe',
    category: 'Web Attack',
    severity: 'high',
    status: 'flagged',
    confidence: 89,
    indicators: [
      'URI parameter contains encoded SQL payloads: %27%20UNION%20SELECT%20NULL--',
      'Repeated probes against /api/v2/authenticate endpoint',
      'User-Agent matches SQLMap automation agent string',
    ],
    modelReasoning: [
      'HTTP payload anomaly score exceeds 0.887 on character n-gram inspection',
      'Pattern matched against OWASP Top 10 A03:2021 Injection class',
    ],
    recommendedResponse: 'Block request signature at Web Application Firewall (WAF) and sanitize input parameters.',
  },
  {
    id: 'THR-8888',
    timestamp: '21:51:22 IST',
    sourceIp: '198.51.100.19',
    sourceCountry: 'IR (AS58224 TIC)',
    destinationIp: '10.0.1.1',
    destinationPort: 0,
    protocol: 'TCP',
    trafficSize: '340 KB',
    packetCount: 5400,
    threat: 'Horizontal TCP FIN Stealth Scan',
    category: 'Port Scan',
    severity: 'medium',
    status: 'mitigated',
    confidence: 86,
    indicators: [
      'Sequential scanning of ports 20 through 1024 on 6 internal DMZ hosts',
      'TCP FIN flag set without standard SYN pre-negotiation',
      'Probe interval randomized between 120ms and 450ms to evade naive rate-limiters',
    ],
    modelReasoning: [
      'Graph-based port scan detector flagged sudden fan-out degree spike (k=38)',
      'Forecast model indicates 78% likelihood of targeted vulnerability exploitation following recon',
    ],
    recommendedResponse: 'Drop stealth TCP packets lacking valid state flags and blacklist scanner subnet.',
  },
  {
    id: 'THR-8887',
    timestamp: '21:49:10 IST',
    sourceIp: '203.0.113.205',
    sourceCountry: 'US (AS16509 AWS)',
    destinationIp: '10.0.3.45',
    destinationPort: 8080,
    protocol: 'TCP',
    trafficSize: '2.4 MB',
    packetCount: 290,
    threat: 'Mirai Botnet Heartbeat & Command',
    category: 'Botnet',
    severity: 'critical',
    status: 'investigating',
    confidence: 96,
    indicators: [
      'Outbound beaconing to known C2 server 198.51.100.12:9999 every 30.0 seconds',
      'Binary payload matches Mirai Telnet scanner bytecode signature',
      'Compromised internal IoT camera host 10.0.3.45 attempting lateral Telnet spread',
    ],
    modelReasoning: [
      'Periodic flow Fourier transform reveals sharp 30-sec periodicity (confidence 96.2%)',
      'Lateral movement attempt flagged by host-to-host graph adjacency detector',
    ],
    recommendedResponse: 'Immediately isolate host 10.0.3.45 from VLAN 3 and revoke 802.1X network access.',
  },
  {
    id: 'THR-8886',
    timestamp: '21:44:50 IST',
    sourceIp: '192.0.2.77',
    sourceCountry: 'BR (AS28573 Claro)',
    destinationIp: '10.0.2.80',
    destinationPort: 53,
    protocol: 'UDP',
    trafficSize: '8.4 MB',
    packetCount: 18900,
    threat: 'DNS Amplification Reflection Flood',
    category: 'DDoS',
    severity: 'high',
    status: 'blocked',
    confidence: 92,
    indicators: [
      'Inbound spoofed ANY query requests to public authoritative resolver',
      'Amplification factor of approximately 42x (50-byte request to 2100-byte response)',
      'Payload contains large DNS TXT records for unregistered domains',
    ],
    modelReasoning: [
      'UDP packet rate increased 620% in 3 minutes',
      'Classifier confidence: 92.6% DNS reflection vector',
    ],
    recommendedResponse: 'Apply Response Rate Limiting (RRL) on internal DNS authoritative servers.',
  },
  {
    id: 'THR-8885',
    timestamp: '21:40:15 IST',
    sourceIp: '198.51.100.99',
    sourceCountry: 'DE (AS24940 Hetzner)',
    destinationIp: '10.0.1.18',
    destinationPort: 445,
    protocol: 'TCP',
    trafficSize: '512 KB',
    packetCount: 650,
    threat: 'SMB Remote Code Execution Probe (EternalBlue pattern)',
    category: 'Malware',
    severity: 'critical',
    status: 'blocked',
    confidence: 95,
    indicators: [
      'Attempted tree connect to IPC$ with malformed multiplex ID header',
      'Matches Snort rule 41978: SMBv1 Buffer Overflow Exploit',
      'Port 445 perimeter exposure attempt',
    ],
    modelReasoning: [
      'Deep packet inspection neural net flagged high similarity to CVE-2017-0144 payload',
      'Risk scoring engine elevated threat to Tier 1 immediate response',
    ],
    recommendedResponse: 'Verify Port 445 is completely blocked at border router; isolate target subnet.',
  },
  {
    id: 'THR-8884',
    timestamp: '21:35:02 IST',
    sourceIp: '10.0.0.8',
    sourceCountry: 'Internal Gateway (Local)',
    destinationIp: '10.0.1.100',
    destinationPort: 443,
    protocol: 'HTTPS',
    trafficSize: '14.2 MB',
    packetCount: 9200,
    threat: 'High-Volume Corporate API Sync',
    category: 'Normal Traffic',
    severity: 'safe',
    status: 'mitigated',
    confidence: 99,
    indicators: [
      'Valid mutual TLS (mTLS) certificate presented',
      'Standard Kubernetes ingress controller service synchronization',
    ],
    modelReasoning: [
      'Traffic conforms completely to expected daily backup / sync baseline profile',
    ],
    recommendedResponse: 'No action required. Whitelisted internal service.',
  },
];

// Threat Distribution Data
export const THREAT_DISTRIBUTION_DATA = [
  { category: 'DDoS', count: 18, percentage: 38, severity: 'critical', color: '#dc2626' },
  { category: 'Port Scan', count: 11, percentage: 23, severity: 'medium', color: '#0284c7' },
  { category: 'Brute Force', count: 7, percentage: 15, severity: 'high', color: '#d97706' },
  { category: 'Botnet', count: 5, percentage: 11, severity: 'critical', color: '#dc2626' },
  { category: 'Web Attack', count: 4, percentage: 8, severity: 'high', color: '#d97706' },
  { category: 'Malware', count: 2, percentage: 5, severity: 'critical', color: '#dc2626' },
];

// Traffic Analytics for Time Ranges
export function getTrafficAnalyticsData(range: '1H' | '6H' | '24H' | '7D'): TrafficDataPoint[] {
  const points: TrafficDataPoint[] = [];
  const count = range === '1H' ? 12 : range === '6H' ? 24 : range === '24H' ? 24 : 14;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    let timeLabel = '';
    let intervalMs = 0;

    if (range === '1H') {
      intervalMs = i * 5 * 60 * 1000;
      const d = new Date(now.getTime() - intervalMs);
      timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (range === '6H') {
      intervalMs = i * 15 * 60 * 1000;
      const d = new Date(now.getTime() - intervalMs);
      timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (range === '24H') {
      intervalMs = i * 60 * 60 * 1000;
      const d = new Date(now.getTime() - intervalMs);
      timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      intervalMs = i * 12 * 60 * 60 * 1000;
      const d = new Date(now.getTime() - intervalMs);
      timeLabel = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:00`;
    }

    // Realistic Mbps variations
    const baseIn = 620 + Math.sin(i / 2) * 80 + (count - i) * 6;
    const baseOut = 410 + Math.cos(i / 2) * 50;
    // Suspicious spike near current time
    const suspicious = i < 4 ? 120 + (4 - i) * 45 : 18 + Math.sin(i) * 10;

    points.push({
      time: timeLabel,
      incomingMbps: Math.round(baseIn),
      outgoingMbps: Math.round(baseOut),
      suspiciousMbps: Math.max(5, Math.round(suspicious)),
      totalPackets: Math.round((baseIn + baseOut) * 180),
    });
  }

  return points;
}

// System Health Items
export const SYSTEM_HEALTH_ITEMS: SystemHealthItem[] = [
  {
    id: 'sh-1',
    name: 'Network Sensors',
    category: 'Ingestion Layer',
    status: 'healthy',
    uptime: '99.99%',
    latency: '1.2 ms',
    details: '12 of 12 distributed probe nodes streaming active PCAP/NetFlow frames.',
  },
  {
    id: 'sh-2',
    name: 'ML Model Engine',
    category: 'AI Forecasting',
    status: 'healthy',
    uptime: '100%',
    latency: '12.4 ms',
    details: 'Inference latency well within 50ms SLA; ONNX runtime engine optimized.',
  },
  {
    id: 'sh-3',
    name: 'Data Pipeline',
    category: 'Message Broker',
    status: 'healthy',
    uptime: '99.98%',
    latency: '4.8 ms',
    details: 'Apache Kafka buffer utilization at 0.4%; zero packet drop in buffer queue.',
  },
  {
    id: 'sh-4',
    name: 'REST / gRPC API',
    category: 'Application Gateway',
    status: 'healthy',
    uptime: '99.99%',
    latency: '8.1 ms',
    details: 'Endpoints responsive; token authentication and rate limiting active.',
  },
  {
    id: 'sh-5',
    name: 'Timescale / ClickHouse DB',
    category: 'Storage Layer',
    status: 'healthy',
    uptime: '100%',
    latency: '3.6 ms',
    details: 'Historical flows partition compressed; write throughput 420K rows/sec.',
  },
];

// Live Traffic Initial State
export const INITIAL_LIVE_TRAFFIC: LiveTrafficMetricState = {
  packetsPerSec: 32410,
  bytesPerSec: '842.6 MB/s',
  activeConnections: 12482,
  uniqueSourceIps: 1840,
  uniqueDestIps: 420,
  tcpPercent: 68,
  udpPercent: 24,
  icmpPercent: 5,
  otherPercent: 3,
  currentBandwidthMbps: 6740.8,
};

// Live Connection Logs Sample
export const INITIAL_CONNECTION_LOGS: LiveConnectionLog[] = [
  { id: 'conn-1', timestamp: '21:58:02.124', srcIp: '198.51.100.42', srcPort: 49152, dstIp: '10.0.1.50', dstPort: 80, protocol: 'TCP', flags: 'SYN', bytes: 64, durationMs: 12, state: 'SYN_RECV', flaggedAnomaly: true },
  { id: 'conn-2', timestamp: '21:58:02.120', srcIp: '198.51.100.42', srcPort: 49153, dstIp: '10.0.1.50', dstPort: 80, protocol: 'TCP', flags: 'SYN', bytes: 64, durationMs: 11, state: 'SYN_RECV', flaggedAnomaly: true },
  { id: 'conn-3', timestamp: '21:58:02.115', srcIp: '10.0.1.14', srcPort: 54322, dstIp: '10.0.2.10', dstPort: 443, protocol: 'TCP', flags: 'ACK, PSH', bytes: 1420, durationMs: 340, state: 'ESTABLISHED', flaggedAnomaly: false },
  { id: 'conn-4', timestamp: '21:58:02.098', srcIp: '203.0.113.88', srcPort: 39812, dstIp: '10.0.1.22', dstPort: 22, protocol: 'TCP', flags: 'SYN', bytes: 54, durationMs: 4, state: 'SYN_SENT', flaggedAnomaly: true },
  { id: 'conn-5', timestamp: '21:58:02.080', srcIp: '10.0.3.12', srcPort: 53120, dstIp: '8.8.8.8', dstPort: 53, protocol: 'UDP', flags: 'NONE', bytes: 78, durationMs: 18, state: 'ESTABLISHED', flaggedAnomaly: false },
  { id: 'conn-6', timestamp: '21:58:02.072', srcIp: '192.0.2.144', srcPort: 44320, dstIp: '10.0.2.10', dstPort: 443, protocol: 'TCP', flags: 'ACK', bytes: 2180, durationMs: 120, state: 'ESTABLISHED', flaggedAnomaly: true },
  { id: 'conn-7', timestamp: '21:58:02.065', srcIp: '10.0.4.99', srcPort: 51200, dstIp: '10.0.1.1', dstPort: 443, protocol: 'TCP', flags: 'ACK, PSH', bytes: 3410, durationMs: 890, state: 'ESTABLISHED', flaggedAnomaly: false },
  { id: 'conn-8', timestamp: '21:58:02.050', srcIp: '198.51.100.19', srcPort: 60124, dstIp: '10.0.1.1', dstPort: 445, protocol: 'TCP', flags: 'FIN', bytes: 40, durationMs: 2, state: 'CLOSED', flaggedAnomaly: true },
];

// Historical Attacks Data
export const INITIAL_HISTORICAL_ATTACKS: HistoricalAttack[] = [
  {
    id: 'INC-2026-0924',
    date: '2026-09-24 16:32 IST',
    attackType: 'DDoS',
    source: 'AS45899 (Botnet Cluster, 4,200 IPs)',
    targetAsset: 'DMZ Core Edge Gateway (10.0.1.50)',
    duration: '42 minutes',
    severity: 'critical',
    confidence: 96,
    detectionMethod: 'Bi-LSTM Temporal Forecaster (Lead time: 24m)',
    status: 'Mitigated',
    peakVolume: '14.8 Gbps (18.2M pps)',
    incidentSummary: 'Volumetric SYN flood forecasted 24 minutes prior to peak. Automated BGP Flowspec diversion scrubbed 99.2% of anomalous traffic.',
  },
  {
    id: 'INC-2026-0922',
    date: '2026-09-22 03:15 IST',
    attackType: 'Brute Force',
    source: 'AS4134 (Distributed Proxy Pool)',
    targetAsset: 'SSH Bastion Host (10.0.1.22)',
    duration: '1 hour 15 min',
    severity: 'high',
    confidence: 93,
    detectionMethod: 'Sequential Flow Anomaly Detector',
    status: 'Blocked',
    peakVolume: '120 auth attempts/sec',
    incidentSummary: 'Coordinated dictionary attack on privileged credentials. Fail2ban automated CIDR isolation prevented unauthorized compromise.',
  },
  {
    id: 'INC-2026-0919',
    date: '2026-09-19 11:48 IST',
    attackType: 'Port Scan',
    source: '198.51.100.89 (Netherlands)',
    targetAsset: 'Database Subnet 10.0.2.0/24',
    duration: '18 minutes',
    severity: 'medium',
    confidence: 91,
    detectionMethod: 'Graph Degree Entropy Classifier',
    status: 'Blocked',
    peakVolume: '4,500 probe packets/sec',
    incidentSummary: 'Stealth Xmas/FIN port sweep scanning for open MySQL and Redis ports. Perimeter firewall dropped anomalous non-syn packets.',
  },
  {
    id: 'INC-2026-0915',
    date: '2026-09-15 22:04 IST',
    attackType: 'Botnet',
    source: 'Compromised IoT Gateway (Internal 10.0.3.45)',
    targetAsset: 'External C2 Server (198.51.100.12)',
    duration: '3 hours',
    severity: 'critical',
    confidence: 98,
    detectionMethod: 'Autoencoder Periodic Flow Analysis',
    status: 'Neutralized',
    peakVolume: 'Periodic 30-sec beaconing',
    incidentSummary: 'Mirai variant payload executed on unpatched security camera. Internal network segment isolated and firmware re-imaged.',
  },
  {
    id: 'INC-2026-0910',
    date: '2026-09-10 14:20 IST',
    attackType: 'Web Attack',
    source: '192.0.2.144 (Russia)',
    targetAsset: 'Customer Auth Portal (10.0.2.10)',
    duration: '25 minutes',
    severity: 'high',
    confidence: 89,
    detectionMethod: 'HTTP Payload Anomaly Network',
    status: 'Blocked',
    peakVolume: '450 malicious requests/min',
    incidentSummary: 'Automated SQL injection attempting to bypass login form via tautology injection. WAF rule 1044 triggered and blocked attacker IP.',
  },
];

// Security Alerts
export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-1092',
    title: 'Predicted Volumetric DDoS SYN Flood (Lead Time: 18m)',
    timestamp: '21:56:42 IST',
    source: '198.51.100.42 (AS45899)',
    attackType: 'DDoS',
    confidence: 94,
    severity: 'critical',
    status: 'open',
    assignee: 'Capt. V. Sharma',
  },
  {
    id: 'ALT-1091',
    title: 'High-Frequency SSH Authentication Failures on Bastion',
    timestamp: '21:55:18 IST',
    source: '203.0.113.88 (AS4134)',
    attackType: 'Brute Force',
    confidence: 91,
    severity: 'high',
    status: 'in_progress',
    assignee: 'Analyst K. Roy',
  },
  {
    id: 'ALT-1090',
    title: 'Malicious SQL Payload in HTTP POST Body',
    timestamp: '21:53:04 IST',
    source: '192.0.2.144',
    attackType: 'Web Attack',
    confidence: 89,
    severity: 'high',
    status: 'open',
  },
  {
    id: 'ALT-1089',
    title: 'Stealth TCP FIN Port Scan Targeting Core DMZ',
    timestamp: '21:51:22 IST',
    source: '198.51.100.19',
    attackType: 'Port Scan',
    confidence: 86,
    severity: 'medium',
    status: 'resolved',
    resolvedAt: '21:54:10 IST',
    resolutionNotes: 'Perimeter firewall rate-limiting applied. Attacker IP added to 24-hour drop rule.',
  },
  {
    id: 'ALT-1088',
    title: 'Potential C2 Heartbeat Beaconing from IoT Segment',
    timestamp: '21:49:10 IST',
    source: '10.0.3.45 (VLAN 3)',
    attackType: 'Botnet',
    confidence: 96,
    severity: 'critical',
    status: 'in_progress',
    assignee: 'Capt. V. Sharma',
  },
  {
    id: 'ALT-1087',
    title: 'Unusual ICMP Ping Sweep from Foreign Subnet',
    timestamp: '21:32:00 IST',
    source: '198.51.100.8',
    attackType: 'Port Scan',
    confidence: 76,
    severity: 'low',
    status: 'resolved',
    resolvedAt: '21:40:00 IST',
    resolutionNotes: 'Low volume reconnaissance. Dropped at border ACL.',
  },
];

// AI Model Performance Benchmark Data
export const MODEL_PERFORMANCE_METRICS: ModelMetricInfo[] = [
  { name: 'Accuracy', value: '96.4%', score: 0.964, description: 'Overall correct classifications across attack & normal flows', benchmarkTarget: '> 95.0%' },
  { name: 'Precision', value: '94.8%', score: 0.948, description: 'True positives divided by all predicted attacks (low false alarm)', benchmarkTarget: '> 92.0%' },
  { name: 'Recall', value: '93.7%', score: 0.937, description: 'Proportion of actual attack flows successfully caught', benchmarkTarget: '> 90.0%' },
  { name: 'F1 Score', value: '94.2%', score: 0.942, description: 'Harmonic mean balancing precision and recall performance', benchmarkTarget: '> 92.0%' },
  { name: 'ROC-AUC', value: '97.1%', score: 0.971, description: 'Area under Receiver Operating Characteristic curve', benchmarkTarget: '> 95.0%' },
  { name: 'False Positive Rate', value: '1.2%', score: 0.012, description: 'Normal traffic erroneously flagged as an attack', benchmarkTarget: '< 2.5%' },
];

export const MODEL_PIPELINE_STAGES: ModelPipelineStage[] = [
  {
    id: 1,
    title: 'Network Traffic Ingestion',
    subtitle: 'High-speed PCAP / NetFlow v9 / IPFIX',
    description: 'Captures raw wire frames via AF_PACKET & DPDK zero-copy ring buffers at line rate (10 Gbps).',
    tech: 'DPDK / eBPF kernel probes',
    latencyMs: 1.4,
  },
  {
    id: 2,
    title: 'Feature Extraction',
    subtitle: 'Flow Aggregation & Statistical Moments',
    description: 'Computes 78 statistical network flow features including packet inter-arrival times, payload entropy, and TCP flag ratios.',
    tech: 'Streaming Flow Extractor (C++)',
    latencyMs: 3.2,
  },
  {
    id: 3,
    title: 'Data Preprocessing',
    subtitle: 'Normalization & Sliding Window Slicing',
    description: 'Applies RobustScaler normalization and maintains 60-second sliding temporal windows with 5-second strides.',
    tech: 'NumPy / TensorRT Batching',
    latencyMs: 1.1,
  },
  {
    id: 4,
    title: 'Anomaly Detection',
    subtitle: 'Bi-LSTM Autoencoder / Isolation Forest',
    description: 'Calculates flow reconstruction error against learned normal traffic baseline to spot zero-day anomalies.',
    tech: 'PyTorch / ONNX Runtime FP16',
    latencyMs: 2.8,
  },
  {
    id: 5,
    title: 'Attack Classification',
    subtitle: 'Multi-Class XGBoost & Transformer Classifier',
    description: 'Categorizes anomalous patterns into specific MITRE ATT&CK vectors: DDoS, Port Scan, Brute Force, Web, Botnet.',
    tech: 'LightGBM & DistilBERT Embeddings',
    latencyMs: 2.1,
  },
  {
    id: 6,
    title: 'Time-Series Forecasting',
    subtitle: 'Temporal Fusion Transformer (TFT)',
    description: 'Predicts future attack probability, volume trajectory, and time-to-impact (lead time 15–60 minutes).',
    tech: 'Temporal Fusion Transformer',
    latencyMs: 1.8,
  },
  {
    id: 7,
    title: 'Threat Prediction & XAI',
    subtitle: 'SHAP Feature Attributions & Preemptive Alert',
    description: 'Generates explainable factor attribution percentages and triggers proactive mitigation playbooks.',
    tech: 'TreeSHAP & Rules Engine',
    latencyMs: 0.8,
  },
];

export const FEATURE_IMPORTANCE_LIST: FeatureImportanceItem[] = [
  { feature: 'flow_packets_per_sec_ratio', importance: 0.28, category: 'Volume Dynamics' },
  { feature: 'tcp_syn_to_ack_asymmetry', importance: 0.22, category: 'Protocol Flags' },
  { feature: 'src_ip_entropy_score', importance: 0.17, category: 'Entropy' },
  { feature: 'inter_arrival_time_variance', importance: 0.13, category: 'Temporal Timing' },
  { feature: 'dst_port_diversity_index', importance: 0.09, category: 'Topology' },
  { feature: 'tcp_rst_generation_rate', importance: 0.06, category: 'Protocol Flags' },
  { feature: 'avg_payload_byte_size', importance: 0.05, category: 'Payload' },
];

export const MODEL_METADATA = {
  name: 'Network Attack Forecasting Engine v1.0',
  architecture: 'Hybrid Bi-LSTM Autoencoder + Temporal Fusion Transformer (TFT)',
  lastTrained: '2026-09-20 02:00:00 UTC',
  trainingSamples: '1,248,500 network flows',
  evaluationDataset: 'CICIDS2017 & TON-IoT Benchmarks (Synthesized SOC Profile)',
  featuresCount: 78,
  inferenceLatencyAvg: '12.4 ms',
  quantization: 'FP16 ONNX Runtime Execution',
  framework: 'PyTorch 2.4 / ONNX / TensorRT',
  targetLeadTime: '15 to 60 minutes pre-attack early warning',
};
