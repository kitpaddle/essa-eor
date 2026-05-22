// Mock Chroma gate API data for ESSA EOR demo.
// Times are offsets in minutes from app load time (_T0).
// _resolvedStand = what Chroma returns when polled (simulated by "Assign stands" button).

const _T0 = new Date();
const _add = (m) => new Date(_T0.getTime() + m * 60000);

const CHROMA_FLIGHTS = [
  // --- Within 60-min window on load ---
  // GREEN: Ramp F green, free 17 min before ELT
  { callsign: 'SAS1234', elt: _add(25), expectedStand: 'F32L', standFreeTime: _add(8),  _resolvedStand: null,   rnpCapable: true  },
  // YELLOW: Ramp G green, free only 12 min before ELT
  { callsign: 'BAW456',  elt: _add(32), expectedStand: 'G143', standFreeTime: _add(20), _resolvedStand: null,   rnpCapable: true  },
  // Non-RNP: no dot shown
  { callsign: 'TOM123',  elt: _add(36), expectedStand: null,   standFreeTime: null,     _resolvedStand: 'F34',  rnpCapable: false },
  // RED: Ramp K is red by default
  { callsign: 'FIN789',  elt: _add(40), expectedStand: 'K3A',  standFreeTime: _add(22), _resolvedStand: null,   rnpCapable: true  },
  // GREY: no stand assigned yet
  { callsign: 'DLH012',  elt: _add(47), expectedStand: null,   standFreeTime: null,     _resolvedStand: 'F30',  rnpCapable: true  },
  // Non-RNP: no dot shown
  { callsign: 'VLG890',  elt: _add(50), expectedStand: null,   standFreeTime: null,     _resolvedStand: null,   rnpCapable: false },
  { callsign: 'KLM345',  elt: _add(53), expectedStand: null,   standFreeTime: null,     _resolvedStand: 'G145', rnpCapable: true  },
  // GREEN: Ramp F green, free 20 min before ELT
  { callsign: 'NOZ678',  elt: _add(58), expectedStand: 'F39L', standFreeTime: _add(38), _resolvedStand: null,   rnpCapable: true  },

  // --- Pool for "+ Add arrival" button (ELT outside 60-min window on load) ---
  { callsign: 'AFR234',  elt: _add(75),  expectedStand: null, standFreeTime: null, _resolvedStand: 'F36L', rnpCapable: true  },
  { callsign: 'SWR901',  elt: _add(80),  expectedStand: null, standFreeTime: null, _resolvedStand: 'K5L',  rnpCapable: true  },
  { callsign: 'THY567',  elt: _add(85),  expectedStand: null, standFreeTime: null, _resolvedStand: 'G142', rnpCapable: false },
  { callsign: 'WZZ890',  elt: _add(90),  expectedStand: null, standFreeTime: null, _resolvedStand: 'F28R', rnpCapable: true  },
  { callsign: 'EZY123',  elt: _add(95),  expectedStand: null, standFreeTime: null, _resolvedStand: 'M7',   rnpCapable: true  },
  { callsign: 'RYR456',  elt: _add(100), expectedStand: null, standFreeTime: null, _resolvedStand: 'S72',  rnpCapable: false },
];
