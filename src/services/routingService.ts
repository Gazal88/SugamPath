import { MAPS_CONFIG } from '../config/maps';
import { Coordinate, RouteResponse, RouteStep } from '../types/map';

export class RoutingService {
  /**
   * Fetches basic route geometries, distance, duration and steps from self-hosted OSRM.
   * @param start Starting coordinates
   * @param destination Destination coordinates
   */
  static async getRoute(start: Coordinate, destination: Coordinate): Promise<RouteResponse> {
    const url = `${MAPS_CONFIG.OSRM_BASE_URL}/route/v1/${MAPS_CONFIG.OSRM_PROFILE}/${start.longitude},${start.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OSRM server returned status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(data.message || 'No route found by OSRM');
      }

      const route = data.routes[0];
      
      // Parse coordinates (OSRM returns GeoJSON LineString [lng, lat] format)
      const coordinates: Coordinate[] = route.geometry.coordinates.map((coord: number[]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      // Parse route legs steps
      const steps: RouteStep[] = [];
      if (route.legs && route.legs[0] && route.legs[0].steps) {
        route.legs[0].steps.forEach((step: any) => {
          const maneuver = step.maneuver;
          const loc = maneuver?.location || [0, 0];
          
          // Generate dynamic fallback instruction if raw text is unavailable
          let instruction = maneuver?.instruction;
          if (!instruction) {
            const mType = maneuver?.type;
            const mModifier = maneuver?.modifier;
            if (mType === 'depart') {
              instruction = 'Start journey';
            } else if (mType === 'arrive') {
              instruction = 'Arrive at destination';
            } else if (mType) {
              const modifierText = mModifier ? ` ${mModifier}` : '';
              const typeText = mType.charAt(0).toUpperCase() + mType.slice(1);
              instruction = `${typeText}${modifierText}`;
            } else {
              instruction = 'Proceed';
            }
          }

          steps.push({
            instruction,
            distance: step.distance || 0,
            duration: step.duration || 0,
            coordinate: {
              latitude: loc[1],
              longitude: loc[0],
            },
            maneuverType: maneuver?.type,
            maneuverModifier: maneuver?.modifier,
          });
        });
      }

      return {
        coordinates,
        distance: route.distance || 0,
        duration: route.duration || 0,
        steps,
      };
    } catch (error) {
      console.error('Error fetching route from OSRM:', error);
      throw error;
    }
  }
}
