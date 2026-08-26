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

type VoiceState = 'idle' | 'listening' | 'processing' | 'result';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceSearch'>;

// Placeholder phrases simulating STT output until Role 4's real STT module is wired in.
const SIMULATED_PHRASES = [
  'Find the nearest accessible metro station',
  'Take me to Central Library',
  'Is Civic Hospital wheelchair accessible',
];

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

  function startListening() {
    setVoiceState('listening');
    setTranscript('');
    setMatchedLocation(null);

    // Simulated STT: replace with @react-native-voice/voice or expo-speech-recognition
    // once Role 4 ships it. Keeping this simulated so the surrounding UI/UX can be
    // validated (timing, states, accessibility announcements) independent of that work.
    setTimeout(() => {
      setVoiceState('processing');
      const phrase = SIMULATED_PHRASES[Math.floor(Math.random() * SIMULATED_PHRASES.length)];
      setTranscript(phrase);

      setTimeout(() => {
        const match = mockLocations.find((l) => phrase.toLowerCase().includes(l.name.toLowerCase().split(' ')[0]))
          ?? mockLocations[0];
        setMatchedLocation(match);
        setVoiceState('result');
      }, 900);
    }, 1800);
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

        {voiceState === 'result' && matchedLocation && (
          <View style={styles.resultCard} accessible accessibilityLabel={`Found ${matchedLocation.name}, score ${matchedLocation.score}`}>
            <Text style={type.eyebrow}>You said</Text>
            <Text style={[type.body, { marginBottom: space.lg }]}>"{transcript}"</Text>
            <Text style={type.h2}>{matchedLocation.name}</Text>
            <Text style={type.caption}>{matchedLocation.area}</Text>
          </View>
        )}

        <Pressable
          onPress={voiceState === 'idle' ? startListening : voiceState === 'result' ? handleConfirm : undefined}
          disabled={voiceState === 'listening' || voiceState === 'processing'}
          accessibilityRole="button"
          accessibilityLabel={
            voiceState === 'idle' ? 'Start voice search' :
            voiceState === 'result' ? `Go to ${matchedLocation?.name}` :
            'Listening'
          }
          style={styles.micWrap}
        >
          <Animated.View
            style={[
              styles.micButton,
              voiceState === 'listening' && styles.micActive,
              voiceState === 'result' && styles.micResult,
              { transform: [{ scale: pulse }] },
            ]}
          >
            <MaterialCommunityIcons
              name={voiceState === 'result' ? 'arrow-right' : 'microphone'}
              size={30}
              color={voiceState === 'listening' || voiceState === 'result' ? color.accentInk : color.paper}
            />
          </Animated.View>
        </Pressable>

        {voiceState === 'result' && (
          <Pressable onPress={startListening} accessibilityRole="button" accessibilityLabel="Try again">
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
