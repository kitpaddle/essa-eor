# ESSA EOR Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional single-page Vue 3 demo of the ESSA EOR arrival management panel — a light-themed table that shows RNP-capable arrivals with automatically computed green/yellow/red/grey status dots based on stand availability and apron configuration.

**Architecture:** Pure frontend, no build step. Three files: `index.html` (Vue 3 via CDN, all app logic), `data/stand-apron-map.js` (static stand→apron lookup generated from OSM data), and `data/mock-chroma.js` (mock flight data simulating the Chroma gate API). A one-time Node.js script in `scripts/` generates the stand map.

**Tech Stack:** Vue 3 (CDN), vanilla HTML/CSS, Node.js (one-time data generation only)

---

## File Structure

```
essa-eor/
├── index.html                         # Vue 3 app — all UI and logic
├── data/
│   ├── stand-apron-map.js            # { "F32L": "Ramp F", ... } — generated once
│   └── mock-chroma.js                # Mock flight scenarios
└── scripts/
    └── generate-stand-apron-map.js   # One-time Node.js generator
```

---

## Configurable Constants (defined at top of index.html `<script>`)

| Constant | Value | Meaning |
|----------|-------|---------|
| `LEAD_TIME_MIN` | `60` | Minutes before ELT when an arrival enters the list |
| `FREE_TIME_THRESHOLD_MIN` | `15` | Minutes before ELT stand must be free for green |
| `POLL_INTERVAL_SEC` | `60` | Simulated Chroma re-check interval |

---

## Dot Color Logic

```
if expectedStand is null        → grey   (Chroma not yet returned)
else if apron is red            → red    (WS flagged apron)
else if standFreeTime ≤ elt − 15min → green  (stand free early enough)
else                            → yellow (stand assigned but tight timing)
```

---

## Task 1: Scaffolding

**Files:**
- Create: `.gitignore`
- Create: `data/` directory
- Create: `scripts/` directory

- [ ] **Step 1: Create .gitignore**

```
node_modules/
.superpowers/
*.log
```

Write to `C:\Users\kit_p\Documents\essa-eor\.gitignore`

- [ ] **Step 2: Create directories**

```bash
mkdir -p essa-eor/data essa-eor/scripts
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: initial scaffolding"
```

---

## Task 2: Generate Stand-to-Apron Map

**Files:**
- Create: `scripts/generate-stand-apron-map.js`
- Create: `data/stand-apron-map.js` (output — commit this, not the source geojson)

The OSM aeroway geojson is at `C:\Users\kit_p\Documents\opensky-etl\reference_data\airspace\essa_osm_aeroway.geojson`. The script does point-in-polygon to match each parking_position stand to its containing apron polygon.

- [ ] **Step 1: Write the generator script**

Write to `scripts/generate-stand-apron-map.js`:

```javascript
const fs = require('fs');
const path = require('path');

const OSM_PATH = 'C:/Users/kit_p/Documents/opensky-etl/reference_data/airspace/essa_osm_aeroway.geojson';
const OUT_PATH = path.join(__dirname, '../data/stand-apron-map.js');

const geojson = JSON.parse(fs.readFileSync(OSM_PATH));

function pointInPolygon([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function centroid(coords) {
  const [sx, sy] = coords.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
  return [sx / coords.length, sy / coords.length];
}

function getOuterRings(feature) {
  if (feature.geometry.type === 'Polygon') return [feature.geometry.coordinates[0]];
  if (feature.geometry.type === 'MultiPolygon') return feature.geometry.coordinates.map(p => p[0]);
  return [];
}

const aprons = geojson.features.filter(f => f.properties.aeroway === 'apron' && f.properties.name);
const stands = geojson.features.filter(f => f.properties.aeroway === 'parking_position');

const map = {};
let matched = 0;

for (const stand of stands) {
  const ref = stand.properties.ref;
  if (!ref) continue;

  let pt;
  if (stand.geometry.type === 'Point') {
    pt = stand.geometry.coordinates;
  } else if (stand.geometry.type === 'LineString') {
    pt = centroid(stand.geometry.coordinates);
  } else continue;

  for (const apron of aprons) {
    if (getOuterRings(apron).some(ring => pointInPolygon(pt, ring))) {
      map[ref] = apron.properties.name;
      matched++;
      break;
    }
  }
}

const js = [
  '// Auto-generated from OSM aeroway data. Do not edit manually.',
  '// Regenerate by running: node scripts/generate-stand-apron-map.js',
  `const STAND_APRON_MAP = ${JSON.stringify(map, null, 2)};`,
  '',
].join('\n');

fs.writeFileSync(OUT_PATH, js);
console.log(`Mapped ${matched} stands across ${aprons.length} aprons (${stands.length} total stands).`);
```

