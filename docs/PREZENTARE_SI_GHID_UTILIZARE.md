# OmniLine Telemetry - Prezentare Generală & Ghid de Utilizare

**Versiune Sistem:** 2.4.0-PROD  
**Destinație:** Linie de Asamblare Automatizată A-4 Precision  
**Standarde Implementate:** ISO 22400 (Indicatori OEE), EN ISO 13849-1 (Securitate Utilaje), IEC 62541 (OPC UA)

---

## 1. Prezentare Generală

**OmniLine Telemetry** este o platformă industrială de monitorizare în timp real (SCADA/MOM) proiectată pentru a supraveghea eficiența operațională, precizia geometrică și integritatea mecanică a unei linii de asamblare complexe formată din 6 stații de lucru automatizate.

Sistemul conectează direct fluxul de date de la senzorii I/O de pe magistralele de câmp (Profinet / IO-Link) și detectează instantaneu orice deviație de la cotele nominale sau defecțiune de subsistem.

### Principalele Obiective ale Aplicației:
1. **Monitorizarea continuă a eficienței OEE** (*Overall Equipment Effectiveness*) și a ritmului de producție (PPM și Takt Time).
2. **Supravegherea în timp real a 18 senzori critici** (vibrații radiale, temperaturi lagăre, presiuni pneumatice, abateri laser sub-micronice).
3. **Detecția automată a anomaliilor și oprirea de siguranță (*Safe Stop*)**: când o mărime depășește pragul critic, sistemul trece automat linia într-o rutină de securitate, decelerând transportorul și izolând piesa curentă pentru a preveni defectele în cascadă.
4. **Generarea automată a Fișelor Tehnice de Incident**: crearea instantanee a unui raport detaliat cu snapshot-ul telemetriei, cauza rădăcină suspectată și pașii de intervenție standard (SOP).
5. **Notificarea instantanee a echipei tehnice**: dispecerat mobil cu alerte audio și atribuire directă pe roluri (Automatist, Mecanic, Inspector Calitate).

---

## 2. Cum Funcționează Sistemul

### A. Fluxul de Date și Telemetria Senzorilor
Linia de asamblare este monitorizată printr-o rețea de senzori digitali eșantionați la fiecare secundă (1000ms):
- **WS-01 (Alimentare & Sortare)**: Senzor viteză transportor, nivel buncăr capacitiv, traductor curent motor.
- **WS-02 (Frezare & Ștanțare CNC)**: Termocuplu PT100 lagăr frontal, accelerometru vibrații radiale RMS, presostat emulsie răcire.
- **WS-03 (Asamblare Robotică Braț 1 & 2)**: Regulator pneumatic Festo VPPM gripper, cuplu servomotoare axe, encoder optic poziționare $\pm\mu\text{m}$.
- **WS-04 (Sudură cu Ultrasunete)**: Frecvență rezonanță generator piezoelectric, contor integrat energie sudură, pirometru infraroșu sonotrodă.
- **WS-05 (Inspecție Optică AOI & Laser 3D)**: Profilometru laser 3D Keyence, cameră viziune artificială defecte suprafață, măsurătoare planitate.
- **WS-06 (Marcare Laser & Ambalare)**: Monitor putere fascicul laser fibră, cronometru timp ciclu, celulă de forță cântărire dinamică.

### B. Mecanismul Rutinei de Siguranță (*Safe Stop Routine*)
În momentul în care un senzor depășește pragul critic (de exemplu, temperatura lagărului CNC trece de 82°C sau presiunea gripperului coboară sub 4.2 bar):
1. **Decelerație Controlată**: Indexorul mecanic reduce viteza de la $14.2\text{ m/min}$ la $0\text{ m/min}$ în $1.2\text{s}$.
2. **Retragere Scule**: Sculele CNC și brațele robotice KUKA sunt retrase automat la cota de securitate (*Home Safe*).
3. **Carantinare Reper**: Piesa aflată în stația cu anomalie este evacuată în jgheabul de carantină înainte de a ajunge la stațiile următoare.
4. **Interlock LOTO**: Se activează blocarea hardware de securitate (*Lock-Out / Tag-Out*), împiedicând repornirea accidentală.
5. **Generare Raport & Alertă**: Se emite codul de incident, fișa tehnică și alarma audio către tehnicieni.

### C. Calculul Eficienței Globale (OEE)
Calculul respectă standardul ISO 22400:
$$\text{OEE} = \text{Disponibilitate (A)} \times \text{Performanță (P)} \times \text{Calitate (Q)}$$
- **Disponibilitate**: Raportul dintre timpul de funcționare util și timpul planificat.
- **Performanță**: Raportul dintre ritmul real de producție și viteza normată (Takt Time nominal: $12.0\text{s}$).
- **Calitate**: Procentul de piese conforme fără defecte din totalul pieselor produse.

