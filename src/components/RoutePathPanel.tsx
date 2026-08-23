// A stylized route panel standing in for the live map until Role 3 (Maps & Routing)
// wires OSRM/GraphHopper output through. Deliberately not a fake map screenshot —
// it's an abstracted "signal path" view (dot-grid ground + a drawn route + start/end
// pins) so it reads honestly as a placeholder rather than pretending to be real map data.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { color, radius, space, type } from '../theme/tokens';

const W = 320;
const H = 180;

export function RoutePathPanel({ accessScore }: { accessScore: number }) {
  const gridDots = [];
  const spacing = 20;
  for (let x = spacing; x < W; x += spacing) {
    for (let y = spacing; y < H; y += spacing) {
      gridDots.push({ x, y });
    }
  }

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {gridDots.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={1.4} fill={color.ink} opacity={0.08} />
        ))}
        <Path
          d={`M 30 150 C 90 150, 70 60, 140 60 S 230 40, 290 30`}
          stroke={color.accent}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={30} cy={150} r={7} fill={color.ink} />
        <Circle cx={290} cy={30} r={7} fill={color.green} />
        <Line x1={30} y1={150} x2={30} y2={150} stroke={color.ink} strokeWidth={1} />
      </Svg>

      <View style={styles.badge}>
        <Text style={[type.eyebrow, { textTransform: 'none' }]}>Live map arrives with routing API</Text>
      </View>

      <View style={styles.scoreChip}>
        <Text style={[type.score, { color: color.green, fontSize: 13 }]}>{accessScore}</Text>
        <Text style={[type.caption, { fontSize: 10 }]}>route score</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: space.xl,
    borderRadius: radius.lg,
    backgroundColor: color.paperRaised,
    borderWidth: 1,
    borderColor: color.line,
    overflow: 'hidden',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: space.sm,
    left: space.sm,
    backgroundColor: color.paper,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  scoreChip: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    backgroundColor: color.paper,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
});
