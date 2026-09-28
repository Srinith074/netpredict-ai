import {
  AttackForecastData,
  HistoricalAttack,
  LiveTrafficMetricState,
  SecurityAlert,
  SecurityOverviewMetrics,
  ThreatEvent,
} from '../types';
import {
  FORECAST_SCENARIOS,
  INITIAL_ALERTS,
  INITIAL_HISTORICAL_ATTACKS,
  INITIAL_LIVE_TRAFFIC,
  INITIAL_SECURITY_METRICS,
  INITIAL_THREAT_EVENTS,
} from './mockData';

const CONFIG_KEY = 'netpredict_api_config';

export interface ApiConfig {
  mode: 'mock' | 'live';
  backendUrl: string;
  pollingIntervalSeconds: number;
}

export const DEFAULT_CONFIG: ApiConfig = {
  mode: 'mock',
  backendUrl: 'http://localhost:8000/api/v1',
  pollingIntervalSeconds: 5,
};

export class ApiService {
  private config: ApiConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
    } catch {
      // LocalStorage not available or quota exceeded
    }
  }

  private loadConfig(): ApiConfig {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  }

  public async getOverviewMetrics(): Promise<SecurityOverviewMetrics> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/overview`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    // Return mock data with subtle live jitter
    return {
      ...INITIAL_SECURITY_METRICS,
      networkTraffic: {
        ...INITIAL_SECURITY_METRICS.networkTraffic,
        value: `${(1.82 + Math.random() * 0.05).toFixed(2)}M`,
      },
      activeConnections: {
        ...INITIAL_SECURITY_METRICS.activeConnections,
        value: `${Math.round(12450 + Math.random() * 80).toLocaleString()}`,
      },
    };
  }

  public async getAttackForecast(scenarioKey: string = 'ddos'): Promise<AttackForecastData> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/forecast`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    const scenario = FORECAST_SCENARIOS[scenarioKey] || FORECAST_SCENARIOS.ddos;
    return JSON.parse(JSON.stringify(scenario));
  }

  public async getThreatEvents(): Promise<ThreatEvent[]> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/threats`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_THREAT_EVENTS));
  }

  public async getLiveTrafficMetrics(): Promise<LiveTrafficMetricState> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/live-traffic`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    // Simulated live metrics with subtle natural pulse
    const jitter = (Math.random() - 0.5) * 500;
    return {
      ...INITIAL_LIVE_TRAFFIC,
      packetsPerSec: Math.round(INITIAL_LIVE_TRAFFIC.packetsPerSec + jitter),
      activeConnections: Math.round(INITIAL_LIVE_TRAFFIC.activeConnections + (Math.random() - 0.5) * 40),
    };
  }

  public async getHistoricalAttacks(): Promise<HistoricalAttack[]> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/history`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_HISTORICAL_ATTACKS));
  }

  public async getAlerts(): Promise<SecurityAlert[]> {
    if (this.config.mode === 'live') {
      try {
        const res = await fetch(`${this.config.backendUrl}/alerts`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return await res.json();
      } catch {
        console.warn('Live API unavailable, falling back to mock');
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_ALERTS));
  }
}

export const apiService = new ApiService();
