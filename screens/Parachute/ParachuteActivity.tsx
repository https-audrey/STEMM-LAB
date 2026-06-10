import React, { useState, useEffect } from 'react';
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
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { saveSessionReflection, markSessionSubmitted, PrototypeRecord, getTrialsBySession } from '../../src/services/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ParachuteActivity'>;
type PrototypeKey = 'baseline' | 'prototype1' | 'prototype2' | 'prototype3';

export default function ParachuteActivity({ navigation, route }: Props) {
    const { currentSessionId } = route.params;

    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const TIMER_MINUTES = 1;
    const STORAGE_KEY = `parachute_session_start_${currentSessionId}`;

    const [showSetupModal, setShowSetupModal] = useState(false);
    const [mass, setMass] = useState('');
    const [height, setHeight] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [history, setHistory] = useState<Record<PrototypeKey, PrototypeRecord[]>>({
        baseline: [],
        prototype1: [],
        prototype2: [],
        prototype3: [],
    });

    const [isNewSession, setIsNewSession] = useState(true);

    // Initialize timer on mount
    useEffect(() => {
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
                setIsExpired(true);
                setTimeRemaining(0);
                await autoSubmit();
                return;
            }
            
            setTimeRemaining(remaining);
            
            const interval = setInterval(() => {
                const currentElapsed = (Date.now() - startTime) / 1000;
                const currentRemaining = TIMER_MINUTES * 60 - currentElapsed;
                
                if (currentRemaining <= 0) {
                    clearInterval(interval);
                    setIsExpired(true);
                    setTimeRemaining(0);
                    autoSubmit();
                } else {
                    setTimeRemaining(currentRemaining);
                }
            }, 1000);
            
            return () => clearInterval(interval);
        };
        
        initTimer();
    }, [currentSessionId, (route.params as any)?.forceNewSession]);

    const autoSubmit = async () => {
        const trials = getTrialsBySession(currentSessionId);
        const completedCount = trials.length;
        
        Alert.alert(
            'Time\'s Up!',
            `Your ${TIMER_MINUTES} minutes have ended. ${completedCount} prototype${completedCount !== 1 ? 's' : ''} have been saved.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.replace('Parachute', { currentSessionId });
                    }
                }
            ]
        );
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
                setHasUnsavedChanges(false);
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

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges && history.baseline.length === 0 && history.prototype1.length === 0) {
                return;
            }

            e.preventDefault();

            Alert.alert(
                'Discard Lab Run?',
                'Leaving now will permanently erase all trial configuration entries entered during this unsubmitted sequence.',
                [
                    { text: 'Keep Workspace', style: 'cancel', onPress: () => {} },
                    {
                        text: 'Discard All Data',
                        style: 'destructive',
                        onPress: () => {
                            setMass('');
                            setHeight('');
                            setReflection('');
                            setHistory({
                                baseline: [],
                                prototype1: [],
                                prototype2: [],
                                prototype3: [],
                            });
                            setHasUnsavedChanges(false);
                            setIsSessionActive(false);
                            navigation.dispatch(e.data.action);
                        },
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, hasUnsavedChanges, history]);

    const handlePrototypePress = (prototypeKey: PrototypeKey) => {
        if (isExpired) {
            Alert.alert('Session Expired', 'Your 20 minutes have ended. Please start a new session.');
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
        navigation.replace('Parachute', {
            currentSessionId,
        });
    };

    const handleSubmit = () => {
        if (isExpired) {
            Alert.alert('Session Expired', 'Your 20 minutes have ended. Please start a new session.');
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

        saveSessionReflection(currentSessionId, 'parachute', reflection);
        markSessionSubmitted(currentSessionId);

        Alert.alert('Activity Submitted', 'Your parachute analytics report has been saved!', [
            {
                text: 'Start New Session',
                onPress: () => {
                    setMass('');
                    setHeight('');
                    setReflection('');
                    setHasUnsavedChanges(false);
                    setIsSessionActive(false);
                    setIsNewSession(true);
                    setShowSetupModal(true);
                    const freshSessionId = `session_${Date.now()}`;
                    navigation.replace('ParachuteActivity', { currentSessionId: freshSessionId, forceNewSession: true } as any);
                }
            },
            {
                text: 'Go to Home',
                onPress: () => {
                    navigation.navigate('Home');
                }
            }
        ]);
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
                            onChangeText={(text) => { setMass(text); setHasUnsavedChanges(true); }}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="20.5"
                            placeholderTextColor="#bbb"
                        />
                        <Text style={styles.label}>Drop Height (m)</Text>
                        <TextInput
                            value={height}
                            onChangeText={(text) => { setHeight(text); setHasUnsavedChanges(true); }}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="1.5"
                            placeholderTextColor="#bbb"
                        />
                        <Pressable
                            style={styles.confirmButton}
                            onPress={handleSetupConfirm}
                        >
                            <Text style={styles.confirmText}>Confirm</Text>
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

                {/* Timer Display */}
                <View style={[styles.timerCard, isExpired && styles.timerCardExpired]}>
                    <Ionicons name="time-outline" size={20} color={isExpired ? '#ff4757' : '#00d2d3'} />
                    <Text style={[styles.timerText, isExpired && styles.timerTextExpired]}>
                        {isExpired ? '⏰ Session Expired' : `Time Remaining: ${timeRemaining !== null ? formatTime(timeRemaining) : '20:00'}`}
                    </Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session Tracking ID: {currentSessionId}</Text>
                    <Text style={styles.infoText}>Object Mass: {mass || '--'} g</Text>
                    <Text style={styles.infoText}>Drop Height: {height || '--'} m</Text>
                    {!isNewSession && history.baseline.length > 0 && (
                        <Text style={styles.infoText}>✅ Session in progress - Add more prototypes or review existing ones</Text>
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
                            {reflection.length > 0 ? 'View / Edit Reflection' : 'Add Reflection'}
                        </Text>
                    </Pressable>
                    {reflection.length > 0 && (
                        <Text style={styles.reflectionPreview} numberOfLines={2}>
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
                        <ScrollView>
                            <TextInput
                                multiline
                                scrollEnabled
                                value={reflection}
                                onChangeText={(text) => { setReflection(text); setHasUnsavedChanges(true); }}
                                placeholder="Describe your design process, what worked, what didn't, and how you improved..."
                                placeholderTextColor="#AAA"
                                style={styles.reflectionInput}
                            />
                        </ScrollView>
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