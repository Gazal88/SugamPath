import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space, type, MIN_TAP_TARGET } from '../theme/tokens';
import { PlaceCard } from '../components/PlaceCard';
import { mockLocations, mockLiveReports } from '../data/mockLocations';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={type.eyebrow}>Good morning</Text>
          <Text style={[type.h1, styles.h1]}>Where do you{'\n'}need to go?</Text>
        </View>

        <Pressable
          style={styles.searchBar}
          accessibilityRole="search"
          accessibilityLabel="Search for a place or address"
          onPress={() => {
            navigation.navigate('Map');
          }}
        >
          <Ionicons name="search" size={18} color={color.inkSoft} />
          <Text style={[type.body, { color: color.inkSoft, flex: 1 }]}>Search for a place or address</Text>
          <View style={styles.goButton}>
            <Ionicons name="arrow-forward" size={16} color={color.accentInk} />
          </View>
        </Pressable>

        <Pressable
          style={styles.voiceRow}
          accessibilityRole="button"
          accessibilityLabel="Search by voice"
        >
          <MaterialCommunityIcons name="microphone" size={18} color={color.ink} />
          <Text style={type.bodyMedium}>Or search by voice</Text>
        </Pressable>

        <View style={styles.sectionTitle}>
          <Text style={type.h3}>Nearby, verified</Text>
          <Text style={[type.eyebrow, { textTransform: 'none' }]}>within 1.2 km</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: space.xl }}>
          {mockLocations.map((loc) => (
            <PlaceCard key={loc.id} location={loc} onPress={() => navigation.navigate('LocationDetail', { id: loc.id })} />
          ))}
        </ScrollView>

        <View style={[styles.sectionTitle, { marginTop: space.xl }]}>
          <Text style={type.h3}>Recently reported</Text>
          <Text style={[type.eyebrow, { textTransform: 'none' }]}>live</Text>
        </View>

        {mockLiveReports.map((r) => (
          <View key={r.id} style={styles.reportRow} accessible accessibilityLabel={`${r.title}. ${r.meta}`}>
            <View style={[styles.reportIcon, { backgroundColor: r.kind === 'warning' ? color.redBg : color.greenBg }]}>
              <MaterialCommunityIcons
                name={r.kind === 'warning' ? 'alert' : 'check-circle'}
                size={16}
                color={r.kind === 'warning' ? color.red : color.green}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.bodyMedium}>{r.title}</Text>
              <Text style={type.caption}>{r.meta}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  scroll: { paddingBottom: space.xxxl },
  header: { paddingHorizontal: space.xl, paddingTop: space.lg },
  h1: { marginTop: space.sm, marginBottom: space.lg },
  searchBar: {
    marginHorizontal: space.xl,
    marginBottom: space.md,
    minHeight: MIN_TAP_TARGET,
    backgroundColor: color.paperRaised,
    borderWidth: 1.5,
    borderColor: color.ink,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  goButton: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRow: {
    marginHorizontal: space.xl,
    marginBottom: space.xl,
    minHeight: MIN_TAP_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    marginBottom: space.md,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
  reportIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
