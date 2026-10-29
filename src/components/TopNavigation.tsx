import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Bell, BookOpen } from 'lucide-react';
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
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 h-14 sm:h-16 w-full">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-2 h-6 sm:w-2.5 sm:h-7 bg-amber-500 rounded-sm shrink-0"></div>
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('overview');
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-amber-400 transition-colors truncate"
            >
              OmniLine
              <span className="hidden xs:inline"> Telemetry</span>
            </a>
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-800 shrink-0">
              Linia A-4
            </span>
          </div>

          {/* Zone 2: Navigation Links for Desktop (hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-slate-300 shrink-0">
            <button
              onClick={() => onSelectTab('overview')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
                activeTab === 'overview'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Linie & Senzori
            </button>
            <button
              onClick={() => onSelectTab('oee')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
                activeTab === 'oee'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Eficiență OEE & Calitate
            </button>
            <button
              onClick={() => onSelectTab('incidents')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
                activeTab === 'incidents'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Rapoarte Incident
            </button>
            <button
              onClick={() => onSelectTab('maintenance')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
                activeTab === 'maintenance'
                  ? 'text-white font-semibold border-b-2 border-amber-500'
                  : 'text-slate-400'
              }`}
            >
              Dispecerat Mentenanță
            </button>
          </nav>

          {/* Zone 3: Actions area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Documentation modal button */}
            <button
              onClick={onOpenDocs}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Ghid & Documentație Aplicație"
              aria-label="Ghid & Documentație"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ghid</span>
            </button>

            {/* Audio toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Activează alertele audio' : 'Dezactivează sunetul'}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              aria-label="Comutare sunet alerte"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Notification bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Alerte dispecerat tehnic"
              aria-label="Alerte dispecerat tehnic"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Safety status / Emergency stop button */}
            {safetyRoutine.isActive ? (
              <button
                onClick={onOpenSafetyModal}
                className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all animate-pulse shadow-md shadow-rose-950/50 whitespace-nowrap"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RUTINĂ SIGURANȚĂ</span>
                <span className="sm:hidden">SIGURANȚĂ</span>
              </button>
            ) : (
              <button
                onClick={onTriggerManualEmergencyStop}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-rose-600/60 hover:bg-rose-950/30 text-slate-300 hover:text-rose-300 text-[11px] sm:text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
                title="Apasă pentru oprire de siguranță manuală (E-Stop)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>E-STOP</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Navigation bar - Compact grid, zero horizontal overflow */}
        <div className="grid grid-cols-4 lg:hidden py-1.5 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400 text-center w-full">
          <button
            onClick={() => onSelectTab('overview')}
            className={`py-1 px-1 rounded truncate transition-colors ${activeTab === 'overview' ? 'text-amber-400 font-semibold bg-slate-900' : 'hover:text-slate-200'}`}
          >
            Senzori
          </button>
          <button
            onClick={() => onSelectTab('oee')}
            className={`py-1 px-1 rounded truncate transition-colors ${activeTab === 'oee' ? 'text-amber-400 font-semibold bg-slate-900' : 'hover:text-slate-200'}`}
          >
            OEE
          </button>
          <button
            onClick={() => onSelectTab('incidents')}
            className={`py-1 px-1 rounded truncate transition-colors ${activeTab === 'incidents' ? 'text-amber-400 font-semibold bg-slate-900' : 'hover:text-slate-200'}`}
          >
            Incidente
          </button>
          <button
            onClick={() => onSelectTab('maintenance')}
            className={`py-1 px-1 rounded truncate transition-colors ${activeTab === 'maintenance' ? 'text-amber-400 font-semibold bg-slate-900' : 'hover:text-slate-200'}`}
          >
            Mentenanță
          </button>
        </div>
      </div>
    </header>
  );
};
