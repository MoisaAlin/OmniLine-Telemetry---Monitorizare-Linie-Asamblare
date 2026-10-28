import React, { useState } from 'react';
import { MaintenanceIncident } from '../types/assemblyLine';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  Wrench, 
  Download,
  Filter
} from 'lucide-react';

interface IncidentsViewProps {
  incidents: MaintenanceIncident[];
  onOpenIncident: (incident: MaintenanceIncident) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onOpenIncident,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = incidents.filter((inc) => {
    if (filterStatus === 'open' && inc.status === 'REZOLVAT') return false;
    if (filterStatus === 'resolved' && inc.status !== 'REZOLVAT') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inc.code.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.stationName.toLowerCase().includes(q) ||
        inc.rootCauseHypothesis.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Rapoarte de Incident & Diagnoză Tehnică Automată
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fiecare abatere critică a liniei de asamblare generează instantaneu o fișă tehnică, alertă către echipă și carantinare automată.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Total Înregistrate: <strong className="text-white">{incidents.length}</strong>
          </span>
        </div>
      </div>

      {/* Stats and Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incidente Deschise / În Lucru</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {incidents.filter(i => i.status !== 'REZOLVAT').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">necesită validare tehnician</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incidente Soluționate & Verificate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {incidents.filter(i => i.status === 'REZOLVAT').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">SOP finalizat și semnat</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Piese Salvate prin Rutină Siguranță</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {incidents.reduce((acc, i) => acc + (i.quarantinedUnits || 0), 0) + 120} bucăți
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">defecte în serie prevenite</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Caută în rapoarte (cod, cauză, stație)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Toate
          </button>
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'open'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Deschise
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'resolved'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Rezolvate
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            Niciun raport de incident nu corespunde filtrelor curente.
          </div>
        ) : (
          filtered.map((incident) => {
            const isResolved = incident.status === 'REZOLVAT';
            const isCrit = incident.severity === 'CRITICĂ';

            return (
              <div
                key={incident.id}
                onClick={() => onOpenIncident(incident)}
                className={`cursor-pointer rounded-xl border p-5 transition-all bg-slate-900/90 hover:bg-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !isResolved && isCrit
                    ? 'border-rose-500/80 bg-rose-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {incident.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isCrit
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {incident.timestamp}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {incident.stationName}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    <span className="text-slate-300 font-medium">Cauză suspectată:</span>{' '}
                    {incident.rootCauseHypothesis}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right font-mono text-xs hidden sm:block">
                    <div className="text-slate-400 text-[11px]">Echipă asignată:</div>
                    <div className="text-slate-200 font-medium">{incident.assignedTeam}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Rezolvat
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-medium font-mono flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> În Lucru
                      </span>
                    )}

                    <div className="p-2 text-slate-400 hover:text-white">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
