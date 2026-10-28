# Arhitectura Tehnică & Specificații de Sistem

**Sistem:** OmniLine Telemetry SCADA Core  
**Arhitectură:** React 19 + TypeScript + Vite + Tailwind CSS  
**Motor Telemetric:** Web Audio API + Buclă Deterministică de Eșantionare I/O

---

## 1. Structura Fișierelor & Componentelor

```
/
├── docs/                                    # Documentația completă a sistemului
│   ├── PREZENTARE_SI_GHID_UTILIZARE.md      # Prezentare, funcționare și ghid utilizare
│   ├── ARHITECTURA_TEHNICA.md               # Arhitectură frontend, date & telemetrie
│   ├── STANDARDE_CALITATE_SI_OEE.md         # Formule ISO 22400 & abateri de calitate
│   └── MANUAL_MENTENANTA_SI_RUTINA_SIGURANTA.md # Proceduri LOTO, SOP & Rutină Siguranță
├── src/
│   ├── assets/images/                       # Active vizuale industriale de înaltă fidelitate
│   ├── components/                          # Componente UI modulare
│   │   ├── AssemblyLineTwin.tsx             # Geamănul digital & banda transportoare animată
│   │   ├── FaultInjectionBar.tsx            # Simulatorul de anomalii & comenzi viteză
│   │   ├── IncidentReportModal.tsx          # Fișa de incident tipăribilă & exportabilă
│   │   ├── IncidentsView.tsx                # Catalogul complet de rapoarte de avarie
│   │   ├── MaintenanceDashboard.tsx         # Modulul CMMS & program de mentenanță
│   │   ├── OEEPerformanceView.tsx           # Grafice OEE, Pareto și timpi de ciclu
│   │   ├── SafetyRoutineBanner.tsx          # Banner-ul de alertă maximă la oprirea liniei
│   │   ├── SafetyRoutineModal.tsx           # Protocolul de deblocare asistată LOTO
│   │   ├── SensorMatrixView.tsx             # Matricea detaliată de senzori I/O & sparklines
│   │   ├── StationDetailModal.tsx           # Fereastra de diagnoză individuală a stației
│   │   ├── TechnicalAlertsDrawer.tsx        # Panoul lateral de dispecerat tehnic
│   │   ├── DocumentationModal.tsx           # Vizualizatorul interactiv de documentație in-app
│   │   └── TopNavigation.tsx                # Bara superioară conform Top Bar Contract
│   ├── data/
│   │   └── initialAssemblyData.ts           # Calibrări inițiale, stații, senzori și istoric
│   ├── hooks/
│   │   └── useAssemblyLineSimulation.ts     # Motorul de stare & telemetrie sincronizată
│   ├── types/
│   │   └── assemblyLine.ts                  # Definițiile de tipuri TypeScript
│   ├── utils/
│   │   └── audioAlerts.ts                   # Sintetizator audio industrial (Web Audio API)
│   ├── App.tsx                              # Componenta rădăcină & orchestrare
│   ├── main.tsx                             # Punct de intrare React
│   └── index.css                            # Stiluri Tailwind & animații industriale
```

---

## 2. Modelul de Date (Types)

Sistemul este complet tipizat în `src/types/assemblyLine.ts`:
- **`Workstation`**: id, cod, model furnizor, stare mecatronică (`nominal`, `warning`, `critical`, `safe_stop`), timpi de ciclu și colecție de senzori.
- **`SensorData`**: id, cod mărime, valoare curentă, unitate, praguri min/max nominale, prag de avertizare, prag critic de oprire, vector de istoric pentru sparkline.
- **`SafetyRoutineState`**: stadiul rutinei (`idle`, `triggered`, `locked_out`), motiv, timestamp, piesa carantinată, vector etape parcurse.
- **`MaintenanceIncident`**: cod incident generat automat, snapshot telemetric, cauză rădăcină, severitate, procedură SOP, notă tehnician și status rezoluție.
- **`OEEStats`**: Disponibilitate, Performanță, Calitate, OEE Global, PPM, piese bune vs rebuturi.

---

## 3. Motorul de Sinteză Audio (Web Audio API)

Sistemul include modulul `IndustrialAudioEngine` (`src/utils/audioAlerts.ts`), care generează sunete specifice de uzină fără a depinde de fișiere audio externe:
- **Alarmă Critică Sirenă**: Oscilator tip `sawtooth` modulat între 880 Hz și 440 Hz cu atenuare exponențială.
- **Avertisment Dublu-Bip**: Două tonuri sinusoidale scurte (E5 și D5).
- **Decelerație Rutină de Siguranță**: Frecvență descendentă adâncă tip `triangle` (280 Hz la 65 Hz) simulând decuplarea mecanică.
- **Confirmare & Resetare**: Ton de validare ascendent de 800 Hz la 1200 Hz.
