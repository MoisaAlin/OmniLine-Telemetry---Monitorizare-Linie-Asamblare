import React, { useEffect } from 'react';
import { Workstation } from '../types/assemblyLine';
import { X, Activity } from 'lucide-react';

interface StationDetailModalProps {
  station: Workstation | null;
  onClose: () => void;
  onInjectStationFault?: (stationId: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!station) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-modal-title"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header - Fixed & Compact */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
              0{station.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="station-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                  {station.name}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {station.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {station.type} · {station.vendorModel} · Apasă ESC sau clic în exterior pentru a ieși
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors shrink-0"
            title="Închide fereastra"
            aria-label="Închide fereastra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable with min-h-0 and flex-1 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Operator</span>
              <span className="font-semibold text-slate-200">{station.operatorAssigned}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Timp Ciclu</span>
              <span className="font-semibold text-slate-200 font-mono tabular-nums">
                {station.cycleTimeSec.toFixed(1)}s (Țintă: {station.targetCycleTimeSec.toFixed(1)}s)
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Prelucrate</span>
              <span className="font-semibold text-slate-200 font-mono tabular-nums">
                {station.processedCount} (Rebut: {station.rejectedCount})
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Ultima Revizie</span>
              <span className="font-semibold text-slate-200 font-mono">{station.lastMaintenanceDate}</span>
            </div>
          </div>

          {/* Sensors In-depth */}
          <div>
            <h4 className="font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-[11px]">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Telemetrie Senzori I/O & Limite de Calibrare</span>
            </h4>

            <div className="space-y-2.5">
              {station.sensors.map((sensor) => {
                const isCrit = sensor.status === 'critical';
                const isWarn = sensor.status === 'warning';

                // Sparkline generator
                const minHist = Math.min(...sensor.history);
                const maxHist = Math.max(...sensor.history);
                const range = maxHist - minHist === 0 ? 1 : maxHist - minHist;
                const points = sensor.history
                  .map((val, idx) => {
                    const x = (idx / (sensor.history.length - 1 || 1)) * 120;
                    const y = 24 - ((val - minHist) / range) * 20;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <div
                    key={sensor.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCrit
                        ? 'bg-rose-950/30 border-rose-500/80'
                        : isWarn
                        ? 'bg-amber-950/20 border-amber-500/60'
                        : 'bg-slate-950/70 border-slate-800/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{sensor.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                            {sensor.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{sensor.description}</p>
                      </div>

                      {/* Value & Sparkline */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 h-6">
                          <svg className="w-full h-full" viewBox="0 0 120 26">
                            <polyline
                              fill="none"
                              stroke={isCrit ? '#f43f5e' : isWarn ? '#f59e0b' : '#10b981'}
                              strokeWidth="1.5"
                              points={points}
                            />
                          </svg>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-base font-bold font-mono tabular-nums ${
                              isCrit
                                ? 'text-rose-400'
                                : isWarn
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {typeof sensor.value === 'number'
                              ? sensor.value.toFixed(1)
                              : sensor.value}{' '}
                            <span className="text-[11px] text-slate-400 font-sans font-normal">
                              {sensor.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tolerance bounds meter */}
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                      <div>
                        <span>Nominal: </span>
                        <span className="text-slate-200">
                          {sensor.nominalMin} - {sensor.nominalMax} {sensor.unit}
                        </span>
                      </div>
                      <div>
                        <span>Avertizare: </span>
                        <span className="text-amber-400 font-semibold">
                          &gt; {sensor.warningHigh} {sensor.unit}
                        </span>
                      </div>
                      <div>
                        <span>Critic Stop: </span>
                        <span className="text-rose-400 font-bold">
                          &gt; {sensor.criticalHigh} {sensor.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Senzori conectați via Profinet / IO-Link
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Închide Fereastra
          </button>
        </div>
      </div>
    </div>
  );
};
