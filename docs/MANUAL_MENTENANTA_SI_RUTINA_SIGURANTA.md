# Manual Tehnic: Rutină de Siguranță & Proceduri Mentenanță

**Standard de Referință:** EN ISO 13849-1 (Securitatea Mașinilor - Părți ale Sistemelor de Comandă Referitoare la Securitate, Categoria 4 / PLe)  
**Procedură Standard de Operare:** SOP-IND-402 (Intervenție Avarii Linia A-4)

---

## 1. Secvența Rutinei Automate de Siguranță

Când oricare dintre senzorii critici depășește limita maximă admisă:

1. **Decelerație Controlată (1.2 secunde)**:
   - Convertizorul de frecvență SEW reduce turația motorului de antrenare pe o rampă liniară de decelerare pentru a evita răsturnarea pieselor pe paleți.
   - Viteza scade de la $14.2\text{ m/min}$ la $0.0\text{ m/min}$.

2. **Retragere Scule & Brațe în Poziție Sigură (*Home Safe*)**:
   - Mandrina Chiron FZ-12 este oprită din rotație cu frână dinamică și ridicată la cota $Z_{\text{MAX}}$.
   - Brațele robotice KUKA KR CYBERTECH se deplasează pe traiectoria PTP de urgență la coordonatele de repaus protejat.

3. **Carantinare Automată a Reperului**:
   - Piesa din stația afectată este transferată pe jgheabul de carantină prin acționare pneumatică locală.
   - Piesa primește un tag unic (ex: `#LOT-A4-1841`) pentru inspecție ulterioară în laboratorul de calitate.

4. **Cuplare Mecanică & Electrică Interlock LOTO**:
   - Se activează releele de securitate Pilz, decuplând alimentarea de forță a actuatoarelor.
   - Este blocată orice încercare de repornire automată până când este parcurs protocolul de deblocare.

---

## 2. Procedura Standard de Remediere (SOP-IND-402)

Pentru deblocarea liniei și reluarea producției, tehnicianul de mentenanță trebuie să execute următorii pași:

1. **Verificare LOTO**: Verificarea lipsei de tensiune și presiune reziduală pe actuatorul afectat.
2. **Inspecție Vizuală & Mecanică**: Verificarea absenței corpurilor străine, a șpanului sau a scurgerilor de fluid în zona de lucru.
3. **Remediere Cauză Rădăcină**:
   - *Pentru lagăr CNC*: Înlocuire con sculă, suflare canal, adăugare lubrifiere.
   - *Pentru gripper Festo*: Schimbare garnitură, strângere racord 8mm, verificare presiune alimentare 6.4 bar.
   - *Pentru laser Keyence*: Curățare prismă optică cu alcool izopropilic, etalonare pe piesa etalon ceramică.
   - *Pentru sonotrodă Herrmann*: Verificare cuplu de strângere cheie dinamometrică (35 Nm), test impedanță în gol.
4. **Validare În Gol**: Testare senzor fără sarcină pentru confirmarea revenirii în plaja nominală.
5. **Deblocare Interlock & Ramp-Up**:
   - Bifarea confirmărilor în aplicație.
   - Pornirea transportorului în viteză redusă (Ramp-up slow test) timp de 1 ciclu (12 secunde).
   - Verificarea primei piese (*First Article Inspection*).
   - Semnarea raportului de incident în modulul digital.
