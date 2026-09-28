# NetPredict AI — AI-Based Network Attack Forecasting SOC Dashboard
### Smart India Hackathon (SIH 2026) Prototype

> **Problem Statement**: AI-Based Network Attack Forecasting from Network Traffic Data  
> **Solution**: Enterprise-grade Security Operations Center (SOC) dashboard that analyzes network telemetry, detects anomalous packet dynamics, identifies MITRE ATT&CK patterns, and forecasts impending cyber attacks **15 to 60 minutes before saturation occurs** with Explainable AI (XAI).

---

## 🛡️ Key Features & Implementation Overview

### 1. Enterprise SOC Design Aesthetics
- **Minimal, Professional Cybersecurity Theme**: Built specifically for high-stress security operations environments with white/light gray backgrounds (`#f8fafc`, `#ffffff`), slate/charcoal typography (`#0f172a`, `#334155`), and subtle hairline borders (`#e2e8f0`).
- **Strict Color Discipline**:
  - **Single Primary Accent**: Muted enterprise blue (`#0284c7`).
  - **Red**: Exclusively for Critical/High severity attacks (`#dc2626`).
  - **Amber/Orange**: Exclusively for warnings and reconnaissance (`#d97706`).
  - **Green**: Exclusively for healthy/safe states (`#16a34a`).
  - **Zero Purple Gradients / Zero Glassmorphism**: Designed to look like a true enterprise product (CrowdStrike / Palo Alto Cortex / Cloudflare Radar) rather than a student toy.

### 2. Application Architecture & Pages
1. **Login Page**:
   - Clean enterprise authentication screen with product name, subtitle, and demo badge.
   - Quick one-click "Fill Demo Analyst Credentials" button for effortless judge presentations.
2. **Main SOC Dashboard**:
   - **Security Overview**: 4 metric cards (Network Traffic `1.84M pps`, Active Connections `12,482`, Threats Detected `37`, Predicted Attacks `8`) with trends and sparklines.
   - **Attack Forecast Panel (Next 60 Minutes)**: Clean line/area probability chart with 95% confidence bounds, warning (50%) & critical (75%) thresholds, and expected peak lead time marker (+21m).
   - **Network Traffic Analytics**: Duplex bandwidth (Incoming, Outgoing, and Suspicious traffic) with 1H, 6H, 24H, 7D time filters.
   - **Threat Distribution**: Horizontal breakdown of DDoS, Port Scan, Brute Force, Botnet, Web Attack, and Malware.
   - **Live Security Events**: Real-time telemetry table with clickable rows that open the detailed inspection drawer.
   - **System Health**: Health and latency monitoring for Network Sensors, ML Model, Data Pipeline (Kafka), REST/gRPC API, and TimescaleDB.
3. **Attack Forecast Page ("Predictive Threat Intelligence")**:
   - Current probability, 15-minute, 30-minute, and 60-minute forward projections with model confidence.
   - Multinomial attack distribution (DDoS 72%, Port Scan 15%, Brute Force 8%, Botnet 5%).
   - **Explainable AI (XAI)**: SHAP feature attributions (`Sudden increase in packet rate +31%`, `Increase in SYN packets +24%`, `Unusual source IP diversity +18%`, `Abnormal connection frequency +14%`).
   - **Interactive Scenario Switcher**: Judges can switch between Volumetric DDoS, Stealth Port Recon, Distributed Brute Force, and Clean Baseline to see the model dynamically recalculate!
   - **Preemptive Mitigation Playbook**: One-click autonomous actions (SYN-proxy deployment, BGP Flowspec rate-limiting, CIDR isolation).
4. **Threat Detection Page**:
   - Severity counters (Total, Critical, High, Medium, Low).
   - Multi-parameter filtering (Severity, Attack Type, Protocol, Source IP) and full-text search.
   - **Slide-over Threat Inspector**: Displays Indicators of Compromise (IoCs), AI model reasoning, recommended response, raw packet hex snippets, and one-click "Isolate Source IP" / "Export PCAP" actions.
5. **Live Traffic Page**:
   - Ingestion counters: Packets/sec, Throughput (Bytes/sec), Active Connections, Unique Source & Destination IPs.
   - 4 live telemetry charts: Packet Rate (pps), Bandwidth (Mbps), Protocol Distribution (TCP/UDP/ICMP), Connection Rate (cps).
   - Live socket state connection stream table with pause/resume stream toggle.
6. **Traffic Analysis Page**:
   - Multi-dimensional flow analysis (Time range, protocol, source subnet, destination, traffic direction).
   - **Flow Anomaly Score Timeline**: Graphing Isolation Forest reconstruction scores against 0.65 threshold.
   - Packet size distribution histogram (0-64B flood probes vs MTU jumbo frames).
   - Connection behavior metrics: Flow duration, inter-arrival variance, SYN/ACK ratio, port entropy.
   - Top talkers / ingress host table.
