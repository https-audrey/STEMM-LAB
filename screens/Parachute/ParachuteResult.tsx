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
import { saveTrialRecord } from '../../services/db';

type Props = NativeStackScreenProps<RootStackParamList, 'ParachuteResult'>;

const g = 9.8;

export default function ParachuteResult({ route, navigation }: Props) {
  const { data } = route.params;

  const {
    videoUri,
    dropTime,
    hitGroundTime,
    bounceTime,
    stopTime,
    mass,
    height,
    prototypeKey,
    isHistoricalView,
    currentSessionId,
  } = data;

  // -------------------------
  // BASIC TIME VALUES
  // -------------------------
  const tDrop = dropTime ?? 0;
  const tHit = hitGroundTime ?? 0;
  const tStop = stopTime ?? 0;

  const fallTime = Math.max(0.001, tHit - tDrop);
  const contactTime = Math.max(0.001, tStop - tHit);

  // -------------------------
  // MOTION CALCULATIONS
  // (matches your worksheet exactly)
  // -------------------------

  // Step 3: Final velocity = distance / time
  const vFinal = height / fallTime;

  // Step 4: Acceleration = velocity / time
  const acceleration = vFinal / fallTime;

  // Step 5: Forces
  const weight = mass * g;                 // Weight = mass × g
  const netForce = mass * acceleration;    // Net Force = mass × acceleration
  const dragForce = weight - netForce;     // Drag = Weight − Net Force

  // -------------------------
  // G-FORCE CALCULATION
  // -------------------------

  let deltaV = vFinal;

  // Bounce case (optional)
  const isBounceValid =
    bounceTime !== null &&
    bounceTime > tHit &&
    bounceTime < tStop;

  if (isBounceValid && bounceTime !== null) {
    const tUp = bounceTime - tHit;
    const vUp = g * tUp;
    deltaV = vFinal + vUp;
  }

  const gForce = (deltaV / contactTime) / g;

  // -------------------------
  // RISK LEVEL & RATING
  // -------------------------
  let riskLevel = '';
  let riskColor = '';
  let riskText = '';
  let rate = ''; // Combined rating for database

  if (gForce <= 5) {
    riskLevel = '1–5 g (Low Risk)';
    riskColor = '#2ed573';
    riskText = 'Safe: No injury expected.';
    rate = 'Low Risk (1-5 g) - Safe: No injury expected';
  } else if (gForce <= 10) {
    riskLevel = '5–10 g (Minor Impact)';
    riskColor = '#ffa502';
    riskText = 'Minor: possible small structural strain.';
    rate = 'Minor Impact (5-10 g) - Possible small structural strain';
  } else if (gForce <= 30) {
    riskLevel = '10–30 g (Moderate Risk)';
    riskColor = '#ff6b81';
    riskText = 'Moderate: risk of damage or breakage.';
    rate = 'Moderate Risk (10-30 g) - Risk of damage or breakage';
  } else if (gForce <= 50) {
    riskLevel = '30–50 g (Severe Risk)';
    riskColor = '#ff4757';
    riskText = 'Severe: high chance of structural failure.';
    rate = 'Severe Risk (30-50 g) - High chance of structural failure';
  } else {
    riskLevel = '50+ g (Extreme)';
    riskColor = '#ff0000';
    riskText = 'Extreme: catastrophic failure likely.';
    rate = 'Extreme Risk (50+ g) - Catastrophic failure likely';
  }

  // -------------------------
  // SAVE FUNCTION
  // -------------------------
  const commitRunToDatabase = () => {
    try {
      saveTrialRecord({
        session_id: currentSessionId ?? '',
        prototype_key: prototypeKey || 'baseline',
        mass,
        height,
        video_uri: videoUri,
        drop_time: tDrop,
        hit_ground_time: tHit,
        bounce_time: bounceTime,
        stop_time: tStop,
        g_force: gForce,
        v_impact: vFinal,
        rate: rate, // Add the rating to the database
      });

      Alert.alert('Success', 'Trial saved successfully!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('ParachuteActivity', {
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

      <Text style={styles.title}>Physics Results</Text>

      {/* MOTION SECTION */}
      <View style={styles.card}>
        <Text style={styles.header}>📊 Motion Calculations</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{height.toFixed(2)} m</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fall Time:</Text>
          <Text style={styles.value}>{fallTime.toFixed(3)} s</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Final Velocity:</Text>
          <Text style={styles.highlight}>{vFinal.toFixed(2)} m/s</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Acceleration:</Text>
          <Text style={styles.value}>
            {acceleration.toFixed(2)} m/s²
          </Text>
        </View>
      </View>

      {/* FORCES SECTION */}
      <View style={styles.card}>
        <Text style={styles.header}>⚙️ Forces Acting on Toy</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Weight (mg):</Text>
          <Text style={styles.value}>{weight.toFixed(2)} N</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Net Force:</Text>
          <Text style={styles.value}>{netForce.toFixed(2)} N</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Drag Force:</Text>
          <Text style={styles.highlight}>
            {dragForce.toFixed(2)} N
          </Text>
        </View>
      </View>

      {/* G-FORCE */}
      <View style={styles.card}>
        <Text style={styles.header}>💥 G-Force Analysis</Text>

        <View style={styles.gBox}>
          <Text style={styles.gLabel}>G-Force</Text>
          <Text style={[styles.gValue, { color: riskColor }]}>
            {gForce.toFixed(1)} g
          </Text>
        </View>
      </View>

      {/* RISK */}
      <View style={[styles.riskCard, { borderColor: riskColor }]}>
        <Text style={[styles.riskTitle, { color: riskColor }]}>
          ⚠ Risk Level
        </Text>
        <Text style={styles.riskTier}>{riskLevel}</Text>
        <Text style={styles.riskText}>{riskText}</Text>
      </View>

      {/* ACTION */}
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
          <Text style={styles.backText}>Back</Text>
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
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  label: { color: '#aaa', fontSize: 13 },
  value: { color: '#fff', fontWeight: '600' },

  highlight: { color: '#2ed573', fontWeight: '700' },

  gBox: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
  },

  gLabel: { color: '#aaa', fontSize: 12 },
  gValue: { fontSize: 32, fontWeight: '900' },

  riskCard: {
    borderWidth: 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  riskTitle: { fontWeight: '700', marginBottom: 5 },
  riskTier: { color: '#fff', fontWeight: '600' },
  riskText: { color: '#ccc', marginTop: 5 },

  saveBtn: {
    backgroundColor: '#2ed573',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveText: { color: '#fff', fontWeight: '700' },

  backBtn: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  backText: { color: '#4A90E2', fontWeight: '700' },

  banner: {
    backgroundColor: '#ffa502',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  bannerText: { fontWeight: '700', color: '#000', textAlign: 'center' },
});