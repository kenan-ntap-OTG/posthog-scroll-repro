import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePostHog } from 'posthog-react-native';

const ITEMS = Array.from({ length: 500 }, (_, i) => ({
  id: String(i),
  title: `Item #${i + 1}`,
  subtitle: `Scroll this list on a real iOS device with PostHog session replay enabled to reproduce the scroll stutter.`,
}));

export default function ScrollRepro() {
  const posthog = usePostHog();

  const onCheckReplay = async () => {
    if (!posthog) {
      Alert.alert('PostHog', 'Client not ready yet.');
      return;
    }
    try {
      const active = await posthog.isSessionReplayActive();
      Alert.alert(
        'Session replay',
        active ? 'ACTIVE ✓' : 'INACTIVE ✗'
      );
    } catch (err: any) {
      Alert.alert('Session replay check FAILED', err?.message ?? String(err));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable onPress={onCheckReplay} style={styles.button}>
          <Text style={styles.buttonText}>Check session replay</Text>
        </Pressable>
      </View>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d0d0d0',
    backgroundColor: '#f5f5f7',
  },
  button: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  content: {
    paddingVertical: 16,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d0d0d0',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
  },
});
