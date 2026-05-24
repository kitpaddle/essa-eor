const fs = require('fs');
const path = require('path');
const { main: imgMain, apron: imgApron } = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/_b64.json')));

const srcMain  = 'data:image/png;base64,' + imgMain;
const srcApron = 'data:image/png;base64,' + imgApron;

// ─── REPORT ────────────────────────────────────────────────────────────────
// To edit report content: open docs/report-body.html
// Use {{IMG_MAIN}} and {{IMG_APRON}} as image placeholders in that file.

const REPORT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a2e; background: #fff; font-size: 14px; line-height: 1.6; }
  .page { max-width: 780px; margin: 0 auto; padding: 60px 60px; }
  .cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 3px solid #1a1a2e; page-break-after: always; padding-bottom: 60px; }
  .cover-tag { font-size: 11px; letter-spacing: 3px; color: #888; text-transform: uppercase; margin-bottom: 32px; }
  .cover-title { font-size: 38px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
  .cover-sub { font-size: 18px; color: #555; margin-bottom: 48px; }
  .cover-meta { font-size: 12px; color: #aaa; }
  .section { margin-top: 56px; }
  h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
  h3 { font-size: 15px; font-weight: 600; margin: 24px 0 8px; color: #333; }
  p { margin-bottom: 12px; color: #333; }
  ul, ol { margin: 8px 0 16px 20px; color: #333; }
  li { margin-bottom: 5px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th { background: #1a1a2e; color: #fff; padding: 9px 12px; text-align: left; font-weight: 600; font-size: 12px; letter-spacing: 0.5px; }
  td { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
  tr:nth-child(even) td { background: #f9f9f9; }
  .callout { border-left: 4px solid #1a1a2e; background: #f5f6fa; padding: 14px 16px; margin: 20px 0; border-radius: 0 4px 4px 0; }
  .callout.green  { border-color: #4caf50; background: #f0faf0; }
  .callout.red    { border-color: #f44336; background: #fdf0f0; }
  .callout strong { display: block; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; color: #666; }
  .screenshot-wrap { margin: 24px 0; text-align: center; }
  .screenshot-wrap img { max-width: 100%; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .screenshot-caption { font-size: 12px; color: #888; margin-top: 8px; font-style: italic; }
  .dot-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .dot { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; }
  .dot-green  { background: #4caf50; }
  .dot-yellow { background: #ffc107; }
  .dot-red    { background: #f44336; }
  .dot-grey   { background: #ccc; }
  .steps { counter-reset: step; list-style: none; margin: 0 0 16px; padding: 0; }
  .steps li { counter-increment: step; display: flex; gap: 14px; align-items: flex-start; margin-bottom: 10px; }
  .steps li::before { content: counter(step); background: #1a1a2e; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
  .compare-col-head { padding: 10px 14px; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .compare-col-head.before { background: #fdf0f0; color: #c62828; }
  .compare-col-head.after  { background: #f0faf0; color: #2e7d32; }
  .compare-col ul { padding: 12px 14px 12px 28px; margin: 0; font-size: 13px; }
  .compare-col li { margin-bottom: 5px; color: #333; }
  @media print { .cover { page-break-after: always; } .section { page-break-inside: avoid; } body { font-size: 12px; } .page { padding: 40px 50px; } }
`;

const bodyHtml = fs.readFileSync(path.join(__dirname, '../docs/report-body.html'), 'utf8')
  .replace(/{{IMG_MAIN}}/g, srcMain)
  .replace(/{{IMG_APRON}}/g, srcApron);

const report = '<!DOCTYPE html>\n<html lang="sv">\n<head>\n<meta charset="UTF-8">\n<title>EOR Ankomsthantering — Konceptförslag</title>\n<style>' + REPORT_CSS + '</style>\n</head>\n<body>\n<div class="page">\n' + bodyHtml + '\n</div>\n</body>\n</html>';

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
