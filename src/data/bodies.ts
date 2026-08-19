export interface Body {
  id: string;
  name: string;
  epithet: string;
  kind: "Terrestrial Planet" | "Gas Giant" | "Ice Giant" | "G-type Star";
  /** surface palette */
  hi: string;
  base: string;
  deep: string;
  glow: string;
  accent: string;
  /** real figures */
  diameterKm: number;
  distanceMKm: number | null;
  au: number | null;
  periodDays: number | null;
  periodLabel: string;
  dayLength: string;
  tempC: number | null;
  tempNote: string;
  moons: number | null;
  fact: string;
  /** visual layout on the orrery (distance not to scale) */
  orbitFrac: number;
  visualR: number;
  angle0: number;
  hasRings?: boolean;
  bands?: boolean;
  spot?: boolean;
  hasMoon?: boolean;
}

export const SUN: Body = {
  id: "sun",
  name: "Sun",
  epithet:
    "From Old English “sunne” — the gravitational anchor everything else falls around.",
  kind: "G-type Star",
  hi: "#fff7dc",
  base: "#ffd98a",
  deep: "#f08a2e",
  glow: "#ffb84d",
  accent: "#ffc86b",
  diameterKm: 1392700,
  distanceMKm: null,
  au: null,
  periodDays: null,
  periodLabel: "230M yr (galactic)",
  dayLength: "≈ 27 Earth days",
  tempC: 5505,
  tempNote: "surface",
  moons: null,
  fact: "The Sun holds 99.86% of all mass in the Solar System — the eight planets, every moon and every comet share the remaining 0.14%.",
  orbitFrac: 0,
  visualR: 0,
  angle0: 0,
};

