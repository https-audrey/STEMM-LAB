import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { saveSessionReflection, markSessionSubmitted, PrototypeRecord, getTrialsBySession, ensureSessionExists } from '../../services/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDocument } from '../../services/firestoreService';
import { sendNotification, cancelAllNotifications } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { submitActivityScore } from '../../services/scoreService';

type ParachuteActivityRouteProp = RouteProp<RootStackParamList, 'ParachuteActivity'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ParachuteActivity'>;
type PrototypeKey = 'baseline' | 'prototype1' | 'prototype2' | 'prototype3';

export default function ParachuteActivity() {
    const route = useRoute<ParachuteActivityRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { currentSessionId } = route.params;
    const { user } = useAuth();

    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const TIMER_MINUTES = 2;
    const STORAGE_KEY = `parachute_session_start_${currentSessionId}`;

    const [showSetupModal, setShowSetupModal] = useState(false);
    const [mass, setMass] = useState('');
    const [height, setHeight] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [history, setHistory] = useState<Record<PrototypeKey, PrototypeRecord[]>>({
        baseline: [],
        prototype1: [],
        prototype2: [],
        prototype3: [],
    });

    const warningsSentRef = useRef({
        tenMin: false,
        fiveMin: false,
        oneMin: false,
    });

    const [isNewSession, setIsNewSession] = useState(true);
    const autoSubmittedRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const initTimer = async () => {
            let startTime: number;
            const storedStartTime = await AsyncStorage.getItem(STORAGE_KEY);
            
            if (!storedStartTime || (route.params as any)?.forceNewSession) {
                startTime = Date.now();
                await AsyncStorage.setItem(STORAGE_KEY, startTime.toString());
            } else {
                startTime = parseInt(storedStartTime);
            }
            
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = TIMER_MINUTES * 60 - elapsed;
            
            if (remaining <= 0) {
                if (isMounted) {
                    setIsExpired(true);
                    setTimeRemaining(0);
                    if (!autoSubmittedRef.current) {
                        autoSubmit();
                    }
                }
                return;
            }
            
            if (isMounted) {
                setTimeRemaining(remaining);
            }
            
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            intervalRef.current = setInterval(() => {
                const currentElapsed = (Date.now() - startTime) / 1000;
                const currentRemaining = TIMER_MINUTES * 60 - currentElapsed;
                
                if (currentRemaining <= 0) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    if (isMounted) {
                        setIsExpired(true);
                        setTimeRemaining(0);
                        if (!autoSubmittedRef.current) {
                            autoSubmit();
                        }
                    }
                } else if (isMounted) {
                    setTimeRemaining(currentRemaining);
                }
            }, 1000);
        };
        
        initTimer();
        
        return () => {
            isMounted = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [currentSessionId, (route.params as any)?.forceNewSession]);

    useEffect(() => {
        const sendWarningNotifications = async () => {
            if (!timeRemaining || isExpired) return;
            
            const remainingSeconds = timeRemaining;
            
            if (
                remainingSeconds <= 600 &&
                remainingSeconds > 595 &&
                !warningsSentRef.current.tenMin
            ) {
                warningsSentRef.current.tenMin = true;
                await sendNotification(
                    '⚠️ 5 Minutes Remaining',
                    'Your parachute session will end in 5 minutes.'
                );
            }
            
            if (
                remainingSeconds <= 61 &&
                remainingSeconds > 55 &&
                !warningsSentRef.current.oneMin
            ) {
                warningsSentRef.current.oneMin = true;
                await sendNotification(
                    '⚠️ 1 Minute Remaining',
                    'Your parachute session will end in 1 minute. Wrap up your current test!'
                );
            }
        };
        
        sendWarningNotifications();
    }, [timeRemaining, isExpired]);

    const autoSubmit = async () => {
        if (autoSubmittedRef.current) return;

        autoSubmittedRef.current = true;

        try {
            ensureSessionExists(currentSessionId, 'parachute');

            const prototypeKeys = ['baseline', 'prototype1', 'prototype2', 'prototype3'];
            let trialCount = 0;
            for (const key of prototypeKeys) {
                if (history[key as PrototypeKey].length > 0) {
                    trialCount++;
                }
            }
            const hasReflection = reflection.trim().length > 0;

            if (user) {
                await submitActivityScore(
                    user.uid, 
                    'parachute', 
                    currentSessionId, 
                    trialCount, 
                    hasReflection
                );
            }

            if (reflection.trim()) {
                saveSessionReflection(currentSessionId, 'parachute', reflection);
            }

            markSessionSubmitted(currentSessionId);

            const readings = getTrialsBySession(currentSessionId);

            await cancelAllNotifications();
            
            await Promise.all([
                addDocument('parachute_submissions', {
                    sessionId: currentSessionId,
                    userID: user?.uid || 'anonymous',
                    readings,
                    reflection,
                    submittedAt: new Date().toISOString(),
                }),
                sendNotification(
                    'Activity Auto-Submitted',
                    `Time expired. ${readings.length} prototype records have been saved automatically.`
                ),
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error('Auto submit failed:', error);
            Alert.alert(
                'Auto Submit Error',
                'The session ended but automatic submission failed.'
            );
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useFocusEffect(
        React.useCallback(() => {
            const trials = getTrialsBySession(currentSessionId);

            const hBaseline = trials.filter(x => x.prototype_key === 'baseline');
            const hProto1 = trials.filter(x => x.prototype_key === 'prototype1');
            const hProto2 = trials.filter(x => x.prototype_key === 'prototype2');
            const hProto3 = trials.filter(x => x.prototype_key === 'prototype3');

            setHistory({
                baseline: hBaseline,
                prototype1: hProto1,
                prototype2: hProto2,
                prototype3: hProto3,
            });

            if ((route.params as any)?.didSubmitSuccessfully) {
                setMass('');
                setHeight('');
                setReflection('');
                setIsSessionActive(false);
                setIsNewSession(true);
                setShowSetupModal(true);
                navigation.setParams({ didSubmitSuccessfully: undefined as any });
                return;
            }

            const hasExistingData = hBaseline.length > 0 || hProto1.length > 0;
            
            if (hasExistingData && !(route.params as any)?.forceNewSession) {
                setIsNewSession(false);
                setIsSessionActive(true);
                const firstRecord = hBaseline[0] || hProto1[0];
                if (firstRecord && !mass) {
                    setMass((firstRecord.mass * 1000).toString());
                    setHeight(firstRecord.height.toString());
                }
                setShowSetupModal(false);
            } else if (!isSessionActive && !(route.params as any)?.forceNewSession) {
                setShowSetupModal(true);
                setIsNewSession(true);
            }
        }, [route.params, isSessionActive, currentSessionId])
    );

    const handlePrototypePress = (prototypeKey: PrototypeKey) => {
        if (isExpired) {
            Alert.alert('Session Expired', 'Your time has ended. Please start a new session.');
            return;
        }
        
        const parsedMass = parseFloat(mass);
        const parsedHeight = parseFloat(height);
        
        if (isNaN(parsedMass) || parsedMass <= 0 || isNaN(parsedHeight) || parsedHeight <= 0) {
            Alert.alert('Setup Required', 'Please complete the experiment setup first.');
            setShowSetupModal(true);
            return;
        }
        
        const massInKg = parsedMass / 1000;

        if (history[prototypeKey].length > 0) {
            const latest = history[prototypeKey][0];
            
            navigation.navigate('ParachuteResult', {
                data: {
                    currentSessionId: currentSessionId,
                    videoUri: latest.video_uri,
                    dropTime: latest.drop_time ?? 0,
                    hitGroundTime: latest.hit_ground_time ?? 0,
                    bounceTime: latest.bounce_time ?? null,
                    stopTime: latest.stop_time ?? 0,
                    mass: latest.mass,
                    height: latest.height,
                    prototypeKey: prototypeKey,
                    rate: latest.rate,
                    isHistoricalView: true,
                }
            });
        } else {
            navigation.navigate('ParachutePrototype', {
                currentSessionId: currentSessionId,
                prototype: prototypeKey,
                mass: massInKg,
                height: parsedHeight,
            });
        }
    };

    const renderPrototypeCard = (title: string, key: PrototypeKey) => {
        const trialsCount = history[key].length;
        const bestGForce = trialsCount > 0 
            ? Math.min(...history[key].map(r => r.g_force)).toFixed(1) 
            : null;

        const isLocked = key !== 'baseline' && history.baseline.length === 0;
        const buttonText = trialsCount > 0 ? `Review ${title} ✓` : (isLocked ? `Complete Baseline First` : `Add ${title}`);

        return (
            <View style={styles.card} key={key}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {trialsCount > 0 && (
                        <Text style={styles.badgeText}>⚙️ {trialsCount} Saved Run(s)</Text>
                    )}
                </View>

                {bestGForce && (
                    <Text style={styles.statsPreview}>
                        Best Performance Impact: <Text style={{ color: '#2ed573', fontWeight: 'bold' }}>{bestGForce} G</Text>
                    </Text>
                )}

                <Pressable
                    style={[styles.actionButton, (trialsCount > 0 || (!isLocked && !trialsCount)) && styles.completedButton, (isLocked || isExpired) && styles.lockedButton]}
                    onPress={() => !isLocked && !isExpired && handlePrototypePress(key)}
                    disabled={isLocked || isExpired}
                >
                    <Text style={styles.actionText}>
                        {isExpired ? 'Session Expired' : buttonText}
                    </Text>
                </Pressable>
            </View>
        );
    };

    const handleBack = () => {
        // Direct navigation back without confirmation
        navigation.replace('Parachute', { 
            currentSessionId: currentSessionId 
        });
    };

    const handleSubmit = async () => {
        if (isExpired) {
            Alert.alert('Session Expired', 'Your time has ended. Please start a new session.');
            return;
        }
        
        if (!history.baseline.length) {
            Alert.alert('Incomplete Activity', 'Please complete the baseline test first.');
            return;
        }
        
        if (!history.prototype1.length || !history.prototype2.length || !history.prototype3.length) {
            Alert.alert('Incomplete Activity', 'Please complete all three prototype test sequences.');
            return;
        }

        if (!reflection.trim()) {
            Alert.alert('Reflection Required', 'Please complete your team reflection.');
            return;
        }

        const prototypeKeys = ['baseline', 'prototype1', 'prototype2', 'prototype3'];
        let trialCount = 0;
        for (const key of prototypeKeys) {
            if (history[key as PrototypeKey].length > 0) {
                trialCount++;
            }
        }
        const hasReflection = reflection.trim().length > 0;

        try {
            if (user) {
                await submitActivityScore(
                    user.uid, 
                    'parachute', 
                    currentSessionId, 
                    trialCount, 
                    hasReflection
                );
            }

            saveSessionReflection(currentSessionId, 'parachute', reflection);
            markSessionSubmitted(currentSessionId);

            const readings = getTrialsBySession(currentSessionId);

            await cancelAllNotifications();
            await Promise.all([
                addDocument('parachute_submissions', {
                    sessionId: currentSessionId,
                    userID: user?.uid || 'anonymous',
                    readings,
                    reflection,
                    submittedAt: new Date().toISOString(),
                }),
                sendNotification(
                    'Activity Submitted',
                    'Your Parachute Drop Challenge report has been saved!'
                ),
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to submit activity. Please try again.');
        }
    };

    const handleSetupConfirm = () => {
        const mVal = parseFloat(mass);
        const hVal = parseFloat(height);
        if (!mass || !height || isNaN(mVal) || isNaN(hVal) || mVal <= 0 || hVal <= 0) {
            Alert.alert('Invalid Setup', 'Please enter valid numerical values for mass and height.');
            return;
        }
        setIsSessionActive(true);
        setIsNewSession(false);
        setShowSetupModal(false);
    };

    return (
        <>
            <Modal visible={showSetupModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Experiment Setup</Text>
                        <Text style={styles.label}>Object Mass (g)</Text>
                        <TextInput
                            value={mass}
                            onChangeText={setMass}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="20.5"
                            placeholderTextColor="#bbb"
                        />
                        <Text style={styles.label}>Drop Height (m)</Text>
                        <TextInput
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="1.5"
                            placeholderTextColor="#bbb"
                        />
                        <Pressable style={styles.confirmButton} onPress={handleSetupConfirm}>
                            <Text style={styles.confirmText}>Confirm</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.confirmButton, { backgroundColor: '#666', marginTop: 10 }]} 
                            onPress={() => {
                                setShowSetupModal(false);
                                setMass('');
                                setHeight('');
                            }}
                        >
                            <Text style={styles.confirmText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Parachute Drop Challenge</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={[styles.timerCard, isExpired && styles.timerCardExpired]}>
                    <Ionicons name="time-outline" size={20} color={isExpired ? '#ff4757' : '#00d2d3'} />
                    <Text style={[styles.timerText, isExpired && styles.timerTextExpired]}>
                        {isExpired ? '⏰ Session Expired' : `Time Remaining: ${timeRemaining !== null ? formatTime(timeRemaining) : '20:00'}`}
                    </Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session ID: {currentSessionId}</Text>
                    <Text style={styles.infoText}>Object Mass: {mass || '--'} g</Text>
                    <Text style={styles.infoText}>Drop Height: {height || '--'} m</Text>
                    {!isNewSession && history.baseline.length > 0 && (
                        <Text style={styles.infoText}>✅ {history.baseline.length + history.prototype1.length + history.prototype2.length + history.prototype3.length} total prototype(s) completed</Text>
                    )}
                    {isExpired && (
                        <Text style={styles.warningText}>⚠️ Time has expired. Please start a new session.</Text>
                    )}
                </View>

                {renderPrototypeCard('Baseline (No Parachute)', 'baseline')}
                {renderPrototypeCard('Prototype 1', 'prototype1')}
                {renderPrototypeCard('Prototype 2', 'prototype2')}
                {renderPrototypeCard('Prototype 3', 'prototype3')}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Team Reflection</Text>
                    <Pressable style={styles.actionButton} onPress={() => setShowReflectionModal(true)}>
                        <Text style={styles.actionText}>
                            {reflection.length > 0 ? 'Edit Reflection' : 'Add Reflection'}
                        </Text>
                    </Pressable>
                    {reflection.length > 0 && (
                        <Text style={styles.reflectionPreview} numberOfLines={3}>
                            {reflection}
                        </Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.submitButton, isExpired && styles.disabledButton]} onPress={handleSubmit} disabled={isExpired}>
                        <Text style={styles.submitText}>{isExpired ? 'Session Expired' : 'Submit Activity'}</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal visible={showReflectionModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Team Reflection</Text>
                        <TextInput
                            multiline
                            scrollEnabled
                            value={reflection}
                            onChangeText={setReflection}
                            placeholder="Describe your design process, what worked, what didn't, and how you improved..."
                            placeholderTextColor="#AAA"
                            style={styles.reflectionInput}
                        />
                        <Pressable style={styles.confirmButton} onPress={() => setShowReflectionModal(false)}>
                            <Text style={styles.confirmText}>Save Reflection</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#071A3D', padding: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 25 },
    backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.5)' },
    title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 26, fontWeight: 'bold' },
    headerSpacer: { width: 44 },
    
    timerCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8,
        backgroundColor: 'rgba(0,210,211,0.15)', 
        borderRadius: 12, 
        padding: 12, 
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#00d2d3',
    },
    timerCardExpired: {
        backgroundColor: 'rgba(255,71,87,0.15)',
        borderColor: '#ff4757',
    },
    timerText: { color: '#00d2d3', fontSize: 14, fontWeight: '600' },
    timerTextExpired: { color: '#ff4757' },
    warningText: { color: '#ffa502', fontSize: 13, marginTop: 8 },
    
    infoCard: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 20, padding: 18, marginBottom: 25 },
    infoText: { color: '#fff', fontSize: 14, marginBottom: 6 },
    card: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    actionButton: { backgroundColor: '#4A90E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    completedButton: { backgroundColor: '#2E86C1' },
    lockedButton: { backgroundColor: '#555', opacity: 0.5 },
    actionText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalCard: { width: '85%', backgroundColor: '#102654', borderRadius: 24, padding: 25 },
    modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { color: '#fff', marginBottom: 8, fontSize: 16 },
    input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, padding: 14, marginBottom: 18 },
    confirmButton: { backgroundColor: '#4A90E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
    confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    reflectionInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: 12, padding: 14, minHeight: 150, maxHeight: 250, textAlignVertical: 'top' },
    submitButton: { backgroundColor: '#2ECC71', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
    submitText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    buttonContainer: { marginTop: 10, marginBottom: 30 },
    badgeText: { color: '#ffa502', fontSize: 12, alignSelf: 'center', fontWeight: '600' },
    statsPreview: { color: '#ddd', fontSize: 13, marginBottom: 12, fontStyle: 'italic' },
    reflectionPreview: { color: '#aaa', fontSize: 12, marginTop: 10, fontStyle: 'italic' },
    disabledButton: { opacity: 0.5 },
});