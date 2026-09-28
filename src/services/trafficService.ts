import { NetworkTrafficRecord, ProtocolType, SimulationScenario } from '../types';

/**
 * Traffic Simulation Service
 * Generates realistic 24-feature network traffic records corresponding to
 * normal traffic or active attack scenarios (DDoS, Port Scan, Brute Force, Botnet).
 */
export class TrafficService {
  private currentScenario: SimulationScenario = 'ddos';
  private tickCount: number = 0;
  private historyBuffer: NetworkTrafficRecord[] = [];
  private maxBufferSize: number = 50;

  // External IPs for simulation
  private ddosAttackSubnets = ['198.51.100.', '203.0.113.', '192.0.2.', '45.142.212.'];
  private normalClientSubnets = ['10.0.1.', '10.0.2.', '172.16.4.', '192.168.10.'];

  constructor() {
    // Pre-populate with initial normal baseline records
    for (let i = 10; i >= 0; i--) {
      const rec = this.createRecordForScenario('normal', Date.now() - i * 5000);
      this.historyBuffer.push(rec);
    }
  }

  public setScenario(scenario: SimulationScenario): void {
    this.currentScenario = scenario;
  }

  public getScenario(): SimulationScenario {
    return this.currentScenario;
  }

  public getHistory(): NetworkTrafficRecord[] {
    return [...this.historyBuffer];
  }

  /**
   * Deterministic pseudo-random helper to make tests reproducible for judges
   */
  private pseudoRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generates a new 24-feature network traffic record based on active scenario
   */
  public generateNextRecord(timestampOverride?: number): NetworkTrafficRecord {
    this.tickCount++;
    const now = timestampOverride || Date.now();
    const record = this.createRecordForScenario(this.currentScenario, now);

    this.historyBuffer.push(record);
    if (this.historyBuffer.length > this.maxBufferSize) {
      this.historyBuffer.shift();
    }

    return record;
  }