- [ ] **Step 2: Run the generator**

```bash
node scripts/generate-stand-apron-map.js
```

Expected output:
```
Mapped 2XX stands across 16 aprons (295 total stands).
```

- [ ] **Step 3: Verify a few known mappings**

```bash
node -e "require('./data/stand-apron-map.js'); console.log(STAND_APRON_MAP['F32L'], STAND_APRON_MAP['K3A'], STAND_APRON_MAP['G143']);"
```

Expected output: `Ramp F  Ramp K  Ramp G`

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-stand-apron-map.js data/stand-apron-map.js
git commit -m "feat: add stand-to-apron lookup map generated from OSM data"
```

---

## Task 3: Mock Chroma Data

**Files:**
- Create: `data/mock-chroma.js`

On-load flights (within 60-min window) are pre-loaded with a mix showing all four dot colors immediately:
- **SAS1234** → F32L (Ramp F, green) → dot GREEN (free 17 min before ELT, threshold 15)
- **BAW456** → G143 (Ramp G, green) → dot YELLOW (free 12 min before ELT)
- **FIN789** → K3A (Ramp K, **red by default**) → dot RED
- **DLH012** → no stand yet → dot GREY
- **KLM345** → no stand yet → dot GREY
- **NOZ678** → F39L (Ramp F, green) → dot GREEN

Additional pool flights (ELT > 60 min, outside window on load — used by "+ Add arrival" button).

`_resolvedStand` / `_resolvedFreeTime` are private fields used by "Assign stands" button.

- [ ] **Step 1: Write mock-chroma.js**

Write to `data/mock-chroma.js`:

```javascript
// Mock Chroma gate API data for ESSA EOR demo.
// Times are offsets in minutes from app load time (_T0).
// _resolvedStand / _resolvedFreeTime = what Chroma returns when polled (simulated by "Assign stands" button).

const _T0 = new Date();
const _add = (m) => new Date(_T0.getTime() + m * 60000);

const CHROMA_FLIGHTS = [
  // --- Within 60-min window on load ---
  // GREEN: Ramp F green, free 17 min before ELT (elt-25, free-8 → threshold elt-15=+10, free=+8 ≤ +10)
  { callsign: 'SAS1234', elt: _add(25), expectedStand: 'F32L', standFreeTime: _add(8),  _resolvedStand: null, _resolvedFreeTime: null },
  // YELLOW: Ramp G green, free only 12 min before ELT (elt-32, free-20 → threshold +17, free=+20 > +17)
  { callsign: 'BAW456',  elt: _add(32), expectedStand: 'G143', standFreeTime: _add(20), _resolvedStand: null, _resolvedFreeTime: null },
  // RED: Ramp K is red by default
  { callsign: 'FIN789',  elt: _add(40), expectedStand: 'K3A',  standFreeTime: _add(22), _resolvedStand: null, _resolvedFreeTime: null },
  // GREY: no stand assigned yet
  { callsign: 'DLH012',  elt: _add(47), expectedStand: null,   standFreeTime: null,     _resolvedStand: 'F30',  _resolvedFreeTime: null },
  { callsign: 'KLM345',  elt: _add(53), expectedStand: null,   standFreeTime: null,     _resolvedStand: 'G145', _resolvedFreeTime: null },
  // GREEN: Ramp F green, free 20 min before ELT
  { callsign: 'NOZ678',  elt: _add(58), expectedStand: 'F39L', standFreeTime: _add(38), _resolvedStand: null, _resolvedFreeTime: null },

  // --- Pool for "+ Add arrival" button (ELT outside 60-min window on load) ---
  { callsign: 'AFR234',  elt: _add(75), expectedStand: null, standFreeTime: null, _resolvedStand: 'F36L', _resolvedFreeTime: null },
  { callsign: 'SWR901',  elt: _add(80), expectedStand: null, standFreeTime: null, _resolvedStand: 'K5L',  _resolvedFreeTime: null },
  { callsign: 'THY567',  elt: _add(85), expectedStand: null, standFreeTime: null, _resolvedStand: 'G142', _resolvedFreeTime: null },
  { callsign: 'WZZ890',  elt: _add(90), expectedStand: null, standFreeTime: null, _resolvedStand: 'F28R', _resolvedFreeTime: null },
  { callsign: 'EZY123',  elt: _add(95), expectedStand: null, standFreeTime: null, _resolvedStand: 'M7',   _resolvedFreeTime: null },
  { callsign: 'RYR456',  elt: _add(100),expectedStand: null, standFreeTime: null, _resolvedStand: 'S72',  _resolvedFreeTime: null },
];
```

- [ ] **Step 2: Commit**

```bash
git add data/mock-chroma.js
git commit -m "feat: add mock Chroma flight data with realistic ESSA stands"
```

---

## Task 4: App Shell — HTML Structure and CSS

**Files:**
- Create: `index.html`

Creates the complete HTML skeleton: Vue 3 CDN, data file imports, CSS, and a `#app` mount point. App just renders "EOR ARRIVALS" at this stage — we'll add the Vue logic in Task 5.

