import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Animated,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { addDocument, deleteDocument } from '../../services/firestoreService';
import { Accelerometer, Gyroscope } from 'expo-sensors';

type Nav = StackNavigationProp<RootStackParamList, 'Act5Experiment'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ExperimentPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const { profile } = useAuth();
    
    const previousDocIds = route.params?.docIds || [];
    
    const [isRecording, setIsRecording] = useState(false);
    const [speed, setSpeed] = useState(0);
    const [smoothness, setSmoothness] = useState(0);
    const [rangeOfMotion, setRangeOfMotion] = useState(0);
    const [useSimulation, setUseSimulation] = useState(false);

    // Pulse animation for the record button when active
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Motion tracking refs
    const speedRef = useRef(0);
    const cumulativeRotationRef = useRef(0);
    const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
    const lastTimestampRef = useRef(0);
    const speedHistoryRef = useRef<number[]>([]);
    const smoothnessHistoryRef = useRef<number[]>([]);
    const lastSavedDocIdRef = useRef<string | null>(null);
    const startTimeRef = useRef(0);

    // Check sensor availability on mount to determine simulation mode fallback
    useEffect(() => {
        const checkSensors = async () => {
            try {
                const accelAvailable = await Accelerometer.isAvailableAsync();
                const gyroAvailable = await Gyroscope.isAvailableAsync();
                
                // If either sensor is unavailable (e.g. simulator), fall back to simulation mode
                if (!accelAvailable || !gyroAvailable) {
                    setUseSimulation(true);
                    console.log('[Experiment] Hardware sensors not available. Simulation mode enabled.');
                } else {
                    // Request permission if supported
                    if (Accelerometer.requestPermissionsAsync) {
                        await Accelerometer.requestPermissionsAsync();
                    }
                    if (Gyroscope.requestPermissionsAsync) {
                        await Gyroscope.requestPermissionsAsync();
                    }
                    console.log('[Experiment] Hardware sensors active.');
                }
            } catch (e) {
                setUseSimulation(true);
                console.log('[Experiment] Sensor check failed, enabled simulation mode:', e);
            }
        };
        checkSensors();
    }, []);

    // Button pulse animation effect
    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;
        if (isRecording) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.15,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
        } else {
            pulseAnim.setValue(1);
        }
        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [isRecording, pulseAnim]);

    // Sensor integration & tracking effect
    useEffect(() => {
        let accelSubscription: any = null;
        let gyroSubscription: any = null;
        let simulationInterval: any = null;

        if (isRecording) {
            // Reset tracking session stats
            startTimeRef.current = Date.now();
            speedRef.current = 0;
            cumulativeRotationRef.current = 0;
            lastTimestampRef.current = Date.now();
            speedHistoryRef.current = [];
            smoothnessHistoryRef.current = [];
            
            setSpeed(0);
            setSmoothness(0);
            setRangeOfMotion(0);

            if (useSimulation) {
                // Simulation mode: updates numbers continuously to model circle/figure-8 movement
                simulationInterval = setInterval(() => {
                    const time = Date.now() / 1000;
                    // Simulated speeds: wave pattern mimicking circular rotation
                    const simSpeed = 1.2 + 0.6 * Math.sin(time * 2.5);
                    const simSmoothness = simSpeed * (0.85 + 0.1 * Math.cos(time * 1.5));
                    
                    cumulativeRotationRef.current += 3.5; // increments range of motion continuously

                    speedRef.current = simSpeed;
                    speedHistoryRef.current.push(simSpeed);
                    smoothnessHistoryRef.current.push(simSmoothness);

                    setSpeed(simSpeed);
                    setSmoothness(simSmoothness);
                    setRangeOfMotion(cumulativeRotationRef.current);
                }, 100);
            } else {
                // Real sensor mode: Accelerometer + Gyroscope integration
                try {
                    Accelerometer.setUpdateInterval(100);
                    accelSubscription = Accelerometer.addListener(data => {
                        const now = Date.now();
                        const dt = (now - lastTimestampRef.current) / 1000 || 0.1;
                        lastTimestampRef.current = now;

                        const { x, y, z } = data;
                        const magnitude = Math.sqrt(x * x + y * y + z * z);
                        const dynamicAccel = Math.abs(magnitude - 1) * 9.81;

                        // Jerk calculations
                        const lastMag = Math.sqrt(
                            lastAccelRef.current.x * lastAccelRef.current.x +
                            lastAccelRef.current.y * lastAccelRef.current.y +
                            lastAccelRef.current.z * lastAccelRef.current.z
                        );
                        const jerk = Math.abs(magnitude - lastMag) * 9.81 / dt;
                        lastAccelRef.current = data;

                        // Integrate speed (v = v * decay + dynamicAccel * dt)
                        speedRef.current = speedRef.current * 0.9 + dynamicAccel * dt;
                        if (speedRef.current < 0.05) speedRef.current = 0;

                        // Smoothness metric (lower jerk = higher smoothness factor)
                        const currentJerk = jerk || 0;
                        const smoothnessFactor = Math.max(0.1, 1 - Math.min(0.9, currentJerk / 25));
                        const currentSmoothness = speedRef.current * smoothnessFactor;

                        speedHistoryRef.current.push(speedRef.current);
                        smoothnessHistoryRef.current.push(currentSmoothness);

                        setSpeed(speedRef.current);
                        setSmoothness(currentSmoothness);
                    });
                } catch (err) {
                    console.warn('Accelerometer listener error:', err);
                }

                try {
                    Gyroscope.setUpdateInterval(100);
                    gyroSubscription = Gyroscope.addListener(data => {
                        const now = Date.now();
                        const dt = (now - lastTimestampRef.current) / 1000 || 0.1;

                        const { x, y, z } = data;
                        const angularSpeedRad = Math.sqrt(x * x + y * y + z * z);
                        const angularSpeedDeg = angularSpeedRad * (180 / Math.PI);

                        cumulativeRotationRef.current += angularSpeedDeg * dt;
                        setRangeOfMotion(cumulativeRotationRef.current);
                    });
                } catch (err) {
                    console.warn('Gyroscope listener error:', err);
                }
            }
        }

        return () => {
            if (accelSubscription) {
                try { accelSubscription.remove(); } catch (e) {}
            }
            if (gyroSubscription) {
                try { gyroSubscription.remove(); } catch (e) {}
            }
            if (simulationInterval) clearInterval(simulationInterval);
        };
    }, [isRecording, useSimulation]);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        navigation.navigate('Act5RecordingResult', { docIds: previousDocIds });
    };

    const handleRecord = async () => {
        if (isRecording) {
            // Stopping recording
            setIsRecording(false);

            // Compute final summary statistics
            const endTime = Date.now();
            const durationSeconds = Math.max(0.1, (endTime - startTimeRef.current) / 1000);

            const avgSpeed = speedHistoryRef.current.length > 0
                ? speedHistoryRef.current.reduce((a, b) => a + b, 0) / speedHistoryRef.current.length
                : 0;
            const avgSmoothness = smoothnessHistoryRef.current.length > 0
                ? smoothnessHistoryRef.current.reduce((a, b) => a + b, 0) / smoothnessHistoryRef.current.length
                : 0;
            const finalRangeOfMotion = cumulativeRotationRef.current;

            // Save to database
            try {
                const experimentData = {
                    userId: profile?.uid || 'anonymous',
                    fullName: profile?.fullName || 'Anonymous Explorer',
                    averageSpeed: parseFloat(avgSpeed.toFixed(2)),
                    averageSmoothness: parseFloat(avgSmoothness.toFixed(2)),
                    rangeOfMotion: parseFloat(finalRangeOfMotion.toFixed(0)),
                    duration: parseFloat(durationSeconds.toFixed(1)),
                    createdAt: new Date(),
                };

                const docId = await addDocument('experiments', experimentData);
                lastSavedDocIdRef.current = docId;
                
                Alert.alert(
                    'Tracking Saved!',
                    `Your performance has been uploaded successfully:\n\n• Speed: ${avgSpeed.toFixed(2)} m/s\n• Smoothness: ${avgSmoothness.toFixed(2)} m/s\n• Range of Motion: ${finalRangeOfMotion.toFixed(0)} degrees\n• Duration: ${durationSeconds.toFixed(1)} seconds`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('Act5RecordingResult', {
                                    docIds: [...previousDocIds, docId]
                                });
                            }
                        }
                    ]
                );
            } catch (error) {
                console.error('Firestore save failed:', error);
                Alert.alert('Database Sync Failed', 'Your motion stats could not be saved.');
            }
        } else {
            // Starting recording
            setIsRecording(true);
        }
    };

    const handleRestart = async () => {
        // Reset tracking metrics immediately
        setSpeed(0);
        setSmoothness(0);
        setRangeOfMotion(0);

        speedRef.current = 0;
        cumulativeRotationRef.current = 0;
        speedHistoryRef.current = [];
        smoothnessHistoryRef.current = [];

        // Stop current recording
        setIsRecording(false);

        // Delete the last saved recording in the database if it exists
        if (lastSavedDocIdRef.current) {
            try {
                await deleteDocument('experiments', lastSavedDocIdRef.current);
                console.log('[Experiment] Deleted previous database entry:', lastSavedDocIdRef.current);
                lastSavedDocIdRef.current = null;
                Alert.alert('Recording Deleted', 'Your previous recording was deleted from the database.');
            } catch (error) {
                console.error('[Experiment] Failed to delete document:', error);
                Alert.alert('Delete Failed', 'Failed to delete the previous recording from the database.');
            }
        } else {
            Alert.alert('Reset', 'Recording metrics have been cleared.');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Close (X) button — top left */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../../assets/act5/crossBtn.png')}
                        style={styles.closeIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Title bubble — "Stretch Speed & Gracefulness" */}
                <Image
                    source={require('../../assets/act5/act5Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* Experiment box container */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/ExperimentAssets/experimentBox.png')}
                        style={styles.experimentBox}
                        resizeMode="contain"
                    />

                    {/* Writing values of Speed, Smoothness, and Range of motion overlay */}
                    <View style={styles.metricsContainer}>
                        <Text style={styles.metricText}>Speed  {speed.toFixed(2)} m/s</Text>
                        <Text style={styles.metricText}>Smoothness  {smoothness.toFixed(2)} m/s</Text>
                        <Text style={styles.metricText}>Range of motion  {rangeOfMotion.toFixed(0)} degrees</Text>
                    </View>

                    {/* Record button below the values box */}
                    <TouchableOpacity
                        style={styles.recordButtonContainer}
                        onPress={handleRecord}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <Image
                                source={
                                    isRecording
                                        ? require('../../assets/ExperimentAssets/stopBtn.png')
                                        : require('../../assets/ExperimentAssets/recordBtn.png')
                                }
                                style={styles.recordButton}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Restart Button */}
                    <TouchableOpacity
                        style={styles.restartButton}
                        onPress={handleRestart}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../assets/ExperimentAssets/restartBtn.png')}
                            style={styles.restartImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../assets/EquipmentAssets/continueBtn.png')}
                            style={styles.continueImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Saturn planet — bottom of the screen */}
                <Image
                    source={require('../../assets/act5/saturnPlanet.png')}
                    style={styles.saturnPlanet}
                    resizeMode="contain"
                />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08121E',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    /* Close button — top left corner */
    closeButton: {
        position: 'absolute',
        top: s(70),
        left: s(28),
        width: s(55),
        height: s(55),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: s(45),
        height: s(45),
    },

    /* Title bubble — "Stretch Speed & Gracefulness" */
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
    },

    /* Experiment Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(340),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 2,
    },
    experimentBox: {
        width: '100%',
        height: '100%',
    },

    /* Metrics values container — positions inside the white rounded box in experimentBox */
    metricsContainer: {
        position: 'absolute',
        top: s(175),
        left: s(40),
        width: s(260),
        height: s(76),
        justifyContent: 'space-between',
        paddingVertical: s(12),
    },
    metricText: {
        fontFamily: FONTS.title,
        fontSize: s(10),
        color: '#08121E',
    },

    /* Record button container — positions in the center of the dashed box below metrics */
    recordButtonContainer: {
        position: 'absolute',
        top: s(300),
        alignSelf: 'center',
        width: s(90),
        height: s(87),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: s(90),
        height: s(87),
    },

    /* Restart button — aligned bottom left inside the container */
    restartButton: {
        position: 'absolute',
        bottom: s(28),
        left: s(22),
        width: s(141),
        height: s(41),
        zIndex: 10,
    },
    restartImage: {
        width: '100%',
        height: '100%',
    },

    /* Continue button — aligned bottom right inside the container */
    continueButton: {
        position: 'absolute',
        bottom: s(28),
        right: s(22),
        width: s(141),
        height: s(41),
        zIndex: 10,
    },
    continueImage: {
        width: '100%',
        height: '100%',
    },

    /* Saturn planet — bottom of screen, partially cut off */
    saturnPlanet: {
        position: 'absolute',
        bottom: s(-30),
        right: s(-40),
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

export default ExperimentPage;
