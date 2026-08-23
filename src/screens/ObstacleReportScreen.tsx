import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { color, radius, space, type, MIN_TAP_TARGET } from '../theme/tokens';
import { addReport } from '../data/reportsStore';
import { mockLocations } from '../data/mockLocations';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ObstacleReport'>;

const OBSTACLE_TYPES = [
  { key: 'ramp', label: 'Ramp blocked', icon: 'wheelchair-accessibility' },
  { key: 'lift', label: 'Lift not working', icon: 'elevator-passenger-off' },
  { key: 'path', label: 'Path damaged', icon: 'road-variant' },
  { key: 'signage', label: 'Missing signage', icon: 'sign-direction-remove' },
  { key: 'other', label: 'Other', icon: 'dots-horizontal' },
] as const;

export function ObstacleReportScreen({ navigation, route }: Props) {
  const location = mockLocations.find((l) => l.id === route.params?.id);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = selectedType !== null && description.trim().length > 0;

  async function handleAddPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to attach a picture to your report.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to take a photo for your report.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
    if (!result.canceled && result.assets?.[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const typeLabel = OBSTACLE_TYPES.find((t) => t.key === selectedType)?.label ?? 'Obstacle';
    const placeName = location?.name ?? 'Nearby location';

    // Simulated network delay — replace with a real POST to Backend's reports
    // endpoint in week 5-6. Shape: { type, description, photoUri, locationId }.
    setTimeout(() => {
      addReport({ title: `${typeLabel} — ${placeName}`, kind: 'warning' });
      setSubmitting(false);
      navigation.goBack();
    }, 600);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Pressable
            onPress={navigation.goBack}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Cancel and go back"
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={color.ink} />
          </Pressable>
          <Text style={type.h2}>Report an obstacle</Text>
        </View>

        <View style={styles.locationChip} accessible accessibilityLabel={`Reporting for ${location?.name ?? 'current location'}`}>
          <Ionicons name="location" size={14} color={color.blue} />
          <Text style={[type.caption, { color: color.blue }]}>{location?.name ?? 'Current location'}</Text>
        </View>

        <Text style={[type.h3, styles.sectionLabel]}>What's the problem?</Text>
        <View style={styles.chipGrid}>
          {OBSTACLE_TYPES.map((t) => {
            const selected = selectedType === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setSelectedType(t.key)}
                style={[styles.typeChip, selected && styles.typeChipSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={t.label}
              >
                <MaterialCommunityIcons
                  name={t.icon as any}
                  size={16}
                  color={selected ? color.accentInk : color.ink}
                />
                <Text style={[type.bodyMedium, { fontSize: 13, color: selected ? color.accentInk : color.ink }]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[type.h3, styles.sectionLabel]}>Describe it</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Ramp is blocked by construction material since morning"
          placeholderTextColor={color.inkSoft}
          multiline
          numberOfLines={4}
          style={styles.textArea}
          accessibilityLabel="Description of the obstacle"
        />

        <Text style={[type.h3, styles.sectionLabel]}>Add a photo</Text>
        {photoUri ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} accessibilityIgnoresInvertColors />
            <Pressable
              onPress={() => setPhotoUri(null)}
              style={styles.removePhoto}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="close" size={14} color={color.paper} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.photoRow}>
            <Pressable
              style={styles.photoButton}
              onPress={handleTakePhoto}
              accessibilityRole="button"
              accessibilityLabel="Take a photo with camera"
            >
              <MaterialCommunityIcons name="camera" size={20} color={color.ink} />
              <Text style={type.caption}>Camera</Text>
            </Pressable>
            <Pressable
              style={styles.photoButton}
              onPress={handleAddPhoto}
              accessibilityRole="button"
              accessibilityLabel="Choose a photo from gallery"
            >
              <MaterialCommunityIcons name="image" size={20} color={color.ink} />
              <Text style={type.caption}>Gallery</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          accessibilityRole="button"
          accessibilityLabel={canSubmit ? 'Submit report' : 'Submit report, disabled, select a type and add a description first'}
        >
          <Text style={[type.bodyMedium, { color: canSubmit ? color.paper : color.inkSoft }]}>
            {submitting ? 'Submitting…' : 'Submit report'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  scroll: { paddingBottom: space.xxxl, paddingHorizontal: space.xl },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingTop: space.lg, paddingBottom: space.md },
  back: {
    width: MIN_TAP_TARGET - 14,
    height: MIN_TAP_TARGET - 14,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: color.blueBg,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: space.lg,
  },
  sectionLabel: { marginBottom: space.md, marginTop: space.xs },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.xl },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    minHeight: MIN_TAP_TARGET - 8,
  },
  typeChipSelected: { backgroundColor: color.accent, borderColor: color.accent },
  textArea: {
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.md,
    padding: space.md,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: type.body.fontFamily,
    fontSize: 14,
    color: color.ink,
    backgroundColor: color.paperRaised,
    marginBottom: space.xl,
  },
  photoRow: { flexDirection: 'row', gap: space.md, marginBottom: space.xl },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: color.line,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    minHeight: 84,
  },
  photoPreviewWrap: { marginBottom: space.xl, position: 'relative', alignSelf: 'flex-start' },
  photoPreview: { width: 140, height: 140, borderRadius: radius.md },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    minHeight: MIN_TAP_TARGET,
    borderRadius: radius.lg,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: { backgroundColor: color.line },
});
