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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { addDocument } from '../../services/firestoreService';
import { Accelerometer } from 'expo-sensors';

type Nav = StackNavigationProp<RootStackParamList, 'Act7Experiment3'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ExperimentPage3: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const { profile } = useAuth();

    // Accumulate all previous records
    const previousDocIds = route.params?.docIds || [];

    const [isRecording, setIsRecording] = useState(false);
    const [timerValue, setTimerValue] = useState(60);
    const [respirationRate, setRespirationRate] = useState(0);
    const [useSimulation, setUseSimulation] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const timerIntervalRef = useRef<any>(null);
    const startTimeRef = useRef<number>(0);
    const isRecordingRef = useRef(false);

    const accelDataRef = useRef<{ x: number; y: number; z: number }[]>([]);
    const lastSavedDocIdRef = useRef<string | null>(null);

    useEffect(() => {
        const checkSensors = async () => {
            try {
                const accelAvailable = await Accelerometer.isAvailableAsync();
                if (!accelAvailable) setUseSimulation(true);
                else await Accelerometer.requestPermissionsAsync();
            } catch (e) {
                setUseSimulation(true);
            }
        };
        checkSensors();
    }, []);

    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;
        if (isRecording) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            );
            animation.start();
        } else pulseAnim.setValue(1);
        return () => animation?.stop();
    }, [isRecording, pulseAnim]);

    useEffect(() => {
        let accelSubscription: any = null;
        let simulationInterval: any = null;

        if (isRecording) {
            startTimeRef.current = Date.now();
            setTimerValue(60);
            setRespirationRate(0);
            accelDataRef.current = [];

            timerIntervalRef.current = setInterval(() => {
                setTimerValue(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        handleRecord();
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
                    if (accelDataRef.current.length >= 30) {
                        const samples = accelDataRef.current.slice(-30);
                        const zs = samples.map(s => s.z);
                        const avg = zs.reduce((a, b) => a + b, 0) / zs.length;
                        let peaks = 0;
                        let lastState = 0;
                        const threshold = 0.012;
                        for (let i = 1; i < zs.length; i++) {
                            const diff = zs[i] - avg;
                            if (diff > threshold && lastState <= 0) { peaks++; lastState = 1; }
                            else if (diff < -threshold) lastState = -1;
                        }
                        setRespirationRate(peaks * 20);
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
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = (n: number) => (n < 10 ? `0${n}` : n);
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    const handleRecord = async () => {
        if (isRecordingRef.current) {
            setIsRecording(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            Vibration.vibrate(500);
            try {
                const finalRate = respirationRate || 20;
                const duration = 60 - timerValue;
                const resultData = {
                    userId: profile?.uid || 'anonymous',
                    fullName: profile?.fullName || 'Anonymous',
                    respirationRate: finalRate,
                    duration: duration,
                    act: 7,
                    phase: 3,
                    createdAt: new Date(),
                };
                const docId = await addDocument('experiments', resultData);
                lastSavedDocIdRef.current = docId;
                Alert.alert('Experiment 3 Recorded!', `Rate: ${finalRate} BPM`, [{
                    text: 'OK',
                    onPress: () => navigation.navigate('Act7Result3', { docIds: [...previousDocIds, docId] })
                }]);
            } catch (error) { console.error(error); }
        } else setIsRecording(true);
    };

    const handleRestart = () => {
        setIsRecording(false);
        setTimerValue(60);
        setRespirationRate(0);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        Alert.alert('Reset', 'Experiment 3 cleared.');
    };

    const handleContinue = () => {
        navigation.navigate('Act7Result3', { docIds: lastSavedDocIdRef.current ? [...previousDocIds, lastSavedDocIdRef.current] : previousDocIds });
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/OnBoardingAssets/bgImg.png')} style={styles.background} resizeMode="cover">
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/act5/crossBtn.png')} style={styles.closeIcon} />
                </TouchableOpacity>
                <Image source={require('../../assets/act7/act7Title.png')} style={styles.titleBubble} resizeMode="contain" />
                <View style={styles.boxContainer}>
                    <Image source={require('../../assets/ExperimentAssets/act7ExperimentBox3.png')} style={styles.experimentBox} resizeMode="contain" />
                    <View style={styles.respirationContainer}>
                        <Image source={require('../../assets/ExperimentAssets/respirationRate.png')} style={styles.respirationBox} />
                        <Text style={styles.respirationText}>{respirationRate} BPM</Text>
                    </View>
                    <View style={styles.timerContainer}>
                        <Image source={require('../../assets/ExperimentAssets/timerBox.png')} style={styles.timerBox} />
                        <Text style={styles.timerText}>{formatTime(timerValue)}</Text>
                    </View>
                    <TouchableOpacity style={styles.recordButtonContainer} onPress={handleRecord}>
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <Image source={isRecording ? require('../../assets/ExperimentAssets/stopBtn.png') : require('../../assets/ExperimentAssets/recordBtn.png')} style={styles.recordButton} />
                        </Animated.View>
                    </TouchableOpacity>
                    <View style={styles.bottomButtonsRow}>
                        <TouchableOpacity style={styles.bottomBtn} onPress={handleRestart}>
                            <Image source={require('../../assets/ExperimentAssets/restartBtn.png')} style={styles.btnImg} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomBtn} onPress={handleContinue}>
                            <Image source={require('../../assets/EquipmentAssets/continueBtn.png')} style={styles.btnImg} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={require('../../assets/act7/jupiter.png')} style={styles.jupiterPlanet} />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08121E' },
    background: { flex: 1, width: '100%', height: '100%' },
    closeButton: { position: 'absolute', top: s(70), left: s(28), width: s(55), height: s(55), zIndex: 10 },
    closeIcon: { width: s(45), height: s(45) },
    titleBubble: { position: 'absolute', top: s(130), alignSelf: 'center', width: s(390), height: s(180), left: s(30) },
    boxContainer: { position: 'absolute', top: s(320), alignSelf: 'center', width: s(374), height: s(583), zIndex: 2 },
    experimentBox: { width: '100%', height: '100%' },
    respirationContainer: { position: 'absolute', top: s(170), alignSelf: 'center', width: s(220), height: s(50), flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(10), left: s(30) },
    respirationBox: { position: 'absolute', width: '110%', height: '71%' },
    respirationText: { fontFamily: FONTS.title, fontSize: s(12), color: '#08121E', marginLeft: s(160), marginTop: s(2) },
    timerContainer: { position: 'absolute', top: s(235), alignSelf: 'center', width: s(140), height: s(60), justifyContent: 'center', alignItems: 'center' },
    timerBox: { position: 'absolute', width: '100%', height: '100%' },
    timerText: { fontFamily: FONTS.title, fontSize: s(14), color: '#08121E', marginTop: s(27), left: s(18) },
    recordButtonContainer: { position: 'absolute', top: s(300), alignSelf: 'center', width: s(100), height: s(100), justifyContent: 'center', alignItems: 'center' },
    recordButton: { width: s(95), height: s(95) },
    bottomButtonsRow: { position: 'absolute', bottom: s(26), width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: s(25) },
    bottomBtn: { width: s(135), height: s(38) },
    btnImg: { width: '100%', height: '100%' },
    jupiterPlanet: { position: 'absolute', bottom: s(-30), right: s(-40), width: s(480), height: s(280), zIndex: 1 },
});

export default ExperimentPage3;
