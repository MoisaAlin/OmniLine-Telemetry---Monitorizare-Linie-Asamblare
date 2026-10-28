import React from 'react';
import { OEEStats, Workstation } from '../types/assemblyLine';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  PieChart, 
  Clock, 
  Layers, 
  Award,
  Zap,
  Target
} from 'lucide-react';

interface OEEPerformanceViewProps {
  oee: OEEStats;
  workstations: Workstation[];
}

export const OEEPerformanceView: React.FC<OEEPerformanceViewProps> = ({
  oee,
  workstations,
}) => {
  // Pareto reasons
  const scrapPareto = [
    { reason: 'Abatere cotă toleranță înălțime (>15 µm)', count: 14, percent: 45.2, station: 'WS-05 AOI Laser' },
    { reason: 'Micro-porozități îmbinare ultrasonică', count: 9, percent: 29.0, station: 'WS-04 Herrmann' },
    { reason: 'Bavuri & micro-urme manipulare gripper', count: 5, percent: 16.1, station: 'WS-03 KUKA' },
    { reason: 'Contrast redus cod trasabilitate DataMatrix', count: 3, percent: 9.7, station: 'WS-06 Videojet' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Eficiența Globală a Echipamentelor (OEE) & Standarde de Calitate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calcul conform standardului industrial ISO 22400 · Disponibilitate × Performanță × Calitate
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{oee.activeShift}</span>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global OEE Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              OEE Global Linia A-4
            </span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {oee.overallOEE.toFixed(1)}%
            </span>
            <span className="text-xs font-mono text-emerald-400">
              (Țintă: {oee.targetOEE.toFixed(1)}%)
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                style={{ width: `${Math.min(oee.overallOEE, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>Prag minim: 85%</span>
              <span className="text-emerald-400 font-medium">+3.3% peste obiectiv</span>
            </div>
          </div>
        </div>

        {/* Disponibilitate (Availability) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Disponibilitate (A)
            </span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {oee.availability.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">timp util</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${Math.min(oee.availability, 100)}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Timp funcționare: 458 min / 480 min planificate
            </div>
          </div>
        </div>

        {/* Performanță (Performance) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Performanță Ritm (P)
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {oee.performance.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">viteză ciclu</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(oee.performance, 100)}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Takt time: 11.9s efectiv (12.0s normat)
            </div>
          </div>
        </div>

        {/* Calitate (Quality) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rată Calitate Conformă (Q)
            </span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {oee.quality.toFixed(1)}%
            </span>
            <span className="text-xs text-emerald-400">conform standard</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(oee.quality, 100)}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Rebuturi reținute: {oee.unitsScrap} buc ({oee.scrapRate.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Production Volume & Output Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Bilanț Producție Lot Curent #LOT-2026-A4</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Total Piese Introduse</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {oee.unitsProduced}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">stația 1 alimentare</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Piese Bune (Conforme)</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {oee.unitsGood}
            </div>
            <div className="text-[11px] text-emerald-500/80 mt-0.5">livrate la paletizare</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Piese Respinse (Rebut)</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
              {oee.unitsScrap}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-0.5">izolate automat în carantină</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Ritm Producție Curent</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {oee.currentPPM.toFixed(1)} PPM
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">300 unități / oră</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Quality Deviation Analysis (Pareto) & Workstations Cycle Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Defect Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-rose-400" />
                <span>Analiză Pareto Rebuturi & Abateri Calitative</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clasificarea defectelor identificate de senzorii optici și dimensionali
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {oee.unitsScrap} piese</span>
          </div>

          <div className="space-y-3">
            {scrapPareto.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate pr-2">{item.reason}</span>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span className="text-slate-400">{item.count} buc</span>
                    <span className="font-semibold text-amber-400">{item.percent.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500/80 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Sursă identificare: {item.station}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg">
            <span className="font-semibold text-amber-400">Rutină de Protecție Calitate:</span> Când se depășesc 3 rebuturi consecutive la orice stație, sistemul activează automat decelerația și avertizează inspectorul de calitate pentru verificare dimensională.
          </div>
        </div>

        {/* Workstations Performance & Health Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Performanță & Timp de Ciclu pe Stații</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparație timp ciclu real vs timp normat (12.0s)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {workstations.map((ws) => {
              const diff = ws.cycleTimeSec - ws.targetCycleTimeSec;
              const isSlow = diff > 0.1;

              return (
                <div
                  key={ws.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-mono text-[10px] text-amber-400">
                      0{ws.number}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">{ws.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{ws.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Sănătate</span>
                      <span className="text-emerald-400 font-semibold">{ws.healthScore}%</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Timp Ciclu</span>
                      <span className={`font-semibold tabular-nums ${isSlow ? 'text-amber-400' : 'text-slate-200'}`}>
                        {ws.cycleTimeSec.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Gât de gâtuire identificat (Bottleneck):</span>
            <span className="font-mono text-amber-400 font-semibold">WS-02 CNC (12.2s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
