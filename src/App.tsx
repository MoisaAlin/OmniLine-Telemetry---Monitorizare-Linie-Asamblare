import React, { useState } from 'react';
import { useAssemblyLineSimulation } from './hooks/useAssemblyLineSimulation';
import { TopNavigation } from './components/TopNavigation';
import { SafetyRoutineBanner } from './components/SafetyRoutineBanner';
import { FaultInjectionBar } from './components/FaultInjectionBar';
import { AssemblyLineTwin } from './components/AssemblyLineTwin';
import { SensorMatrixView } from './components/SensorMatrixView';
import { OEEPerformanceView } from './components/OEEPerformanceView';
import { IncidentsView } from './components/IncidentsView';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { StationDetailModal } from './components/StationDetailModal';
import { IncidentReportModal } from './components/IncidentReportModal';
import { SafetyRoutineModal } from './components/SafetyRoutineModal';
import { TechnicalAlertsDrawer } from './components/TechnicalAlertsDrawer';
import { DocumentationModal } from './components/DocumentationModal';
import { Workstation, MaintenanceIncident } from './types/assemblyLine';

export default function App() {
  const {
    workstations,
    oee,
    incidents,
    notifications,
    safetyRoutine,
    isPaused,
    setIsPaused,
    simulationSpeed,
    setSimulationSpeed,
    activeFault,
    isMuted,
    toggleMute,
    injectFault,
    resetAllNominal,
    triggerManualEmergencyStop,
    acknowledgeNotification,
    markAllAsRead,
    updateIncidentStatus,
  } = useAssemblyLineSimulation();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'overview' | 'oee' | 'incidents' | 'maintenance'>('overview');

  // Modal states
  const [selectedStation, setSelectedStation] = useState<Workstation | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<MaintenanceIncident | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  // Auto-open safety modal or alert on new critical fault if user wants
  const unreadAlertsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        safetyRoutine={safetyRoutine}
        onTriggerManualEmergencyStop={triggerManualEmergencyStop}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Safety Routine High Visibility Alert Banner */}
      <SafetyRoutineBanner
        routine={safetyRoutine}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenIncidentReport={() => {
          if (incidents.length > 0) {
            setSelectedIncident(incidents[0]);
          } else {
            setActiveTab('incidents');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0">
        {/* Fault Simulation & Stress Testing Dock */}
        <FaultInjectionBar
          simulationSpeed={simulationSpeed}
          onSetSimulationSpeed={setSimulationSpeed}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          onInjectFault={injectFault}
          onResetAllNominal={resetAllNominal}
          activeFault={activeFault}
        />

        {/* Dynamic View based on Navigation */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Digital Twin of the Assembly Line */}
            <AssemblyLineTwin
              workstations={workstations}
              safetyRoutine={safetyRoutine}
              onSelectStation={(st) => setSelectedStation(st)}
              selectedStationId={selectedStation?.id || null}
            />

            {/* Live Sensor Matrix Table with Filtering */}
            <SensorMatrixView
              workstations={workstations}
              onSelectStation={(st) => setSelectedStation(st)}
            />
          </div>
        )}

        {activeTab === 'oee' && (
          <OEEPerformanceView oee={oee} workstations={workstations} />
        )}

        {activeTab === 'incidents' && (
          <IncidentsView
            incidents={incidents}
            onOpenIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceDashboard
            workstations={workstations}
            incidents={incidents}
            onOpenIncident={(inc) => setSelectedIncident(inc)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>OmniLine Telemetry Industrial Suite</span>
            <span className="mx-2">·</span>
            <span>Monitorizare SCADA & Mentenanță Predictivă ISO 22400</span>
          </div>
          <div className="font-mono text-slate-400">
            Conexiune I/O: Profinet DP / IO-Link v1.1.3 · Ritm: 300 piese/h
          </div>
        </div>
      </footer>

      {/* Station Detail Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      {/* Incident Report Modal (Printable & Exportable) */}
      <IncidentReportModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={updateIncidentStatus}
      />

      {/* Safety Routine De-escalation & Restart Protocol Modal */}
      {isSafetyModalOpen && (
        <SafetyRoutineModal
          routine={safetyRoutine}
          workstations={workstations}
          onClose={() => setIsSafetyModalOpen(false)}
          onResetRoutine={resetAllNominal}
          onOpenIncidentReport={() => {
            setIsSafetyModalOpen(false);
            if (incidents.length > 0) {
              setSelectedIncident(incidents[0]);
            }
          }}
        />
      )}

      {/* Technical Alerts Push Notification Drawer */}
      <TechnicalAlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        notifications={notifications}
        onAcknowledgeNotification={acknowledgeNotification}
        onMarkAllAsRead={markAllAsRead}
      />

      {/* Interactive In-App Documentation & User Guide Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