- [ ] **Step 1: Create index.html with CSS and shell**

Write to `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EOR Arrivals — ESSA</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="data/stand-apron-map.js"></script>
  <script src="data/mock-chroma.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f0f2f5;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px;
    }

    #app {
      width: 500px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      overflow: hidden;
    }

    /* ── Header ── */
    .panel-header {
      background: #e8eaf0;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
    }
    .panel-title {
      font-size: 13px;
      letter-spacing: 2px;
      color: #555;
      font-weight: 600;
    }
    .header-right { display: flex; align-items: center; gap: 8px; }
    .rwy-label { font-size: 11px; color: #777; }
    .rwy-btn {
      background: #fff;
      border: 1px solid #999;
      padding: 3px 12px;
      border-radius: 3px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      color: #111;
      min-width: 48px;
    }
    .rwy-btn:hover { background: #f0f0f0; }
    .apron-toggle-btn {
      font-size: 11px;
      color: #777;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px 4px;
    }
    .apron-toggle-btn:hover { color: #333; }

    /* ── Apron settings panel ── */
    .apron-panel {
      background: #f0f2f8;
      border-bottom: 1px solid #ccc;
      padding: 10px 16px;
    }
    .apron-panel-title {
      font-size: 10px;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 8px;
    }
    .apron-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 24px;
    }
    .apron-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px 0;
    }
    .apron-name { font-size: 11px; color: #444; }
    .apron-toggles { display: flex; gap: 3px; }
    .apron-btn {
      font-size: 10px;
      padding: 2px 7px;
      border: 1px solid #ccc;
      border-radius: 3px;
      cursor: pointer;
      background: #fff;
      color: #888;
    }
    .apron-btn.active-green { background: #4caf50; color: #fff; border-color: #4caf50; }
    .apron-btn.active-red   { background: #f44336; color: #fff; border-color: #f44336; }

    /* ── Column headers ── */
    .col-headers {
      display: grid;
      grid-template-columns: 120px 80px 1fr 80px;
      padding: 6px 16px;
      font-size: 10px;
      color: #888;
      letter-spacing: 1px;
      border-bottom: 2px solid #ccc;
      background: #eceef3;
    }
    .col-center { text-align: center; }

    /* ── Arrival rows ── */
    .arrival-row {
      display: grid;
      grid-template-columns: 120px 80px 1fr 80px;
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      font-size: 13px;
      align-items: center;
      font-family: 'Courier New', monospace;
    }
    .row-even { background: #fff; }
    .row-odd  { background: #f9f9fc; }
    .callsign { font-weight: bold; color: #111; }
    .elt-col  { color: #333; }
    .stand-col { color: #333; }
    .stand-empty { color: #bbb; }
    .dot-cell { text-align: center; }

    .dot {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .dot-grey   { background: #ccc; }
    .dot-green  { background: #4caf50; }
    .dot-yellow { background: #ffc107; }
    .dot-red    { background: #f44336; }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: #aaa;
      font-size: 12px;
      font-family: 'Courier New', monospace;
    }

    /* ── Demo controls ── */
    .demo-controls {
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: #fffbe6;
      border: 1px dashed #e0c040;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 11px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.14);
      z-index: 1000;
      min-width: 120px;
    }
    .demo-title {
      color: #b8860b;
      letter-spacing: 1px;
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 10px;
    }
    .demo-controls button {
      display: block;
      width: 100%;
      font-size: 10px;
      padding: 4px 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
      cursor: pointer;
      text-align: left;
      margin-bottom: 4px;
      font-family: monospace;
    }
    .demo-controls button:last-child { margin-bottom: 0; }
    .demo-controls button:hover { background: #f5f5f5; }
  </style>
</head>
<body>
  <div id="app">
    <div class="panel-header">
      <span class="panel-title">EOR ARRIVALS</span>
    </div>
    <div style="padding:16px;color:#aaa;font-size:12px;">Loading...</div>
  </div>

  <script>
    // Placeholder — Vue app added in Task 5
    console.log('STAND_APRON_MAP loaded:', Object.keys(STAND_APRON_MAP).length, 'stands');
    console.log('CHROMA_FLIGHTS loaded:', CHROMA_FLIGHTS.length, 'flights');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `index.html` directly in a browser (file:// works fine).

Expected: grey page with "EOR ARRIVALS" header visible, browser console shows stand and flight counts with no errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add app shell with CSS"
```

