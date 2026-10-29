import React from 'react';
import { Play, Pause, Flame, Gauge, Crosshair, Waves, RefreshCw } from 'lucide-react';

interface FaultInjectionBarProps {
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onInjectFault: (faultKey: 'cnc_bearing' | 'pneumatic_leak' | 'laser_tolerance' | 'ultrasonic_loss' | 'motor_overcurrent') => void;
  onResetAllNominal: () => void;
  activeFault: string | null;
}

export const FaultInjectionBar: React.FC<FaultInjectionBarProps> = ({
  simulationSpeed,
  onSetSimulationSpeed,
  isPaused,
  onTogglePause,
  onInjectFault,
  onResetAllNominal,
  activeFault,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm mb-4 sm:mb-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Simulation controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-800 shrink-0">
            <button
              onClick={onTogglePause}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title={isPaused ? 'Reia fluxul telemetric' : 'Întrerupe temporar telemetria'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Pauză' : 'Live'}</span>
            </button>

            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSetSimulationSpeed(speed)}
                  className={`px-2 py-1 rounded transition-colors ${
                    simulationSpeed === speed
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Simulare Anomalii:
          </span>
        </div>

        {/* Right: Quick Injection Scenarios (wrapping flex) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onInjectFault('cnc_bearing')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all ${
              activeFault === 'cnc_bearing'
                ? 'bg-rose-950 text-rose-300 border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Simulează supraîncălzire și vibrație la axul principal CNC WS-02"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="hidden sm:inline">F1: Supraîncălzire CNC (WS-02)</span>
            <span className="sm:hidden">F1: CNC</span>
          </button>

          <button
            onClick={() => onInjectFault('pneumatic_leak')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all ${
              activeFault === 'pneumatic_leak'
                ? 'bg-rose-950 text-rose-300 border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Simulează scădere critică de presiune pneumatică gripper la brațul KUKA WS-03"
          >
            <Gauge className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">F2: Presiune Braț (WS-03)</span>
            <span className="sm:hidden">F2: Festo</span>
          </button>

          <button
            onClick={() => onInjectFault('laser_tolerance')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all ${
              activeFault === 'laser_tolerance'
                ? 'bg-rose-950 text-rose-300 border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Simulează abatere critică de cotă la scanarea optică 3D WS-05"
          >
            <Crosshair className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="hidden sm:inline">F3: Cotă Laser (WS-05)</span>
            <span className="sm:hidden">F3: Laser</span>
          </button>

          <button
            onClick={() => onInjectFault('ultrasonic_loss')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-all ${
              activeFault === 'ultrasonic_loss'
                ? 'bg-rose-950 text-rose-300 border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Simulează pierdere rezonanță generator ultrasonic WS-04"
          >
            <Waves className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="hidden sm:inline">F4: Sudură (WS-04)</span>
            <span className="sm:hidden">F4: Sudură</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetAllNominal}
            className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            title="Resetează toți senzorii la valorile nominale optime"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nominal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
