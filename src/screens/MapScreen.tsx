import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space, type, MIN_TAP_TARGET } from '../theme/tokens';
import { MapView } from '../components/MapView';
import { LocationService } from '../services/locationService';
import { RoutingService } from '../services/routingService';
import { MapLocation, RouteResponse } from '../types/map';
import { MAPS_CONFIG } from '../config/maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export function MapScreen({ navigation }: Props) {
  // Locations states
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Focus & Selection states
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [centerCoordinate, setCenterCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);

  // Routing states
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [routingLoading, setRoutingLoading] = useState<boolean>(false);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  // Load locations from the backend
  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LocationService.fetchLocations();
      setLocations(data);
      if (data.length === 0) {
        setError('No locations found in the backend.');
      }
    } catch (err: any) {
      setError('Unable to reach database server. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // Request OSRM route from a standard starting coordinate (configured Bhopal default demo center) to the selected place.
  // Note: This start coordinate serves as a placeholder / development start point, not the user's live GPS location.
  const handleCalculateRoute = async () => {
    if (!selectedLocation) return;
    
    setRoutingLoading(true);
    setRoutingError(null);
    setRoute(null);

    // Using the centralized DEFAULT_REGION coordinates as start position
    const startPoint = {
      latitude: MAPS_CONFIG.DEFAULT_REGION.latitude,
      longitude: MAPS_CONFIG.DEFAULT_REGION.longitude,
    };

    const destPoint = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    try {
      const calculatedRoute = await RoutingService.getRoute(startPoint, destPoint);
      setRoute(calculatedRoute);
    } catch (err: any) {
      setRoutingError('OSRM routing server is offline or route cannot be computed.');
    } finally {
      setRoutingLoading(false);
    }
  };

  const handleMarkerSelect = (location: MapLocation) => {
    setSelectedLocation(location);
    setCenterCoordinate({ latitude: location.latitude, longitude: location.longitude });
    // Reset route when selecting a new marker
    setRoute(null);
    setRoutingError(null);
    setShowSteps(false);
  };

  const handleClearRoute = () => {
    setRoute(null);
    setRoutingError(null);
    setShowSteps(false);
  };

  // Convert distance in meters to a clean display string
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Convert duration in seconds to a clean display string
  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs} hr ${remainingMins} mins`;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Map Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={18} color={color.ink} />
        </Pressable>
        <Text style={type.h2}>Accessibility Map</Text>
      </View>

      {/* Main Map Area */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={color.ink} />
            <Text style={[type.body, styles.loadingText]}>Loading locations...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons name="cloud-off-outline" size={48} color={color.red} />
            <Text style={[type.bodyMedium, styles.errorText]}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadLocations}>
              <Text style={styles.retryText}>Retry Fetching</Text>
            </Pressable>
          </View>
        ) : (
          <MapView
            locations={locations}
            routeCoordinates={route ? route.coordinates : []}
            selectedLocation={selectedLocation}
            onLocationMarkerPress={handleMarkerSelect}
            centerCoordinate={centerCoordinate}
          />
        )}

        {/* Selected Location Details Panel */}
        {selectedLocation && (
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={type.h2}>{selectedLocation.name}</Text>
                <Text style={type.caption}>{selectedLocation.category} • {selectedLocation.address}</Text>
              </View>
              <Pressable 
                onPress={() => setSelectedLocation(null)}
                style={styles.closeButton}
                accessibilityLabel="Close place card"
              >
                <Ionicons name="close" size={18} color={color.ink} />
              </Pressable>
            </View>

            {/* Accessibility features checklist summary (read-only flags) */}
            <View style={styles.featuresRow}>
              {selectedLocation.ramp_available && (
                <View style={styles.featureBadge}>
                  <MaterialCommunityIcons name="wheelchair-accessibility" size={14} color={color.green} />
                  <Text style={styles.featureText}>Ramp</Text>
                </View>
              )}
              {selectedLocation.elevator_available && (
                <View style={styles.featureBadge}>
                  <MaterialCommunityIcons name="elevator-passenger" size={14} color={color.green} />
                  <Text style={styles.featureText}>Lift</Text>
                </View>
              )}
              {selectedLocation.accessible_washroom && (
                <View style={styles.featureBadge}>
                  <MaterialCommunityIcons name="toilet" size={14} color={color.green} />
                  <Text style={styles.featureText}>Washroom</Text>
                </View>
              )}
            </View>

            {/* Routing operations block */}
            <View style={styles.routingSection}>
              {routingLoading ? (
                <View style={styles.routingStatus}>
                  <ActivityIndicator size="small" color={color.ink} />
                  <Text style={[type.caption, { marginLeft: space.sm }]}>Querying OSRM server...</Text>
                </View>
              ) : routingError ? (
                <View style={styles.routingErrorContainer}>
                  <Text style={styles.routingErrorText}>{routingError}</Text>
                  <Pressable style={styles.actionButtonOutline} onPress={handleCalculateRoute}>
                    <Text style={[type.bodyMedium, { color: color.ink }]}>Retry Route</Text>
                  </Pressable>
                </View>
              ) : route ? (
                <View>
                  <Text style={[type.caption, { marginBottom: space.xs, fontStyle: 'italic', color: color.blue }]}>
                    Route from Bhopal Map Center (Demo Start)
                  </Text>
                  <View style={styles.routeStatsRow}>
                    <View style={styles.statBox}>
                      <Text style={type.caption}>Distance</Text>
                      <Text style={type.score}>{formatDistance(route.distance)}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={type.caption}>Time (Estimate)</Text>
                      <Text style={type.score}>{formatDuration(route.duration)}</Text>
                    </View>
                  </View>

                  {/* Toggle Steps instructions */}
                  <Pressable style={styles.stepsToggle} onPress={() => setShowSteps(!showSteps)}>
                    <Ionicons name={showSteps ? "chevron-up" : "chevron-down"} size={16} color={color.blue} />
                    <Text style={[type.bodyMedium, { color: color.blue }]}>
                      {showSteps ? "Hide Turn-by-Turn Steps" : "Show Turn-by-Turn Steps"}
                    </Text>
                  </Pressable>

                  {showSteps && (
                    <ScrollView style={styles.stepsList} contentContainerStyle={{ paddingBottom: space.md }}>
                      {route.steps.map((step, idx) => (
                        <View key={idx} style={styles.stepItem}>
                          <Text style={styles.stepNum}>{idx + 1}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={type.body}>{step.instruction}</Text>
                            <Text style={type.caption}>({formatDistance(step.distance)})</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  <Pressable style={[styles.actionButton, { backgroundColor: color.red }]} onPress={handleClearRoute}>
                    <Text style={[type.bodyMedium, { color: color.white }]}>Clear Route</Text>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Text style={[type.caption, { marginBottom: space.xs, fontStyle: 'italic', textAlign: 'center' }]}>
                    Route starts from default Bhopal demo center
                  </Text>
                  <Pressable style={styles.actionButton} onPress={handleCalculateRoute}>
                    <MaterialCommunityIcons name="directions" size={18} color={color.accentInk} style={{ marginRight: space.xs }} />
                    <Text style={[type.bodyMedium, { color: color.accentInk }]}>Calculate Foot Route</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
    backgroundColor: color.paper,
  },
  backButton: {
    width: MIN_TAP_TARGET - 14,
    height: MIN_TAP_TARGET - 14,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
    backgroundColor: color.paper,
  },
  loadingText: {
    marginTop: space.md,
    color: color.inkSoft,
  },
  errorText: {
    marginTop: space.md,
    marginBottom: space.lg,
    color: color.red,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: color.ink,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
  retryText: {
    color: color.white,
    fontFamily: type.bodyMedium.fontFamily,
    fontSize: 14,
  },
  detailCard: {
    position: 'absolute',
    bottom: space.md,
    left: space.md,
    right: space.md,
    backgroundColor: color.paperRaised,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: color.ink,
    padding: space.lg,
    maxHeight: '55%',
    shadowColor: color.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginBottom: space.md,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.greenBg,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  featureText: {
    fontFamily: type.caption.fontFamily,
    fontSize: 11,
    color: color.green,
  },
  routingSection: {
    borderTopWidth: 1,
    borderTopColor: color.line,
    paddingTop: space.md,
  },
  routingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
  },
  routingErrorContainer: {
    alignItems: 'center',
    gap: space.sm,
  },
  routingErrorText: {
    fontFamily: type.caption.fontFamily,
    color: color.red,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: color.accent,
    minHeight: MIN_TAP_TARGET,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  actionButtonOutline: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.ink,
  },
  routeStatsRow: {
    flexDirection: 'row',
    gap: space.md,
    marginBottom: space.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: color.paper,
    padding: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.line,
  },
  stepsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.sm,
    justifyContent: 'center',
  },
  stepsList: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.sm,
    padding: space.sm,
    backgroundColor: color.paper,
    marginBottom: space.sm,
  },
  stepItem: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.sm,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: color.ink,
    color: color.white,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: 'bold',
  },
});
