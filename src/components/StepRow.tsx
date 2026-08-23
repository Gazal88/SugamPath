import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { color, radius, space, type } from '../theme/tokens';
import type { RouteStep } from '../data/mockRoute';

export function StepRow({ step, isLast }: { step: RouteStep; isLast: boolean }) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${step.instruction}, ${step.distanceM} meters${step.accessNote ? '. ' + step.accessNote : ''}`}
    >
      <View style={styles.railCol}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={step.icon as any} size={16} color={color.ink} />
        </View>
        {!isLast && <View style={styles.rail} />}
      </View>

      <View style={styles.content}>
        <View style={styles.line1}>
          <Text style={[type.bodyMedium, { flex: 1 }]}>{step.instruction}</Text>
          <Text style={type.caption}>{step.distanceM} m</Text>
        </View>
        {step.accessNote ? (
          <View style={styles.noteRow}>
            <MaterialCommunityIcons name="shield-check" size={12} color={color.green} />
            <Text style={[type.caption, { color: color.green, flex: 1 }]}>{step.accessNote}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: space.xl },
  railCol: { alignItems: 'center', width: 32 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: color.paperRaised,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: { width: 2, flex: 1, backgroundColor: color.line, marginVertical: 4 },
  content: { flex: 1, paddingBottom: space.lg, paddingLeft: space.md },
  line1: { flexDirection: 'row', alignItems: 'center', paddingTop: space.xs },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
});
