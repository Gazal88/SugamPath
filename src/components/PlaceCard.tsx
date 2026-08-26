import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { color, radius, space, type, MIN_TAP_TARGET, scoreColor } from '../theme/tokens';
import { ScoreRing } from './Tactile';
import type { Location } from '../data/mockLocations';

export function PlaceCard({ location, onPress }: { location: Location; onPress: () => void }) {
  const { fg } = scoreColor(location.score);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}, accessibility score ${location.score} out of 100. ${location.summary}`}
      hitSlop={4}
    >
      <ScoreRing size={46} value={location.score} fg={fg}>
        <Text style={[type.score, { color: fg }]}>{location.score}</Text>
      </ScoreRing>
      <Text style={[type.bodyMedium, styles.name]} numberOfLines={1}>{location.name}</Text>
      <Text style={type.caption} numberOfLines={1}>{location.tags.join(' · ')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 168,
    minHeight: MIN_TAP_TARGET,
    backgroundColor: color.paperRaised,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    padding: space.md,
    marginRight: space.md,
  },
  cardPressed: { opacity: 0.85 },
  name: { marginTop: space.sm, marginBottom: 2 },
});
