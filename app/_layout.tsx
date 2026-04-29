import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '<ph_project_token>';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export default function RootLayout() {
  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      debug
      options={{
        host: POSTHOG_HOST,
        enableSessionReplay: true,
        sessionReplayConfig: {
          maskAllTextInputs: false,
          maskAllImages: false,
          throttleDelayMs: 1000,
        },
      }}
    >
      <Stack screenOptions={{ headerTitle: 'Scroll Repro' }} />
      <StatusBar style="auto" />
    </PostHogProvider>
  );
}
