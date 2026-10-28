import React, { useState } from 'react';
import { Workstation, SensorData, SensorType } from '../types/assemblyLine';
import { Search, Filter, Activity, AlertTriangle, CheckCircle, ShieldAlert, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SensorMatrixViewProps {
  workstations: Workstation[];
  onSelectStation: (station: Workstation) => void;
}

export const SensorMatrixView: React.FC<SensorMatrixViewProps> = ({
  workstations,
  onSelectStation,
}) => {
  const [selectedStationFilter, setSelectedStationFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [onlyAnomalies, setOnlyAnomalies] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all sensors flattened
  const allSensors: { sensor: SensorData; workstation: Workstation }[] = [];
  workstations.forEach((ws) => {
    ws.sensors.forEach((sensor) => {
      allSensors.push({ sensor, workstation: ws });
    });
  });

  // Filter
  const filtered = allSensors.filter(({ sensor, workstation }) => {
    if (selectedStationFilter !== 'all' && workstation.id !== selectedStationFilter) {
      return false;
    }
    if (selectedTypeFilter !== 'all' && sensor.type !== selectedTypeFilter) {
      return false;
    }
    if (onlyAnomalies && sensor.status === 'nominal') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sensor.name.toLowerCase().includes(q);
      const matchCode = sensor.code.toLowerCase().includes(q);
      const matchStation = workstation.name.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchStation) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Matrice Telemetrie & Senzori I/O Conectați ({allSensors.length} Senzori)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Protocol industrial Profinet / IO-Link · Eșantionare 1000ms · Toleranțe calibrate
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyAnomalies(!onlyAnomalies)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                onlyAnomalies
                  ? 'bg-rose-950 text-rose-300 border-rose-500 font-semibold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Afișează doar Abateri / Anomalii</span>
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Caută senzor sau cod (ex: TMP-02, presiune)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Station Filter */}
          <div>
            <select
              value={selectedStationFilter}
              onChange={(e) => setSelectedStationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Toate Stațiile (1 - 6)</option>
              {workstations.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  Stația 0{ws.number}: {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sensor Type Filter */}
          <div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Toate Tipurile de Senzori</option>
              <option value="temperature">Temperatură (°C)</option>
              <option value="vibration">Vibrație & Rulmenți (mm/s)</option>
              <option value="pressure">Presiune Fluid/Pneumatic (bar)</option>
              <option value="precision_tolerance">Toleranță Cotă & Microni (µm)</option>
              <option value="power">Putere / Curent / Cuplu (W, A, Nm)</option>
              <option value="speed">Viteză & Timp Ciclu (m/min, s)</option>
              <option value="optical_defect">Inspecție Optică / Defecte (AOI)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sensors Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Cod & Senzor</th>
                <th className="py-3 px-4 font-semibold">Stație Lucru</th>
                <th className="py-3 px-4 font-semibold text-right">Valoare Telemetrică</th>
                <th className="py-3 px-4 font-semibold">Bară Nivel / Toleranță</th>
                <th className="py-3 px-4 font-semibold text-center">Trend (10 eșantioane)</th>
                <th className="py-3 px-4 font-semibold text-right">Stare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Niciun senzor nu corespunde criteriilor de filtrare selectate.
                  </td>
                </tr>
              ) : (
                filtered.map(({ sensor, workstation }) => {
                  const isCrit = sensor.status === 'critical';
                  const isWarn = sensor.status === 'warning';

                  // Sparkline calculation
                  const minHist = Math.min(...sensor.history);
                  const maxHist = Math.max(...sensor.history);
                  const range = maxHist - minHist === 0 ? 1 : maxHist - minHist;
                  const points = sensor.history
                    .map((val, idx) => {
                      const x = (idx / (sensor.history.length - 1 || 1)) * 90;
                      const y = 22 - ((val - minHist) / range) * 18;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  // Gauge percentage
                  const normMax = sensor.criticalHigh || sensor.nominalMax * 1.5;
                  const pct = Math.min(Math.max((sensor.value / normMax) * 100, 5), 100);

                  return (
                    <tr
                      key={sensor.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCrit
                          ? 'bg-rose-950/20'
                          : isWarn
                          ? 'bg-amber-950/15'
                          : ''
                      }`}
                    >
                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{sensor.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {sensor.code} · {sensor.type}
                        </div>
                      </td>

                      {/* Workstation */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectStation(workstation)}
                          className="text-left text-slate-300 hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5"
                        >
                          <span className="font-mono text-amber-500 font-bold">0{workstation.number}</span>
                          <span className="truncate max-w-[150px]">{workstation.name}</span>
                        </button>
                      </td>

                      {/* Real-time value */}
                      <td className="py-3 px-4 text-right font-mono">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isCrit
                              ? 'text-rose-400'
                              : isWarn
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {typeof sensor.value === 'number'
                            ? sensor.value.toFixed(1)
                            : sensor.value}
                        </span>{' '}
                        <span className="text-slate-400 text-xs">{sensor.unit}</span>
                      </td>

                      {/* Tolerance & Gauge */}
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCrit
                                ? 'bg-rose-500'
                                : isWarn
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                          <span>Nom: {sensor.nominalMin}-{sensor.nominalMax}</span>
                          <span>Prag: {sensor.warningHigh}</span>
                        </div>
                      </td>

                      {/* Sparkline mini */}
                      <td className="py-3 px-4 text-center">
                        <div className="w-24 h-6 mx-auto">
                          <svg className="w-full h-full" viewBox="0 0 90 24">
                            <polyline
                              fill="none"
                              stroke={isCrit ? '#f43f5e' : isWarn ? '#f59e0b' : '#10b981'}
                              strokeWidth="1.5"
                              points={points}
                            />
                          </svg>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right">
                        {isCrit ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold font-mono text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/50">
                            CRITIC
                          </span>
                        ) : isWarn ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold font-mono text-[11px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50">
                            AVERTISMENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                            NOMINAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