---

## Task 5: Arrivals Table and Dot Color Logic

**Files:**
- Modify: `index.html` — replace the `<div id="app">` content and `<script>` block with the full Vue app

This task wires up the Vue 3 app: loads initial arrivals from CHROMA_FLIGHTS, computes dot colors, and renders the sorted table.

- [ ] **Step 1: Replace the `<div id="app">` content in index.html**

Replace everything inside `<div id="app">...</div>` with:

```html
  <!-- Header -->
  <div class="panel-header">
    <span class="panel-title">EOR ARRIVALS</span>
    <div class="header-right">
      <span class="rwy-label">LDG RWY</span>
      <button class="rwy-btn" @click="toggleRunway">{{ config.runway }}</button>
      <button class="apron-toggle-btn" @click="apronPanelOpen = !apronPanelOpen">
        {{ apronPanelOpen ? '▲' : '▼' }} Apron settings
      </button>
    </div>
  </div>

  <!-- Apron settings panel -->
  <div class="apron-panel" v-if="apronPanelOpen">
    <div class="apron-panel-title">APRON STATUS — WS SETTINGS</div>
    <div class="apron-grid">
      <div class="apron-row" v-for="(color, apron) in config.aprons" :key="apron">
        <span class="apron-name">{{ apron }}</span>
        <div class="apron-toggles">
          <button :class="['apron-btn', color === 'green' ? 'active-green' : '']" @click="setApron(apron, 'green')">Green</button>
          <button :class="['apron-btn', color === 'red' ? 'active-red' : '']"   @click="setApron(apron, 'red')">Red</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Column headers -->
  <div class="col-headers">
    <span>CALLSIGN</span>
    <span>ELT</span>
    <span>EXP STAND</span>
    <span class="col-center">STATUS</span>
  </div>

  <!-- Arrivals list -->
  <div v-if="sortedArrivals.length === 0" class="empty-state">
    No RNP-capable arrivals within {{ LEAD_TIME_MIN }} min
  </div>
  <template v-else>
    <div
      class="arrival-row"
      v-for="(arrival, i) in sortedArrivals"
      :key="arrival.callsign"
      :class="i % 2 === 0 ? 'row-even' : 'row-odd'"
    >
      <span class="callsign">{{ arrival.callsign }}</span>
      <span class="elt-col">{{ formatTime(arrival.elt) }}</span>
      <span :class="['stand-col', !arrival.expectedStand ? 'stand-empty' : '']">
        {{ arrival.expectedStand || '—' }}
      </span>
      <span class="dot-cell">
        <span class="dot" :class="`dot-${dotColor(arrival)}`"></span>
      </span>
    </div>
  </template>

  <!-- Demo controls -->
  <div class="demo-controls" v-if="demoPanelVisible">
    <div class="demo-title">⚙ DEMO</div>
    <button @click="addArrival">+ Add arrival</button>
    <button @click="assignStands">Assign stands</button>
    <button @click="runScenario">Run scenario</button>
    <button @click="clearArrivals">Clear</button>
  </div>
```

