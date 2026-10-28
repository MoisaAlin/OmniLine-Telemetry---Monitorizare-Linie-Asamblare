import React, { useState } from 'react';
import { 
  Workstation, 
  SafetyRoutineState, 
  SensorData 
} from '../types/assemblyLine';
import { 
  Cpu, 
  Activity, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  ChevronRight,
  TrendingUp,
  Sliders,
  Settings2,
  Zap,
  Info
} from 'lucide-react';

interface AssemblyLineTwinProps {
  workstations: Workstation[];
  safetyRoutine: SafetyRoutineState;
  onSelectStation: (station: Workstation) => void;
  selectedStationId: string | null;
}

export const AssemblyLineTwin: React.FC<AssemblyLineTwinProps> = ({
  workstations,
  safetyRoutine,
  onSelectStation,
  selectedStationId,
}) => {
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);

  // Status color helper
  const getStatusBadge = (status: Workstation['status']) => {
    switch (status) {
      case 'nominal':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Nominal
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Avertizare
          </span>
        );
      case 'critical':
      case 'safe_stop':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Rutină Siguranță
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">Inactiv</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Plant Overview Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <img
            src="/src/assets/images/assembly_line_factory_1793214287819.jpg"
            alt="Linie automată de asamblare industrială"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">
                  Gemini-Precision Manufacturing
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-slate-400 text-xs font-mono">Linia A-4 Precision Assembly</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Digital Twin & Telemetrie Senzori în Timp Real
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                Arhitectură SCADA cu 6 stații mecatronice automatizate, monitorizare continuă a vibrațiilor, presiunii și abaterilor dimensionale.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 shrink-0 backdrop-blur-md">
              <div className="pr-3 border-r border-slate-800">
                <div className="text-[11px] text-slate-400">Stare Conexiune I/O</div>
                <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profinet 100 Mbps OK</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Stații Active</div>
                <div className="text-xs font-mono font-semibold text-white mt-0.5">
                  {workstations.filter(w => w.status === 'nominal').length} / {workstations.length} Nominale
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Conveyor Belt Track */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${safetyRoutine.isActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
              Flux Bandă Transportoare Sincronizată (Indexor Pas-cu-Pas)
            </span>
            <span className="text-xs font-mono text-slate-400">
              Viteză Transportor: {safetyRoutine.isActive ? '0.0 m/min (Oprit)' : '14.2 m/min'}
            </span>
          </div>

          <div className="relative h-6 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center">
            {/* Moving teeth/track pattern */}
            <div 
              className={`absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#334155,#334155_10px,#1e293b_10px,#1e293b_20px)] ${
                safetyRoutine.isActive ? '' : 'animate-[moveConveyor_3s_linear_infinite]'
              }`}
            ></div>

            {/* Station Markers along the conveyor */}
            <div className="relative z-10 w-full flex items-center justify-between px-3 md:px-8">
              {workstations.map((ws) => (
                <div key={ws.id} className="flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      ws.status === 'safe_stop' || ws.status === 'critical'
                        ? 'bg-rose-500 border-white ring-2 ring-rose-500/50'
                        : ws.status === 'warning'
                        ? 'bg-amber-500 border-slate-900'
                        : 'bg-emerald-500 border-slate-900'
                    }`}
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 hidden sm:block">
                    WS-0{ws.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Workstations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Stații de Lucru & Echipamente Linia A-4
            </h3>
            <p className="text-xs text-slate-400">
              Selectează orice stație pentru a inspecta telemetria detaliată a senzorilor și limitele de toleranță.
            </p>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline-block font-mono">
            Actualizare senzor: 1000ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workstations.map((station) => {
            const isSelected = selectedStationId === station.id;
            const hasCritical = station.status === 'critical' || station.status === 'safe_stop';
            const hasWarning = station.status === 'warning';

            return (
              <div
                key={station.id}
                onClick={() => onSelectStation(station)}
                onMouseEnter={() => setHoveredStationId(station.id)}
                onMouseLeave={() => setHoveredStationId(null)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 bg-slate-900/90 relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-950/20'
                    : hasCritical
                    ? 'border-rose-500/80 bg-rose-950/20 shadow-md shadow-rose-950/30'
                    : hasWarning
                    ? 'border-amber-500/60 bg-amber-950/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Station header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                      0{station.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">
                        {station.name}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {station.vendorModel}
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(station.status)}</div>
                </div>

                {/* Key Sensors quick stats */}
                <div className="space-y-2 my-3 pt-2 border-t border-slate-800/80">
                  {station.sensors.map((sensor) => {
                    const isSensorCrit = sensor.status === 'critical';
                    const isSensorWarn = sensor.status === 'warning';

                    return (
                      <div
                        key={sensor.id}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/50"
                      >
                        <div className="flex items-center gap-1.5 truncate pr-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSensorCrit
                                ? 'bg-rose-500'
                                : isSensorWarn
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span className="text-slate-300 truncate" title={sensor.name}>
                            {sensor.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 font-mono shrink-0">
                          <span
                            className={`font-semibold tabular-nums ${
                              isSensorCrit
                                ? 'text-rose-400'
                                : isSensorWarn
                                ? 'text-amber-400'
                                : 'text-slate-100'
                            }`}
                          >
                            {typeof sensor.value === 'number'
                              ? sensor.value.toFixed(1)
                              : sensor.value}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {sensor.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Workstation Footer Stats */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div>
                    <span>Timp Ciclu: </span>
                    <span className="text-slate-200 font-semibold tabular-nums">
                      {station.cycleTimeSec.toFixed(1)}s
                    </span>
                  </div>
                  <div>
                    <span>Rebuturi: </span>
                    <span className={station.rejectedCount > 5 ? 'text-rose-400 font-bold tabular-nums' : 'text-slate-200 tabular-nums'}>
                      {station.rejectedCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-sans font-medium text-xs">
                    <span>Inspectează</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
