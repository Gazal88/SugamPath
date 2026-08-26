// Mock route data shaped to match what Role 3 (Maps & Routing) will eventually return
// from OSRM/GraphHopper: a polyline (list of lat/lng, used later for the real map) plus
// a turn-by-turn step list annotated with the accessibility reason a step was chosen —
// this "reason" field is what makes the route feel accessibility-aware rather than just
// a normal maps app, so keep it when the real API contract gets negotiated.

export type RouteStep = {
  id: string;
  instruction: string;
  distanceM: number;
  icon: string; // MaterialCommunityIcons name
  accessNote?: string; // why this path was chosen over a shorter one, if relevant
};

export type Route = {
  id: string;
  destinationName: string;
  distanceLabel: string;
  durationLabel: string;
  accessScore: number;
  steps: RouteStep[];
};

export const mockRoute: Route = {
  id: 'route-1',
  destinationName: 'Central Library',
  distanceLabel: '850 m',
  durationLabel: '14 min',
  accessScore: 82,
  steps: [
    { id: 's1', instruction: 'Head north on MG Road', distanceM: 220, icon: 'arrow-up-bold' },
    {
      id: 's2',
      instruction: 'Cross at the signal with tactile paving',
      distanceM: 40,
      icon: 'road-variant',
      accessNote: 'Chosen over the nearer crossing, which has no tactile path',
    },
    { id: 's3', instruction: 'Turn right onto Civil Lines Road', distanceM: 310, icon: 'arrow-right-bold' },
    {
      id: 's4',
      instruction: 'Use the ramp beside the main stairs',
      distanceM: 15,
      icon: 'wheelchair-accessibility',
      accessNote: 'Verified working ramp, 3 days ago',
    },
    { id: 's5', instruction: 'Arrive at Central Library entrance', distanceM: 5, icon: 'flag-checkered' },
  ],
};
