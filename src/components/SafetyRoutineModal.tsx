import React, { useState, useEffect } from 'react';
import { SafetyRoutineState, Workstation } from '../types/assemblyLine';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  Unlock, 
  RotateCcw, 
  X, 
  Wrench, 
  FileText
} from 'lucide-react';

interface SafetyRoutineModalProps {
  routine: SafetyRoutineState;
  workstations: Workstation[];
  onClose: () => void;
  onResetRoutine: () => void;
  onOpenIncidentReport: () => void;
}

export const SafetyRoutineModal: React.FC<SafetyRoutineModalProps> = ({
  routine,
  workstations,
  onClose,
  onResetRoutine,
  onOpenIncidentReport,
}) => {
  const [confirmedPhysicalCheck, setConfirmedPhysicalCheck] = useState<boolean>(false);
  const [confirmedSensorNominal, setConfirmedSensorNominal] = useState<boolean>(false);
  const [isRampingUp, setIsRampingUp] = useState<boolean>(false);

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

  const triggeredStation = workstations.find(w => w.id === routine.triggeredStationId);

  const handleExecuteRestart = () => {
    setIsRampingUp(true);
    setTimeout(() => {
      setIsRampingUp(false);
      onResetRoutine();
      onClose();
    }, 1200);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header - Fixed & Compact */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-rose-500/40 bg-rose-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-600 rounded-lg text-white shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="safety-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                Protocol de Rutină de Siguranță & Repornire
              </h3>
              <p className="text-[11px] text-rose-300">
                Oprire automată EN ISO 13849-1 · Apasă ESC sau clic în exterior pentru a ieși
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-rose-900/40 hover:bg-rose-900 border border-rose-500/30 transition-colors shrink-0"
            title="Închide fereastra (sau tasta ESC)"
            aria-label="Închide fereastra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable with min-h-0 flex-1 */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs">
          {/* Anomaly summary box */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-rose-400 uppercase text-[11px]">
                Anomalie Detectată în Timp Real
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {routine.triggeredAt || 'Acum'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {routine.reason || 'Oprire de siguranță activată pentru prevenirea producerii de piese defecte.'}
            </p>
            {triggeredStation && (
              <div className="text-slate-400 pt-0.5">
                Echipament afectat: <strong className="text-slate-200">{triggeredStation.name}</strong> ({triggeredStation.vendorModel})
              </div>
            )}
          </div>

          {/* Sequential Routine Execution Log */}
          <div>
            <h4 className="font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 text-[11px]">
              Etape Rutină de Siguranță Finalizate Automat
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">1. Decelerație Controlată:</span>
                  <span className="text-slate-400 ml-1">Viteză bandă redusă la 0.0 m/min în 1.2s.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">2. Retragere Scule:</span>
                  <span className="text-slate-400 ml-1">Brațele robotice și axul CNC retrase la poziția Home Safe.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">3. Carantinare Reper:</span>
                  <span className="text-slate-400 ml-1">Piesa #{routine.quarantinedPartId || '1841'} izolată. Zero rebuturi livrate.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">4. Interlock LOTO Blocat:</span>
                  <span className="text-slate-400 ml-1">Repornirea accidentală este blocată până la validarea tehnică.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Verification Checkboxes */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <h4 className="font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Wrench className="w-4 h-4" />
              <span>Validare Obligatorie Tehnician Înainte de Deblocare</span>
            </h4>

            <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={confirmedPhysicalCheck}
                onChange={(e) => setConfirmedPhysicalCheck(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              <span>
                Confirm inspecția vizuală a subsistemului. Zona de lucru este sigură și eliberată de obstacole.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={confirmedSensorNominal}
                onChange={(e) => setConfirmedSensorNominal(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              <span>
                Confirm verificarea senzorilor I/O și revenirea parametrilor de funcționare în limitele nominale.
              </span>
            </label>
          </div>
        </div>

        {/* Footer - Fixed & Compact */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <button
            onClick={onOpenIncidentReport}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Vezi Raportul Tehnic</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Închide Fereastra
            </button>

            <button
              disabled={!confirmedPhysicalCheck || !confirmedSensorNominal || isRampingUp}
              onClick={handleExecuteRestart}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                confirmedPhysicalCheck && confirmedSensorNominal && !isRampingUp
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isRampingUp ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Ramp-Up în Curs...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Deblochează & Repornește</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
