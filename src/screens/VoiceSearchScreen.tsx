// Voice UI: idle -> listening -> processing -> result, using expo-speech-recognition style
// STT flow. This is UI-only for now (Role 4 owns the actual TTS/STT wiring per PRD) — the
// mic button and transcript states are real and interactive, but the "search" it triggers
// is still local mock filtering until Backend + Voice modules are live.

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space, type, MIN_TAP_TARGET } from '../theme/tokens';
import { mockLocations } from '../data/mockLocations';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { speak } from '../voice/tts';
import { startListening, stopListening } from '../voice/stt';

type VoiceState = 'idle' | 'listening' | 'processing' | 'result';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceSearch'>;

export function VoiceSearchScreen({ navigation }: Props) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [matchedLocation, setMatchedLocation] = useState<(typeof mockLocations)[number] | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (voiceState === 'listening') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.35, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulse.setValue(1);
    }
  }, [voiceState]);

async function startVoiceSearch() {
  setVoiceState('listening');
  setTranscript('');
  setMatchedLocation(null);

  await startListening(
    (text) => {
      setVoiceState('processing');
      setTranscript(text);

      const normalizedText = text.toLowerCase().trim();
      let match = null;

      if (normalizedText.includes('library') || normalizedText.includes('book') || normalizedText.includes('read') || normalizedText.includes('central')) {
        match = mockLocations.find(l => l.id === 'loc-2') ?? null;
      } else if (normalizedText.includes('hospital') || normalizedText.includes('opd') || normalizedText.includes('clinic') || normalizedText.includes('medical') || normalizedText.includes('civic')) {
        match = mockLocations.find(l => l.id === 'loc-3') ?? null;
      } else if ((normalizedText.includes('metro') || normalizedText.includes('subway') || normalizedText.includes('station')) && !normalizedText.includes('railway')) {
        match = mockLocations.find(l => l.id === 'loc-1') ?? null;
      }

      setMatchedLocation(match);
      setVoiceState('result');
    },
    () => {
      // Speech recognition has ended.
    },
    (error) => {
      console.log('STT error:', error);
      setVoiceState('idle');
    }
  );
}

  function handleConfirm() {
    if (matchedLocation) {
      navigation.replace('LocationDetail', { id: matchedLocation.id });
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable
          onPress={navigation.goBack}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel="Close voice search"
          hitSlop={8}
        >
          <Ionicons name="close" size={20} color={color.ink} />
        </Pressable>
      </View>

      <View style={styles.center}>
        {voiceState === 'idle' && (
          <>
            <Text style={[type.h2, styles.prompt]}>Tap to speak</Text>
            <Text style={[type.caption, styles.subPrompt]}>Try "Find the nearest accessible metro station"</Text>
          </>
        )}

        {voiceState === 'listening' && (
          <>
            <Text style={[type.h2, styles.prompt]}>Listening…</Text>
            <Text style={[type.caption, styles.subPrompt]} accessibilityLiveRegion="polite">
              Speak now
            </Text>
          </>
        )}

        {voiceState === 'processing' && (
          <>
            <Text style={[type.h2, styles.prompt]}>"{transcript}"</Text>
            <Text style={[type.caption, styles.subPrompt]}>Finding the best match…</Text>
          </>
        )}

        {voiceState === 'result' && (
          matchedLocation ? (
            <View style={styles.resultCard} accessible accessibilityLabel={`Found ${matchedLocation.name}, score ${matchedLocation.score}`}>
              <Text style={type.eyebrow}>You said</Text>
              <Text style={[type.body, { marginBottom: space.lg }]}>"{transcript}"</Text>
              <Text style={type.h2}>{matchedLocation.name}</Text>
              <Text style={type.caption}>{matchedLocation.area}</Text>
            </View>
          ) : (
            <View style={styles.resultCard} accessible accessibilityLabel="No matching destination found">
              <Text style={type.eyebrow}>You said</Text>
              <Text style={[type.body, { marginBottom: space.lg }]}>"{transcript}"</Text>
              <Text style={type.h2}>No match found</Text>
              <Text style={type.caption}>Try saying "library" or "hospital"</Text>
            </View>
          )
        )}

        <Pressable
          onPress={
            voiceState === 'idle' || (voiceState === 'result' && !matchedLocation)
              ? startVoiceSearch
              : voiceState === 'result' && matchedLocation
              ? handleConfirm
              : undefined
          }
          disabled={voiceState === 'listening' || voiceState === 'processing'}
          accessibilityRole="button"
          accessibilityLabel={
            voiceState === 'idle' || (voiceState === 'result' && !matchedLocation)
              ? 'Start voice search'
              : `Go to ${matchedLocation?.name}`
          }
          style={styles.micWrap}
        >
          <Animated.View
            style={[
              styles.micButton,
              voiceState === 'listening' && styles.micActive,
              voiceState === 'result' && matchedLocation && styles.micResult,
              { transform: [{ scale: pulse }] },
            ]}
          >
            <MaterialCommunityIcons
              name={voiceState === 'result' && matchedLocation ? 'arrow-right' : 'microphone'}
              size={30}
              color={voiceState === 'listening' || (voiceState === 'result' && matchedLocation) ? color.accentInk : color.paper}
            />
          </Animated.View>
        </Pressable>

        {voiceState === 'result' && (
          <Pressable onPress={startVoiceSearch} accessibilityRole="button" accessibilityLabel="Try again">
            <Text style={[type.bodyMedium, { color: color.inkSoft, marginTop: space.lg }]}>Try again</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const MIC_SIZE = 84;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  top: { paddingHorizontal: space.xl, paddingTop: space.lg },
  close: {
    width: MIN_TAP_TARGET - 14,
    height: MIN_TAP_TARGET - 14,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xxl },
  prompt: { textAlign: 'center', marginBottom: space.sm },
  subPrompt: { textAlign: 'center', marginBottom: space.xxxl },
  resultCard: {
    backgroundColor: color.paperRaised,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    padding: space.xl,
    marginBottom: space.xxxl,
    alignItems: 'center',
    minWidth: 260,
  },
  micWrap: { alignItems: 'center', justifyContent: 'center' },
  micButton: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: { backgroundColor: color.accent },
  micResult: { backgroundColor: color.green, width: MIC_SIZE - 20, height: MIC_SIZE - 20, borderRadius: (MIC_SIZE - 20) / 2 },
});
