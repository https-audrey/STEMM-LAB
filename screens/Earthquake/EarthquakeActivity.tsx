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
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { saveSessionReflection, markSessionSubmitted, EarthquakePrototypeRecord, getEarthquakeTrialsBySession } from '../../services/db';
import { addDocument } from '../../services/firestoreService';
import { sendNotification } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

type EarthquakeActivityRouteProp = RouteProp<RootStackParamList, 'EarthquakeActivity'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'EarthquakeActivity'>;

export default function EarthquakeActivity() {
    const route = useRoute<EarthquakeActivityRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { currentSessionId } = route.params;
    const { user } = useAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);
    const [description, setDescription] = useState('');
    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [trials, setTrials] = useState<EarthquakePrototypeRecord[]>([]);
    const [isNewSession, setIsNewSession] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            if (currentSessionId) {
                const sessionTrials = getEarthquakeTrialsBySession(currentSessionId);
                setTrials(sessionTrials);
                setIsNewSession(sessionTrials.length === 0);
            }
        }, [currentSessionId])
    );

    const renderTrialCard = (trial: EarthquakePrototypeRecord) => {
        return (
            <View key={trial.prototype_key} style={styles.card}>
                <Text style={styles.cardTitle}>{trial.prototype_key}</Text>
                <Text style={styles.infoText}>Description: {trial.description}</Text>
                <Text style={styles.infoText}>Peak Acceleration: {trial.peakAccel}</Text>
                <Pressable
                    style={styles.actionButton}
                    onPress={() =>
                        navigation.navigate('EarthquakeResult', {
                            data: {
                                currentSessionId,
                                prototypeKey: trial.prototype_key,
                                description: trial.description,
                                peakAccel: trial.peakAccel,
                                avgAccel: trial.avgAccel,
                                isHistoricalView: true,
                            },
                        })
                    }
                >
                    <Text style={styles.actionText}>View Result</Text>
                </Pressable>
            </View>
        );
    };

    const handleBack = () => {
        // Just navigate back directly - no confirmation
        navigation.replace('Earthquake', { 
            currentSessionId: currentSessionId 
        });
    };

    const handleSubmit = async () => {
        if (!trials.length) {
            Alert.alert('Incomplete Activity', 'Please complete at least one prototype test.');
            return;
        }

        if (!reflection.trim()) {
            Alert.alert('Reflection Required', 'Please complete your team reflection.');
            return;
        }

        try {
            if (currentSessionId) {
                saveSessionReflection(currentSessionId, 'earthquake', reflection);
                markSessionSubmitted(currentSessionId);
            }

            const readings = currentSessionId ? getEarthquakeTrialsBySession(currentSessionId) : [];

            await Promise.all([
                addDocument('earthquake_submissions', {
                    sessionId: currentSessionId,
                    userID: user?.uid || 'anonymous',
                    readings,
                    reflection,
                    submittedAt: new Date().toISOString(),
                }),
                sendNotification('Activity Submitted', 'Your Earthquake-Resistant Challenge report has been saved!'),
            ]);

            // Navigate to Home after successful submission
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
        if (!description.trim()) {
            Alert.alert('Invalid Setup', 'Please fill in the description.');
            return;
        }

        const prototypeKey = `prototype${trials.length + 1}_${Date.now()}`;

        setShowSetupModal(false);
        setDescription('');

        navigation.navigate('EarthquakePrototype', {
            currentSessionId: currentSessionId || '',
            prototype: prototypeKey,
            description: description,
        });
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
                            onChangeText={setDescription}
                            keyboardType="default"
                            style={styles.input}
                            placeholder="Describe your prototype structure..."
                            placeholderTextColor="#bbb"
                            multiline
                        />
                        <Pressable style={styles.confirmButton} onPress={handleSetupConfirm}>
                            <Text style={styles.confirmText}>Confirm & Start</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.confirmButton, { backgroundColor: '#666', marginTop: 10 }]} 
                            onPress={() => {
                                setShowSetupModal(false);
                                setDescription('');
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
                    <Text style={styles.title}>Earthquake-Resistant Structure</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session ID: {currentSessionId || 'New Session'}</Text>
                    {!isNewSession && trials.length > 0 && (
                        <Text style={styles.infoText}>✅ {trials.length} prototype(s) completed</Text>
                    )}
                    {isNewSession && (
                        <Text style={styles.infoText}>🆕 New session - Add your first prototype</Text>
                    )}
                </View>

                {trials.map(renderTrialCard)}

                <Pressable style={styles.addButton} onPress={() => setShowSetupModal(true)}>
                    <Text style={styles.addButtonText}>+ Add New Prototype</Text>
                </Pressable>

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
                    <Pressable style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit Activity</Text>
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
    infoCard: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 20, padding: 18, marginBottom: 25 },
    infoText: { color: '#fff', fontSize: 14, marginBottom: 6 },
    card: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    actionButton: { backgroundColor: '#4A90E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
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
    reflectionPreview: { color: '#aaa', fontSize: 12, marginTop: 10, fontStyle: 'italic' },
    addButton: { backgroundColor: '#2ed573', borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
    addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});