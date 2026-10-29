import React from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, FileText, ArrowRight, Wrench } from 'lucide-react';
import { SafetyRoutineState } from '../types/assemblyLine';

interface SafetyRoutineBannerProps {
  routine: SafetyRoutineState;
  onOpenSafetyModal: () => void;
  onOpenIncidentReport: () => void;
}

export const SafetyRoutineBanner: React.FC<SafetyRoutineBannerProps> = ({
  routine,
  onOpenSafetyModal,
  onOpenIncidentReport,
}) => {
  if (!routine.isActive) return null;

  return (
    <div className="bg-rose-950/80 border-b border-rose-500/40 text-rose-100 p-4 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 via-amber-900/20 to-rose-900/30 animate-pulse pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-600 rounded-lg text-white shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white uppercase bg-rose-800/80 px-2 py-0.5 rounded text-xs">
                Rutină de Siguranță Activă
              </span>
              <span className="text-xs font-mono text-rose-300">
                Stop Controlat Linia A-4 · {routine.triggeredAt || 'Acum'}
              </span>
            </div>
            <p className="text-sm font-medium text-rose-100 mt-1">
              {routine.reason || 'Sistem oprit automat pentru prevenirea producerii de piese defecte.'}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-rose-200/90 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Decelerație indexor finalizată
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Scule & brațe retrase în poziție sigură
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Piesă #{routine.quarantinedPartId || '1841'} izolată în carantină
              </span>
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" /> Interlock LOTO cuplat
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end mt-2 lg:mt-0">
          <button
            onClick={onOpenIncidentReport}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-900 text-rose-200 hover:text-white border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors flex-1 sm:flex-initial justify-center"
          >
            <FileText className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Fișă Incident</span>
          </button>

          <button
            onClick={onOpenSafetyModal}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-rose-950/60 transition-all flex-1 sm:flex-initial justify-center"
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Deblocare & Repornire</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden xs:inline" />
          </button>
        </div>
      </div>
    </div>
  );
};
