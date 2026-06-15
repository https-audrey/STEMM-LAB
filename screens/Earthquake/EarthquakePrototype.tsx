import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Vibration } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useBatteryWarning } from '../../hooks/useBatteryWarning';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EarthquakePrototype'
>;

export default function EarthquakePrototype({
  route,
  navigation,
}: Props) {
  const {
    currentSessionId,
    prototype,
    description,
  } = route.params;

  const [isTesting, setIsTesting] = useState(false);
  const [peakAccel, setPeakAccel] = useState(0);
  const [avgAccel, setAvgAccel] = useState(0);
  const [readings, setReadings] = useState<number[]>([]);
  const [testDuration, setTestDuration] = useState(0);
  
  const subscription = useRef<any>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startTime = useRef<number>(0);
    const isTestingRef = useRef(false);

    const peakAccelRef = useRef<number>(0);
    const readingsRef = useRef<number[]>([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      Vibration.cancel();
    };
  }, []);

  // Key fixes in startEarthquakeTest function
  const startTest = async () => {
      try {
          // Clear previous data
          setPeakAccel(0);
          setAvgAccel(0);
          setReadings([]);
          setTestDuration(0);

          peakAccelRef.current = 0;
          readingsRef.current = [];

          setIsTesting(true);
          isTestingRef.current = true;
          startTime.current = Date.now();

          // Ensure any existing subscription is removed
          if (subscription.current) {
              subscription.current.remove();
              subscription.current = null;
          }

          await Accelerometer.setUpdateInterval(50); // Add await here

          subscription.current = Accelerometer.addListener(({ x, y, z }) => {
              // Ensure we're still testing before processing
              if (!isTestingRef.current) return;
              
              const magnitude = Math.sqrt(x * x + y * y + z * z);
              const vibrationMagnitude = Math.abs(magnitude - 1);

              peakAccelRef.current = Math.max(peakAccelRef.current, vibrationMagnitude);
              readingsRef.current.push(vibrationMagnitude);

              const average = readingsRef.current.reduce((a, b) => a + b, 0) / readingsRef.current.length;

              // Update state with latest values
              setPeakAccel(peakAccelRef.current);
              setAvgAccel(average);
              setReadings([...readingsRef.current]);
              setTestDuration((Date.now() - startTime.current) / 1000);
          });

          // Start vibration pattern
          Vibration.vibrate([100, 100, 100, 100, 100, 100, 100, 100], true);

          // Set timeout to auto-stop after 10 seconds
          timeoutRef.current = setTimeout(() => {
              if (isTestingRef.current) {
                  stopTest();
              }
          }, 10000);

      } catch (error) {
          console.error('Error starting test:', error);
          Alert.alert('Error', 'Failed to start earthquake test. Please check sensor permissions.');
          setIsTesting(false);
          isTestingRef.current = false;
      }
  };

  const stopTest = () => {

    if (subscription.current) {
        subscription.current.remove();
        subscription.current = null;
    }

    if (timeoutRef.current) {
        clearTimeout(
        timeoutRef.current
        );
        timeoutRef.current = null;
    }

    Vibration.cancel();

    setIsTesting(false);
    isTestingRef.current = false;

    const finalPeak =
        peakAccelRef.current;

    const finalAverage =
        readingsRef.current.length > 0
        ? readingsRef.current.reduce(
            (a, b) => a + b,
            0
            ) /
            readingsRef.current.length
        : 0;

    console.log(
        'FINAL PEAK:',
        finalPeak
    );

    console.log(
        'FINAL AVG:',
        finalAverage
    );

    navigation.navigate(
        'EarthquakeResult',
        {
        data: {
            currentSessionId,
            prototypeKey:
            prototype,
            description,

            peakAccel:
            finalPeak,

            avgAccel:
            finalAverage,

            isHistoricalView:
            false,
        },
        }
    );
    };

  const cancelTest = () => {
    Alert.alert(
      'Cancel Test',
      'Are you sure you want to cancel this test?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            if (subscription.current) {
              subscription.current.remove();
              subscription.current = null;
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            Vibration.cancel();
            setIsTesting(false);
            isTestingRef.current = false;
            navigation.goBack();
          }
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.testView}>
        {isTesting ? (
          <View style={styles.liveData}>
            <Text style={styles.liveTitle}>🔴 EARTHQUAKE SIMULATION ACTIVE</Text>
            <View style={styles.waveAnimation}>
              <View style={[styles.wave, { transform: [{ scale: 1 + peakAccel * 5 }] }]} />
              <View style={[styles.wave, { transform: [{ scale: 0.8 + peakAccel * 4 }] }]} />
              <View style={[styles.wave, { transform: [{ scale: 0.6 + peakAccel * 3 }] }]} />
            </View>
            <Text style={styles.livePeak}>Peak: {peakAccel.toFixed(3)} g</Text>
            <Text style={styles.liveAvg}>Current Avg: {avgAccel.toFixed(3)} g</Text>
            <Text style={styles.liveTime}>Duration: {formatDuration(testDuration)}</Text>
            <Text style={styles.sampleCount}>Samples: {readings.length}</Text>
          </View>
        ) : (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderText}>📱</Text>
            <Text style={styles.placeholderSubtext}>
              Place phone flat on your structure
            </Text>
            <Text style={styles.placeholderHint}>
              Phone will vibrate to simulate earthquake
            </Text>
          </View>
        )}
      </View>

      <View style={styles.overlay}>
        <Text style={styles.title}>
          🏗️ {prototype.toUpperCase()}
        </Text>

        <Text style={styles.text}>
          {description}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.subtitle}>
          Test Instructions:
        </Text>
        <Text style={styles.instruction}>
          1. Place phone flat on your structure
        </Text>
        <Text style={styles.instruction}>
          2. Ensure phone is stable and centered
        </Text>
        <Text style={styles.instruction}>
          3. Press "Start Test" to simulate earthquake
        </Text>
        <Text style={styles.instruction}>
          4. Phone will vibrate for 10 seconds
        </Text>
        <Text style={styles.instruction}>
          5. Results will be calculated automatically
        </Text>

        <View style={styles.buttonGroup}>
          {!isTesting ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startTest}
            >
              <Text style={styles.buttonText}>
                🌍 Start Earthquake Test
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopTest}
              >
                <Text style={styles.buttonText}>
                  ⏹️ Stop Test & View Results
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelTest}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {isTesting && (
          <Text style={styles.warningText}>
            ⚠️ Phone is vibrating - hold the structure steady!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A3D',
  },

  testView: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  liveData: {
    alignItems: 'center',
    padding: 20,
  },

  liveTitle: {
    color: '#ff4757',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  waveAnimation: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  wave: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff4757',
    opacity: 0.6,
  },

  livePeak: {
    color: '#ff6b81',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  liveAvg: {
    color: '#ffa502',
    fontSize: 18,
    marginBottom: 10,
  },

  liveTime: {
    color: '#fff',
    fontSize: 16,
  },

  sampleCount: {
    color: '#888',
    fontSize: 12,
    marginTop: 10,
  },

  placeholderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 80,
    marginBottom: 20,
  },

  placeholderSubtext: {
    color: '#888',
    fontSize: 16,
  },

  placeholderHint: {
    color: '#555',
    fontSize: 12,
    marginTop: 10,
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },

  text: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 15,
  },

  subtitle: {
    color: '#00d2d3',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  instruction: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
    paddingLeft: 10,
  },

  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },

  startButton: {
    backgroundColor: '#2ed573',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  stopButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#ffa502',
    fontWeight: 'bold',
    fontSize: 14,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  warningText: {
    color: '#ffa502',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
});