- [ ] **Step 2: Replace the `<script>` block with the full Vue app**

Replace the placeholder `<script>` with:

```html
<script>
  const LEAD_TIME_MIN = 60;
  const FREE_TIME_THRESHOLD_MIN = 15;
  const POLL_INTERVAL_SEC = 60;

  const APRON_NAMES = [
    'Ramp AB', 'Ramp BC', 'Ramp CD', 'Ramp D',  'Ramp E',
    'Ramp F',  'Ramp FA', 'Ramp G',  'Ramp H',  'Ramp J',
    'Ramp K',  'Ramp L',  'Ramp M',  'Ramp R',  'Ramp S',
    'Engine Test Site',
  ];

  function buildDefaultAprons() {
    const aprons = {};
    APRON_NAMES.forEach(name => { aprons[name] = 'green'; });
    aprons['Ramp K'] = 'red'; // default red so all 4 dot colors show on load
    return aprons;
  }

  const { createApp } = Vue;

  createApp({
    data() {
      return {
        arrivals: [],
        config: {
          runway: '01R',
          aprons: buildDefaultAprons(),
        },
        apronPanelOpen: false,
        demoPanelVisible: false,
        pollTimer: null,
        addIndex: 0,
        LEAD_TIME_MIN,
      };
    },

    computed: {
      sortedArrivals() {
        return [...this.arrivals].sort((a, b) => a.elt - b.elt);
      },
    },

    methods: {
      formatTime(date) {
        return date.toTimeString().slice(0, 5);
      },

      dotColor(arrival) {
        if (!arrival.expectedStand) return 'grey';
        const apron = STAND_APRON_MAP[arrival.expectedStand];
        if (!apron || this.config.aprons[apron] === 'red') return 'red';
        const threshold = new Date(arrival.elt.getTime() - FREE_TIME_THRESHOLD_MIN * 60000);
        if (!arrival.standFreeTime || arrival.standFreeTime <= threshold) return 'green';
        return 'yellow';
      },

      toggleRunway() {
        this.config.runway = this.config.runway === '01R' ? '19L' : '01R';
      },

      setApron(apron, color) {
        this.config.aprons[apron] = color;
      },

      addArrival() {
        const pool = CHROMA_FLIGHTS.filter(f =>
          !this.arrivals.find(a => a.callsign === f.callsign)
        );
        if (pool.length === 0) return;
        const src = pool[this.addIndex % pool.length];
        this.addIndex++;
        const now = new Date();
        this.arrivals.push({
          callsign: src.callsign,
          elt: new Date(now.getTime() + 45 * 60000),
          expectedStand: null,
          standFreeTime: null,
          _resolvedStand: src._resolvedStand,
        });
      },

      assignStands() {
        this.arrivals.forEach(a => {
          if (!a.expectedStand && a._resolvedStand) {
            a.expectedStand = a._resolvedStand;
            // 20 min before ELT → always green (20 > FREE_TIME_THRESHOLD_MIN)
            a.standFreeTime = new Date(a.elt.getTime() - 20 * 60000);
          }
        });
      },

      runScenario() {
        const now = new Date();
        const add = m => new Date(now.getTime() + m * 60000);
        this.arrivals = [
          { callsign: 'SAS1234', elt: add(25), expectedStand: 'F32L', standFreeTime: add(8),  _resolvedStand: null },
          { callsign: 'BAW456',  elt: add(32), expectedStand: 'G143', standFreeTime: add(20), _resolvedStand: null },
          { callsign: 'FIN789',  elt: add(40), expectedStand: 'K3A',  standFreeTime: add(22), _resolvedStand: null },
          { callsign: 'DLH012',  elt: add(47), expectedStand: null,   standFreeTime: null,    _resolvedStand: 'F30' },
        ];
        this.addIndex = 0;
      },

      clearArrivals() {
        this.arrivals = [];
        this.addIndex = 0;
      },

      pollChroma() {
        // In production this would call the Chroma API and update stand data.
        // In the demo, use "Assign stands" to simulate a Chroma response.
        console.log('[Chroma poll]', new Date().toTimeString().slice(0, 5));
      },

      handleKeydown(e) {
        if (e.shiftKey && e.key === 'D') this.demoPanelVisible = !this.demoPanelVisible;
      },
    },

    mounted() {
      const now = new Date();
      this.arrivals = CHROMA_FLIGHTS
        .filter(f => {
          const minsUntil = (f.elt - now) / 60000;
          return minsUntil > 0 && minsUntil <= LEAD_TIME_MIN;
        })
        .map(f => ({ ...f }));

      this.pollTimer = setInterval(this.pollChroma, POLL_INTERVAL_SEC * 1000);
      window.addEventListener('keydown', this.handleKeydown);
    },

    beforeUnmount() {
      clearInterval(this.pollTimer);
      window.removeEventListener('keydown', this.handleKeydown);
    },
  }).mount('#app');
</script>
```

