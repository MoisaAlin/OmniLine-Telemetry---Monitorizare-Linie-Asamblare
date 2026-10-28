import React, { useState } from 'react';
import { MaintenanceIncident, Workstation } from '../types/assemblyLine';
import { 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText,
  Plus,
  Cpu
} from 'lucide-react';

interface MaintenanceDashboardProps {
  workstations: Workstation[];
  incidents: MaintenanceIncident[];
  onOpenIncident: (incident: MaintenanceIncident) => void;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({
  workstations,
  incidents,
  onOpenIncident,
}) => {
  // Preventive Schedule
  const preventiveTasks = [
    {
      id: 'prev-1',
      equipment: 'WS-02 Chiron FZ-12 CNC',
      task: 'Schimb ulei hidraulic & gresare rulmenți ax principal',
      dueDate: 'În 4 zile (01 Nov 2026)',
      team: 'Mentenanță Mecanică CNC',
      status: 'PLANIFICAT',
      priority: 'Ridicată',
    },
    {
      id: 'prev-2',
      equipment: 'WS-03 KUKA KR CYBERTECH',
      task: 'Înlocuire garnituri gripper pneumatic Festo & calibrare cuplu',
      dueDate: 'În 8 zile (05 Nov 2026)',
      team: 'Automatizări & Robotică',
      status: 'PLANIFICAT',
      priority: 'Normală',
    },
    {
      id: 'prev-3',
      equipment: 'WS-05 Keyence LJ-X8000',
      task: 'Curățare optică prismă laser 3D & etalonare placă calibrare ceramică',
      dueDate: 'În 11 zile (08 Nov 2026)',
      team: 'Control Calitate AOI',
      status: 'PLANIFICAT',
      priority: 'Normală',
    },
    {
      id: 'prev-4',
      equipment: 'WS-04 Herrmann Ultrasonic',
      task: 'Verificare uzură sonotrodă titan & impedanță piezoelectrică',
      dueDate: 'În 15 zile (12 Nov 2026)',
      team: 'Automatizări & Robotică',
      status: 'PLANIFICAT',
      priority: 'Medie',
    },
  ];

  // Technical teams on duty
  const technicalTeams = [
    {
      name: 'Echipa Mentenanță Mecanică CNC',
      lead: 'Ing. Andrei Vasilescu',
      phone: 'Int. 4201',
      status: 'Disponibil în hală',
      activeTickets: incidents.filter(i => i.assignedTeam === 'Mentenanță Mecanică CNC' && i.status !== 'REZOLVAT').length,
    },
    {
      name: 'Echipa Automatizări & Robotică',
      lead: 'Ing. Radu Enache',
      phone: 'Int. 4203',
      status: 'La linia A-4',
      activeTickets: incidents.filter(i => i.assignedTeam === 'Automatizări & Robotică' && i.status !== 'REZOLVAT').length,
    },
    {
      name: 'Echipa Control Calitate & AOI',
      lead: 'Elena Preda (Lead QA)',
      phone: 'Int. 4210',
      status: 'Activ laborator',
      activeTickets: incidents.filter(i => i.assignedTeam === 'Control Calitate AOI' && i.status !== 'REZOLVAT').length,
    },
    {
      name: 'Mentenanță Pneumatică & Fluide',
      lead: 'Tehn. Cristian Luca',
      phone: 'Int. 4215',
      status: 'Disponibil',
      activeTickets: incidents.filter(i => i.assignedTeam === 'Mentenanță Pneumatică' && i.status !== 'REZOLVAT').length,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dispecerat Mentenanță & Management Echipamente (CMMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mentenanță predictivă, comenzi de lucru (Work Orders), planificări profilactice și indice de disponibilitate MTBF/MTTR.
          </p>
        </div>
      </div>

      {/* KPI Cards: MTBF, MTTR, Open Tickets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Tichete Active Deschise</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {incidents.filter(i => i.status !== 'REZOLVAT').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">intervenții necesare</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">MTBF (Timp Mediu Între Defecțiuni)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            184.2 ore
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">+14% peste media fabricii</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">MTTR (Timp Mediu de Reparație)</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            14.6 min
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">intervenție accelerată SOP</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Scor Mediu Sănătate Utilaje</div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
            {(workstations.reduce((a, b) => a + b.healthScore, 0) / workstations.length).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">stare tehnică excelentă</div>
        </div>
      </div>

      {/* Two Column Layout: Preventive Tasks & On-duty Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preventive Schedule (2 cols on large) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Program de Mentenanță Preventivă & Calibrare</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Revizii profilactice planificate pentru evitarea opririlor neprevăzute
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {preventiveTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{task.equipment}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{task.task}</p>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Responsabil: {task.team}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-amber-400 font-semibold">{task.dueDate}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Teams on Duty */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Echipe Tehnice de Gardă (Schimb 1)</span>
          </h3>

          <div className="space-y-3">
            {technicalTeams.map((team, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{team.name}</span>
                  {team.activeTickets > 0 ? (
                    <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded font-bold">
                      {team.activeTickets} Tichet activ
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400">Disponibil</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Coordonator: <strong className="text-slate-300">{team.lead}</strong> ({team.phone})
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Locație: {team.status}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Alertele din linia de producție se transmit automat pe stațiile mobile ale echipelor de intervenție.
          </div>
        </div>
      </div>

      {/* Equipment Health Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Matrice Fiabilitate & Sănătate Utilaje (Asset Health Monitor)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workstations.map((ws) => (
            <div
              key={ws.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Stația 0{ws.number}</div>
                  <div className="text-[10px] font-mono text-slate-400">{ws.vendorModel}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {ws.healthScore}%
                  </span>
                  <div className="text-[10px] text-slate-500">Sănătate</div>
                </div>
              </div>

              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${ws.healthScore}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Ultima revizie:</span>
                <span className="text-slate-200">{ws.lastMaintenanceDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
