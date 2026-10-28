import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  ShieldAlert, 
  Activity, 
  Award, 
  Wrench, 
  CheckCircle2, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'intro' | 'guide' | 'arch' | 'quality' | 'safety'>('intro');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header - Fixed */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="doc-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                Documentație Sistem & Ghid de Utilizare
              </h3>
              <p className="text-[11px] text-slate-400">
                Fișierele complete sunt salvate în directorul <code className="text-amber-400 font-mono">/docs/</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Închide fereastra (ESC)"
            aria-label="Închide documentația"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveDocTab('intro')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeDocTab === 'intro'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Prezentare Aplicație
          </button>
          <button
            onClick={() => setActiveDocTab('guide')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeDocTab === 'guide'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Ghid de Utilizare
          </button>
          <button
            onClick={() => setActiveDocTab('arch')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeDocTab === 'arch'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Arhitectură Tehnică
          </button>
          <button
            onClick={() => setActiveDocTab('quality')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeDocTab === 'quality'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Standarde Calitate & OEE
          </button>
          <button
            onClick={() => setActiveDocTab('safety')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeDocTab === 'safety'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5. Rutină Siguranță & LOTO
          </button>
        </div>

        {/* Scrollable Doc Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs text-slate-300 leading-relaxed">
          {activeDocTab === 'intro' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Ce este OmniLine Telemetry?</span>
                </h4>
                <p>
                  <strong>OmniLine Telemetry</strong> este o aplicație industrială de tip SCADA / MOM dezvoltată pentru monitorizarea în timp real a unei linii de asamblare de mare precizie (Linia A-4 Precision). Aplicația supraveghează permanent eficiența producției (OEE), sănătatea utilajelor și deviațiile de la toleranțele admise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-white block mb-1">Cele 6 Stații Automatizate:</span>
                  <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                    <li>• WS-01: Alimentare & Sortare (Bosch Rexroth)</li>
                    <li>• WS-02: Prelucrare CNC (Chiron FZ-12)</li>
                    <li>• WS-03: Asamblare Robotică (KUKA KR + Festo)</li>
                    <li>• WS-04: Sudură Ultrasunete (Herrmann 20kHz)</li>
                    <li>• WS-05: Inspecție Optică AOI & Laser 3D (Keyence)</li>
                    <li>• WS-06: Marcare Laser & Paletizare (Videojet)</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-white block mb-1">Pilonii Sistemului:</span>
                  <ul className="space-y-1 text-slate-300">
                    <li>✓ <strong>18 Senzori I/O</strong> conectați prin Profinet / IO-Link</li>
                    <li>✓ <strong>Rutină Automată de Siguranță</strong> la depășirea limitelor critice</li>
                    <li>✓ <strong>Generare Automată Fișe Incident</strong> & Diagnoză</li>
                    <li>✓ <strong>Calcul OEE ISO 22400</strong> și analiză Pareto rebuturi</li>
                    <li>✓ <strong>Dispecerat Tehnic Mobil</strong> cu alerte audio dedicate</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2">Ghid de Utilizare Pas-cu-Pas</h4>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 text-xs mb-1">1. Supravegherea Geamănului Digital:</div>
                  <p className="text-slate-300">
                    În tab-ul principal <em>„Monitorizare Linie & Senzori”</em>, urmăriți banda transportoare animată și starea fiecărei stații mecatronice. Clic pe orice stație deschide diagnoza individuală cu grafice sparkline pe ultimele eșantioane.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 text-xs mb-1">2. Simulare & Injectare Anomalii:</div>
                  <p className="text-slate-300">
                    Bara de sus vă permite să testați scenarii reale: apăsați <strong>F1 (Supraîncălzire CNC)</strong>, <strong>F2 (Cădere presiune Festo)</strong>, <strong>F3 (Abatere laser AOI)</strong> sau <strong>F4 (Pierdere rezonanță sudură)</strong>. Observați cum senzorul trece în stare critică și declanșează automat rutina de siguranță!
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 text-xs mb-1">3. Deblocarea Liniei după o Oprire de Securitate:</div>
                  <p className="text-slate-300">
                    Când sistemul intră în <em>Rutină de Siguranță</em>, apăsați pe butonul <strong>„Protocol Repornire & Deblocare”</strong>, bifați verificările de conformitate fizică și de senzor, apoi apăsați <strong>„Deblochează & Repornește”</strong> pentru a iniția rampa de pornire asistată (Ramp-up).
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400 text-xs mb-1">4. Tipărirea Fișelor de Incident:</div>
                  <p className="text-slate-300">
                    În tab-ul <em>„Rapoarte Incident & Diagnoză”</em>, deschideți orice raport și apăsați butonul de imprimare sau descărcare fișă TXT pentru arhivare sau predare schimb.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'arch' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Arhitectură Tehnică & Integrare Senzori</span>
              </h4>
              <p>
                Aplicația rulează pe un frontend determinist React 19 cu TypeScript. Bucla de simulare telemetrică (`useAssemblyLineSimulation`) gestionează starea celor 18 senzori, calculează deviațiile relative la toleranțele normate și generează automat obiecte de tip `MaintenanceIncident` și `TechnicalNotification`.
              </p>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                Fișier detaliat disponibil în: <span className="text-amber-400">/docs/ARHITECTURA_TEHNICA.md</span>
              </div>
            </div>
          )}

          {activeDocTab === 'quality' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Calcul OEE & Standarde de Calitate (ISO 22400)</span>
              </h4>
              <p>
                Formula OEE implementată este <strong className="text-white">OEE = Disponibilitate × Performanță × Calitate</strong>. Sistemul calculează în timp real Takt Time-ul efectiv (11.9s vs 12.0s normat) și clasifică defectele printr-o diagramă Pareto în timp real.
              </p>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                Fișier detaliat disponibil în: <span className="text-amber-400">/docs/STANDARDE_CALITATE_SI_OEE.md</span>
              </div>
            </div>
          )}

          {activeDocTab === 'safety' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Rutină de Siguranță & Protocol LOTO (EN ISO 13849-1)</span>
              </h4>
              <p>
                Oprirea controlată se realizează în 1.2 secunde, mandrina și brațele robotice sunt retrase la poziția Home Safe, iar piesa din stația afectată este evacuată în jgheabul de carantină. Repornirea este condiționată de parcurgerea procedurii standard SOP-IND-402.
              </p>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                Fișier detaliat disponibil în: <span className="text-amber-400">/docs/MANUAL_MENTENANTA_SI_RUTINA_SIGURANTA.md</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Documentație tehnică conform standardelor industriale IEC & ISO
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
