const fs = require('fs');
const path = require('path');
const { main: imgMain, apron: imgApron } = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/_b64.json')));

const srcMain  = `data:image/png;base64,${imgMain}`;
const srcApron = `data:image/png;base64,${imgApron}`;

// ─── REPORT ────────────────────────────────────────────────────────────────

const report = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>EOR Ankomsthantering — Konceptförslag</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a2e; background: #fff; font-size: 14px; line-height: 1.6; }
  .page { max-width: 780px; margin: 0 auto; padding: 60px 60px; }

  /* Cover */
  .cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 3px solid #1a1a2e; page-break-after: always; padding-bottom: 60px; }
  .cover-tag { font-size: 11px; letter-spacing: 3px; color: #888; text-transform: uppercase; margin-bottom: 32px; }
  .cover-title { font-size: 38px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
  .cover-sub { font-size: 18px; color: #555; margin-bottom: 48px; }
  .cover-meta { font-size: 12px; color: #aaa; }

  /* Sections */
  .section { margin-top: 56px; }
  h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
  h3 { font-size: 15px; font-weight: 600; margin: 24px 0 8px; color: #333; }
  p { margin-bottom: 12px; color: #333; }

  /* Lists */
  ul, ol { margin: 8px 0 16px 20px; color: #333; }
  li { margin-bottom: 5px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th { background: #1a1a2e; color: #fff; padding: 9px 12px; text-align: left; font-weight: 600; font-size: 12px; letter-spacing: 0.5px; }
  td { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
  tr:nth-child(even) td { background: #f9f9f9; }

  /* Callout boxes */
  .callout { border-left: 4px solid #1a1a2e; background: #f5f6fa; padding: 14px 16px; margin: 20px 0; border-radius: 0 4px 4px 0; }
  .callout.green  { border-color: #4caf50; background: #f0faf0; }
  .callout.red    { border-color: #f44336; background: #fdf0f0; }
  .callout strong { display: block; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; color: #666; }

  /* Screenshots */
  .screenshot-wrap { margin: 24px 0; text-align: center; }
  .screenshot-wrap img { max-width: 100%; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .screenshot-caption { font-size: 12px; color: #888; margin-top: 8px; font-style: italic; }

  /* Dot legend */
  .dot-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .dot { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; }
  .dot-green  { background: #4caf50; }
  .dot-yellow { background: #ffc107; }
  .dot-red    { background: #f44336; }
  .dot-grey   { background: #ccc; }

  /* Process steps */
  .steps { counter-reset: step; list-style: none; margin: 0 0 16px; padding: 0; }
  .steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; margin-bottom: 10px; }
  .steps li::before { content: counter(step); background: #1a1a2e; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

  /* Before/after */
  .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
  .compare-col-head { padding: 10px 14px; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .compare-col-head.before { background: #fdf0f0; color: #c62828; }
  .compare-col-head.after  { background: #f0faf0; color: #2e7d32; }
  .compare-col ul { padding: 12px 14px 12px 28px; margin: 0; font-size: 13px; }
  .compare-col li { margin-bottom: 5px; color: #333; }

  @media print {
    .cover { page-break-after: always; }
    .section { page-break-inside: avoid; }
    body { font-size: 12px; }
    .page { padding: 40px 50px; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- FRAMSIDA -->
  <div class="cover">
    <div class="cover-tag">ESSA ATC — Internt konceptförslag</div>
    <div class="cover-title">EOR Ankomsthantering<br>Digital Förbättring</div>
    <div class="cover-sub">Automatisering av gatetillgänglighetskontroller för att minska koordination mellan Vakthavande och Inflygningskontroll</div>
    <div class="cover-meta">Upprättad: Maj 2026 &nbsp;·&nbsp; ESSA TWR/APP</div>
  </div>

  <!-- 1. SAMMANFATTNING -->
  <div class="section">
    <h2>1. Sammanfattning</h2>
    <p>Detta förslag beskriver en enkel förbättring av den befintliga EOR-ankomstlistan som redan visas på IRIS vid både Inflygningskontroll (APP) och Vakthavande (WS). Genom att koppla listan till Chromas gate-hanteringssystem kan verktyget automatiskt avgöra om varje RNP-kapabel ankomst är en lämplig EOR-kandidat — utan att WS behöver manuellt kontrollera gates och ringa APP för varje flyg.</p>
    <p>Resultatet är en enda färgkodad statusindikator per ankomst som ger APP-kontrollanten allt som behövs för att fatta ett EOR-beslut självständigt, medan WS behåller full kontroll över rampkonfigurationen och möjlighet till manuella åsidosättningar.</p>
  </div>

  <!-- 2. BAKGRUND -->
  <div class="section">
    <h2>2. Bakgrund — Hur EOR Genomförs Idag</h2>
    <p>ESSA tillämpar en <strong>Early Off Runway (EOR)</strong>-procedur som tillåter utvalda ankommande flygplan att landa på parallellbanan (01L eller 19R) med en kurvilinjär RNP-inflygning, simultant med ILS-trafik på huvudlandningsbanan. Detta ökar kapaciteten under hektiska perioder.</p>
    <h3>Begränsningar</h3>
    <ul>
      <li><strong>Maximalt 5 EOR-ankomster per timme</strong></li>
      <li><strong>RNP-kapacitet krävs</strong> — endast flygplan med korrekt utrustning angiven i färdplanen är berättigade</li>
      <li><strong>Taxivägens lämplighet</strong> — efter landning måste flygplanet taxa till sin stand utan att gå mot det ordinarie trafikflödet; detta beror på tilldelad ramp och aktiv banakonfiguration</li>
    </ul>
    <h3>Nuvarande Beslutsprocess</h3>
    <p>När en ankomst träder in i planeringsfönstret (ungefär 60 minuter före landning) genomförs följande steg:</p>
    <ol class="steps">
      <li>WS kontrollerar IRIS EOR-listan, som markerar RNP-kapabla ankomster.</li>
      <li>För varje lämplig kandidat öppnar WS Chroma (flygplatsens gate-hanteringssystem) och slår manuellt upp förväntad stand och gatetillgänglighet.</li>
      <li>WS jämför standen mot aktuell banakonfiguration och ramptrafik för att bedöma om taxivägen är acceptabel.</li>
      <li>WS ringer APP-kontrollanten via telefon för att meddela vilka ankomster som är godkända eller ej godkända för EOR.</li>
      <li>APP väljer från den godkända listan och koordinerar med Tornet (TWR) — detta steg kvarstår oförändrat.</li>
    </ol>
  </div>

  <!-- 3. UTMANINGAR -->
  <div class="section">
    <h2>3. Nuvarande Utmaningar</h2>
    <table>
      <tr><th>Användare</th><th>Utmaning</th><th>Konsekvens</th></tr>
      <tr><td><strong>Vakthavande (WS)</strong></td><td>Måste manuellt kontrollera Chroma för varje RNP-kapabel ankomst</td><td>Repetitiv, tidskrävande uppgift som upprepas under hela passet</td></tr>
      <tr><td><strong>Vakthavande (WS)</strong></td><td>Måste ringa APP för varje EOR-beslut</td><td>Avbryter övriga tillsynsuppgifter; skapar ett kommunikationsberoende</td></tr>
      <tr><td><strong>APP-kontrollant</strong></td><td>Måste invänta WS-godkännande innan EOR tilldelas</td><td>Skapar tidstryck, särskilt när Chroma-data är försenad</td></tr>
      <tr><td><strong>APP-kontrollant</strong></td><td>Telefonkoordination avbryter fokus på trafikledningen</td><td>Ökad arbetsbelastning under hektisk inflygningsfas</td></tr>
      <tr><td><strong>Båda</strong></td><td>Processen kräver manuella kontroller i två separata system</td><td>Risk för missade EOR-möjligheter eller fel under hög trafik</td></tr>
    </table>
    <div class="callout red">
      <strong>Kärnutmaningen</strong>
      WS utför en upprepad, förutsägbar uppslagsuppgift (stand + rampens lämplighet) som kan automatiseras — vilket frigör tid för mer värdefulla tillsynsuppgifter och eliminerar en koordinationsflaskhals för APP.
    </div>
  </div>

  <!-- 4. FÖRESLAGEN LÖSNING -->
  <div class="section">
    <h2>4. Föreslagen Lösning</h2>
    <p>Förslaget är att utöka den befintliga EOR-ankomstlistan på IRIS med två förbättringar:</p>
    <ol>
      <li><strong>Automatisk Chroma-uppslagning</strong> — när en ankomst träder in i 60-minutersfönstret frågar systemet Chroma om förväntad stand och gatetillgänglighet, med uppdatering en gång per minut.</li>
      <li><strong>Rampkonfigurationspanel</strong> — WS anger varje ramp som <em>Grön</em> (lämplig) eller <em>Röd</em> (undvik) för respektive EOR-bana, en gång per konfigurationsändring snarare än per flyg.</li>
    </ol>
    <p>Resultatet är en enkel färgkodad statuspunkt bredvid varje ankomst som både APP och WS kan avläsa på en sekund.</p>

    <h3>Statuspunktens Betydelse</h3>
    <div class="dot-row"><span class="dot dot-green"></span><strong>Grön</strong> — Stand på lämplig ramp och ledig minst 15 minuter före landning. Säkert att tilldela EOR.</div>
    <div class="dot-row"><span class="dot dot-yellow"></span><strong>Gul</strong> — Stand på lämplig ramp men gatetillgängligheten är tight (&lt;15 min före landning). Används om inget grönt alternativ finns.</div>
    <div class="dot-row"><span class="dot dot-red"></span><strong>Röd</strong> — Stand på ramp som WS markerat som olämplig för aktuell banakonfiguration. Tilldela ej EOR.</div>
    <div class="dot-row"><span class="dot dot-grey"></span><strong>Grå</strong> — Chroma har ännu inte tilldelat en stand. Status inväntas.</div>

    <div class="callout green">
      <strong>Resultat för APP</strong>
      APP kan agera på färgen direkt, utan att invänta ett samtal från WS. Beslutslogiken är transparent och konsekvent.
    </div>
    <div class="callout green">
      <strong>Resultat för WS</strong>
      WS behöver bara uppdatera rampinställningarna när banakonfigurationen eller rampsituationen förändras — inte en gång per flyg. Telefonkoordination med APP för rutinmässiga EOR-beslut elimineras.
    </div>
  </div>

  <!-- 5. GRÄNSSNITTET -->
  <div class="section">
    <h2>5. Gränssnittet</h2>
    <p>EOR-panelen är utformad för att sitta som ett dedikerat fönster i den befintliga IRIS-miljön vid både APP- och WS-positionerna. Båda positionerna ser samma vy.</p>

    <div class="screenshot-wrap">
      <img src="${srcMain}" alt="EOR-ankomstpanel — huvudvy" style="max-width:420px;">
      <div class="screenshot-caption">Bild 1. EOR-ankomstpanelen — ankomster inom 60 minuter före landning, med alla fyra statustyper synliga</div>
    </div>

    <h3>Panelinformation</h3>
    <table>
      <tr><th>Element</th><th>Beskrivning</th></tr>
      <tr><td><strong>RNP-kolumn</strong></td><td>Bockmark = RNP-kapabel (berättigad till EOR). Kryss = ej RNP (nedtonad, visas för kännedom).</td></tr>
      <tr><td><strong>Anropssignal</strong></td><td>Flygplanets anropssignal</td></tr>
      <tr><td><strong>ELT</strong></td><td>Beräknad landningstid</td></tr>
      <tr><td><strong>Förv. Stand</strong></td><td>Förväntad stand enligt Chroma. Streck = ännu ej tilldelad.</td></tr>
      <tr><td><strong>Statuspunkt</strong></td><td>Färgkodad EOR-lämplighetsindikator (se avsnitt 4). Klickbar för manuell åsidosättning vid behov.</td></tr>
      <tr><td><strong>ARR BANA-växel</strong></td><td>Aktiv EOR-bana (01L eller 19R). Styr vilka rampinställningar som används vid punktberäkning.</td></tr>
      <tr><td><strong>Rampinställningar</strong></td><td>WS-panel för att ange varje ramp som Grön eller Röd per EOR-bana (se bild 2).</td></tr>
    </table>

    <div class="screenshot-wrap">
      <img src="${srcApron}" alt="EOR-ankomstpanel — rampinställningar öppna" style="max-width:420px;">
      <div class="screenshot-caption">Bild 2. Rampinställningspanelen — WS anger varje ramp som Grön eller Röd per EOR-bana. Ändringar träder omedelbart i kraft vid båda positionerna.</div>
    </div>

    <h3>Manuell Åsidosättning</h3>
    <p>En kontrollant kan klicka på valfri statuspunkt för att manuellt ange dess färg. När ett manuellt val gjorts visas en liten asterisk (<strong>*</strong>) bredvid punkten. Om det manuella valet stämmer överens med vad algoritmen skulle ha beräknat rensas åsidosättningen automatiskt.</p>

    <h3>Filter</h3>
    <p>Kolumnrubrikerna RNP och STATUS är klickbara och öppnar ett filterdropdown som låter användaren tillfälligt dölja specifika kategorier av ankomster — exempelvis icke-RNP-rader eller rader med röd status — för att minska visuellt brus.</p>
  </div>

  <!-- 6. FÖRE OCH EFTER -->
  <div class="section">
    <h2>6. Före och Efter</h2>
    <div class="compare">
      <div class="compare-col">
        <div class="compare-col-head before">Idag</div>
        <ul>
          <li>WS kontrollerar IRIS-listan för RNP-ankomster</li>
          <li>WS öppnar Chroma — slår upp stand per flyg</li>
          <li>WS jämför ramp mot banakonfiguration</li>
          <li>WS ringer APP via telefon</li>
          <li>APP inväntar besked, agerar sedan</li>
          <li>Upprepas för varje EOR-kandidat</li>
        </ul>
      </div>
      <div class="compare-col">
        <div class="compare-col-head after">Med detta verktyg</div>
        <ul>
          <li>WS anger rampfärger en gång (vid skiftstart eller vid konfigurationsändring)</li>
          <li>Systemet frågar Chroma automatiskt</li>
          <li>Statuspunkt beräknas i realtid</li>
          <li>APP läser punkten — agerar självständigt</li>
          <li>Inget telefonsamtal krävs för rutinbeslut</li>
          <li>WS tillgänglig för manuell åsidosättning vid behov</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 7. TEKNISKA KRAV -->
  <div class="section">
    <h2>7. Tekniska Krav</h2>

    <h3>IRIS-integration</h3>
    <ul>
      <li>EOR-panelen är ett webbaserat program inbäddat som ett dedikerat fönster i IRIS-miljön</li>
      <li>Ska visas vid både APP- och WS-positionerna simultant</li>
      <li>Läsbehörighet till befintligt IRIS EOR-dataflöde (anropssignal, ELT, RNP-kapacitetsflagga)</li>
    </ul>

    <h3>Chroma API</h3>
    <table>
      <tr><th>Datapunkt</th><th>Användning</th></tr>
      <tr><td>Förväntad standnummer</td><td>Identifierar vilken ramp flygplanet kommer att parkera på</td></tr>
      <tr><td>Förväntad gatefritid</td><td>Avgör grön kontra gul status (15-minuterströskel före ELT)</td></tr>
    </table>
    <ul>
      <li><strong>Åtkomsttyp:</strong> Skrivskyddad — inga skrivningar till Chroma krävs</li>
      <li><strong>Frågefrekvens:</strong> En gång per ankomst, sedan en gång per minut tills standen är bekräftad</li>
      <li><strong>Utlösare:</strong> När en ankomst träder in i 60-minutersfönstret</li>
    </ul>

    <h3>Statisk Referensdata</h3>
    <ul>
      <li>Mappning av standnummer till rampnamn (härled från flygplatsens GIS-data — redan tillgänglig)</li>
    </ul>

    <h3>Konfigurerbara Parametrar</h3>
    <table>
      <tr><th>Parameter</th><th>Standardvärde</th><th>Beskrivning</th></tr>
      <tr><td>Ledtid</td><td>60 minuter</td><td>När ankomster visas i listan</td></tr>
      <tr><td>Fritidströskel</td><td>15 minuter</td><td>Gaten måste vara ledig detta antal minuter före ELT för grön status</td></tr>
      <tr><td>Pollingintervall</td><td>60 sekunder</td><td>Hur ofta Chroma API:et frågas per flyg</td></tr>
    </table>

    <h3>Infrastruktur</h3>
    <ul>
      <li>Körs helt som ett klientbaserat webbprogram — ingen dedikerad serverinfrastruktur krävs utöver Chroma API-anslutningen</li>
      <li>Kompatibelt med standard IRIS-fönsterhantering</li>
    </ul>
  </div>

  <!-- 8. NÄSTA STEG -->
  <div class="section">
    <h2>8. Nästa Steg</h2>
    <ol>
      <li><strong>Operativ granskning</strong> — validera ramp/bana-logik och tröskelvärden med APP- och WS-kollegor</li>
      <li><strong>Chroma API-bedömning</strong> — bekräfta tillgängliga slutpunkter och dataformat med Chroma-teamet</li>
      <li><strong>IRIS-integrationsprojektering</strong> — bekräfta inbäddningskrav med IRIS-leverantör/IT</li>
      <li><strong>Pilottest</strong> — driftsätt vid en position (WS rekommenderas) och validera punktfärgernas korrekthet mot manuella kontroller</li>
      <li><strong>Fullständig driftsättning</strong> — rulla ut till både APP- och WS-positionerna</li>
    </ol>
    <div class="callout">
      <strong>Notering</strong>
      En fungerande prototyp av gränssnittet finns tillgänglig för demonstration. Prototypen använder simulerad Chroma-data och är tillgänglig på: <strong>https://kitpaddle.github.io/essa-eor/</strong>
    </div>
  </div>

</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../docs/report.html'), report);
console.log('Rapport klar.');

// ─── PRESENTATION ──────────────────────────────────────────────────────────

const slides = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>EOR Ankomsthantering — Presentation</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/white.css">
<style>
  .reveal { font-family: 'Segoe UI', system-ui, sans-serif; }
  .reveal h1 { font-size: 1.8em; color: #1a1a2e; }
  .reveal h2 { font-size: 1.3em; color: #1a1a2e; text-transform: none; letter-spacing: 0; }
  .reveal ul, .reveal ol { display: block; text-align: left; }
  .reveal li { margin-bottom: 0.4em; font-size: 0.85em; }
  .reveal section { padding: 20px 40px; }
  .tag { font-size: 0.5em; letter-spacing: 3px; text-transform: uppercase; color: #aaa; display: block; margin-bottom: 0.5em; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; text-align: left; }
  .col-box { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
  .col-head { padding: 8px 12px; font-weight: 700; font-size: 0.6em; letter-spacing: 1px; text-transform: uppercase; }
  .col-head.before { background: #fdf0f0; color: #c62828; }
  .col-head.after  { background: #f0faf0; color: #2e7d32; }
  .col-box ul { padding: 10px 12px 10px 28px; margin: 0; }
  .col-box li { font-size: 0.75em; margin-bottom: 4px; }
  .dot-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; font-size: 0.8em; text-align: left; }
  .dot { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; }
  .dot-green { background: #4caf50; }
  .dot-yellow { background: #ffc107; }
  .dot-red { background: #f44336; }
  .dot-grey { background: #ccc; }
  .callout { background: #f5f6fa; border-left: 4px solid #1a1a2e; padding: 12px 16px; font-size: 0.75em; text-align: left; border-radius: 0 4px 4px 0; margin-top: 16px; }
  .callout.green { border-color: #4caf50; background: #f0faf0; }
  table { font-size: 0.7em; width: 100%; border-collapse: collapse; }
  th { background: #1a1a2e; color: #fff; padding: 7px 10px; text-align: left; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
  .screenshot { max-height: 340px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .small { font-size: 0.6em; color: #888; }
</style>
</head>
<body>
<div class="reveal">
<div class="slides">

  <section>
    <span class="tag">ESSA ATC — Internt konceptförslag</span>
    <h1>EOR Ankomsthantering<br>Digital Förbättring</h1>
    <p style="font-size:0.8em;color:#666;margin-top:16px;">Automatisering av gatetillgänglighetskontroller för att minska koordination mellan Vakthavande och Inflygningskontroll</p>
  </section>

  <section>
    <h2>Vad är EOR?</h2>
    <ul>
      <li><strong>Early Off Runway (EOR)</strong> — utvalda ankomster landar på <strong>parallellbanan</strong> (01L eller 19R) med en kurvilinjär RNP-inflygning, simultant med ILS-trafik på huvudlandningsbanan</li>
      <li>Ökar kapaciteten under hektiska perioder</li>
      <li><strong>Max 5 per timme</strong></li>
      <li>Kräver <strong>RNP-kapabla flygplan</strong></li>
      <li>Flygplanet måste kunna taxa till sin stand <strong>utan att gå mot trafikflödet</strong></li>
    </ul>
  </section>

  <section>
    <h2>Hur EOR Koordineras Idag</h2>
    <ol style="font-size:0.82em;">
      <li>WS kontrollerar IRIS-listan för <strong>RNP-kapabla ankomster</strong></li>
      <li>WS öppnar Chroma och slår manuellt upp <strong>förväntad stand</strong> per kandidat</li>
      <li>WS jämför standen mot <strong>aktiv banakonfiguration</strong> och rampsituation</li>
      <li>WS <strong>ringer APP via telefon</strong> med godkända/ej godkända kandidater</li>
      <li>APP väljer EOR-kandidater och koordinerar med TWR <em>(oförändrat)</em></li>
    </ol>
    <div class="callout" style="margin-top:20px;">
      Denna manuella kontroll och telefonslinga upprepas för <strong>varje EOR-kandidat</strong> under hela passet.
    </div>
  </section>

  <section>
    <h2>Utmaningarna</h2>
    <table>
      <tr><th>Vem</th><th>Utmaning</th></tr>
      <tr><td><strong>WS</strong></td><td>Repetitiv manuell standsuppslagning i Chroma, varje flyg</td></tr>
      <tr><td><strong>WS</strong></td><td>Täta telefonsamtal till APP avbryter övriga uppgifter</td></tr>
      <tr><td><strong>APP</strong></td><td>Måste invänta WS-godkännande — skapar tidstryck</td></tr>
      <tr><td><strong>APP</strong></td><td>Telefonkoordination bryter fokus under inflygningsfasen</td></tr>
      <tr><td><strong>Båda</strong></td><td>Manuell process i två system ökar risken för misstag</td></tr>
    </table>
  </section>

  <section>
    <h2>Förslaget</h2>
    <p style="font-size:0.82em;">Utöka den befintliga IRIS EOR-listan med två tillägg:</p>
    <ul>
      <li><strong>Automatisk Chroma-uppslagning</strong> — systemet hämtar gateinformation och uppdaterar en gång per minut</li>
      <li><strong>Rampkonfigurationspanel</strong> — WS anger varje ramp som Grön eller Röd en gång, inte en gång per flyg</li>
    </ul>
    <p style="font-size:0.82em;margin-top:16px;">Resultatet är en <strong>färgkodad statuspunkt</strong> per ankomst som APP kan avläsa direkt — inget telefonsamtal krävs för rutinmässiga EOR-beslut.</p>
  </section>

  <section>
    <h2>Statuspunkt — Vad Varje Färg Betyder</h2>
    <div style="margin-top:16px;">
      <div class="dot-row"><span class="dot dot-green"></span><span><strong>Grön</strong> — Lämplig ramp, stand ledig ≥15 min före landning. Säkert att tilldela EOR.</span></div>
      <div class="dot-row"><span class="dot dot-yellow"></span><span><strong>Gul</strong> — Lämplig ramp, gatetillgängligheten är tight (&lt;15 min). Används om inget grönt alternativ finns.</span></div>
      <div class="dot-row"><span class="dot dot-red"></span><span><strong>Röd</strong> — Ramp markerad som olämplig av WS. Tilldela ej EOR.</span></div>
      <div class="dot-row"><span class="dot dot-grey"></span><span><strong>Grå</strong> — Chroma har ännu inte tilldelat stand. Status inväntas.</span></div>
    </div>
  </section>

  <section>
    <h2>Gränssnittet</h2>
    <img src="${srcMain}" class="screenshot" alt="EOR-ankomstpanel">
    <p class="small" style="margin-top:8px;">Alla fyra statustyper synliga vid laddning. RNP-kolumnen visar behörighet. Icke-RNP-ankomster visas nedtonade för kännedom.</p>
  </section>

  <section>
    <h2>Rampinställningar (WS)</h2>
    <img src="${srcApron}" class="screenshot" alt="Rampinställningspanelen">
    <p class="small" style="margin-top:8px;">WS anger varje ramp Grön eller Röd per EOR-bana. Ändringar träder omedelbart i kraft vid båda positionerna.</p>
  </section>

  <section>
    <h2>Före och Efter</h2>
    <div class="two-col">
      <div class="col-box">
        <div class="col-head before">Idag</div>
        <ul>
          <li>WS kontrollerar IRIS-listan manuellt</li>
          <li>WS slår upp varje stand i Chroma</li>
          <li>WS bedömer rampens lämplighet</li>
          <li>WS ringer APP via telefon</li>
          <li>APP inväntar, agerar sedan</li>
          <li>Upprepas varje flyg</li>
        </ul>
      </div>
      <div class="col-box">
        <div class="col-head after">Med detta verktyg</div>
        <ul>
          <li>WS anger rampfärger en gång</li>
          <li>Systemet frågar Chroma automatiskt</li>
          <li>Statuspunkt beräknas i realtid</li>
          <li>APP läser punkten — agerar direkt</li>
          <li>Inget telefonsamtal för rutinbeslut</li>
          <li>WS kan åsidosätta manuellt vid behov</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2>Vad Som Krävs</h2>
    <table>
      <tr><th>Krav</th><th>Detalj</th></tr>
      <tr><td><strong>IRIS-integration</strong></td><td>Inbäddad panel vid APP och WS; läsbehörighet till EOR-dataflöde (anropssignal, ELT, RNP-flagga)</td></tr>
      <tr><td><strong>Chroma API</strong></td><td>Skrivskyddad åtkomst till förväntad stand och gatefritid, frågas en gång per minut per flyg</td></tr>
      <tr><td><strong>Stand/ramp-mappning</strong></td><td>Statisk referens som kopplar standnummer till rampnamn — redan tillgänglig från flygplatsens GIS-data</td></tr>
    </table>
    <div class="callout green" style="margin-top:16px;">Ingen skrivrättighet till något befintligt system krävs.</div>
  </section>

  <section>
    <h2>Föreslagna Nästa Steg</h2>
    <ol style="font-size:0.82em;">
      <li>Operativ granskning — validera tröskelvärden och ramplogik med APP/WS-kollegor</li>
      <li>Chroma API-bedömning — bekräfta slutpunkter och dataformat</li>
      <li>IRIS-integrationsprojektering — bekräfta inbäddningskrav med leverantör/IT</li>
      <li>Pilottest vid WS-position — validera punktfärger mot manuella kontroller</li>
      <li>Fullständig driftsättning till APP och WS</li>
    </ol>
    <div class="callout" style="margin-top:20px;font-size:0.72em;">
      En fungerande prototyp finns tillgänglig för demonstration: <strong>https://kitpaddle.github.io/essa-eor/</strong>
    </div>
  </section>

</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script>Reveal.initialize({ hash: true, transition: 'fade', controls: true, progress: true });</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../docs/presentation.html'), slides);
console.log('Presentation klar.');
