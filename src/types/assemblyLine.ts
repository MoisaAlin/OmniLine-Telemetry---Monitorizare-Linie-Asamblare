export type StationStatus = 'nominal' | 'warning' | 'critical' | 'safe_stop' | 'offline';

export type SensorType = 
  | 'temperature' 
  | 'vibration' 
  | 'pressure' 
  | 'speed' 
  | 'precision_tolerance' 
  | 'power' 
  | 'optical_defect';

export interface SensorData {
  id: string;
  name: string;
  code: string;
  type: SensorType;
  value: number;
  unit: string;
  nominalMin: number;
  nominalMax: number;
  warningLow?: number;
  warningHigh: number;
  criticalHigh: number;
  criticalLow?: number;
  status: 'nominal' | 'warning' | 'critical';
  history: number[]; // last 15-20 readings
  description: string;
}

export interface Workstation {
  id: string;
  number: number;
  name: string;
  code: string;
  type: string;
  vendorModel: string;
  status: StationStatus;
  cycleTimeSec: number;
  targetCycleTimeSec: number;
  processedCount: number;
  rejectedCount: number;
  sensors: SensorData[];
  healthScore: number; // 0-100%
  operatorAssigned: string;
  lastMaintenanceDate: string;
}

export interface SafetyRoutineState {
  isActive: boolean;
  stage: 'idle' | 'triggered' | 'decelerating' | 'pneumatic_dump' | 'quarantine' | 'locked_out' | 'inspection_ready';
  triggeredAt: string | null;
  triggeredStationId: string | null;
  triggeredSensorCode: string | null;
  reason: string | null;
  quarantinedPartId: string | null;
  stepsCompleted: string[];
  interlockLocked: boolean;
}

export interface MaintenanceIncident {
  id: string;
  code: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  sensorCode: string;
  severity: 'CRITICĂ' | 'RIDICATĂ' | 'MEDIE' | 'PREVENTIVĂ';
  status: 'DESCHIS' | 'IN_INTERVENTIE' | 'REZOLVAT';
  title: string;
  rootCauseHypothesis: string;
  telemetrySnapshot: {
    sensorName: string;
    recordedValue: string;
    nominalRange: string;
    deviation: string;
  }[];
  impactOnBatch: string;
  quarantinedUnits: number;
  assignedTeam: 'Automatizări & Robotică' | 'Mentenanță Mecanică CNC' | 'Control Calitate AOI' | 'Mentenanță Pneumatică';
  sopChecklist: {
    step: string;
    completed: boolean;
  }[];
  technicianNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface TechnicalNotification {
  id: string;
  timestamp: string;
  type: 'critical_alarm' | 'warning' | 'safety_stop' | 'ticket_created' | 'system_info';
  title: string;
  message: string;
  stationCode: string;
  targetRole: 'Automatist' | 'Tehnician Mecanic' | 'Inspector Calitate' | 'Șef Tură' | 'Toți';
  isRead: boolean;
  acknowledgedBy?: string;
}

export interface OEEStats {
  availability: number; // e.g. 94.2%
  performance: number;  // e.g. 96.5%
  quality: number;      // e.g. 98.8%
  overallOEE: number;   // Availability * Performance * Quality / 10000
  targetOEE: number;
  unitsProduced: number;
  unitsGood: number;
  unitsScrap: number;
  scrapRate: number;    // %
  currentPPM: number;   // parts per minute
  targetPPM: number;
  taktTimeSec: number;
  activeShift: string;
  history: {
    time: string;
    oee: number;
    availability: number;
    performance: number;
    quality: number;
  }[];
}