7. **Attack History Page**:
   - Searchable, filterable audit log of historical attacks.
   - **CSV Export**: Fully functional export downloading real `.csv` audit logs.
   - **Incident Post-Mortem Modal**: Deep forensic audit review for past incidents.
8. **AI Model Performance Page**:
   - Model name: `Network Attack Forecasting Engine v1.0`.
   - Benchmark Metrics (calibrated on CICIDS2017 & TON-IoT):
     - Accuracy: **96.4%**
     - Precision: **94.8%**
     - Recall: **93.7%**
     - F1 Score: **94.2%**
     - ROC-AUC: **97.1%**
     - False Positive Rate: **1.2%**
     - Inference Latency: **12.4 ms**
   - **Explicit Demo/Mock Disclaimer**: Clearly labeled as calibrated demo benchmarks.
   - **Model Architecture Pipeline Visualization**:
     `Network Traffic` → `Feature Extraction` → `Preprocessing` → `Anomaly Detection` → `Attack Classification` → `Time-Series Forecasting` → `Threat Prediction`.
   - Feature importance rankings and Confusion Matrix holdout breakdown.
9. **Alerts Page**:
   - Alert triage queue with Critical, High, Medium, Low severity states.
   - Actionable workflows: Acknowledge (assigns to operator), Investigate (routes to threat forensics), and Resolve (with resolution notes dialog).
   - Bulk "Acknowledge All Open Alerts" capability.
10. **Reports Page**:
    - Daily security summary, attack statistics, forecast lead-time summary, and recommended hardening checklist.
    - **Generate Executive Report Modal**: Formatted print/export modal with one-click **Print Document** and **Download Report (.txt)**.
11. **Settings Page**:
    - Seamlessly switch between **Demo Benchmark Engine** and **Live Python ML Backend** (`http://localhost:8000/api/v1`).
    - Capture interface selector (`eth0`, `eth1`, `ens192`), buffer flush intervals, and alert sensitivity thresholds.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm

### Development Mode
```bash
# Install dependencies (already completed)
npm install

# Start Vite Development Server
npm run dev
```
The application will be accessible at:
```
http://127.0.0.1:5173/
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Connecting a Real Python ML / FastAPI Backend

The application is architected via `src/services/apiService.ts` to seamlessly connect with an external Python ML model:

```python
# Sample FastAPI ML Backend (backend/main.py)
from fastapi import FastAPI
from pydantic import BaseModel
import torch

app = FastAPI(title="NetPredict ML Engine")

@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "model": "Bi-LSTM-TFT-v1.0", "latency_ms": 11.8}

@app.get("/api/v1/forecast")
def get_attack_forecast():
    # Return 60-minute predictive forecast points & explainable factors
    return { ... }
```

In the NetPredict AI dashboard:
1. Navigate to **Settings** in the left sidebar.
2. Select **Live Python ML / REST API Backend**.
3. Enter your backend URL (`http://localhost:8000/api/v1`).
4. Click **Test Connection** — the app will automatically synchronize with your model!

---

## 🎯 Smart India Hackathon Demonstration Guide

1. **Sign In**: Click "Fill Demo Analyst Credentials" on the login screen to enter the console as `Capt. V. Sharma (Lead SOC Analyst)`.
2. **Dashboard Overview**: Show judges the 4 overview metrics, the 60-minute attack forecast curve peaking in 21 minutes, and the live security events table.
3. **Drill Down into a Threat**: Click on `THR-8891 (DDoS SYN Flood Staging)`. Show judges the IoCs, AI model reasoning, and click **"Isolate Source IP"** to demonstrate immediate automated countermeasure execution.
4. **Predictive Intelligence & XAI**: Navigate to **Attack Forecast**. Highlight the **+21 min lead-time window**, and show the **Explainable AI** factors (`Sudden increase in packet rate +31%`, `Increase in SYN packets +24%`).
5. **Interactive Scenario Testing**: Use the **Scenario Switcher** pill buttons at the top right to switch between **Volumetric DDoS**, **Stealth Port Recon**, **Distributed Brute Force**, and **Clean Baseline**. Watch the forecasting curve and threat attributions dynamically recalculate!
6. **AI Architecture**: Navigate to **AI Model** to showcase the 7-stage pipeline topology (`Network Traffic` → `Feature Extraction` → `Anomaly Detection` → `Forecasting` → `Threat Prediction`).
7. **Executive Reporting**: Navigate to **Reports**, click **Generate Executive Report**, and preview the printable compliance report.
