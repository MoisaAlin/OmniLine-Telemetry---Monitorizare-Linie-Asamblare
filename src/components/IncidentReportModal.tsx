import React, { useState, useEffect } from 'react';
import { MaintenanceIncident } from '../types/assemblyLine';
import { 
  X, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Download, 
  UserCheck, 
  ClipboardList
} from 'lucide-react';

interface IncidentReportModalProps {
  incident: MaintenanceIncident | null;
  onClose: () => void;
  onUpdateStatus?: (incidentId: string, newStatus: MaintenanceIncident['status'], technicianNote?: string) => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  incident,
  onClose,
  onUpdateStatus,
}) => {
  const [techNote, setTechNote] = useState<string>('');

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

  if (!incident) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    const content = `RAPORT TEHNIC INCIDENT INDUSTRIAL - LINIA DE ASAMBLARE A-4
Cod Incident: ${incident.code}
Data & Ora: ${incident.timestamp}
Severitate: ${incident.severity}
Status: ${incident.status}
Stație Afectată: ${incident.stationName}
Titlu Incident: ${incident.title}

CAUZĂ RĂDĂCINĂ IDENTIFICATĂ:
${incident.rootCauseHypothesis}

IMPACT ASUPRA LOTULUI:
${incident.impactOnBatch}
Piese Reținute în Carantină: ${incident.quarantinedUnits} buc

TELEMETRIE LA DECLANȘAREA ALERTEI:
${incident.telemetrySnapshot.map(s => `- ${s.sensorName}: ${s.recordedValue} (Plajă standard: ${s.nominalRange}) -> Abatere: ${s.deviation}`).join('\n')}

ECHIPĂ ASIGNATĂ:
${incident.assignedTeam}

PROCEDURI STANDARD DE MENTENANȚĂ (SOP):
${incident.sopChecklist.map((c, i) => `${i+1}. [${c.completed ? 'X' : ' '}] ${c.step}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Raport_${incident.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incident-modal-title"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-full print:bg-white print:text-black"
      >
        {/* Top Header - Fixed */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-950 border border-rose-500/40 text-rose-400 rounded-lg shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{incident.code}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-600 text-white font-semibold font-mono">
                  {incident.severity}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {incident.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fișă de Diagnoză Generată Automat · Apasă ESC sau clic în exterior pentru a ieși
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tipărește fișa de incident"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportText}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Descarcă raportul (TXT)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors ml-1"
              title="Închide fereastra"
              aria-label="Închide fereastra"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content with min-h-0 and flex-1 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 print:p-4 print:text-black text-xs">
          {/* Header Title info */}
          <div className="border-b border-slate-800 pb-3 print:border-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-semibold text-amber-500 uppercase tracking-wider text-[11px] print:text-black">
                  Fișă Tehnică de Diagnoză & Mentenanță
                </span>
                <h2 id="incident-modal-title" className="text-base sm:text-lg font-bold text-white print:text-black mt-0.5">
                  {incident.title}
                </h2>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400 print:text-black">
                <div>Înregistrat: {incident.timestamp}</div>
                <div>Echipă: {incident.assignedTeam}</div>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-slate-300 print:text-black">
              <span className="font-semibold">Stație Lucru:</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded font-mono print:border print:border-black">
                {incident.stationName}
              </span>
              <span>·</span>
              <span className="font-semibold">Piese Carantinate:</span>
              <span className="text-amber-400 font-mono font-bold print:text-black">
                {incident.quarantinedUnits} bucăți
              </span>
            </div>
          </div>

          {/* Root Cause Hypothesis */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 print:border-black print:bg-gray-50">
            <h4 className="font-mono font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-[11px] print:text-black">
              <AlertOctagon className="w-4 h-4" />
              <span>Cauză Rădăcină Identificată pe Baza Senzorilor</span>
            </h4>
            <p className="text-slate-200 print:text-black font-medium leading-relaxed">
              {incident.rootCauseHypothesis}
            </p>
            <p className="text-slate-400 print:text-gray-600 mt-1.5 text-[11px]">
              <span className="font-semibold">Impact:</span> {incident.impactOnBatch}
            </p>
          </div>

          {/* Telemetry Snapshot Table */}
          <div>
            <h4 className="font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 text-[11px] print:text-black">
              Snapshot Telemetrie la Declanșarea Rutinei de Siguranță
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] print:bg-gray-100 print:text-black print:border-black">
                  <tr>
                    <th className="py-2 px-3">Senzor I/O</th>
                    <th className="py-2 px-3">Valoare Înregistrată</th>
                    <th className="py-2 px-3">Plajă Nominală</th>
                    <th className="py-2 px-3 text-right">Abatere</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-black">
                  {incident.telemetrySnapshot.map((snap, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40">
                      <td className="py-2 px-3 font-semibold text-white print:text-black">
                        {snap.sensorName}
                      </td>
                      <td className="py-2 px-3 font-mono text-rose-400 font-bold print:text-black">
                        {snap.recordedValue}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-300 print:text-black">
                        {snap.nominalRange}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-right text-amber-400 print:text-black">
                        {snap.deviation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Standard Operating Procedure (SOP) Checklist */}
          <div>
            <h4 className="font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px] print:text-black">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>Procedură Standard de Remediere (SOP-IND-402)</span>
            </h4>
            <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 print:border-black print:bg-white">
              {incident.sopChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-slate-300 print:text-black">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center font-mono text-[10px] shrink-0 ${
                    item.completed ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {item.completed ? '✓' : idx + 1}
                  </span>
                  <span className={item.completed ? 'line-through text-slate-500 print:text-gray-500' : ''}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution / Technician sign-off */}
          {incident.resolvedAt ? (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Incident Soluționat & Verificat</span>
              </div>
              <p className="text-[11px]">Rezolvat la: <span className="font-mono">{incident.resolvedAt}</span> de către: <span className="font-semibold">{incident.resolvedBy || 'Inginer Mentenanță'}</span></p>
              {incident.technicianNotes && (
                <p className="mt-1.5 text-slate-300 bg-slate-950/60 p-2 rounded border border-emerald-900/40 font-mono text-[11px]">
                  Note tehnician: {incident.technicianNotes}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 print:hidden">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300 text-[11px]">
                  Semnare Raport & Încheiere Intervenție
                </span>
                <span className="text-amber-400 font-mono text-[11px]">În Lucru</span>
              </div>
              <input
                type="text"
                placeholder="Note tehnice remediere (ex: Garnitură schimbată, test presiune 6.4 bar OK)..."
                value={techNote}
                onChange={(e) => setTechNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (onUpdateStatus) {
                      onUpdateStatus(incident.id, 'REZOLVAT', techNote || 'Remediat conform procedurii standard. Parametri în limite optime.');
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Semnează & Marchează Rezolvat</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Fixed */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-[11px] text-slate-400 font-mono">
            ID: {incident.id} · Mentenanță Predictivă
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
