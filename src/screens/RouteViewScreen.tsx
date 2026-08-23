import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space, type, MIN_TAP_TARGET } from '../theme/tokens';
import { RoutePathPanel } from '../components/RoutePathPanel';
import { StepRow } from '../components/StepRow';
import { TactileStrip } from '../components/Tactile';
import { mockRoute } from '../data/mockRoute';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RouteView'>;

export function RouteViewScreen({ navigation }: Props) {
  const route = mockRoute;

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
            <Text style={type.h2}>To {route.destinationName}</Text>
            <Text style={type.caption}>{route.distanceLabel} · {route.durationLabel} · most accessible route</Text>
          </View>
        </View>

        <View style={styles.mapWrap}>
          <RoutePathPanel accessScore={route.accessScore} />
        </View>

        <View style={styles.stripWrap}>
          <TactileStrip count={26} />
        </View>

        <View style={styles.stepsHeader}>
          <Text style={type.h3}>Turn-by-turn</Text>
          <Text style={[type.eyebrow, { textTransform: 'none' }]}>{route.steps.length} steps</Text>
        </View>

        <View style={{ paddingTop: space.sm }}>
          {route.steps.map((step, i) => (
            <StepRow key={step.id} step={step} isLast={i === route.steps.length - 1} />
          ))}
        </View>

        <Pressable
          style={styles.voiceButton}
          accessibilityRole="button"
          accessibilityLabel="Start voice guided navigation"
        >
          <MaterialCommunityIcons name="volume-high" size={18} color={color.paper} />
          <Text style={[type.bodyMedium, { color: color.paper }]}>Start voice guidance</Text>
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
    paddingBottom: space.md,
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
  mapWrap: { marginBottom: space.md },
  stripWrap: { paddingHorizontal: space.xl, paddingVertical: space.sm },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    marginTop: space.sm,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    marginHorizontal: space.xl,
    marginTop: space.lg,
    backgroundColor: color.ink,
    borderRadius: radius.lg,
    minHeight: MIN_TAP_TARGET,
  },
});
