# Standarde de Calitate & Eficiență OEE

**Standard:** ISO 22400-2 (KPI pentru Managementul Producției)  
**Calibrare Toleranțe:** ISO 2768-mK (Toleranțe Generale de Prelucrare)

---

## 1. Indicatorul OEE Global

Eficiența globală a echipamentelor măsoară gradul de utilizare productivă a capacității liniei de asamblare:

$$\text{OEE} = A \times P \times Q$$

### Componente:
1. **Disponibilitate (Availability - A)**:
   $$A = \frac{\text{Timp Efectiv de Funcționare}}{\text{Timp Planificat de Producție}} \times 100$$
   - Pierderi monitorizate: Opriri neplanificate, avarii, timpi morți de reglare.
   - Țintă Linie A-4: $\ge 95.0\%$.

2. **Performanță Ritm (Performance - P)**:
   $$P = \frac{\text{Takt Time Teoretic} \times \text{Piese Totale}}{\text{Timp Efectiv de Funcționare}} \times 100$$
   - Takt Time nominal: $12.0\text{ secunde/piesă}$.
   - Ritm normat: 5 piese/minut (300 piese/oră).
   - Pierderi monitorizate: Micro-întreruperi, scăderi de turație, blocaje la indexor.

3. **Rată de Calitate Conformă (Quality - Q)**:
   $$Q = \frac{\text{Piese Bune Conforme}}{\text{Piese Totale Produse}} \times 100$$
   - Țintă Linie A-4: $\ge 98.5\%$.
   - Rebuturile sunt reținute automat în sertarul de carantină de către stația de inspecție optică AOI WS-05.

---

## 2. Abateri de la Standardele de Calitate & Toleranțe

Sistemul supraveghează activ următoarele toleranțe dimensionale și de suprafață:

| Mărime Măsurată | Senzor / Stație | Nominal | Avertisment | Critic (Stop) |
| :--- | :--- | :--- | :--- | :--- |
| **Abatere Cotă Înălțime** | TOL-05 (Keyence Laser) | $0.0 - 10.0\ \mu\text{m}$ | $> 15.0\ \mu\text{m}$ | $> 25.0\ \mu\text{m}$ |
| **Defecte Suprafață AOI** | DEF-05 (Cameră 12MP) | $0 - 1\ \text{def/lot}$ | $\ge 3\ \text{def/lot}$ | $\ge 6\ \text{def/lot}$ |
| **Planitate Calotă** | PLN-05 (Interferometru) | $3.0 - 12.0\ \mu\text{m}$ | $> 18.0\ \mu\text{m}$ | $> 28.0\ \mu\text{m}$ |
| **Energie Sudură Rezonanță** | ENG-04 (Herrmann 20kHz) | $420 - 490\ \text{J}$ | $> 525\ \text{J}$ | $> 600\ \text{J}$ |

### Analiză Pareto Rebuturi:
1. **$45.2\%$**: Abatere cotă toleranță înălțime (uzură sculă de așchiere CNC WS-02).
2. **$29.0\%$**: Micro-porozități la îmbinarea ultrasonică (variație impedanță sonotrodă WS-04).
3. **$16.1\%$**: Urme și micro-zgârieturi la manipularea gripperului pneumatic (WS-03 KUKA).
4. **$9.7\%$**: Deficiențe de contrast la marcarea codului 2D DataMatrix (WS-06 Videojet).
