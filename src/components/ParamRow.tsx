import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { color, radius, space, type } from '../theme/tokens';
import type { AccessParam } from '../data/mockLocations';

export function ParamRow({ param }: { param: AccessParam }) {
  const positive = param.delta >= 0;
  const tint = positive ? color.green : color.red;
  const bg = positive ? color.greenBg : color.redBg;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${param.label}, ${positive ? 'plus' : 'minus'} ${Math.abs(param.delta)} points`}
    >
      <View style={[styles.icon, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={param.icon as any} size={16} color={tint} />
      </View>
      <Text style={[type.bodyMedium, styles.label]}>{param.label}</Text>
      <Text style={[type.score, { color: tint, fontSize: 13 }]}>
        {positive ? '+' : ''}{param.delta}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
    gap: space.md,
  },
  icon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
