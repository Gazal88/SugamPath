export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapLocation {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  ramp_available: boolean | null;
  ramp_usable: boolean | null;
  elevator_available: boolean | null;
  elevator_working: boolean | null;
  accessible_washroom: boolean | null;
  wheelchair_entrance: boolean | null;
  accessible_parking: boolean | null;
  tactile_paving: boolean | null;
  surface_quality: string | null;
  door_width_cm: number | null;
  handrails: boolean | null;
  created_at: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinate: Coordinate;
  maneuverType?: string;
  maneuverModifier?: string;
}

export interface RouteResponse {
  coordinates: Coordinate[];
  distance: number;
  duration: number;
  steps: RouteStep[];
}
