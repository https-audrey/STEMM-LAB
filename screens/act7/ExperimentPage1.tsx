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
    Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { addDocument } from '../../services/firestoreService';
import { Accelerometer } from 'expo-sensors';

type Nav = StackNavigationProp<RootStackParamList, 'Act7Experiment1'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ExperimentPage1: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { profile } = useAuth();

    const [isRecording, setIsRecording] = useState(false);
    const [timerValue, setTimerValue] = useState(60); // countdown starting from 60
    const [respirationRate, setRespirationRate] = useState(0);
    const [useSimulation, setUseSimulation] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const timerIntervalRef = useRef<any>(null);
    const startTimeRef = useRef<number>(0);
    const isRecordingRef = useRef(false);

    // Breathing tracking refs
    const accelDataRef = useRef<{ x: number; y: number; z: number }[]>([]);
    const lastSavedDocIdRef = useRef<string | null>(null);

    useEffect(() => {
        const checkSensors = async () => {
            try {
                const accelAvailable = await Accelerometer.isAvailableAsync();
                if (!accelAvailable) {
                    setUseSimulation(true);
                } else {
                    await Accelerometer.requestPermissionsAsync();
                }
            } catch (e) {
                setUseSimulation(true);
            }
        };
        checkSensors();
    }, []);

    // Toggle recording ref
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    // Pulse animation
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
        return () => animation?.stop();
    }, [isRecording, pulseAnim]);

    // Timer and Measurement Logic
    useEffect(() => {
        let accelSubscription: any = null;
        let simulationInterval: any = null;

        if (isRecording) {
            startTimeRef.current = Date.now();
            setTimerValue(60);
            setRespirationRate(0);
            accelDataRef.current = [];

            // Timer interval (Countdown)
            timerIntervalRef.current = setInterval(() => {
                setTimerValue(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        handleRecord(); // Stop recording when timer hits 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            if (useSimulation) {
                simulationInterval = setInterval(() => {
                    const rate = 12 + Math.floor(Math.random() * 8);
                    setRespirationRate(rate);
                }, 3000);
            } else {
                Accelerometer.setUpdateInterval(100);
                accelSubscription = Accelerometer.addListener(data => {
                    accelDataRef.current.push(data);
                    
                    // Increased sensitivity: Analyze every 30 samples (~3 seconds)
                    if (accelDataRef.current.length >= 30) {
                        const samples = accelDataRef.current.slice(-30);
                        const zs = samples.map(s => s.z);
                        const avg = zs.reduce((a, b) => a + b, 0) / zs.length;

                        let peaks = 0;
                        let lastState = 0; 
                        const threshold = 0.012; // Lower threshold = Higher sensitivity

                        for (let i = 1; i < zs.length; i++) {
                            const diff = zs[i] - avg;
                            if (diff > threshold && lastState <= 0) {
                                peaks++;
                                lastState = 1;
                            } else if (diff < -threshold) {
                                lastState = -1;
                            }
                        }
                        // Multiply by 20 to get BPM (3s * 20 = 60s)
                        const bpm = peaks * 20;
                        setRespirationRate(bpm);
                        accelDataRef.current = [];
                    }
                });
            }
        }

        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (simulationInterval) clearInterval(simulationInterval);
            if (accelSubscription) accelSubscription.remove();
        };
    }, [isRecording, useSimulation]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => (n < 10 ? `0${n}` : n);
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const handleRecord = async () => {
        if (isRecordingRef.current) {
            setIsRecording(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            
            // Vibrate device on stop
            Vibration.vibrate(500);

            // Save result
            try {
                const finalRate = respirationRate || 15;
                const duration = 60 - timerValue; // Actual elapsed time

                const resultData = {
                    userId: profile?.uid || 'anonymous',
                    fullName: profile?.fullName || 'Anonymous',
                    respirationRate: finalRate,
                    duration: duration,
                    act: 7,
                    phase: 1,
                    createdAt: new Date(),
                };

                const docId = await addDocument('experiments', resultData);
                lastSavedDocIdRef.current = docId;

                Alert.alert(
                    'Experiment Recorded!',
                    `Respiration Rate: ${finalRate} BPM\nDuration: ${duration}s`,
                    [{
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Act7Result1', {
                                docIds: [...(lastSavedDocIdRef.current ? [lastSavedDocIdRef.current] : [])]
                            });
                        }
                    }]
                );
            } catch (error) {
                console.error('Save failed:', error);
            }
        } else {
            setIsRecording(true);
        }
    };

    const handleRestart = () => {
        setIsRecording(false);
        setTimerValue(60);
        setRespirationRate(0);
        accelDataRef.current = [];
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        Alert.alert('Reset', 'Metrics have been cleared.');
    };

    const handleContinue = () => {
        navigation.navigate('Act7Result1', { docIds: lastSavedDocIdRef.current ? [lastSavedDocIdRef.current] : [] });
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Image
                        source={require('../../assets/act5/crossBtn.png')}
                        style={styles.closeIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Title */}
                <Image
                    source={require('../../assets/act7/act7Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* Experiment Box */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/ExperimentAssets/act7ExperimentBox1.png')}
                        style={styles.experimentBox}
                        resizeMode="contain"
                    />

                    {/* Respiration Rate Section */}
                    <View style={styles.respirationContainer}>
                        <Image
                            source={require('../../assets/ExperimentAssets/respirationRate.png')}
                            style={styles.respirationBox}
                            resizeMode="contain"
                        />
                        <Text style={styles.respirationText}>
                            {respirationRate} BPM
                        </Text>
                    </View>

                    {/* Timer Section */}
                    <View style={styles.timerContainer}>
                        <Image
                            source={require('../../assets/ExperimentAssets/timerBox.png')}
                            style={styles.timerBox}
                            resizeMode="contain"
                        />
                        <Text style={styles.timerText}>
                            {formatTime(timerValue)}
                        </Text>
                    </View>

                    {/* Record Button */}
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

                    {/* Restart & Continue Buttons */}
                    <View style={styles.bottomButtonsRow}>
                        <TouchableOpacity style={styles.bottomBtn} onPress={handleRestart}>
                            <Image
                                source={require('../../assets/ExperimentAssets/restartBtn.png')}
                                style={styles.btnImg}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bottomBtn} onPress={handleContinue}>
                            <Image
                                source={require('../../assets/EquipmentAssets/continueBtn.png')}
                                style={styles.btnImg}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Jupiter Planet */}
                <Image
                    source={require('../../assets/act7/jupiter.png')}
                    style={styles.jupiterPlanet}
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
    titleBubble: {
        position: 'absolute',
        top: s(130),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
    },
    boxContainer: {
        position: 'absolute',
        top: s(320),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 2,
    },
    experimentBox: {
        width: '100%',
        height: '100%',
    },
    respirationContainer: {
        position: 'absolute',
        top: s(170),
        alignSelf: 'center',
        width: s(220),
        height: s(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(10),
        left: s(30),
    },
    respirationBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    respirationText: {
        fontFamily: FONTS.title,
        fontSize: s(12),
        color: '#08121E',
        marginLeft: s(135), // Adjusted for internal text placement
        marginTop: s(2),
    },
    timerContainer: {
        position: 'absolute',
        top: s(215),
        alignSelf: 'center',
        width: s(140),
        height: s(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    timerText: {
        fontFamily: FONTS.title,
        fontSize: s(14),
        color: '#08121E',
        marginTop: s(27),
        left: s(18),
    },
    recordButtonContainer: {
        position: 'absolute',
        top: s(300),
        alignSelf: 'center',
        width: s(100),
        height: s(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: s(95),
        height: s(95),
    },
    bottomButtonsRow: {
        position: 'absolute',
        bottom: s(30),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: s(25),
    },
    bottomBtn: {
        width: s(145),
        height: s(45),
    },
    btnImg: {
        width: '100%',
        height: '100%',
    },
    jupiterPlanet: {
        position: 'absolute',
        bottom: s(-30),
        right: s(-40),
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

export default ExperimentPage1;
