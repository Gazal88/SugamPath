// The signature visual motif of SugamPath: a literal tactile-paving dot pattern.
// Reused three ways across the app — as a section divider (TactileStrip), as the
// accessibility score indicator (ScoreRing, built from stud segments rather than a
// plain arc), and as a determinate loading/progress bar (TactileProgress).
// This is deliberate: the app's entire subject is verified physical accessibility
// infrastructure, so the "chrome" of the UI is made of the same real-world material
// it maps, instead of a decorative gradient or generic spinner.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { color } from '../theme/tokens';

export function TactileStrip({ opacity = 0.18, dotSize = 5, gap = 5, count = 22 }: {
  opacity?: number;
  dotSize?: number;
  gap?: number;
  count?: number;
}) {
  return (
    <View style={[styles.strip, { gap }]} accessibilityElementsHidden importantForAccessibility="no">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color.ink,
            opacity,
          }}
        />
      ))}
    </View>
  );
}

// Circular accessibility score, rendered as discrete studs (like tactile tile segments)
// rather than a smooth arc — reinforces "each stud = one verified checkpoint".
export function ScoreRing({
  size = 46,
  value,
  fg,
  track = color.line,
  studCount = 24,
  children,
}: {
  size?: number;
  value: number; // 0-100
  fg: string;
  track?: string;
  studCount?: number;
  children?: React.ReactNode;
}) {
  const radius = size / 2 - 4;
  const center = size / 2;
  const filledCount = Math.round((value / 100) * studCount);
  const studRadius = size < 60 ? 1.6 : 2.6;

  const studs = Array.from({ length: studCount }).map((_, i) => {
    const angle = (i / studCount) * 2 * Math.PI - Math.PI / 2;
    const cx = center + radius * Math.cos(angle);
    const cy = center + radius * Math.sin(angle);
    const filled = i < filledCount;
    return <Circle key={i} cx={cx} cy={cy} r={studRadius} fill={filled ? fg : track} />;
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G>{studs}</G>
      </Svg>
      {children}
    </View>
  );
}

export function TactileProgress({ progress, width = 200 }: { progress: number; width?: number }) {
  const count = Math.round(width / 10);
  const filled = Math.round(progress * count);
  return (
    <View
      style={[styles.strip, { gap: 4, width }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: i < filled ? color.accent : color.line,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', flexWrap: 'wrap' },
});
