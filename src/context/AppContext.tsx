import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  AnomalyResult,
  AttackCategory,
  AttackForecastData,
  ClassificationResult,
  HistoricalAttack,
  LiveTrafficMetricState,
  NetworkTrafficRecord,
  NormalizedFeatureVector,
  SecurityAlert,
  SecurityOverviewMetrics,
  SimulationScenario,
  ThreatEvent,
  ThreatStatus,
  User,
  PredictionExplanation,
  DemoScenarioId,
  DemoState,
  DemoTimelineStep,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_ALERTS,
  INITIAL_HISTORICAL_ATTACKS,
  INITIAL_SECURITY_METRICS,
  INITIAL_THREAT_EVENTS,
} from '../services/mockData';
import { pipelineOrchestrator } from '../services/pipelineOrchestrator';
import { trafficService } from '../services/trafficService';
import { demoService } from '../services/demoService';

export type NavItem =
  | 'Dashboard'
  | 'Live Traffic'
  | 'Attack Forecast'
  | 'Threat Detection'
  | 'Traffic Analysis'
  | 'Alerts'
  | 'Attack History'
  | 'AI Model'
  | 'Reports'
  | 'Settings';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  navTarget?: NavItem;
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Navigation
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;

  // ML Pipeline Simulation & Scenario State
  isSimulating: boolean;
  toggleSimulation: () => void;
  isStreaming: boolean;
  toggleStreaming: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  activeScenario: SimulationScenario;
  setScenario: (scenario: SimulationScenario) => void;
  triggerInstantAnomaly: () => void;

  // Dynamic ML Pipeline Data
  currentRecord: NetworkTrafficRecord | null;
  trafficHistory: NetworkTrafficRecord[];
  latestFeatures: NormalizedFeatureVector | null;
  latestAnomaly: AnomalyResult | null;
  latestClassification: ClassificationResult | null;
  latestExplanation: PredictionExplanation | null;
  forecastData: AttackForecastData;
  overviewMetrics: SecurityOverviewMetrics;
  liveTraffic: LiveTrafficMetricState;

  // Threats & Alerts
  threats: ThreatEvent[];
  selectedThreat: ThreatEvent | null;
  setSelectedThreat: (threat: ThreatEvent | null) => void;
  updateThreatStatus: (id: string, status: ThreatStatus) => void;
  alerts: SecurityAlert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string, notes?: string) => void;

  // Telemetry Controls
  lastUpdated: string;
  refreshNow: () => void;

  // History & Notifications
  historicalAttacks: HistoricalAttack[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Guided Live Demonstration Mode State & Controls
  isDemoMode: boolean;
  toggleDemoMode: (enable?: boolean) => void;
  demoState: DemoState;
  startDemoScenario: (scenario: DemoScenarioId) => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  resetDemo: () => void;
  stepDemoNext: () => void;
  setDemoSpeed: (speed: 'normal' | 'fast') => void;
  networkStatus: 'Protected' | 'Elevated Warning' | 'Under Attack';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(CURRENT_USER);
  const [activeNav, setActiveNav] = useState<NavItem>('Dashboard');

  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeScenario, setActiveScenarioState] = useState<SimulationScenario>('ddos');

  // Dynamic Pipeline States
  const [currentRecord, setCurrentRecord] = useState<NetworkTrafficRecord | null>(null);
  const [trafficHistory, setTrafficHistory] = useState<NetworkTrafficRecord[]>(trafficService.getHistory());
  const [latestFeatures, setLatestFeatures] = useState<NormalizedFeatureVector | null>(null);
  const [latestAnomaly, setLatestAnomaly] = useState<AnomalyResult | null>(null);
  const [latestClassification, setLatestClassification] = useState<ClassificationResult | null>(null);

  // Initialize pipeline with initial execution
  const initialStep = useMemo(() => {
    pipelineOrchestrator.setScenario('ddos');
    return pipelineOrchestrator.executeStep();
  }, []);

  const [latestExplanation, setLatestExplanation] = useState<PredictionExplanation | null>(initialStep.explanation);
  const [overviewMetrics, setOverviewMetrics] = useState<SecurityOverviewMetrics>(initialStep.overviewMetrics);
  const [forecastData, setForecastData] = useState<AttackForecastData>(initialStep.forecast);
  const [liveTraffic, setLiveTraffic] = useState<LiveTrafficMetricState>(initialStep.liveTraffic);
  const [threats, setThreats] = useState<ThreatEvent[]>(INITIAL_THREAT_EVENTS);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [historicalAttacks] = useState<HistoricalAttack[]>(INITIAL_HISTORICAL_ATTACKS);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Guided Live Demonstration Mode State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoState, setDemoState] = useState<DemoState>({
    isDemoModeActive: false,
    activeScenarioId: 'normal',
    isRunning: false,
    isPaused: false,
    currentStepIndex: -1,
    timeline: demoService.createInitialTimeline('normal'),
    statusMessage: 'Ready to launch guided demonstration. Select a scenario above.',
    autoPlaySpeed: 'normal',
  });

  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const demoStageRef = useRef<number>(-1);
  const demoScenarioRef = useRef<DemoScenarioId>('normal');
  const demoIsPausedRef = useRef<boolean>(false);

  // Notifications & Toasts
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'High Attack Probability Forecasted (82%)',
      description: 'Distributed SYN Flood predicted to peak in 18 minutes on Core DMZ Gateway.',
      timestamp: '2 min ago',
      severity: 'critical',
      read: false,
      navTarget: 'Attack Forecast',
    },
    {
      id: 'notif-2',
      title: 'New Port Scan Cluster Detected',
      description: 'Foreign subnet 198.51.100.19 probing DMZ hosts 10.0.1.1-10.',
      timestamp: '7 min ago',
      severity: 'medium',
      read: false,
      navTarget: 'Threat Detection',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Executes a single pipeline step and propagates across the SOC dashboard
  const runPipelineStep = useCallback(() => {
    const snapshot = pipelineOrchestrator.executeStep();

    setCurrentRecord(snapshot.record);
    setTrafficHistory(trafficService.getHistory());
    setLatestFeatures(snapshot.features);
    setLatestAnomaly(snapshot.anomaly);
    setLatestClassification(snapshot.classification);
    setLatestExplanation(snapshot.explanation);
    setForecastData(snapshot.forecast);
    setOverviewMetrics(snapshot.overviewMetrics);
    setLiveTraffic(snapshot.liveTraffic);

    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');

    // If an anomaly occurred, insert new live threat event into table if not already populated
    if (snapshot.newThreatEvent) {
      setThreats((prev) => [snapshot.newThreatEvent!, ...prev.slice(0, 14)]);
    }
  }, []);

  // Continuous background simulation loop
  useEffect(() => {
    if (!isSimulating || demoState.isRunning) return;

    // Run first step immediately
    runPipelineStep();

    // Tick every 3.5 seconds
    const interval = setInterval(() => {
      runPipelineStep();
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating, demoState.isRunning, runPipelineStep]);

  // Scenario Switcher: Immediately changes model weights and regenerates traffic
  const setScenario = useCallback((scenario: SimulationScenario) => {
    setActiveScenarioState(scenario);
    pipelineOrchestrator.setScenario(scenario);

    // Run pipeline immediately to update all cards and charts
    const snapshot = pipelineOrchestrator.executeStep();
    setCurrentRecord(snapshot.record);
    setTrafficHistory(trafficService.getHistory());
    setLatestFeatures(snapshot.features);
    setLatestAnomaly(snapshot.anomaly);
    setLatestClassification(snapshot.classification);
    setLatestExplanation(snapshot.explanation);
    setForecastData(snapshot.forecast);
    setOverviewMetrics(snapshot.overviewMetrics);
    setLiveTraffic(snapshot.liveTraffic);

    const scenarioLabels: Record<SimulationScenario, { title: string; desc: string; type: ToastMessage['type'] }> = {
      normal: { title: 'Scenario: Normal Traffic', desc: 'Baseline flows, low anomaly score, clean handshake completion.', type: 'info' },
      ddos: { title: 'Scenario: DDoS Attack', desc: 'Volumetric SYN flood, high packet rate (>150K pps), distributed sources.', type: 'error' },
      portscan: { title: 'Scenario: Port Scan', desc: 'Stealth horizontal port sweep, high connection failure rate.', type: 'warning' },
      bruteforce: { title: 'Scenario: Brute Force', desc: 'Repeated auth failures against Port 22, short session duration.', type: 'warning' },
      botnet: { title: 'Scenario: Botnet Activity', desc: 'Periodic C2 beaconing, internal IoT host compromise, high DNS.', type: 'error' },
    };

    const s = scenarioLabels[scenario];
    addToast(s.title, s.desc, s.type);
  }, [addToast]);

  const triggerInstantAnomaly = () => {
    setScenario('ddos');
    addToast('Simulated Attack Surge Injected', 'Immediate volumetric anomaly dispatched to forecasting engine.', 'error');
  };

  // =========================================================================
  // GUIDED LIVE DEMONSTRATION MODE ENGINE
  // =========================================================================

  const applyDemoStage = useCallback((scenarioId: DemoScenarioId, stepIdx: number) => {
    const stage = demoService.getStage(scenarioId, stepIdx);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';

    // Execute pipeline step with stage overrides
    const snapshot = pipelineOrchestrator.executeStep(stage.trafficOverrides, {
      anomalyScore: stage.anomalyScoreOverride,
      attackProbability: stage.probabilityOverride,
      confidence: stage.confidenceOverride,
    });

    setCurrentRecord(snapshot.record);
    setTrafficHistory(trafficService.getHistory());
    setLatestFeatures(snapshot.features);
    setLatestAnomaly(snapshot.anomaly);
    setLatestClassification(snapshot.classification);
    setLatestExplanation(snapshot.explanation);
    setForecastData(snapshot.forecast);
    setOverviewMetrics(snapshot.overviewMetrics);
    setLiveTraffic(snapshot.liveTraffic);
    setLastUpdated(timeStr);

    // If stage 6 (index 5) and scenario is an attack, register threat event
    if (stepIdx === 5 && scenarioId !== 'normal') {
      const newThreat: ThreatEvent = {
        id: `THR-DEMO-${Math.floor(9000 + Math.random() * 900)}`,
        timestamp: timeStr,
        sourceIp: snapshot.record.sourceIp,
        sourceCountry: snapshot.record.sourceIp.startsWith('10.') ? 'Internal VLAN' : 'Foreign AS45899',
        destinationIp: snapshot.record.destinationIp,
        destinationPort: snapshot.record.destinationPort,
        protocol: snapshot.record.protocol,
        trafficSize: `${(snapshot.record.byteCount / (1024 * 1024)).toFixed(1)} MB`,
        packetCount: snapshot.record.packetCount,
        threat: `${snapshot.classification.predictedCategory} (${snapshot.classification.subtype})`,
        category: snapshot.classification.predictedCategory,
        severity: snapshot.forecast.attackProbability >= 75 ? 'critical' : 'high',
        status: 'investigating',
        confidence: snapshot.classification.confidence,
        indicators: snapshot.classification.indicators,
        modelReasoning: snapshot.classification.modelReasoning,
        recommendedResponse: snapshot.classification.recommendedResponse,
      };
      setThreats((prev) => [newThreat, ...prev.slice(0, 14)]);
    }

    // Update demoState timeline
    setDemoState((prev) => {
      const updatedTimeline = prev.timeline.map((item, idx) => {
        if (idx < stepIdx) {
          return { ...item, status: 'completed' as const };
        } else if (idx === stepIdx) {
          return {
            ...item,
            status: 'active' as const,
            timestamp: timeStr,
            metricHighlight: stage.metricHighlight,
            description: stage.description,
          };
        } else {
          return { ...item, status: 'pending' as const };
        }
      });

      return {
        ...prev,
        currentStepIndex: stepIdx,
        timeline: updatedTimeline,
        statusMessage: `Step ${stepIdx + 1}/6: ${stage.title} — ${stage.description}`,
      };
    });
  }, []);

  const runProgressiveDemo = useCallback((scenarioId: DemoScenarioId, startingStep = 0) => {
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
      demoTimerRef.current = null;
    }

    demoScenarioRef.current = scenarioId;
    demoStageRef.current = startingStep;
    demoIsPausedRef.current = false;

    // Apply starting stage immediately
    applyDemoStage(scenarioId, startingStep);

    if (startingStep >= 5) {
      setDemoState((prev) => ({
        ...prev,
        isRunning: false,
        isPaused: false,
        timeline: prev.timeline.map((t) => ({ ...t, status: 'completed' as const })),
        statusMessage: `Scenario complete: ${scenarioId.toUpperCase()} demonstration concluded.`,
      }));
      return;
    }

    const stepIntervalMs = demoState.autoPlaySpeed === 'fast' ? 1200 : 2500;
    let currentStep = startingStep;

    demoTimerRef.current = setInterval(() => {
      if (demoIsPausedRef.current) return;

      currentStep++;
      demoStageRef.current = currentStep;

      if (currentStep <= 5) {
        applyDemoStage(scenarioId, currentStep);
      }

      if (currentStep >= 5) {
        if (demoTimerRef.current) {
          clearInterval(demoTimerRef.current);
          demoTimerRef.current = null;
        }
        setTimeout(() => {
          setDemoState((prev) => ({
            ...prev,
            isRunning: false,
            timeline: prev.timeline.map((t) => ({ ...t, status: 'completed' as const })),
            statusMessage: `Demonstration Complete: ${scenarioId === 'normal' ? 'Normal Baseline Verified • Status: Protected' : 'Attack Successfully Forecasted with Preemptive Early Warning!'}`,
          }));
          addToast(
            'Guided Demo Complete',
            scenarioId === 'normal'
              ? 'Normal baseline operations confirmed. Status: Protected.'
              : `Threat ${scenarioId.toUpperCase()} identified and forecasted ahead of impact!`,
            'success'
          );
        }, 1200);
      }
    }, stepIntervalMs);
  }, [applyDemoStage, demoState.autoPlaySpeed, addToast]);

  const startDemoScenario = useCallback((scenarioId: DemoScenarioId) => {
    setActiveScenarioState(scenarioId);
    pipelineOrchestrator.setScenario(scenarioId);

    setDemoState((prev) => ({
      ...prev,
      isDemoModeActive: true,
      activeScenarioId: scenarioId,
      isRunning: true,
      isPaused: false,
      currentStepIndex: 0,
      timeline: demoService.createInitialTimeline(scenarioId),
      statusMessage: `Starting ${scenarioId.toUpperCase()} progressive demonstration...`,
    }));

    runProgressiveDemo(scenarioId, 0);
  }, [runProgressiveDemo]);

  const resetDemo = useCallback(() => {
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
      demoTimerRef.current = null;
    }

    demoStageRef.current = -1;
    demoIsPausedRef.current = false;
    demoScenarioRef.current = 'normal';

    setActiveScenarioState('normal');
    pipelineOrchestrator.setScenario('normal');

    // Run clean baseline step
    const snapshot = pipelineOrchestrator.executeStep();
    setCurrentRecord(snapshot.record);
    setTrafficHistory(trafficService.getHistory());
    setLatestFeatures(snapshot.features);
    setLatestAnomaly(snapshot.anomaly);
    setLatestClassification(snapshot.classification);
    setLatestExplanation(snapshot.explanation);
    setForecastData(snapshot.forecast);
    setOverviewMetrics(snapshot.overviewMetrics);
    setLiveTraffic(snapshot.liveTraffic);

    setDemoState((prev) => ({
      ...prev,
      activeScenarioId: 'normal',
      isRunning: false,
      isPaused: false,
      currentStepIndex: -1,
      timeline: demoService.createInitialTimeline('normal'),
      statusMessage: 'Demo reset: Network restored to clean diurnal baseline. Ready to demonstrate.',
    }));

    addToast('Demo Reset', 'System restored to clean enterprise baseline. Zero active threats.', 'info');
  }, [addToast]);

  const stepDemoNext = useCallback(() => {
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
      demoTimerRef.current = null;
    }

    const nextStep = Math.min(5, (demoState.currentStepIndex === -1 ? 0 : demoState.currentStepIndex + 1));
    demoStageRef.current = nextStep;
    demoIsPausedRef.current = true;

    setDemoState((prev) => ({
      ...prev,
      isRunning: nextStep < 5,
      isPaused: true,
    }));

    applyDemoStage(demoState.activeScenarioId, nextStep);

    if (nextStep === 5) {
      addToast('Demo Step 6/6 Reached', 'Forecast and security alerts fully materialized.', 'success');
    }
  }, [demoState.currentStepIndex, demoState.activeScenarioId, applyDemoStage, addToast]);

  const pauseDemo = useCallback(() => {
    demoIsPausedRef.current = true;
    setDemoState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resumeDemo = useCallback(() => {
    demoIsPausedRef.current = false;
    setDemoState((prev) => ({ ...prev, isPaused: false, isRunning: true }));
    runProgressiveDemo(demoScenarioRef.current, Math.max(0, demoStageRef.current));
  }, [runProgressiveDemo]);

  const setDemoSpeed = useCallback((speed: 'normal' | 'fast') => {
    setDemoState((prev) => ({ ...prev, autoPlaySpeed: speed }));
  }, []);

  const toggleDemoMode = useCallback((enable?: boolean) => {
    setIsDemoMode((prev) => {
      const next = enable !== undefined ? enable : !prev;
      setDemoState((d) => ({ ...d, isDemoModeActive: next }));
      if (next) {
        addToast('Guided Demo Mode Activated', 'Select one of the 4 scenarios to begin progressive demonstration.', 'info');
      } else {
        if (demoTimerRef.current) {
          clearInterval(demoTimerRef.current);
          demoTimerRef.current = null;
        }
      }
      return next;
    });
  }, [addToast]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
      }
    };
  }, []);

  // Compute live Network Security Status for top navigation badge
  const networkStatus = useMemo<'Protected' | 'Elevated Warning' | 'Under Attack'>(() => {
    if (forecastData.attackProbability >= 70 || (latestAnomaly && latestAnomaly.anomalyScore >= 0.8)) {
      return 'Under Attack';
    }
    if (forecastData.attackProbability >= 35 || (latestAnomaly && latestAnomaly.isAnomaly)) {
      return 'Elevated Warning';
    }
    return 'Protected';
  }, [forecastData.attackProbability, latestAnomaly]);

  const toggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      addToast(next ? 'Traffic Simulation Started' : 'Traffic Simulation Paused', undefined, 'info');
      return next;
    });
  };

  const startSimulation = () => {
    setIsSimulating(true);
    addToast('Traffic Simulation Started', undefined, 'info');
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    addToast('Traffic Simulation Paused', undefined, 'info');
  };

  const refreshNow = () => {
    runPipelineStep();
    addToast('Telemetry Synchronized', undefined, 'info');
  };

  const login = (email: string, pass: string): boolean => {
    if (email && pass) {
      setIsAuthenticated(true);
      setUser(CURRENT_USER);
      addToast('Authenticated Successfully', `Welcome back, ${CURRENT_USER.name}`, 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    addToast('Signed Out', 'You have been disconnected from NetPredict SOC.', 'info');
  };

  const updateThreatStatus = (id: string, status: ThreatStatus) => {
    setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (selectedThreat && selectedThreat.id === id) {
      setSelectedThreat((prev) => (prev ? { ...prev, status } : null));
    }
    addToast('Threat Status Updated', `Event ${id} transitioned to [${status.toUpperCase()}].`, 'success');
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'in_progress', assignee: CURRENT_USER.name } : a))
    );
    addToast('Alert Acknowledged', `Alert ${id} assigned to ${CURRENT_USER.name}`, 'info');
  };

  const resolveAlert = (id: string, notes: string = 'Investigated and mitigated by SOC team.') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved', resolvedAt: nowTime, resolutionNotes: notes } : a))
    );
    addToast('Alert Resolved', `Alert ${id} closed successfully.`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All Notifications Read', undefined, 'info');
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        activeNav,
        setActiveNav,
        isSimulating,
        toggleSimulation,
        isStreaming: isSimulating,
        toggleStreaming: toggleSimulation,
        startSimulation,
        stopSimulation,
        activeScenario,
        setScenario,
        triggerInstantAnomaly,
        currentRecord,
        trafficHistory,
        latestFeatures,
        latestAnomaly,
        latestClassification,
        latestExplanation,
        overviewMetrics,
        forecastData,
        liveTraffic,
        threats,
        selectedThreat,
        setSelectedThreat,
        updateThreatStatus,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        lastUpdated,
        refreshNow,
        historicalAttacks,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        isDemoMode,
        toggleDemoMode,
        demoState,
        startDemoScenario,
        pauseDemo,
        resumeDemo,
        resetDemo,
        stepDemoNext,
        setDemoSpeed,
        networkStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