  private createRecordForScenario(scenario: SimulationScenario, epochMs: number): NetworkTrafficRecord {
    const date = new Date(epochMs);
    const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const rand = this.pseudoRandom(this.tickCount + epochMs);

    let sourceIp = '10.0.1.14';
    let destinationIp = '10.0.1.50';
    let sourcePort = 49152 + Math.floor(rand * 15000);
    let destinationPort = 443;
    let protocol: ProtocolType = 'TCP';
    let packetCount = 180;
    let byteCount = 240000;
    let packetRate = 24000;
    let byteRate = 650000;
    let flowDuration = 340; // ms
    let synCount = 12;
    let ackCount = 12;
    let rstCount = 0;
    let connectionCount = 180;
    let failedConnectionCount = 2;
    let uniqueSourceCount = 42;
    let uniqueDestinationCount = 6;
    let avgPacketSize = 650;
    let tcpFlags = 'ACK, PSH';
    let dnsRequests = 24;
    let httpRequests = 140;
    let connectionFrequency = 14;
    let previousAttackIndicator = 0;

    switch (scenario) {
      case 'ddos': {
        // Very high packet rate, high connection count, large number of packets from multiple sources, high SYN traffic
        const sub = this.ddosAttackSubnets[Math.floor(rand * this.ddosAttackSubnets.length)];
        sourceIp = `${sub}${10 + Math.floor(rand * 240)}`;
        destinationIp = '10.0.1.50'; // Core Gateway DMZ
        destinationPort = 80;
        protocol = 'TCP';
        packetRate = Math.round(145000 + rand * 85000);
        packetCount = Math.round(packetRate * 0.2);
        avgPacketSize = 64; // Small spoofed SYN packets
        byteCount = packetCount * avgPacketSize;
        byteRate = packetRate * avgPacketSize;
        flowDuration = Math.round(18 + rand * 25); // Extremely short, unanswered handshakes
        synCount = Math.round(packetCount * 0.88); // 88% SYN packets
        ackCount = Math.round(packetCount * 0.02); // Minimal ACK responses
        rstCount = Math.round(packetCount * 0.05);
        connectionCount = Math.round(12000 + rand * 6000);
        failedConnectionCount = Math.round(connectionCount * 0.78);
        uniqueSourceCount = Math.round(1800 + rand * 600); // Distributed source IPs
        uniqueDestinationCount = 2; // Target concentrated on DMZ load balancer
        tcpFlags = 'SYN';
        dnsRequests = 12;
        httpRequests = 10;
        connectionFrequency = Math.round(180 + rand * 90);
        previousAttackIndicator = 1;
        break;
      }

      case 'portscan': {
        // Many destination ports, short connections, repeated connection attempts, many failed connections
        sourceIp = '198.51.100.89'; // Single reconnaissance source
        destinationIp = `10.0.1.${1 + Math.floor(rand * 15)}`;
        // Scanning diverse ports
        const probePorts = [21, 22, 23, 25, 53, 80, 110, 135, 139, 443, 445, 1433, 3306, 3389, 8080];
        destinationPort = probePorts[Math.floor(rand * probePorts.length)];
        protocol = 'TCP';
        packetRate = Math.round(38000 + rand * 14000);
        packetCount = Math.round(packetRate * 0.15);
        avgPacketSize = 48; // Stealth FIN/SYN probe
        byteCount = packetCount * avgPacketSize;
        byteRate = packetRate * avgPacketSize;
        flowDuration = Math.round(12 + rand * 15); // Fast probe
        synCount = Math.round(packetCount * 0.45);
        ackCount = Math.round(packetCount * 0.05);
        rstCount = Math.round(packetCount * 0.48); // Firewalls returning RST
        connectionCount = Math.round(2800 + rand * 800);
        failedConnectionCount = Math.round(connectionCount * 0.86); // Closed ports
        uniqueSourceCount = 1; // Single or very few probing hosts
        uniqueDestinationCount = Math.round(180 + rand * 90); // Scanning across many ports/hosts
        tcpFlags = rand > 0.5 ? 'FIN' : 'SYN, ECE';
        dnsRequests = 8;
        httpRequests = 5;
        connectionFrequency = Math.round(85 + rand * 30);
        previousAttackIndicator = 0.6;
        break;
      }

      case 'bruteforce': {
        // Repeated connections to a service, high failed authentication-like traffic, same destination, repeated source behavior
        sourceIp = '203.0.113.88'; // Password spray source
        destinationIp = '10.0.1.22'; // SSH Bastion Host
        destinationPort = 22;
        protocol = 'TCP';
        packetRate = Math.round(28000 + rand * 9000);
        packetCount = Math.round(packetRate * 0.1);
        avgPacketSize = 280; // SSH key exchange & auth frames
        byteCount = packetCount * avgPacketSize;
        byteRate = packetRate * avgPacketSize;
        flowDuration = Math.round(180 + rand * 120); // Quick disconnect on PAM reject
        synCount = Math.round(packetCount * 0.28);
        ackCount = Math.round(packetCount * 0.32);
        rstCount = Math.round(packetCount * 0.25);
        connectionCount = Math.round(1400 + rand * 400);
        failedConnectionCount = Math.round(connectionCount * 0.92); // 92% authentication failures
        uniqueSourceCount = Math.round(4 + rand * 8); // Concentrated proxy pool
        uniqueDestinationCount = 1; // Concentrated exclusively on Bastion
        tcpFlags = 'ACK, PSH, RST';
        dnsRequests = 4;
        httpRequests = 0;
        connectionFrequency = Math.round(65 + rand * 25);
        previousAttackIndicator = 0.7;
        break;
      }

      case 'botnet': {
        // Distributed sources, periodic communication, abnormal destination patterns
        const botId = 10 + Math.floor(rand * 150);
        sourceIp = `10.0.3.${botId}`; // Internal IoT subnet compromise
        destinationIp = '198.51.100.12'; // External C2 server
        destinationPort = 9999;
        protocol = 'TCP';
        packetRate = Math.round(34000 + rand * 12000);
        packetCount = Math.round(packetRate * 0.12);
        avgPacketSize = 180;
        byteCount = packetCount * avgPacketSize;
        byteRate = packetRate * avgPacketSize;
        flowDuration = Math.round(620 + rand * 80);
        synCount = Math.round(packetCount * 0.18);
        ackCount = Math.round(packetCount * 0.75);
        rstCount = Math.round(packetCount * 0.02);
        connectionCount = Math.round(850 + rand * 250);
        failedConnectionCount = Math.round(connectionCount * 0.08);
        uniqueSourceCount = Math.round(85 + rand * 40); // Multi-node botnet swarm
        uniqueDestinationCount = 4; // C2 controllers & DNS resolvers
        tcpFlags = 'ACK, PSH';
        dnsRequests = 140; // High DNS resolution for DGA domains
        httpRequests = 15;
        connectionFrequency = Math.round(30 + Math.sin(this.tickCount) * 8); // Periodic beaconing
        previousAttackIndicator = 0.8;
        break;
      }

      case 'normal':
      default: {
        // Normal baseline traffic
        const clientSub = this.normalClientSubnets[Math.floor(rand * this.normalClientSubnets.length)];
        sourceIp = `${clientSub}${10 + Math.floor(rand * 200)}`;
        destinationIp = rand > 0.4 ? '10.0.2.10' : '10.0.1.50';
        destinationPort = rand > 0.3 ? 443 : 80;
        protocol = rand > 0.15 ? 'HTTPS' : 'TCP';
        packetRate = Math.round(21000 + rand * 7000);
        packetCount = Math.round(packetRate * 0.1);
        avgPacketSize = Math.round(620 + rand * 300);
        byteCount = packetCount * avgPacketSize;
        byteRate = packetRate * avgPacketSize;
        flowDuration = Math.round(350 + rand * 650);
        synCount = Math.round(packetCount * 0.12);
        ackCount = Math.round(packetCount * 0.85); // Standard 3-way handshake completion
        rstCount = Math.round(packetCount * 0.01);
        connectionCount = Math.round(320 + rand * 120);
        failedConnectionCount = Math.round(connectionCount * 0.012); // < 1.5% failed
        uniqueSourceCount = Math.round(180 + rand * 60);
        uniqueDestinationCount = Math.round(15 + rand * 8);
        tcpFlags = 'ACK, PSH';
        dnsRequests = Math.round(45 + rand * 20);
        httpRequests = Math.round(160 + rand * 50);
        connectionFrequency = Math.round(18 + rand * 6);
        previousAttackIndicator = 0.05;
        break;
      }
    }

    return {
      id: `FLW-${this.tickCount.toString().padStart(6, '0')}`,
      timestamp,
      epochMs,
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol,
      packetCount,
      byteCount,
      packetRate,
      byteRate,
      flowDuration,
      synCount,
      ackCount,
      rstCount,
      connectionCount,
      failedConnectionCount,
      uniqueSourceCount,
      uniqueDestinationCount,
      avgPacketSize,
      tcpFlags,
      dnsRequests,
      httpRequests,
      connectionFrequency,
      previousAttackIndicator,
      scenario,
    };
  }
}

export const trafficService = new TrafficService();