---

## 3. Ghid de Utilizare Pas-cu-Pas

### Pasul 1: Vizualizarea Liniei & a Geamănului Digital (Digital Twin)
- Accesați fila **„Monitorizare Linie & Senzori”**.
- În partea superioară veți observa schema vizuală a liniei de asamblare cu cele 6 stații conectate prin banda transportoare sincronizată.
- Fiecare stație afișează codul de stare (Verde = Nominal, Galben = Avertizare, Roșu = Rutină de Siguranță).
- Faceți clic pe **oricare dintre cele 6 stații** sau pe textul „Inspectează” pentru a deschide fereastra cu detaliile senzorilor, graficul sparkline și limitele de calibrare.

### Pasul 2: Filtrarea și Căutarea în Matricea de Senzori
- Sub geamănul digital se află tabelul complet cu toți cei 18 senzori.
- Puteți filtra după:
  - Stație specifică (ex: doar Stația 02 Chiron CNC).
  - Tipul mărimii fizice (Temperatură, Vibrație, Presiune, Microni etc.).
  - Butonul **„Afișează doar Abateri / Anomalii”** pentru a izola instantaneu senzorii care se abat de la normal.

### Pasul 3: Testarea și Injectarea Anomaliilor (Fault Simulator)
În bara de testare rapidă de deasupra conținutului aveți la dispoziție scenarii preconfigurate:
- **F1: Supraîncălzire CNC (WS-02)**: Simulează uzura lagărului și vibrații axiale.
- **F2: Pierdere Presiune Braț (WS-03)**: Simulează o cădere de presiune în circuitul pneumatic Festo.
- **F3: Abatere Cotă Laser (WS-05)**: Simulează o depășire a toleranței micronice la scanarea 3D.
- **F4: Rezonanță Sudură (WS-04)**: Simulează pierderea frecvenței de lucru la sonotrodă.
- **Butonul „Stare Nominală”**: Readuce toți senzorii la parametrii ideali.
- **Comutatoarele de viteză (1x, 2x, 5x, Pauză)**: Ajustează viteza de simulare a telemetriei.

### Pasul 4: Gestionarea unei Rutine de Siguranță Active
Când este declanșată o oprire de securitate:
1. Va apărea un banner roșu cu detalii la începutul paginii și se va auzi alarma industrială (dacă sunetul este activat).
2. Apăsați butonul **„Protocol Repornire & Deblocare”** din banner sau din bara de sus.
3. În fereastra modală, bifați verificările obligatorii:
   - *„Confirm inspecția vizuală a subsistemului...”*
   - *„Confirm verificarea senzorilor I/O...”*
4. Apăsați **„Deblochează & Repornește”**. Sistemul va efectua o procedură de ramp-up și va relua producția nominală.

### Pasul 5: Consultarea și Tipărirea Raportului Tehnic de Incident
1. Accesați fila **„Rapoarte Incident & Diagnoză”**.
2. Selectați oricare dintre rapoartele generate automat.
3. În fișa tehnică veți găsi:
   - Snapshot-ul valorilor senzorilor la momentul opririi.
   - Cauza rădăcină suspectată și impactul asupra lotului.
   - Checklist-ul procedurii standard de remediere (SOP-IND-402).
   - Formular de semnare tehnician pentru încheierea intervenției.
   - Butoanele de **Tipărire** (iconița imprimantă) și **Descărcare Fișă TXT**.

### Pasul 6: Dispecerat Mentenanță & Management Echipamente (CMMS)
- Accesați fila **„Dispecerat Mentenanță”** pentru:
  - Planificarea reviziilor profilactice (mentenanță preventivă).
  - Consultarea indicilor de disponibilitate **MTBF** și **MTTR**.
  - Evidența echipelor de gardă din hală (Mecanică, Automatizări, Calitate).

---

## 4. Comenzi Rapide & Taste de Comandă
- **Tasta `Escape` (ESC)**: Închide instantaneu orice fereastră pop-up deschisă.
- **Clic pe fundal întunecat**: Închide imediat fereastra modală.
- **Pictograma Difuzor (Sus-Dreapta)**: Activează sau dezactivează sunetele alertei industriale.
- **Pictograma Clopoțel (Sus-Dreapta)**: Deschide panoul lateral cu alertele în timp real ale dispeceratului tehnic.
- **Butonul E-STOP**: Permite declanșarea manuală a unei opriri de urgență pentru exerciții de securitate.