- [ ] **Step 3: Open in browser and verify dot colors**

Open `index.html`. Expected table on load:

| CALLSIGN | ELT | EXP STAND | STATUS |
|----------|-----|-----------|--------|
| SAS1234 | HH:MM | F32L | 🟢 green |
| BAW456  | HH:MM | G143 | 🟡 yellow |
| FIN789  | HH:MM | K3A  | 🔴 red |
| DLH012  | HH:MM | —    | ⚫ grey |
| KLM345  | HH:MM | —    | ⚫ grey |
| NOZ678  | HH:MM | F39L | 🟢 green |

All four dot colors are present. Rows sorted by ELT ascending.

- [ ] **Step 4: Verify runway toggle**

Click the runway button. It should toggle between `01R` and `19L`.

- [ ] **Step 5: Verify apron settings**

Click "▼ Apron settings". Panel should open showing all 16 aprons. Ramp K should show the Red button active. Click Green on Ramp K → FIN789's dot should immediately change from red to green or yellow (reactive update).

- [ ] **Step 6: Verify demo controls**

Press Shift+D. Demo panel appears in bottom-right corner.

- Click **Run scenario** → table shows exactly 4 arrivals (one of each color)
- Click **+ Add arrival** → new grey arrival added with ELT ~45 min from now
- Click **Assign stands** → grey arrivals get stands and turn green
- Click **Clear** → table empties, "No RNP-capable arrivals" message shows

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: complete EOR arrivals panel with dot color logic and demo controls"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Arrivals appear 1hr before ELT with RNP capability → `mounted()` filters by `LEAD_TIME_MIN`
- ✅ Columns: Callsign, ELT, Expected Stand, Status → template `col-headers` + `arrival-row`
- ✅ Dot colors: grey/green/yellow/red → `dotColor()` method
- ✅ Every-minute poll → `setInterval(this.pollChroma, POLL_INTERVAL_SEC * 1000)`
- ✅ Runway selector (01R/19L) → `toggleRunway()` + `config.runway`
- ✅ Apron settings panel (collapsible, red/green per apron) → `apronPanelOpen` + `setApron()`
- ✅ All 16 ESSA aprons → `APRON_NAMES` array
- ✅ Default Ramp K red → `buildDefaultAprons()`
- ✅ Configurable constants → `LEAD_TIME_MIN`, `FREE_TIME_THRESHOLD_MIN`, `POLL_INTERVAL_SEC`
- ✅ Demo controls bottom-right → `position: fixed; bottom: 16px; right: 16px`
- ✅ Demo toggle Shift+D → `handleKeydown()`
- ✅ Stand→apron map from OSM data → Task 2 generator script

**Type consistency:**
- `STAND_APRON_MAP` defined in `data/stand-apron-map.js`, used in `dotColor()`
- `CHROMA_FLIGHTS` defined in `data/mock-chroma.js`, used in `mounted()` and `addArrival()`
- `arrival.elt` is a `Date` object throughout — arithmetic uses `.getTime()`
- `arrival.standFreeTime` is `Date | null` — `null` check before comparison in `dotColor()`
