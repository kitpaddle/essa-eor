// One-time script: rewrites build-docs.js to use report-body.html as source
const fs = require('fs');
const path = require('path');

// Read current slides block from build-docs.js
const src = fs.readFileSync(path.join(__dirname, 'build-docs.js'), 'utf8');
const slidesStart = src.indexOf('\nconst slides = `');
const slidesEnd = src.lastIndexOf('\nfs.writeFileSync(path.join(__dirname');
const slidesBlock = src.slice(slidesStart, slidesEnd);

const newScript = `const fs = require('fs');
const path = require('path');
const { main: imgMain, apron: imgApron } = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/_b64.json')));

const srcMain  = 'data:image/png;base64,' + imgMain;
const srcApron = 'data:image/png;base64,' + imgApron;

// ─── REPORT ────────────────────────────────────────────────────────────────
// To edit report content: open docs/report-body.html
// Use {{IMG_MAIN}} and {{IMG_APRON}} as image placeholders in that file.

const REPORT_CSS = \`
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
\`;

const bodyHtml = fs.readFileSync(path.join(__dirname, '../docs/report-body.html'), 'utf8')
  .replace(/{{IMG_MAIN}}/g, srcMain)
  .replace(/{{IMG_APRON}}/g, srcApron);

const report = '<!DOCTYPE html>\\n<html lang="sv">\\n<head>\\n<meta charset="UTF-8">\\n<title>EOR Ankomsthantering — Konceptförslag</title>\\n<style>' + REPORT_CSS + '</style>\\n</head>\\n<body>\\n<div class="page">\\n' + bodyHtml + '\\n</div>\\n</body>\\n</html>';

fs.writeFileSync(path.join(__dirname, '../docs/report.html'), report);
console.log('Rapport klar.');

// ─── PRESENTATION ──────────────────────────────────────────────────────────
${slidesBlock}
fs.writeFileSync(path.join(__dirname, '../docs/presentation.html'), slides);
console.log('Presentation klar.');
`;

fs.writeFileSync(path.join(__dirname, 'build-docs.js'), newScript);
console.log('build-docs.js rewritten.');
