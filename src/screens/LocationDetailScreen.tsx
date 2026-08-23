import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space, type, MIN_TAP_TARGET, scoreColor } from '../theme/tokens';
import { ScoreRing, TactileStrip } from '../components/Tactile';
import { ParamRow } from '../components/ParamRow';
import { mockLocations } from '../data/mockLocations';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({ route, navigation }: Props) {
  const location = mockLocations.find((l) => l.id === route.params.id) ?? mockLocations[0];
  const { fg } = scoreColor(location.score);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <Pressable
            onPress={navigation.goBack}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={18} color={color.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={type.h2}>{location.name}</Text>
            <Text style={type.caption}>{location.area}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <ScoreRing size={104} value={location.score} fg={fg} studCount={32}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[type.scoreLarge, { color: fg }]}>{location.score}</Text>
              <Text style={[type.caption, { textTransform: 'uppercase', letterSpacing: 0.5 }]}>score</Text>
            </View>
          </ScoreRing>
          <View style={{ flex: 1 }}>
            <View style={styles.verifiedBadge}>
              <View style={styles.dot} />
              <Text style={[type.bodyMedium, { color: color.green, fontSize: 12 }]}>{location.verifiedLabel}</Text>
            </View>
            <Text style={[type.caption, { lineHeight: 18 }]}>{location.summary}</Text>
          </View>
        </View>

        <View style={styles.stripWrap}>
          <TactileStrip />
        </View>

        <View style={styles.breakdown}>
          <Text style={[type.h3, { marginBottom: space.md }]}>Score breakdown</Text>
          {location.params.map((p) => (
            <ParamRow key={p.key} param={p} />
          ))}
        </View>

        <Pressable
          style={styles.startRoute}
          accessibilityRole="button"
          accessibilityLabel={`Start the most accessible route to ${location.name}`}
          onPress={() => navigation.navigate('RouteView', { id: location.id })}
        >
          <MaterialCommunityIcons name="map-marker-path" size={18} color={color.accentInk} />
          <Text style={[type.bodyMedium, { color: color.accentInk }]}>Start most accessible route</Text>
        </Pressable>

        <Pressable
          style={styles.reportStrip}
          accessibilityRole="button"
          accessibilityLabel="See something wrong? Report an obstacle with a photo"
          onPress={() => navigation.navigate('ObstacleReport', { id: location.id })}
        >
          <View style={styles.reportIcon}>
            <MaterialCommunityIcons name="camera" size={18} color={color.accentInk} />
          </View>
          <View>
            <Text style={[type.bodyMedium, { color: color.paper }]}>See something wrong?</Text>
            <Text style={[type.caption, { color: '#9CA6B4' }]}>Report an obstacle with a photo</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  scroll: { paddingBottom: space.xxxl },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.sm,
  },
  back: {
    width: MIN_TAP_TARGET - 14,
    height: MIN_TAP_TARGET - 14,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingHorizontal: space.xl,
    paddingVertical: space.lg,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: color.greenBg,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: space.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.green },
  stripWrap: { paddingHorizontal: space.xl, paddingVertical: space.md },
  breakdown: { paddingHorizontal: space.xl, paddingTop: space.xs },
  startRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    marginHorizontal: space.xl,
    marginTop: space.xl,
    backgroundColor: color.accent,
    borderRadius: radius.lg,
    minHeight: MIN_TAP_TARGET,
  },
  reportStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginHorizontal: space.xl,
    marginTop: space.md,
    backgroundColor: color.ink,
    borderRadius: radius.lg,
    padding: space.lg,
    minHeight: MIN_TAP_TARGET,
  },
  reportIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});