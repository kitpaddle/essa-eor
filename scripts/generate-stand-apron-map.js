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
