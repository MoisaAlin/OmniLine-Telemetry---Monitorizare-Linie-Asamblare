import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  FileText, 
  Wrench, 
  Play, 
  CheckCircle2, 
  Download, 
  Printer, 
  Search,
  Layers,
  HelpCircle,
  AlertTriangle,
  Radio
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchDoc, setSearchDoc] = useState<string>('');

  const sections = [
    { id: 'intro', title: '1. Prezentare Generală', icon: BookOpen },
    { id: 'architecture', title: '2. Stații & Senzori I/O', icon: Cpu },
    { id: 'oee', title: '3. Eficiență OEE & Calitate', icon: BarChart3 },
    { id: 'safety', title: '4. Rutină de Siguranță & LOTO', icon: ShieldAlert },
    { id: 'incidents', title: '5. Diagnoză & Rapoarte Incident', icon: FileText },
    { id: 'guide', title: '6. Ghid Utilizare & Testare Live', icon: Play },
  ];

  const handleDownloadManual = () => {
    const manualContent = `====================================================================
MANUAL TEHNIC DE UTILIZARE & SPECIFICAȚII SISTEM
Sistem Industrial OmniLine Telemetry - Linia A-4 Precision Assembly
Standard de referință: ISO 22400 (OEE) & EN ISO 13849-1 (Securitate Mașini)
====================================================================

1. PREZENTARE GENERALĂ
OmniLine Telemetry este o platformă industrială SCADA și de mentenanță predictivă concepută pentru monitorizarea continuă a fluxului pe linia de asamblare automată. Sistemul asigură:
- Conectare continuă la senzorii I/O de precizie prin magistrale Profinet și IO-Link.
- Calcul în timp real al eficienței OEE (Disponibilitate, Performanță, Calitate).
- Detecție automată a anomaliilor mecanice, hidraulice, termice și optice.
- Activare instantanee a Rutinei de Siguranță (Safe Stop) și carantinare automată a piesei pentru a preveni propagarea defectelor în serie.
- Generare automată de fișe tehnice detaliate de incident cu telemetrie snapshot și atribuire către echipa de intervenție.

2. STAȚII MECATRONICE & SENZORI MONITORIZAȚI
Linia de asamblare A-4 este compusă din 6 stații sincronizate prin indexor pas-cu-pas:
- Stația 01 (WS-01-FEED): Alimentare & Sortare Componente (Viteză bandă m/min, Nivel buncăr %, Curent motor A).
- Stația 02 (WS-02-CNC): Frezare & Ștanțare Precizie (Temperatură lagăr frontal °C, Vibrații radiale mm/s, Presiune răcire bar).
- Stația 03 (WS-03-ROB): Asamblare Robotică Braț 1 & 2 KUKA (Presiune gripper Festo bar, Cuplu sarcină Nm, Precizie repetabilitate µm).
- Stația 04 (WS-04-WELD): Sudură & Fixare cu Ultrasunete (Frecvență generator kHz, Energie îmbinare J, Temperatură sonotrodă °C).
- Stația 05 (WS-05-AOI): Inspecție Optică Automată AOI & Laser 3D (Abatere cotă toleranță µm, Cameră defecte suprafață, Planitate calotă µm).
- Stația 06 (WS-06-PACK): Marcare Laser DataMatrix & Paletizare (Putere laser W, Timp ciclu palet s, Cântărire dinamică kg).

3. FORMULA EFICIENȚEI OEE (ISO 22400)
OEE Global = Disponibilitate (A) × Performanță (P) × Calitate (Q)
- Disponibilitate (A) = Timp efectiv de funcționare / Timp planificat producție.
- Performanță (P) = Timp normat de ciclu (12.0s) / Timp real de ciclu.
- Calitate (Q) = Număr piese conforme (bune) / Total piese produse.

4. PROTOCOLUL RUTINEI DE SIGURANȚĂ (AUTOMATIC SAFE STOP)
Când un parametru telemetric depășește pragul critic definit:
Pasul 1: Decelerație controlată a transportorului la 0.0 m/min în 1.2 secunde.
Pasul 2: Retragerea uneltelor de așchiere și brațelor robotice în poziție sigură (Home Safe).
Pasul 3: Reținerea și izolarea automată a reperului curent în caseta de carantină.
Pasul 4: Cuplare mecanică/software Interlock LOTO (Lock-Out / Tag-Out) pentru protecția operatorilor.
Pasul 5: Deblocarea se realizează exclusiv după validarea tehnicianului prin bifarea procedurii de inspecție și calibrare din fereastra dedicată.

5. CUM SE UTILIZEAZĂ APLICAȚIA
- Pentru a urmări linia: accesați fila „Monitorizare Linie & Senzori”. Faceți clic pe orice stație pentru a deschide telemetria avansată.
- Pentru a simula o avarie: utilizați bara superioară de injectare defecțiuni (F1, F2, F3, F4) sau butonul E-Stop.
- Când apare o avarie: linia intră în siguranță, se declanșează alarma sonoră și apare bannerul roșu. Faceți clic pe „Fișă Incident Generată” pentru raportul tehnic sau pe „Protocol Repornire & Deblocare” pentru readucerea liniei în funcțiune.
- Pentru dispecerat alerte: faceți clic pe clopoțelul de notificări din colțul dreapta-sus.
====================================================================`;

    const blob = new Blob([manualContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OmniLine_Manual_Operare_Linie_Asamblare.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
              Manual Tehnic & Documentație Sistem
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 font-mono text-xs">Versiunea 2.4-SOP</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Ghid de Prezentare, Funcționare & Utilizare OmniLine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Documentație tehnică completă pentru operatori, ingineri de proces, automatiști și tehnicieni de mentenanță.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Tipărește manualul"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Tipărește</span>
          </button>

          <button
            onClick={handleDownloadManual}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            title="Descarcă documentația completă în format text"
          >
            <Download className="w-4 h-4" />
            <span>Descarcă Manual (TXT)</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-amber-400 mb-1.5">
            <Radio className="w-4 h-4" />
            <span className="font-semibold text-xs">Telemetrie I/O Continuă</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            18 senzori industriali pe 6 stații de lucru, cu eșantionare continuă la 1000ms conform standardului Profinet.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold text-xs">OEE ISO 22400</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Calcul integrat Disponibilitate × Performanță × Calitate, rată rebut, timp de tact și analiză Pareto a defectelor.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-rose-400 mb-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-semibold text-xs">Rutină Safe Stop & LOTO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Oprire automată în 1.2s, retragere scule în Home Safe, carantinare reper și interlock hardware EN ISO 13849-1.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-sky-400 mb-1.5">
            <FileText className="w-4 h-4" />
            <span className="font-semibold text-xs">Diagnoză & SOP Automat</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Snapshot instant al senzorilor la declanșare, ipoteză cauză rădăcină, generare fișă incident și alertare tehnicieni.
          </p>
        </div>
      </div>

      {/* Main Two-Column Navigation & Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar for Sections */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Capitole Documentație
          </div>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Section Content Area */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-xs text-slate-300 space-y-6 leading-relaxed">
          {/* SECTION 1: INTRO */}
          {activeSection === 'intro' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  1. Prezentare Generală a Aplicației OmniLine
                </h3>
                <p className="text-slate-400">
                  Sistem integrat de monitorizare telemetrică și intervenție automată pentru linii de asamblare de precizie.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <h4 className="font-semibold text-white text-sm">Obiective Industriale Majore</h4>
                <p>
                  Aplicația are rolul de a supraveghea continuu starea de funcționare a utilajelor mecatronice, detectând din timp vibrațiile excesive, supraîncălzirile de lagăre, căderile de presiune pneumatică și micro-abaterile dimensionale.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Prevenirea Rebuturilor în Cascadă:</strong> Oprirea instantanee a fluxului împiedică prelucrarea pieselor compromise.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Siguranța Operatorilor:</strong> Implementarea interlock-ului LOTO decuplează forțele reziduale.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Diagnoză Asistată:</strong> Tehnicianul primește snapshot-ul senzorilor exact la momentul avariei.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Maximizarea OEE:</strong> Reducerea timpului de oprire neplanificată (downtime) și creșterea MTBF.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ARCHITECTURE & WORKSTATIONS */}
          {activeSection === 'architecture' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  2. Stațiile Liniei de Asamblare & Senzorii I/O
                </h3>
                <p className="text-slate-400">
                  Descrierea celor 6 posturi de lucru mecatronice și parametrii măsurați.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">01</span>
                    <span>Alimentare & Sortare Componente (Bosch Rexroth TS-2 Plus)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Alimentează piesele brute în ritm calibrat. Senzori: Viteză bandă (SPD-01: 12-16 m/min), Nivel umplere buncăr (LVL-01: 50-100%), Curent motor SEW (CUR-01: 4.0-6.0 A).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">02</span>
                    <span>Frezare & Ștanțare Precizie CNC (Chiron FZ-12 HighSpeed)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Prelucrare mecanică de înaltă viteză. Senzori: Temperatură lagăr ax principal (TMP-02: 40-60°C, critic &gt; 82°C), Vibrație radială RMS (VIB-02: 0.8-2.8 mm/s, critic &gt; 7.2 mm/s), Presiune emulsie răcire (PRS-02: 18-25 bar).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">03</span>
                    <span>Asamblare Robotică Braț 1 & 2 (KUKA KR CYBERTECH + Festo)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Inserție automată componente delicate. Senzori: Presiune pneumatică gripper Festo (PRS-03: 5.8-6.8 bar, critic &lt; 4.2 bar), Cuplu servomotoare axe J2/J3 (TRQ-03: 100-155 Nm), Repetabilitate poziție vârf braț (POS-03: 2-10 µm).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">04</span>
                    <span>Sudură & Fixare cu Ultrasunete (Herrmann HiQ DIALOG 20kHz)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Îmbinare termoplastică fără aditivi. Senzori: Frecvență rezonanță sonotrodă (FRQ-04: 19.8-20.2 kHz), Energie pe îmbinare (ENG-04: 420-490 J), Temperatură sonotrodă titan (TMP-04: 30-48°C).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">05</span>
                    <span>Inspecție Optică Automată AOI & Laser 3D (Keyence LJ-X8000)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Control calitate inline 100%. Senzori: Abatere cotă toleranță înălțime (TOL-05: 0-10 µm, critic &gt; 25 µm), Cameră defecte optice (DEF-05: 0-1 def/lot), Planitate așezare (PLN-05: 3-12 µm).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 flex items-center justify-center">06</span>
                    <span>Marcare Laser DataMatrix & Paletizare (Videojet Faserlaser)</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Trasabilitate completă și ambalare palet. Senzori: Putere laser fibră (PWR-06: 27-33 W), Timp transfer cutie (TIM-06: 11-13.5 s), Cântărire dinamică (WGT-06: 4.95-5.05 kg).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: OEE & QUALITY */}
          {activeSection === 'oee' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  3. Calculul Eficienței OEE & Analiza Calității (ISO 22400)
                </h3>
                <p className="text-slate-400">
                  Metodologia standardizată de calcul pentru cei trei factori constitutivi ai indicatorului OEE.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-mono text-sm font-bold text-amber-400 pb-2 border-b border-slate-800">
                  OEE Global (%) = Disponibilitate (A) × Performanță (P) × Calitate (Q) / 10000
                </div>

                <div className="space-y-2 pt-1">
                  <div>
                    <span className="font-semibold text-white">1. Disponibilitate (A):</span>
                    <span className="text-slate-400 ml-1">Raportul dintre timpul efectiv în care linia funcționează și timpul planificat de lucru (480 min/tură). Opririle de siguranță sau lipsa de materie primă reduc disponibilitatea.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">2. Performanță (P):</span>
                    <span className="text-slate-400 ml-1">Compară viteza reală a liniei cu viteza optimă de proiectare (Takt Time normat de 12.0s = 5 piese/minut). Micro-întârzierile la indexor reduc performanța.</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">3. Calitate (Q):</span>
                    <span className="text-slate-400 ml-1">Procentul de produse bune, conforme din totalul pieselor realizate: <em>(Piese Conforme / Total Piese) × 100</em>.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-white mb-1 text-xs uppercase tracking-wider">Analiză Pareto a Rebuturilor</h4>
                <p className="text-slate-400">
                  Aplicația clasifică automat cauzele rebutării pieselor (abateri micronice la frezare, porozități de sudură, bavuri gripper sau contrast DataMatrix scăzut), permițând intervenții țintite înainte ca o abatere să devină cronică.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: SAFETY ROUTINE & LOTO */}
          {activeSection === 'safety' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  4. Rutina Automată de Siguranță & Procedura de Resetare (LOTO)
                </h3>
                <p className="text-slate-400">
                  Mecanismul de protecție automată conceput conform standardului european de securitate a mașinilor EN ISO 13849-1.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-2">
                  <div className="font-bold text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Cum se declanșează Rutina de Siguranță:</span>
                  </div>
                  <p className="text-slate-300">
                    În momentul în care orice senzor atinge pragul critic (sau este detectată o cădere pneumatică ori anomalie dimensională severă), PLC-ul liniei inițiază secvența de oprire controlată în maxim 1.2 secunde:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                    <li>Transportorul este decadrat și frânat fără șocuri mecanice.</li>
                    <li>Capetele de așchiere CNC și brațele KUKA sunt retrase în poziția de repaus de siguranță (Home Safe).</li>
                    <li>Piesa aflată în stația cu eroare este evacuată direct în jgheabul de carantină dedicat.</li>
                    <li>Se activează blocajul de securitate LOTO (Lock-Out / Tag-Out).</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Cum se deblochează linia (Procedura Pas-cu-Pas):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                    <li>Faceți clic pe butonul <strong>„Protocol Repornire & Deblocare”</strong> din bannerul roșu sau din antet.</li>
                    <li>Inspectați fizic echipamentul implicat și bifați prima casetă: <em>Confirm inspecția vizuală a subsistemului</em>.</li>
                    <li>Verificați revenirea senzorilor în plaja nominală și bifați a doua casetă: <em>Confirm verificarea senzorilor I/O</em>.</li>
                    <li>Apăsați butonul <strong>„Deblochează & Repornește”</strong>. Sistemul va executa o secvență de calibrare (Ramp-up) și va relua transportul în parametri optimi.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: INCIDENT REPORTS & CMMS */}
          {activeSection === 'incidents' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  5. Diagnoză Tehnică & Rapoarte Automate de Incident
                </h3>
                <p className="text-slate-400">
                  Fișe tehnice generate instantaneu pentru arhivare, analiză cauză rădăcină și trasabilitate mentenanță.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white">Ce conține un Raport de Incident:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Cod Unic Incident & Timestamp:</strong> Ex. <em>INC-2026-1024</em> cu data, ora și stația de lucru exactă.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Snapshot Telemetric la Declanșare:</strong> Tabel cu toate valorile înregistrate, limitele nominale și abaterea calculată (+72%, +300% etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Ipoteză Cauză Rădăcină (Root Cause):</strong> Explicație tehnică (ex. uzură lagăr Chiron, fisură furtun Festo, deplasare plăcuță de așchiere).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Checklist Procedură Standard (SOP):</strong> Pași recomandați pentru remediere mecanică/electrică.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Semnătură Tehnician & Închidere:</strong> Tehnicianul poate adăuga note de remediere și semna fișa direct în aplicație.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 6: USER GUIDE & SIMULATION */}
          {activeSection === 'guide' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  6. Ghid Rapid de Utilizare & Testare Live
                </h3>
                <p className="text-slate-400">
                  Instrucțiuni practice pentru a naviga și a testa toate funcțiile interactive ale platformei.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400 mb-1">Pasul 1: Navigarea în Interfață</h4>
                  <p className="text-slate-300">
                    Utilizați meniul de sus pentru a naviga între:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1 pl-1">
                    <li><strong>Monitorizare Linie & Senzori:</strong> Digital Twin vizual + tabelul live cu toți cei 18 senzori.</li>
                    <li><strong>Eficiență OEE & Calitate:</strong> Bilanț producție, ceasuri OEE și analiză Pareto rebuturi.</li>
                    <li><strong>Rapoarte Incident:</strong> Arhiva completă a fișelor de incident generate automat.</li>
                    <li><strong>Dispecerat Mentenanță:</strong> Program preventiv, echipe de gardă și starea utilajelor.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400 mb-1">Pasul 2: Testarea Scenariilor de Avarie</h4>
                  <p className="text-slate-300">
                    În bara de simulare din partea superioară a ecranului, puteți declanșa oricare dintre anomaliile prestabilite:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1 pl-1">
                    <li><strong>F1: Supraîncălzire CNC (WS-02):</strong> Simulează încălzirea lagărului peste 84°C și vibrații ax 7.9 mm/s.</li>
                    <li><strong>F2: Pierdere Presiune Braț (WS-03):</strong> Scade presiunea pneumatică la 3.4 bar (sub pragul de 4.2 bar).</li>
                    <li><strong>F3: Abatere Cotă Laser (WS-05):</strong> Simulează eroare dimensională +34.2 µm și defecte optice.</li>
                    <li><strong>F4: Rezonanță Sudură (WS-04):</strong> Decuplează generatorul ultrasonic la 18.2 kHz.</li>
                    <li><strong>Oprire Urgență (E-Stop):</strong> Butonul hardware din colțul din dreapta-sus pentru testare manuală.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400 mb-1">Pasul 3: Deblocare & Revenire la Starea Nominală</h4>
                  <p className="text-slate-300">
                    După declanșarea unei avarii, puteți reseta oricând linia fie prin butonul verde <strong>„Stare Nominală”</strong> din bara de simulare, fie parcurgând verificarea din modalul <strong>„Protocol Repornire & Deblocare”</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
