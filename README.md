# OmniLine Telemetry - Sistem Industrial de Monitorizare Linie de Asamblare & OEE

Aplicație SCADA / MOM pentru monitorizarea în timp real a liniei de asamblare industriale, eficienței OEE, telemetriei senzorilor, detectării anomaliilor de calitate și protecției automate prin rutină de siguranță.

<div align="center">
<img width="1200" height="475" alt="Imagine1" src="https://github.com/MoisaAlin/OmniLine-Telemetry---Monitorizare-Linie-Asamblare/blob/main/printscreens/main_menu_onmiline.png" />
</div>
---

## Documentația Completă a Aplicației

Toate ghidurile detaliate se găsesc în directorul `/docs/`:

1. **[`/docs/PREZENTARE_SI_GHID_UTILIZARE.md`](docs/PREZENTARE_SI_GHID_UTILIZARE.md)**
   - Prezentare generală a aplicației
   - Cum funcționează sistemul (fluxul telemetric, rutina de siguranță, calculul OEE)
   - Ghid de utilizare pas-cu-pas (navigare, simulare defecte, deblocare interlock, tipărire rapoarte)
   - Taste rapide și comenzi de securitate

2. **[`/docs/ARHITECTURA_TEHNICA.md`](docs/ARHITECTURA_TEHNICA.md)**
   - Arhitectura componentelor React / TypeScript
   - Modelul de date și interfețele senzorilor
   - Motorul de sinteză audio (Web Audio API) fără dependențe externe

3. **[`/docs/STANDARDE_CALITATE_SI_OEE.md`](docs/STANDARDE_CALITATE_SI_OEE.md)**
   - Formulele OEE conform ISO 22400 (Disponibilitate, Performanță, Calitate)
   - Matricea toleranțelor micronice și standarde de precizie
   - Clasificarea Pareto a defectelor de fabricație

4. **[`/docs/MANUAL_MENTENANTA_SI_RUTINA_SIGURANTA.md`](docs/MANUAL_MENTENANTA_SI_RUTINA_SIGURANTA.md)**
   - Secvența automată de Safe Stop (decelerație, carantinare reper, blocare LOTO)
   - Procedura de mentenanță și remediere SOP-IND-402
   - Protocolul de validare tehnician înainte de reluarea producției

---

## Pornire & Rulare Proiect

```bash
# Instalare dependențe
npm install

# Rulare server de dezvoltare
npm run dev

# Compilare pentru producție
npm run build
```
