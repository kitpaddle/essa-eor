# ESSA EOR Arrival Management Tool — Design Spec

**Date:** 2026-05-22

---

## Background

ESSA operates an EOR (Early Off Runway) procedure where select arrivals land on the parallel runway via a curved RNP approach, simultaneously with ILS traffic on the main runway. Constraints:

- Maximum 5 EOR per hour
- Only RNP-capable aircraft are eligible (capability listed in flight plan equipment)
- After landing, the aircraft must taxi to its stand — certain aprons create taxi conflicts depending on the active runway and ramp traffic flow

**Today's workflow:**
1. WS checks the IRIS list for RNP-capable arrivals
2. WS manually cross-references Chroma (gate allocation system) to check expected stand and gate free time
3. WS calls APP to approve/reject each candidate
4. APP selects EOR aircraft and calls TWR (unchanged — out of scope)

**Problem:** Steps 1–3 are time-consuming and require repeated phone coordination between WS and APP.

**Solution:** Extend the existing IRIS list with automated Chroma lookups and a simple apron status configuration, so APP can read the dot color and act without calling WS.

---

## Users

| User | Role |
|------|------|
| APP ATCO | Reads the list; uses dot color to decide EOR candidates; still calls TWR as today |
| Watch Supervisor (WS) | Sets landing runway and apron colors; no longer manually checks gates |
| TWR ATCO | Receives APP call as today — completely unaffected |

One unified HMI, same view for all users. WS is the one who adjusts settings in practice.

---

## Data Model

### Arrival

```
{
  callsign: string,       // e.g. "SAS456"
  elt: string,            // expected landing time, HH:MM
  expectedStand: string | null,  // e.g. "F32L", null if not yet assigned
  apron: string | null,   // derived from stand via OSM spatial lookup
  standFreeTime: string | null,  // HH:MM when stand expected to be free
  dotColor: 'grey' | 'green' | 'yellow' | 'red'
}
```

### Config

```
{
  runway: '01R' | '19L',
  aprons: { [apronName]: 'green' | 'red' },
  leadTimeMinutes: 60,       // how early arrivals appear (configurable)
  freeTimeThresholdMinutes: 15,  // stand must be free this many min before ELT
  pollIntervalSeconds: 60
}
```

---

## Dot Color Logic

```
if (expectedStand == null)         → grey   (Chroma hasn't returned data yet)
else if (apron is red)             → red    (WS flagged this apron)
else if (standFreeTime <= ELT - 15min) → green
else                               → yellow (stand not free early enough)
```

A stand already free at query time is treated as free time = now → green.

---

## UI Layout

### Main panel (IRIS window)

**Header bar:**
- Left: "EOR ARRIVALS" label
- Right: "LDG RWY" + toggle button (01R / 19L) + "▼ Apron settings" collapsible trigger

**Apron settings panel** (collapsed by default):
- Grid of all ESSA aprons, each with a Red/Green toggle
- Aprons: Ramp AB, BC, CD, D, E, F, FA, G, H, J, K, L, M, R, S, Engine Test Site

**Arrivals table:**

| CALLSIGN | ELT | EXP STAND | STATUS |
|----------|-----|-----------|--------|
| SAS456 | 14:32 | F32L | 🟢 |
| NOZ123 | 14:38 | — | ⚫ |
| FIN002 | 14:45 | K3A | 🔴 |
| BAW789 | 14:51 | G143 | 🟡 |

Status column shows solid filled circle (28px), light theme.

Rows sorted by ELT ascending. Only RNP-capable arrivals shown.

### Demo controls (floating, bottom-right corner)

Small panel, toggleable with Shift+D, dashed yellow border:
- **+ Add arrival** — appends a new mock arrival with grey dot
- **Assign stands** — simulates Chroma returning stand data for all grey-dot arrivals
- **Run scenario** — populates list with one of each dot color for a full demo
- **Clear** — removes all arrivals

---

## Stand → Apron Mapping

Derived at build time from `essa_osm_aeroway.geojson` (OSM data). Each stand (parking_position) is spatially matched to the apron polygon it falls within. Output is a static JS lookup object bundled with the app:

```js
const STAND_APRON = {
  "F32L": "Ramp F",
  "K3A": "Ramp K",
  "G143": "Ramp G",
  // ...all 295 stands
}
```

---

## Mock Chroma Data

Bundled as `mock-chroma.js`. Contains a list of realistic flight scenarios with:
- Callsign (real airline codes + random flight numbers)
- ELT (relative to "now" + offset minutes)
- Stand assignment (drawn from ESSA stand list)
- Stand free time (randomised around ELT ± 30 min)

The mock is static — no server required.

---

## Tech Stack

- **Vue 3** via CDN (no build step)
- **Single HTML file** (`index.html`) + `mock-chroma.js` + `stand-apron-map.js`
- No backend, no bundler
- Runs by opening `index.html` in a browser

---

## Configurable Parameters

All defined as constants at the top of the app, easy to change:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `LEAD_TIME_MIN` | 60 | Minutes before ELT when arrival appears |
| `FREE_TIME_THRESHOLD_MIN` | 15 | Minutes before ELT stand must be free for green |
| `POLL_INTERVAL_SEC` | 60 | How often Chroma is re-queried |

---

## Out of Scope

- APP → TWR coordination call (unchanged, not part of this tool)
- 5/hour EOR counter (APP tracks mentally)
- Authentication / role separation (WS and APP share one view)
- Real Chroma API integration (demo uses mock data)
