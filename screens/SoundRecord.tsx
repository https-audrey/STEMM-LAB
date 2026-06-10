import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { saveSoundRecord } from '../src/services/db';

type Props = NativeStackScreenProps<RootStackParamList, 'SoundRecord'>;

export default function SoundRecord({ route, navigation }: Props) {
    const {
        currentSessionId,
        latitude,
        longitude,
        accuracy,
        location_description,
        action,
    } = route.params;

    const [isRecording, setIsRecording] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [currentDB, setCurrentDB] = useState(0);
    const [peakDB, setPeakDB] = useState(0);
    const [readings, setReadings] = useState<number[]>([]);
    const [duration, setDuration] = useState(0);
    
    const recordingRef = useRef<Audio.Recording | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    // Request microphone permission on mount
    useEffect(() => {
        requestMicrophonePermission();
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (recordingRef.current) {
                recordingRef.current.stopAndUnloadAsync();
            }
        };
    }, []);

    const requestMicrophonePermission = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status === 'granted') {
                setHasPermission(true);
            } else {
                Alert.alert(
                    'Permission Required',
                    'Microphone access is needed to measure sound levels.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (error) {
            console.error('Microphone permission error:', error);
        }
    };

    const startRecording = async () => {
        try {
            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await recording.startAsync();
            recordingRef.current = recording;
            
            setIsRecording(true);
            setPeakDB(0);
            setReadings([]);
            setDuration(0);
            startTimeRef.current = Date.now();

            // Update sound levels every 200ms
            intervalRef.current = setInterval(async () => {
                if (recordingRef.current) {
                    const status = await recordingRef.current.getStatusAsync();

                    if (status.isRecording) {
                        console.log(status);
                        // Get metering (Apple's scale: 0 to -160 dB)
                        const meterValue =
                            typeof status.metering === 'number'
                                ? status.metering
                                : -160;
                        
                        // Convert to positive dB scale (0-120)
                        // Apple's meter: 0 = loudest, -160 = quietest
                        const positiveDB = Math.max(0, Math.min(120, 120 + meterValue));
                        
                        setCurrentDB(positiveDB);
                        setPeakDB(prev => Math.max(prev, positiveDB));
                        setReadings(prev => {
                            const newReadings = [...prev, positiveDB];
                            return newReadings;
                        });
                        
                        const elapsed = (Date.now() - startTimeRef.current) / 1000;
                        setDuration(elapsed);
                    }
                }
            }, 200);

        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'Failed to start sound recording.');
        }
    };

    const stopRecordingAndSave = async () => {
        // Stop interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // Stop recording
        if (recordingRef.current) {
            await recordingRef.current.stopAndUnloadAsync();
            recordingRef.current = null;
        }
        
        setIsRecording(false);
        
        // Calculate average dB
        const avgDB = readings.length > 0 
            ? readings.reduce((a, b) => a + b, 0) / readings.length 
            : currentDB;
        
        // Calculate dot color
        const getDotColor = (db: number): string => {
            if (db < 40) return '#2ed573';
            if (db < 60) return '#ffa502';
            if (db < 85) return '#ff6b81';
            return '#ff4757';
        };
        
        // Save to database
        try {
            await saveSoundRecord({
                session_id: currentSessionId,
                latitude,
                longitude,
                accuracy,
                location_description,
                action,
                sound_level_db: peakDB,
                duration: duration,
                dot_color: getDotColor(peakDB),
            });
            
            Alert.alert(
                'Recording Saved',
                `Peak: ${peakDB.toFixed(1)} dB\nAverage: ${avgDB.toFixed(1)} dB\nDuration: ${duration.toFixed(1)}s`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.replace('SoundActivity', { currentSessionId })
                    }
                ]
            );
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save recording.');
        }
    };

    const cancelRecording = () => {
        Alert.alert(
            'Cancel Recording',
            'Are you sure you want to cancel? This recording will not be saved.',
            [
                { text: 'Continue Recording', style: 'cancel' },
                { 
                    text: 'Cancel', 
                    style: 'destructive',
                    onPress: async () => {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        if (recordingRef.current) {
                            await recordingRef.current.stopAndUnloadAsync();
                        }
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const getRiskLevel = (db: number) => {
        if (db < 40) return { text: 'Quiet', color: '#2ed573' };
        if (db < 60) return { text: 'Normal', color: '#ffa502' };
        if (db < 85) return { text: 'Loud', color: '#ff6b81' };
        return { text: 'Very Loud', color: '#ff4757' };
    };

    const risk = getRiskLevel(currentDB);

    if (!hasPermission) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.centerText}>Requesting microphone permission...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={cancelRecording} style={styles.cancelHeaderButton}>
                    <Text style={styles.cancelHeaderText}>Cancel</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Sound Meter</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{location_description}</Text>
                <Text style={styles.infoLabel}>Action:</Text>
                <Text style={styles.infoValue}>{action}</Text>
            </View>

            <View style={styles.meterContainer}>
                <Text style={[styles.dbValue, { color: risk.color }]}>{currentDB.toFixed(1)}</Text>
                <Text style={styles.dbUnit}>dB</Text>
                <Text style={[styles.riskText, { color: risk.color }]}>{risk.text}</Text>
            </View>

            <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${(currentDB / 120) * 100}%`, backgroundColor: risk.color }]} />
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Peak</Text>
                    <Text style={styles.statValue}>{peakDB.toFixed(1)} dB</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>{duration.toFixed(1)} s</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Samples</Text>
                    <Text style={styles.statValue}>{readings.length}</Text>
                </View>
            </View>

            <View style={styles.referenceCard}>
                <Text style={styles.referenceTitle}>Reference Guide</Text>
                <Text style={styles.referenceText}>🔇 0-40 dB: Whisper</Text>
                <Text style={styles.referenceText}>🗣️ 40-60 dB: Conversation</Text>
                <Text style={styles.referenceText}>🚗 60-85 dB: Traffic</Text>
                <Text style={styles.referenceText}>⚠️ 85+ dB: Hearing risk</Text>
            </View>

            <View style={styles.buttonContainer}>
                {!isRecording ? (
                    <Pressable style={styles.startButton} onPress={startRecording}>
                        <Ionicons name="mic" size={24} color="white" />
                        <Text style={styles.buttonText}>Start Recording</Text>
                    </Pressable>
                ) : (
                    <Pressable style={styles.stopButton} onPress={stopRecordingAndSave}>
                        <Ionicons name="stop" size={24} color="white" />
                        <Text style={styles.buttonText}>Stop & Save</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#071A3D', padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#071A3D' },
    centerText: { color: '#fff', marginTop: 20 },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
    cancelHeaderButton: { padding: 10 },
    cancelHeaderText: { color: '#ff4757', fontSize: 16 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    headerSpacer: { width: 60 },
    
    infoCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 15, marginBottom: 20 },
    infoLabel: { color: '#aaa', fontSize: 12, marginBottom: 4 },
    infoValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    
    meterContainer: { alignItems: 'center', marginBottom: 20 },
    dbValue: { fontSize: 80, fontWeight: 'bold' },
    dbUnit: { fontSize: 24, color: '#888' },
    riskText: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
    
    barContainer: { height: 20, backgroundColor: '#333', borderRadius: 10, overflow: 'hidden', marginBottom: 30 },
    bar: { height: '100%', borderRadius: 10 },
    
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
    statBox: { alignItems: 'center' },
    statLabel: { color: '#888', fontSize: 12 },
    statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    
    referenceCard: { backgroundColor: 'rgba(74,144,226,0.1)', borderRadius: 12, padding: 15, marginBottom: 30 },
    referenceTitle: { color: '#4A90E2', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    referenceText: { color: '#ddd', fontSize: 12, marginBottom: 4 },
    
    buttonContainer: { marginBottom: 20 },
    startButton: { backgroundColor: '#2ed573', flexDirection: 'row', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 },
    stopButton: { backgroundColor: '#ff4757', flexDirection: 'row', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});