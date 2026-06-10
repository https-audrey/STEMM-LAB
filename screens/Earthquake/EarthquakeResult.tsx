import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { saveEarthquakeTrialRecord } from '../../services/db';

type Props = NativeStackScreenProps<RootStackParamList, 'EarthquakeResult'>;

export default function EarthquakeResult({ route, navigation }: Props) {
  const { data } = route.params;

  const {
    currentSessionId,
    prototypeKey,
    description,
    peakAccel,
    avgAccel,
    isHistoricalView,
  } = data;

  // -------------------------
  // SAVE FUNCTION
  // -------------------------
  const commitRunToDatabase = () => {
    try {
      saveEarthquakeTrialRecord({
        session_id: currentSessionId ?? '',
        prototype_key: prototypeKey,
        description: description,
        peakAccel: peakAccel,
        avgAccel: avgAccel,
      });

      Alert.alert('Success', 'Test saved successfully!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('EarthquakeActivity', {
              currentSessionId: currentSessionId ?? '',
            }),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save test results.');
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isHistoricalView && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            🕰 Viewing Historical Trial
          </Text>
        </View>
      )}

      <Text style={styles.title}>Earthquake Test Results</Text>

      {/* STRUCTURE DETAILS */}
      <View style={styles.card}>
        <Text style={styles.header}>🏢 Structure Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Prototype:</Text>
          <Text style={styles.value}>{prototypeKey?.toUpperCase() || 'Structure'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{description || '—'}</Text>
        </View>
      </View>

      {/* MEASUREMENT RESULTS */}
      <View style={styles.card}>
        <Text style={styles.header}>📊 Shaking Measurements</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Peak Acceleration:</Text>
          <Text style={styles.peakValue}>{peakAccel.toFixed(3)} g</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Average Acceleration:</Text>
          <Text style={styles.value}>{avgAccel.toFixed(3)} g</Text>
        </View>
      </View>

      {/* ACTION BUTTON */}
      {!isHistoricalView ? (
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={commitRunToDatabase}
        >
          <Text style={styles.saveText}>💾 Save Result</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// -------------------------
// STYLES
// -------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071A3D' },
  content: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
  },

  header: {
    color: '#00d2d3',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  label: { color: '#aaa', fontSize: 13 },
  value: { color: '#fff', fontWeight: '600' },

  peakValue: {
    color: '#ffa502',
    fontSize: 18,
    fontWeight: 'bold',
  },

  saveBtn: {
    backgroundColor: '#2ed573',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  backBtn: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  backText: {
    color: '#4A90E2',
    fontWeight: '700',
  },

  banner: {
    backgroundColor: '#ffa502',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  bannerText: {
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
});