import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NativeMapView, { UrlTile, Marker, Polyline, MapViewProps } from 'react-native-maps';
import { color, radius, space, type } from '../theme/tokens';
import { Coordinate, MapLocation } from '../types/map';
import { MAPS_CONFIG } from '../config/maps';

interface MapViewPropsExtended extends MapViewProps {
  locations?: MapLocation[];
  routeCoordinates?: Coordinate[];
  selectedLocation?: MapLocation | null;
  onMarkerPress?: (location: MapLocation) => void;
  centerCoordinate?: Coordinate | null;
}

export function MapView({
  locations = [],
  routeCoordinates = [],
  selectedLocation = null,
  onMarkerPress,
  centerCoordinate = null,
  style,
  ...rest
}: MapViewPropsExtended) {
  const mapRef = useRef<NativeMapView>(null);

  // Animate the map focus when the center coordinate changes
  useEffect(() => {
    if (centerCoordinate && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: centerCoordinate.latitude,
        longitude: centerCoordinate.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 800);
    }
  }, [centerCoordinate]);

  return (
    <View style={[styles.container, style]}>
      <NativeMapView
        ref={mapRef}
        style={styles.map}
        provider={null} // Force standard native maps container rather than Google Maps API
        mapType="none" // Hides Apple Maps/Google Maps vector layers completely
        initialRegion={MAPS_CONFIG.DEFAULT_REGION}
        rotateEnabled={true}
        pitchEnabled={false}
        showsUserLocation={false}
        {...rest}
      >
        {/* OpenStreetMap Tile Layer */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          minimumZ={1}
          flipY={false}
          shouldReplaceMapContent={true} // Replaces default Android vector layers
        />

        {/* Route Polyline overlay */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4.5}
            strokeColor={color.blue}
            lineJoin="round"
            lineDashPattern={undefined}
          />
        )}

        {/* Location Markers */}
        {locations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          return (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              onPress={() => onMarkerPress?.(loc)}
              title={loc.name}
              description={loc.address}
              pinColor={isSelected ? color.blue : color.accent}
            />
          );
        })}
      </NativeMapView>

      {/* Required OpenStreetMap Attribution Overlay */}
      <View style={styles.attributionContainer} pointerEvents="none">
        <Text style={styles.attributionText}>
          © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: space.xs,
    right: space.xs,
    backgroundColor: 'rgba(251, 250, 246, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 0.5,
    borderColor: color.lineStrong,
  },
  attributionText: {
    fontFamily: type.caption.fontFamily,
    fontSize: 9,
    color: color.inkSoft,
  },
});