export const PLANETS: Body[] = [
  {
    id: "mercury",
    name: "Mercury",
    epithet: "Named for Rome's winged messenger — fitting for the swiftest planet.",
    kind: "Terrestrial Planet",
    hi: "#efe6d6",
    base: "#c7bba8",
    deep: "#75695a",
    glow: "#e0d4c0",
    accent: "#cbbba4",
    diameterKm: 4879,
    distanceMKm: 57.9,
    au: 0.39,
    periodDays: 88,
    periodLabel: "88 days",
    dayLength: "59 Earth days",
    tempC: 167,
    tempNote: "mean",
    moons: 0,
    fact: "One solar day on Mercury — sunrise to sunrise — lasts 176 Earth days. A single day there spans two full Mercurian years.",
    orbitFrac: 0.155,
    visualR: 6.5,
    angle0: 5.8,
  },
  {
    id: "venus",
    name: "Venus",
    epithet: "Named for the Roman goddess of love — the brightest natural point in our night sky.",
    kind: "Terrestrial Planet",
    hi: "#fbe9c0",
    base: "#f0ce93",
    deep: "#a8783a",
    glow: "#f7dcab",
    accent: "#edc488",
    diameterKm: 12104,
    distanceMKm: 108.2,
    au: 0.72,
    periodDays: 225,
    periodLabel: "225 days",
    dayLength: "243 Earth days",
    tempC: 464,
    tempNote: "mean",
    moons: 0,
    fact: "Venus spins backwards, so its Sun rises in the west — and one Venusian day is longer than its entire year.",
    orbitFrac: 0.278,
    visualR: 9.3,
    angle0: 2.2,
  },
  {
    id: "earth",
    name: "Earth",
    epithet: "From Old English “ertha”, the ground — the only planet not named after a deity.",
    kind: "Terrestrial Planet",
    hi: "#bfe0f8",
    base: "#6fb1e8",
    deep: "#1e4e8c",
    glow: "#8cc4f0",
    accent: "#7fc0f0",
    diameterKm: 12756,
    distanceMKm: 149.6,
    au: 1,
    periodDays: 365.25,
    periodLabel: "365.25 days",
    dayLength: "23.9 hours",
    tempC: 15,
    tempNote: "mean",
    moons: 1,
    fact: "Earth is the only world known to harbour life — 71% of its surface is ocean, shielded by a magnetic field and a single large moon.",
    orbitFrac: 0.342,
    visualR: 9.6,
    angle0: 0.6,
    hasMoon: true,
  },
  {
    id: "mars",
    name: "Mars",
    epithet: "Named for the Roman god of war, after its blood-red iron-oxide deserts.",
    kind: "Terrestrial Planet",
    hi: "#f2a57e",
    base: "#e07b52",
    deep: "#8c3b22",
    glow: "#eb9468",
    accent: "#e88b60",
    diameterKm: 6792,
    distanceMKm: 227.9,
    au: 1.52,
    periodDays: 687,
    periodLabel: "687 days",
    dayLength: "24.6 hours",
    tempC: -63,
    tempNote: "mean",
    moons: 2,
    fact: "Mars carries Olympus Mons — a volcano three times the height of Everest and roughly the area of Arizona, the tallest in the Solar System.",
    orbitFrac: 0.423,
    visualR: 7.5,
    angle0: 3.9,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    epithet: "King of the Roman gods — this one world outweighs all other planets combined.",
    kind: "Gas Giant",
    hi: "#f2d7ac",
    base: "#e0b183",
    deep: "#96602e",
    glow: "#ecc396",
    accent: "#e4b98a",
    diameterKm: 142984,
    distanceMKm: 778.6,
    au: 5.2,
    periodDays: 4333,
    periodLabel: "11.9 years",
    dayLength: "9.9 hours",
    tempC: -108,
    tempNote: "cloud tops",
    moons: 95,
    fact: "The Great Red Spot is a storm wider than Earth that has been raging for at least 350 years — and it is slowly shrinking.",
    orbitFrac: 0.66,
    visualR: 25,
    angle0: 5.0,
    bands: true,
    spot: true,
  },
  {
    id: "saturn",
    name: "Saturn",
    epithet: "Named for the Roman god of sowing and harvest — father of Jupiter.",
    kind: "Gas Giant",
    hi: "#f7e7c0",
    base: "#ebd3a0",
    deep: "#a8854c",
    glow: "#f0ddb2",
    accent: "#ecd7a6",
    diameterKm: 120536,
    distanceMKm: 1433.5,
    au: 9.58,
    periodDays: 10759,
    periodLabel: "29.4 years",
    dayLength: "10.7 hours",
    tempC: -139,
    tempNote: "cloud tops",
    moons: 146,
    fact: "Saturn's mean density is lower than water — given a big enough bathtub, the ringed giant would float.",
    orbitFrac: 0.78,
    visualR: 23.5,
    angle0: 1.2,
    bands: true,
    hasRings: true,
  },
  {
    id: "uranus",
    name: "Uranus",
    epithet: "The Greek primordial god of the sky — father of Saturn, grandfather of Jupiter.",
    kind: "Ice Giant",
    hi: "#d8f4f4",
    base: "#a8e0e4",
    deep: "#4e98a6",
    glow: "#bdecee",
    accent: "#a9e2e6",
    diameterKm: 51118,
    distanceMKm: 2872.5,
    au: 19.2,
    periodDays: 30687,
    periodLabel: "84 years",
    dayLength: "17.2 hours",
    tempC: -195,
    tempNote: "cloud tops",
    moons: 28,
    fact: "Uranus rolls around the Sun on its side, tilted 98° — likely knocked over by a colossal ancient collision.",
    orbitFrac: 0.912,
    visualR: 16.8,
    angle0: 2.9,
  },
  {
    id: "neptune",
    name: "Neptune",
    epithet: "Roman god of the sea — a match for its deep, storm-lashed azure.",
    kind: "Ice Giant",
    hi: "#b9c9f6",
    base: "#7a97e8",
    deep: "#2e4aa0",
    glow: "#93adf0",
    accent: "#86a2f0",
    diameterKm: 49528,
    distanceMKm: 4495.1,
    au: 30.05,
    periodDays: 60190,
    periodLabel: "164.8 years",
    dayLength: "16.1 hours",
    tempC: -201,
    tempNote: "cloud tops",
    moons: 16,
    fact: "Neptune's winds top 2,000 km/h — the fastest in the Solar System — whipped up despite receiving 900× less sunlight than Earth.",
    orbitFrac: 1,
    visualR: 16.4,
    angle0: 4.4,
  },
];

export const ALL_BODIES: Body[] = [SUN, ...PLANETS];

export const bodyById = (id: string | null): Body | null =>
  id ? ALL_BODIES.find((b) => b.id === id) ?? null : null;

export const EARTH_DIAMETER = 12756;
export const JUPITER_DIAMETER = 142984;

export const fmtNum = (n: number): string => n.toLocaleString("en-US");

export const fmtTemp = (t: number): string =>
  `${t > 0 ? "" : "−"}${fmtNum(Math.abs(t))}°C`;

export const BASE_DAYS_PER_SEC = 15;
export const SPEEDS = [1, 2, 5, 10, 25, 50];
