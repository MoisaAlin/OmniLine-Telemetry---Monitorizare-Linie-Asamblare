import React, { useState } from 'react';
import { Workstation, SensorData } from '../types/assemblyLine';
import { Search, Activity, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Matrice Senzori I/O Conectați ({allSensors.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Protocol Profinet / IO-Link · Eșantionare 1000ms
            </p>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setOnlyAnomalies(!onlyAnomalies)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                onlyAnomalies
                  ? 'bg-rose-950 text-rose-300 border-rose-500 font-semibold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Doar Abateri</span>
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Caută senzor sau cod..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Station Filter */}
          <div>
            <select
              value={selectedStationFilter}
              onChange={(e) => setSelectedStationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Toate Tipurile</option>
              <option value="temperature">Temperatură (°C)</option>
              <option value="vibration">Vibrație (mm/s)</option>
              <option value="pressure">Presiune (bar)</option>
              <option value="precision_tolerance">Toleranță (µm)</option>
              <option value="power">Putere / Cuplu</option>
              <option value="speed">Viteză (m/min, s)</option>
              <option value="optical_defect">Inspecție Optică (AOI)</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Compact Cards (Zero Horizontal Overflow) */}
      <div className="block md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
            Niciun senzor nu corespunde filtrelor selectate.
          </div>
        ) : (
          filtered.map(({ sensor, workstation }) => {
            const isCrit = sensor.status === 'critical';
            const isWarn = sensor.status === 'warning';
            const normMax = sensor.criticalHigh || sensor.nominalMax * 1.5;
            const pct = Math.min(Math.max((sensor.value / normMax) * 100, 5), 100);

            return (
              <div
                key={sensor.id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  isCrit
                    ? 'bg-rose-950/25 border-rose-500/80'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/60'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="font-semibold text-white leading-tight">{sensor.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {sensor.code} · Stația 0{workstation.number}
                    </div>
                  </div>
                  <div>
                    {isCrit ? (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">
                        CRITIC
                      </span>
                    ) : isWarn ? (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        AVERTISMENT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        NOMINAL
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <span className="text-[11px] text-slate-400">Valoare Telemetrică:</span>
                  <div className="font-mono text-sm font-bold">
                    <span className={isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>
                      {typeof sensor.value === 'number' ? sensor.value.toFixed(1) : sensor.value}
                    </span>{' '}
                    <span className="text-slate-400 text-xs font-normal">{sensor.unit}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full ${
                      isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                  <span>Nom: {sensor.nominalMin}-{sensor.nominalMax} {sensor.unit}</span>
                  <span>Prag Critic: {sensor.criticalHigh}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP / TABLET VIEW: Contained Table */}
      <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Cod & Senzor</th>
                <th className="py-2.5 px-3 font-semibold">Stație Lucru</th>
                <th className="py-2.5 px-3 font-semibold text-right">Valoare</th>
                <th className="py-2.5 px-3 font-semibold">Nivel / Plajă</th>
                <th className="py-2.5 px-3 font-semibold text-center">Trend</th>
                <th className="py-2.5 px-3 font-semibold text-right">Stare</th>
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
                      const x = (idx / (sensor.history.length - 1 || 1)) * 80;
                      const y = 20 - ((val - minHist) / range) * 16;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  const normMax = sensor.criticalHigh || sensor.nominalMax * 1.5;
                  const pct = Math.min(Math.max((sensor.value / normMax) * 100, 5), 100);

                  return (
                    <tr
                      key={sensor.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCrit ? 'bg-rose-950/20' : isWarn ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white">{sensor.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {sensor.code} · {sensor.type}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => onSelectStation(workstation)}
                          className="text-left text-slate-300 hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5"
                        >
                          <span className="font-mono text-amber-500 font-bold">0{workstation.number}</span>
                          <span className="truncate max-w-[130px]">{workstation.name}</span>
                        </button>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isCrit
                              ? 'text-rose-400'
                              : isWarn
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {typeof sensor.value === 'number' ? sensor.value.toFixed(1) : sensor.value}
                        </span>{' '}
                        <span className="text-slate-400 text-xs">{sensor.unit}</span>
                      </td>

                      <td className="py-2.5 px-3 min-w-[140px]">
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                          <span>Nom: {sensor.nominalMin}-{sensor.nominalMax}</span>
                          <span>Prag: {sensor.warningHigh}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="w-20 h-5 mx-auto">
                          <svg className="w-full h-full" viewBox="0 0 80 20">
                            <polyline
                              fill="none"
                              stroke={isCrit ? '#f43f5e' : isWarn ? '#f59e0b' : '#10b981'}
                              strokeWidth="1.5"
                              points={points}
                            />
                          </svg>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {isCrit ? (
                          <span className="inline-flex items-center text-rose-400 font-semibold font-mono text-[10px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/50">
                            CRITIC
                          </span>
                        ) : isWarn ? (
                          <span className="inline-flex items-center text-amber-400 font-semibold font-mono text-[10px] bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/50">
                            AVERTISMENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-emerald-400 font-mono text-[10px] bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
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
