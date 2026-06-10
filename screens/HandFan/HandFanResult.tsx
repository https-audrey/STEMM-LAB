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
import { saveHFTrialRecord } from '../../services/db';

type Props = NativeStackScreenProps<RootStackParamList, 'HandFanResult'>;

export default function HandFanResult({ route, navigation }: Props) {
  const { data } = route.params;

  const {
    videoUri,
    prototypeKey,
    design,
    distance,
    material,
    stiffness,
    bend_angle,
    top_point_x,
    top_point_y,
    bottom_point_x,
    bottom_point_y,
    isHistoricalView,
    currentSessionId,
  } = data;

  // -------------------------
  // ANGLE CALCULATION (Radian)
  // -------------------------
  const angleDegrees = bend_angle ?? 0;
  const angleRadians = angleDegrees * (Math.PI / 180);

  // -------------------------
  // FORCE CALCULATION
  // Force (N) = Stiffness (N/rad) × Angle (rad)
  // -------------------------
  const forceNewtons = stiffness * angleRadians;

  // -------------------------
  // SAVE FUNCTION
  // -------------------------
  const commitRunToDatabase = () => {
    try {
      saveHFTrialRecord({
        session_id: currentSessionId ?? '',
        prototype_key: prototypeKey,
        design: design,
        distance: distance,
        material: material,
        stiffness: stiffness,
        bend_angle: angleDegrees,
        force: forceNewtons,
        video_uri: videoUri,
        top_point_x: top_point_x ?? 0,
        top_point_y: top_point_y ?? 0,
        bottom_point_x: bottom_point_x ?? 0,
        bottom_point_y: bottom_point_y ?? 0,
      });

      Alert.alert('Success', 'Trial saved successfully!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('HandFanActivity', {
              currentSessionId: currentSessionId ?? '',
            }),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save trial.');
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

      <Text style={styles.title}>Hand Fan Results</Text>

      {/* EXPERIMENT DETAILS */}
      <View style={styles.card}>
        <Text style={styles.header}>📋 Experiment Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Prototype:</Text>
          <Text style={styles.value}>{prototypeKey?.toUpperCase() || 'Hand Fan'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Design #:</Text>
          <Text style={styles.value}>{design || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fan Distance:</Text>
          <Text style={styles.value}>{distance} cm</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Material:</Text>
          <Text style={styles.value}>{material?.toUpperCase() || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Stiffness (k):</Text>
          <Text style={styles.highlight}>{stiffness} N/rad</Text>
        </View>
      </View>

      {/* MEASUREMENT RESULTS */}
      <View style={styles.card}>
        <Text style={styles.header}>📐 Bend Measurement</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Bend Angle:</Text>
          <Text style={styles.angleValue}>{angleDegrees.toFixed(1)}°</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>In Radians:</Text>
          <Text style={styles.value}>{angleRadians.toFixed(4)} rad</Text>
        </View>
      </View>

      {/* FORCE CALCULATION */}
      <View style={styles.card}>
        <Text style={styles.header}>⚙️ Force Calculation</Text>

        <View style={styles.formulaBox}>
          <Text style={styles.formula}>F = k × θ</Text>
          <Text style={styles.formulaSub}>Force = Stiffness × Angle (radians)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Stiffness (k):</Text>
          <Text style={styles.value}>{stiffness} N/rad</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Angle (θ):</Text>
          <Text style={styles.value}>{angleRadians.toFixed(4)} rad</Text>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Resulting Force</Text>
          <Text style={styles.resultValue}>{forceNewtons.toFixed(3)} N</Text>
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
  highlight: { color: '#2ed573', fontWeight: '700' },

  angleValue: {
    color: '#ffa502',
    fontSize: 18,
    fontWeight: 'bold',
  },

  formulaBox: {
    backgroundColor: 'rgba(0,210,211,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },

  formula: {
    color: '#00d2d3',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  formulaSub: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },

  resultBox: {
    marginTop: 12,
    padding: 15,
    backgroundColor: 'rgba(46,213,115,0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },

  resultLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },

  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2ed573',
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