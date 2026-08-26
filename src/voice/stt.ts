import {
  ExpoSpeechRecognitionModule,
} from "expo-speech-recognition";

export async function startListening(
  onResult: (text: string) => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  const permission =
    await ExpoSpeechRecognitionModule.requestPermissionsAsync();

  if (!permission.granted) {
    onError?.("Microphone permission was not granted.");
    return;
  }

  const resultListener =
    ExpoSpeechRecognitionModule.addListener("result", (event) => {
      const text = event.results?.[0]?.transcript ?? "";

      if (text) {
        onResult(text);
      }
    });

  const errorListener =
    ExpoSpeechRecognitionModule.addListener("error", (event) => {
        onError?.(event.message ?? "Speech recognition failed.");
    });

  const endListener =
    ExpoSpeechRecognitionModule.addListener("end", () => {
      resultListener.remove();
      endListener.remove();
      errorListener.remove();
      onEnd?.();
    });

  ExpoSpeechRecognitionModule.start({
    lang: "en-US",
    interimResults: false,
    continuous: false,
  });
}

export function stopListening(): void {
  ExpoSpeechRecognitionModule.stop();
}