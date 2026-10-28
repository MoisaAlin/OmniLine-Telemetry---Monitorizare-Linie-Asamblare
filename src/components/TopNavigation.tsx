import React from 'react';
import { Volume2, VolumeX, ShieldAlert, CheckCircle2, AlertTriangle, Bell, BookOpen } from 'lucide-react';
import { SafetyRoutineState } from '../types/assemblyLine';

interface TopNavigationProps {
  activeTab: 'overview' | 'oee' | 'incidents' | 'maintenance';
  onSelectTab: (tab: 'overview' | 'oee' | 'incidents' | 'maintenance') => void;
  safetyRoutine: SafetyRoutineState;
  onTriggerManualEmergencyStop: () => void;
  onOpenSafetyModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenDocs: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onSelectTab,
  safetyRoutine,
  onTriggerManualEmergencyStop,
  onOpenSafetyModal,
  isMuted,
  onToggleMute,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenDocs,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-2.5 h-7 bg-amber-500 rounded-sm"></div>
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('overview');
              }}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
            >
              OmniLine Telemetry
            </a>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
              Linia A-4 Precision
            </span>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectTab('overview')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'overview'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Monitorizare Linie & Senzori
            </button>
            <button
              onClick={() => onSelectTab('oee')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'oee'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Eficiență OEE & Calitate
            </button>
            <button
              onClick={() => onSelectTab('incidents')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'incidents'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Rapoarte Incident & Diagnoză
            </button>
            <button
              onClick={() => onSelectTab('maintenance')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'maintenance'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Dispecerat Mentenanță
            </button>
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Documentation & Guide modal button */}
            <button
              onClick={onOpenDocs}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Ghid & Documentație Aplicație"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ghid & Documentație</span>
            </button>

            {/* Audio alarm toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Activează alertele audio' : 'Dezactivează sunetul'}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              aria-label="Comutare sunet alerte"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Notification bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Alerte dispecerat tehnic"
              aria-label="Alerte dispecerat tehnic"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center font-mono">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Safety status pill / Primary action */}
            {safetyRoutine.isActive ? (
              <button
                onClick={onOpenSafetyModal}
                className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all animate-pulse shadow-lg shadow-rose-950/50 whitespace-nowrap shrink-0"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>RUTINĂ SIGURANȚĂ ACTIVĂ</span>
              </button>
            ) : (
              <button
                onClick={onTriggerManualEmergencyStop}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-rose-600/60 hover:bg-rose-950/30 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                title="Apasă pentru oprire de siguranță manuală (E-Stop)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="hidden sm:inline">OPRIRE URGENȚĂ (E-STOP)</span>
                <span className="sm:hidden">E-STOP</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs text-slate-400 overflow-x-auto">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'overview' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Linie & Senzori
          </button>
          <button
            onClick={() => onSelectTab('oee')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'oee' ? 'text-amber-400 font-semibold' : ''}`}
          >
            OEE & Calitate
          </button>
          <button
            onClick={() => onSelectTab('incidents')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'incidents' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Rapoarte Incidente
          </button>
          <button
            onClick={() => onSelectTab('maintenance')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'maintenance' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Mentenanță
          </button>
        </div>
      </div>
    </header>
  );
};
