import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Workstation, 
  SafetyRoutineState, 
  MaintenanceIncident, 
  TechnicalNotification, 
  OEEStats,
  SensorData
} from '../types/assemblyLine';
import { 
  INITIAL_WORKSTATIONS, 
  INITIAL_OEE, 
  INITIAL_INCIDENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialAssemblyData';
import { industrialAudio } from '../utils/audioAlerts';

export function useAssemblyLineSimulation() {
  const [workstations, setWorkstations] = useState<Workstation[]>(INITIAL_WORKSTATIONS);
  const [oee, setOee] = useState<OEEStats>(INITIAL_OEE);
  const [incidents, setIncidents] = useState<MaintenanceIncident[]>(INITIAL_INCIDENTS);
  const [notifications, setNotifications] = useState<TechnicalNotification[]>(INITIAL_NOTIFICATIONS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [activeFault, setActiveFault] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [safetyRoutine, setSafetyRoutine] = useState<SafetyRoutineState>({
    isActive: false,
    stage: 'idle',
    triggeredAt: null,
    triggeredStationId: null,
    triggeredSensorCode: null,
    reason: null,
    quarantinedPartId: null,
    stepsCompleted: [],
    interlockLocked: false,
  });

  const partCounterRef = useRef<number>(1841);

  // Trigger Automatic Safety Routine
  const triggerSafetyRoutine = useCallback((
    station: Workstation,
    sensor: SensorData,
    reasonText: string,
    rootCause: string,
    team: MaintenanceIncident['assignedTeam']
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];
    const fullTimeStr = `${dateStr} ${timeStr}`;
    const quarantinedPart = `LOT-A4-${partCounterRef.current++}`;
    const incidentCode = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Sound alert
    industrialAudio.playCriticalAlarm();
    setTimeout(() => {
      industrialAudio.playSafeStopRoutine();
    }, 400);

    // Update safety routine state
    setSafetyRoutine({
      isActive: true,
      stage: 'locked_out',
      triggeredAt: fullTimeStr,
      triggeredStationId: station.id,
      triggeredSensorCode: sensor.code,
      reason: reasonText,
      quarantinedPartId: quarantinedPart,
      stepsCompleted: [
        'Decelerație automată indexor',
        'Retragere scule în poziție sigură',
        'Carantinare piesă curentă',
        'Cuplare mecanică interlock LOTO'
      ],
      interlockLocked: true,
    });

    // Mark station as safe_stop
    setWorkstations((prev) =>
      prev.map((ws) =>
        ws.id === station.id ? { ...ws, status: 'safe_stop' } : ws
      )
    );

    // Create telemetry snapshot
    const deviationCalc = typeof sensor.value === 'number'
      ? `${(((sensor.value - sensor.nominalMax) / (sensor.nominalMax || 1)) * 100).toFixed(0)}%`
      : 'Depășire critică';

    const snapshot = station.sensors.map((s) => ({
      sensorName: s.name,
      recordedValue: `${s.value.toFixed ? s.value.toFixed(1) : s.value} ${s.unit}`,
      nominalRange: `${s.nominalMin} - ${s.nominalMax} ${s.unit}`,
      deviation: s.id === sensor.id ? `+${deviationCalc} (CRITIC)` : 'În limite nominale',
    }));

    // Auto-generate Incident Report
    const newIncident: MaintenanceIncident = {
      id: `inc-${Date.now()}`,
      code: incidentCode,
      timestamp: fullTimeStr,
      stationId: station.id,
      stationName: `${station.name} (${station.code})`,
      sensorCode: sensor.code,
      severity: 'CRITICĂ',
      status: 'DESCHIS',
      title: `Oprire Rutină Siguranță: ${sensor.name} peste pragul critic`,
      rootCauseHypothesis: rootCause,
      telemetrySnapshot: snapshot,
      impactOnBatch: `Linia a fost oprită în 1.2s. Reperul #${quarantinedPart} a fost evacuat în zona de carantină. Zero piese defecte livrate mai departe.`,
      quarantinedUnits: 1,
      assignedTeam: team,
      sopChecklist: [
        { step: 'Blocare LOTO activată și verificare absență tensiune/presiune reziduală', completed: true },
        { step: 'Inspecție vizuală și mecanică a subsistemului implicat', completed: false },
        { step: 'Recalibrare sau înlocuire componentă afectată conform manualului', completed: false },
        { step: 'Validare toleranțe în gol și resetare interlock de siguranță', completed: false },
        { step: 'Pornire în viteză redusă (Slow Ramp-up) și aprobare First Article', completed: false },
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Push instant notification to tech team
    const newNotification: TechnicalNotification = {
      id: `notif-${Date.now()}`,
      timestamp: timeStr,
      type: 'safety_stop',
      title: `Rutină Siguranță Declansată: ${station.name}`,
      message: `${reasonText} - Echipajul ${team} solicitat de urgență la Linia A-4.`,
      stationCode: station.code,
      targetRole: team.includes('Automatizări') ? 'Automatist' : team.includes('Mecanică') ? 'Tehnician Mecanic' : 'Inspector Calitate',
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  // Inject specific industrial failure
  const injectFault = useCallback((faultKey: 'cnc_bearing' | 'pneumatic_leak' | 'laser_tolerance' | 'ultrasonic_loss' | 'motor_overcurrent') => {
    setActiveFault(faultKey);

    setWorkstations((prev) => {
      return prev.map((ws) => {
        if (faultKey === 'cnc_bearing' && ws.id === 'ws-2') {
          // CNC Bearing overheating & excessive vibration
          const updatedSensors = ws.sensors.map((s) => {
            if (s.type === 'temperature') return { ...s, value: 84.5, status: 'critical' as const };
            if (s.type === 'vibration') return { ...s, value: 7.9, status: 'critical' as const };
            return s;
          });
          const targetSensor = updatedSensors.find(s => s.type === 'temperature')!;
          setTimeout(() => {
            triggerSafetyRoutine(
              ws,
              targetSensor,
              'Supraîncălzire critică lagăr ax principal CNC (84.5°C > 82.0°C) și vibrații ax 7.9 mm/s',
              'Uzura avansată a căii de rulare a rulmentului frontal Chiron FZ-12 din cauza pătrunderii micro-șpanului sau colmatării ungerii.',
              'Mentenanță Mecanică CNC'
            );
          }, 400);
          return { ...ws, status: 'critical' as const, sensors: updatedSensors, healthScore: 68 };
        }

        if (faultKey === 'pneumatic_leak' && ws.id === 'ws-3') {
          // Gripper pneumatic pressure loss
          const updatedSensors = ws.sensors.map((s) => {
            if (s.code === 'PRS-03') return { ...s, value: 3.4, status: 'critical' as const };
            return s;
          });
          const targetSensor = updatedSensors.find(s => s.code === 'PRS-03')!;
          setTimeout(() => {
            triggerSafetyRoutine(
              ws,
              targetSensor,
              'Cădere critică presiune gripper robotic Festo (3.4 bar < 4.2 bar limită minimă)',
              'Fisură racord flexibil pneumatic 8mm sau defectare electrovalvă proporțională VPPM la brațul 1 KUKA.',
              'Automatizări & Robotică'
            );
          }, 400);
          return { ...ws, status: 'critical' as const, sensors: updatedSensors, healthScore: 71 };
        }

        if (faultKey === 'laser_tolerance' && ws.id === 'ws-5') {
          // Keyence 3D laser dimension deviation
          const updatedSensors = ws.sensors.map((s) => {
            if (s.code === 'TOL-05') return { ...s, value: 34.2, status: 'critical' as const };
            if (s.code === 'DEF-05') return { ...s, value: 7, status: 'critical' as const };
            return s;
          });
          const targetSensor = updatedSensors.find(s => s.code === 'TOL-05')!;
          setTimeout(() => {
            triggerSafetyRoutine(
              ws,
              targetSensor,
              'Abatere dimensională critică cotă înălțime (+34.2 µm > toleranță 25 µm) și 7 defecte optice detectate',
              'Deplasare axială sculă de așchiere în port-cuțit sau deformare termică a piesei anterioare.',
              'Control Calitate AOI'
            );
          }, 400);
          return { ...ws, status: 'critical' as const, sensors: updatedSensors, healthScore: 74, rejectedCount: ws.rejectedCount + 3 };
        }

        if (faultKey === 'ultrasonic_loss' && ws.id === 'ws-4') {
          // Herrmann ultrasonic frequency resonance lost
          const updatedSensors = ws.sensors.map((s) => {
            if (s.code === 'FRQ-04') return { ...s, value: 18.2, status: 'critical' as const };
            if (s.code === 'TMP-04') return { ...s, value: 74.0, status: 'critical' as const };
            return s;
          });
          const targetSensor = updatedSensors.find(s => s.code === 'FRQ-04')!;
          setTimeout(() => {
            triggerSafetyRoutine(
              ws,
              targetSensor,
              'Pierdere rezonanță generator ultrasonic (18.2 kHz vs 20.0 kHz nominal) și supraîncălzire sonotrodă',
              'Micro-fisură internă în sonotroda de titan sau decuplare traductor piezoelectric la Herrmann HiQ.',
              'Automatizări & Robotică'
            );
          }, 400);
          return { ...ws, status: 'critical' as const, sensors: updatedSensors, healthScore: 70 };
        }

        return ws;
      });
    });
  }, [triggerSafetyRoutine]);

  // Reset to nominal operation
  const resetAllNominal = useCallback(() => {
    setActiveFault(null);
    industrialAudio.playAcknowledge();

    setSafetyRoutine({
      isActive: false,
      stage: 'idle',
      triggeredAt: null,
      triggeredStationId: null,
      triggeredSensorCode: null,
      reason: null,
      quarantinedPartId: null,
      stepsCompleted: [],
      interlockLocked: false,
    });

    setWorkstations(INITIAL_WORKSTATIONS.map(w => ({
      ...w,
      status: 'nominal',
      healthScore: 95 + Math.floor(Math.random() * 5),
      sensors: w.sensors.map(s => ({
        ...s,
        status: 'nominal',
        value: Number(((s.nominalMin + s.nominalMax) / 2).toFixed(1)),
      })),
    })));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'system_info',
        title: 'Linia Repornită în Parametri Nominali',
        message: 'Procedura de deblocare a fost validată cu succes. Toți senzorii raportează valori optime.',
        stationCode: 'WS-ALL',
        targetRole: 'Toți',
        isRead: false,
      },
      ...prev,
    ]);
  }, []);

  // Manual E-stop trigger
  const triggerManualEmergencyStop = useCallback(() => {
    const ws = workstations[1]; // WS-02 by default
    const sensor = ws.sensors[0];
    triggerSafetyRoutine(
      ws,
      sensor,
      'Oprire Manuală de Urgență (E-Stop Acționat de Operator)',
      'Buton E-Stop acționat manual pe pupitrul principal de comandă pentru verificare procedură de siguranță.',
      'Mentenanță Mecanică CNC'
    );
  }, [workstations, triggerSafetyRoutine]);

  // Live simulation tick loop
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = Math.max(800 / simulationSpeed, 200);

    const timer = setInterval(() => {
      // If safety routine is active, production is paused, sensors hold or cool down slightly
      if (safetyRoutine.isActive) {
        setWorkstations((prev) =>
          prev.map((ws) => ({
            ...ws,
            sensors: ws.sensors.map((s) => {
              // gentle cooling if hot
              if (s.type === 'temperature' && s.value > s.nominalMax) {
                const newVal = Math.max(s.value - 0.4, s.nominalMax + 1);
                return {
                  ...s,
                  value: Number(newVal.toFixed(1)),
                  history: [...s.history.slice(1), newVal],
                };
              }
              return s;
            }),
          }))
        );
        return;
      }

      // Normal running telemetry fluctuations
      setWorkstations((prev) =>
        prev.map((ws) => {
          const updatedSensors = ws.sensors.map((sensor) => {
            let delta = 0;
            switch (sensor.type) {
              case 'temperature':
                delta = (Math.random() - 0.5) * 0.4;
                break;
              case 'vibration':
                delta = (Math.random() - 0.5) * 0.08;
                break;
              case 'pressure':
                delta = (Math.random() - 0.5) * 0.06;
                break;
              case 'precision_tolerance':
                delta = (Math.random() - 0.5) * 0.25;
                break;
              case 'power':
                delta = (Math.random() - 0.5) * 1.5;
                break;
              case 'speed':
                delta = (Math.random() - 0.5) * 0.15;
                break;
              default:
                delta = 0;
            }

            let nextVal = sensor.value + delta;

            // clamp around nominal if not faulted
            if (!activeFault) {
              if (nextVal < sensor.nominalMin) nextVal = sensor.nominalMin + 0.1;
              if (nextVal > sensor.nominalMax) nextVal = sensor.nominalMax - 0.1;
            }

            const cleanVal = Number(nextVal.toFixed(1));
            const newHistory = [...sensor.history.slice(1), cleanVal];

            // Evaluate status
            let newStatus: SensorData['status'] = 'nominal';
            if (cleanVal >= sensor.criticalHigh || (sensor.criticalLow && cleanVal <= sensor.criticalLow)) {
              newStatus = 'critical';
            } else if (cleanVal >= sensor.warningHigh || (sensor.warningLow && cleanVal <= sensor.warningLow)) {
              newStatus = 'warning';
            }

            return {
              ...sensor,
              value: cleanVal,
              history: newHistory,
              status: newStatus,
            };
          });

          // Workstation aggregate status
          const hasCrit = updatedSensors.some((s) => s.status === 'critical');
          const hasWarn = updatedSensors.some((s) => s.status === 'warning');

          return {
            ...ws,
            status: hasCrit ? 'critical' : hasWarn ? 'warning' : 'nominal',
            processedCount: ws.processedCount + 1,
            sensors: updatedSensors,
          };
        })
      );

      // Increment OEE produced pieces count
      setOee((prev) => {
        const newProduced = prev.unitsProduced + 1;
        const newGood = prev.unitsGood + (Math.random() > 0.02 ? 1 : 0);
        const newScrap = newProduced - newGood;
        const scrapRate = (newScrap / newProduced) * 100;
        const quality = 100 - scrapRate;
        const overallOEE = (prev.availability * prev.performance * quality) / 10000;

        return {
          ...prev,
          unitsProduced: newProduced,
          unitsGood: newGood,
          unitsScrap: newScrap,
          scrapRate: scrapRate,
          quality: Number(quality.toFixed(1)),
          overallOEE: Number(overallOEE.toFixed(1)),
        };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, simulationSpeed, safetyRoutine.isActive, activeFault]);

  // Notifications management
  const acknowledgeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, acknowledgedBy: 'Tehnician Tură (Confirmare)', isRead: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const updateIncidentStatus = useCallback((
    incidentId: string,
    newStatus: MaintenanceIncident['status'],
    technicianNote?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: newStatus,
              resolvedAt: newStatus === 'REZOLVAT' ? new Date().toTimeString().split(' ')[0] : undefined,
              resolvedBy: newStatus === 'REZOLVAT' ? 'Inginer Mentenanță Intervenție' : undefined,
              technicianNotes: technicianNote || inc.technicianNotes,
            }
          : inc
      )
    );
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      industrialAudio.isMuted = next;
      return next;
    });
  }, []);

  return {
    workstations,
    oee,
    incidents,
    notifications,
    safetyRoutine,
    isPaused,
    setIsPaused,
    simulationSpeed,
    setSimulationSpeed,
    activeFault,
    isMuted,
    toggleMute,
    injectFault,
    resetAllNominal,
    triggerManualEmergencyStop,
    acknowledgeNotification,
    markAllAsRead,
    updateIncidentStatus,
  };
}
