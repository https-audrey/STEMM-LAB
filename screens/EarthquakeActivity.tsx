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
import { RootStackParamList } from '../types/navigation';
import { getEarthquakeRecordsByPrototype, EarthquakePrototypeRecord, getEarthquakeTrialsBySession } from '../src/services/db';


type Props = NativeStackScreenProps<RootStackParamList, 'EarthquakeActivity'>;

export default function EarthquakeActivity({ navigation, route }: Props) {
    const { currentSessionId } = route.params;

    const [showSetupModal, setShowSetupModal] = useState(false);
    const [description, setDescription] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [trials, setTrials] =
    useState<EarthquakePrototypeRecord[]>([]);

    const [isNewSession, setIsNewSession] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const sessionTrials =
                getEarthquakeTrialsBySession(
                    currentSessionId
                );

            setTrials(sessionTrials);

            setIsNewSession(
                sessionTrials.length === 0
            );

        }, [currentSessionId])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges && trials.length === 0) {
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
                            setDescription('');
                            setReflection('');
                            setTrials([]);
                            setHasUnsavedChanges(false);
                            setIsSessionActive(false);
                            navigation.dispatch(e.data.action);
                        },
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, hasUnsavedChanges, trials]);

    const renderTrialCard =
    (
        trial: EarthquakePrototypeRecord
    ) => {

        return (
            <View
                key={trial.prototype_key}
                style={styles.card}
            >
                <Text style={styles.cardTitle}>
                    {trial.prototype_key}
                </Text>

                <Text style={styles.infoText}>
                    Description:
                    {' '}
                    {trial.description}
                </Text>

                <Text style={styles.infoText}>
                    Peak Acceleration:
                    {' '}
                    {trial.peakAccel}
                </Text>


                <Pressable
                    style={styles.actionButton}
                    onPress={() =>
                        navigation.navigate(
                            'EarthquakeResult',
                            {
                                data: {
                                    currentSessionId,

                                    prototypeKey:
                                        trial.prototype_key,

                                    description:
                                        trial.description,

                                    peakAccel:
                                        trial.peakAccel,

                                    avgAccel:
                                        trial.avgAccel,

                                    isHistoricalView:
                                        true,
                                },
                            }
                        )
                    }
                >
                    <Text style={styles.actionText}>
                        View Result
                    </Text>
                </Pressable>
            </View>
        );
    };

    const handleBack = () => {
        navigation.replace('Earthquake', {
            currentSessionId,
        });
    };

    const handleSubmit = () => {
        
        if (!trials.length) {
            Alert.alert('Incomplete Activity', 'Please complete the prototype.');
            return;
        }

        if (!reflection.trim()) {
            Alert.alert('Reflection Required', 'Please complete your team reflection.');
            return;
        }

        Alert.alert('Activity Submitted', 'Your Earthquake-Resistant Structure report has been saved!', [
            {
                text: 'Start New Session',
                onPress: () => {
                    setDescription('');
                    setReflection('');
                    setHasUnsavedChanges(false);
                    setIsSessionActive(false);
                    setIsNewSession(true);
                    setShowSetupModal(true);
                    const freshSessionId = `session_${Date.now()}`;
                    navigation.replace('EarthquakeActivity', { currentSessionId: freshSessionId, forceNewSession: true } as any);
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

        if (
            !description.trim()
        ) {
            Alert.alert(
                'Invalid Setup',
                'Please fill the description.'
            );
            return;
        }

        const prototypeKey =
            `prototype${trials.length + 1}_${Date.now()}`;

        setShowSetupModal(false);

        setDescription('');

        navigation.navigate(
            'EarthquakePrototype',
            {
                currentSessionId,
                prototype: prototypeKey,
                description
            }
        );
    };

    return (
        <>
            <Modal visible={showSetupModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Experiment Setup</Text>
                        <Text style={styles.label}>Prototype Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={(text) => { setDescription(text); setHasUnsavedChanges(true); }}
                            keyboardType="default"
                            style={styles.input}
                            placeholder="1"
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
                    <Text style={styles.title}>Earthquake-Resistant Structure</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session Tracking ID: {currentSessionId}</Text>
                    {!isNewSession && (
                        <Text style={styles.infoText}>✅ Session in progress - Add more prototypes or review existing ones</Text>
                    )}
                </View>

                {trials.map(renderTrialCard)}

                <Pressable
                    style={styles.addButton}
                    onPress={() =>
                        setShowSetupModal(true)
                    }
                >
                    <Text style={styles.addButtonText}>
                        + Add Prototype
                    </Text>
                </Pressable>

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
                    <Pressable style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit Activity</Text>
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
    addButton: {
    backgroundColor: '#2ed573',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
},
addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},
});