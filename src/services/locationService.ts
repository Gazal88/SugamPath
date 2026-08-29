import { MAPS_CONFIG } from '../config/maps';
import { MapLocation } from '../types/map';

export class LocationService {
  /**
   * Validates if a set of latitude and longitude coordinates falls within standard geographic limits.
   * @param lat Latitude (-90 to 90)
   * @param lng Longitude (-180 to 180)
   */
  static isValidCoordinate(lat: number | null | undefined, lng: number | null | undefined): boolean {
    if (lat === null || lat === undefined || isNaN(lat)) return false;
    if (lng === null || lng === undefined || isNaN(lng)) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  /**
   * Fetches all locations from the Backend Locations API and filters out entries with invalid coordinates.
   */
  static async fetchLocations(): Promise<MapLocation[]> {
    const url = `${MAPS_CONFIG.BACKEND_BASE_URL}/api/locations`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Backend Locations API returned status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Malformed API response: expected an array of locations');
      }

      // Normalize and validate each location
      const normalizedLocations: MapLocation[] = [];

      for (const item of data) {
        // Safe conversion of string coordinates if they come as strings
        const lat = typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
        const lng = typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;

        if (!this.isValidCoordinate(lat, lng)) {
          console.warn(`LocationService: Skipping malformed location ID ${item.id || 'unknown'} due to invalid coordinates (${item.latitude}, ${item.longitude})`);
          continue;
        }

        // Map and preserve all relevant fields exactly as returned by Supabase
        normalizedLocations.push({
          id: String(item.id),
          name: String(item.name || 'Unnamed Location'),
          category: String(item.category || 'General'),
          address: String(item.address || ''),
          latitude: lat,
          longitude: lng,
          ramp_available: item.ramp_available ?? null,
          ramp_usable: item.ramp_usable ?? null,
          elevator_available: item.elevator_available ?? null,
          elevator_working: item.elevator_working ?? null,
          accessible_washroom: item.accessible_washroom ?? null,
          wheelchair_entrance: item.wheelchair_entrance ?? null,
          accessible_parking: item.accessible_parking ?? null,
          tactile_paving: item.tactile_paving ?? null,
          surface_quality: item.surface_quality ? String(item.surface_quality) : null,
          door_width_cm: item.door_width_cm ? Number(item.door_width_cm) : null,
          handrails: item.handrails ?? null,
          created_at: String(item.created_at || new Date().toISOString()),
        });
      }

      return normalizedLocations;
    } catch (error) {
      console.error('Error fetching locations from backend:', error);
      throw error;
    }
  }
}
