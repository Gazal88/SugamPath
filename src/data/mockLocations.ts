// Mock data shaped to match the location/score API contract.
// IMPORTANT: when Role 2 (Backend) ships real endpoints in week 5-6, this shape
// should not need to change — only the fetch call swaps from mock to live.
// Confirm this shape with Backend + Maps/Routing before week 3-4 screens solidify.

export type AccessParam = {
  key: string;
  label: string;
  icon: string; // @expo/vector-icons MaterialCommunityIcons name
  delta: number; // positive or negative score contribution
};

export type Location = {
  id: string;
  name: string;
  area: string;
  score: number; // 0-100
  verifiedLabel: string;
  summary: string;
  tags: string[];
  params: AccessParam[];
};

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'City Metro Station',
    area: 'Sector 17, near Bus Terminal',
    score: 88,
    verifiedLabel: 'Verified today',
    summary: 'Fully accessible entrance and platform. Tactile path leads directly from the gate to the lift.',
    tags: ['Ramp', 'Lift', 'Tactile path'],
    params: [
      { key: 'ramp', label: 'Ramp available', icon: 'wheelchair-accessibility', delta: 30 },
      { key: 'lift', label: 'Working lift', icon: 'elevator-passenger', delta: 20 },
      { key: 'washroom', label: 'Accessible washroom', icon: 'toilet', delta: 15 },
      { key: 'entrance', label: 'Wide entrance', icon: 'door-open', delta: 15 },
      { key: 'pathway', label: 'Good pathway surface', icon: 'road-variant', delta: 8 },
    ],
  },
  {
    id: 'loc-2',
    name: 'Central Library',
    area: 'Civil Lines, near Bus Stand',
    score: 61,
    verifiedLabel: 'Verified 3 days ago',
    summary: 'Moderately accessible. Entrance ramp and washroom are usable; lift is currently reported broken.',
    tags: ['Ramp', 'Lift under repair'],
    params: [
      { key: 'ramp', label: 'Ramp available', icon: 'wheelchair-accessibility', delta: 30 },
      { key: 'lift', label: 'Broken lift', icon: 'elevator-passenger-off', delta: -25 },
      { key: 'washroom', label: 'Accessible washroom', icon: 'toilet', delta: 15 },
      { key: 'entrance', label: 'Wide entrance', icon: 'door-open', delta: 15 },
      { key: 'pathway', label: 'Uneven pathway surface', icon: 'road-variant', delta: -10 },
    ],
  },
  {
    id: 'loc-3',
    name: 'Civic Hospital OPD',
    area: 'MG Road',
    score: 92,
    verifiedLabel: 'Verified today',
    summary: 'Full access across entrance, corridors, and washrooms. Volunteer desk available for guidance.',
    tags: ['Full access', 'Verified today'],
    params: [
      { key: 'ramp', label: 'Ramp available', icon: 'wheelchair-accessibility', delta: 30 },
      { key: 'lift', label: 'Working lift', icon: 'elevator-passenger', delta: 20 },
      { key: 'washroom', label: 'Accessible washroom', icon: 'toilet', delta: 15 },
      { key: 'entrance', label: 'Wide entrance', icon: 'door-open', delta: 15 },
      { key: 'signage', label: 'Clear signage', icon: 'sign-direction', delta: 12 },
    ],
  },
];

export type LiveReport = {
  id: string;
  title: string;
  meta: string;
  kind: 'warning' | 'resolved';
};

export const mockLiveReports: LiveReport[] = [
  { id: 'r1', title: 'Ramp blocked — Sector 12 Market', meta: 'Reported 20 min ago · 4 upvotes', kind: 'warning' },
  { id: 'r2', title: 'Lift restored — District Court', meta: 'Verified 1 hr ago by NGO Sahayak', kind: 'resolved' },
];
