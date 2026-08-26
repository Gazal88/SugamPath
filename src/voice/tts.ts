import * as Speech from "expo-speech";

export function speak(text: string): void {
  Speech.speak(text);
}

export function stopSpeaking(): void {
  Speech.stop();
}
