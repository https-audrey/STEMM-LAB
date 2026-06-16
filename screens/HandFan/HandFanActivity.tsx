import React, { useState } from 'react';
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
import { saveSessionReflection, markSessionSubmitted, HandFanPrototypeRecord, getHFTrialsBySession } from '../../services/db';
import { addDocument } from '../../services/firestoreService';
import { sendNotification } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { submitActivityScore } from '../../services/scoreService';

type HandFanActivityRouteProp = RouteProp<RootStackParamList, 'HandFanActivity'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'HandFanActivity'>;

export default function HandFanActivity() {
    const route = useRoute<HandFanActivityRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { currentSessionId } = route.params;
    const { user } = useAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);
    const [design, setDesign] = useState('');
    const [distance, setDistance] = useState('');
    const [material, setMaterial] = useState('');
    const [stiffness, setStiffness] = useState('');
    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [trials, setTrials] = useState<HandFanPrototypeRecord[]>([]);
    const [isNewSession, setIsNewSession] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const sessionTrials = getHFTrialsBySession(currentSessionId);
            setTrials(sessionTrials);
            setIsNewSession(sessionTrials.length === 0);
        }, [currentSessionId])
    );

    const renderTrialCard = (trial: HandFanPrototypeRecord) => {
        return (
            <View key={trial.prototype_key} style={styles.card}>
                <Text style={styles.cardTitle}>{trial.prototype_key}</Text>
                <Text style={styles.infoText}>Design: {trial.design}</Text>
                <Text style={styles.infoText}>Distance: {trial.distance} cm</Text>
                <Text style={styles.infoText}>Material: {trial.material}</Text>
                <Text style={styles.infoText}>Stiffness: {trial.stiffness}</Text>

                <Pressable
                    style={styles.actionButton}
                    onPress={() =>
                        navigation.navigate('HandFanResult', {
                            data: {
                                currentSessionId,
                                videoUri: trial.video_uri,
                                prototypeKey: trial.prototype_key,
                                design: trial.design,
                                distance: trial.distance,
                                material: trial.material,
                                stiffness: trial.stiffness,
                                top_point_x: trial.top_point_x,
                                top_point_y: trial.top_point_y,
                                bottom_point_x: trial.bottom_point_x,
                                bottom_point_y: trial.bottom_point_y,
                                bend_angle: trial.bend_angle,
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
        // Direct navigation back without confirmation
        navigation.replace('HandFan', { 
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

        const trialCount = trials.length;
        const hasReflection = reflection.trim().length > 0;

        try {
            if (user) {
                await submitActivityScore(
                    user.uid, 
                    'handfan', 
                    currentSessionId, 
                    trialCount, 
                    hasReflection
                );
            }

            saveSessionReflection(currentSessionId, 'handfan', reflection);
            markSessionSubmitted(currentSessionId);

            const readings = getHFTrialsBySession(currentSessionId);
            
            await Promise.all([
                addDocument('handfan_submissions', {
                    sessionId: currentSessionId,
                    userID: user?.uid || 'anonymous',
                    readings,
                    reflection,
                    submittedAt: new Date().toISOString(),
                }),
                sendNotification(
                    'Activity Submitted',
                    'Your Hand Fan Challenge report has been saved!'
                ),
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
        const designNum = parseInt(design);
        const distanceNum = parseFloat(distance);
        const stiffnessNum = parseFloat(stiffness);

        if (
            isNaN(designNum) ||
            isNaN(distanceNum) ||
            !material.trim() ||
            isNaN(stiffnessNum)
        ) {
            Alert.alert('Invalid Setup', 'Please fill all fields.');
            return;
        }

        const prototypeKey = `prototype${trials.length + 1}_${Date.now()}`;

        setShowSetupModal(false);
        
        // Clear form fields
        setDesign('');
        setDistance('');
        setMaterial('');
        setStiffness('');

        navigation.navigate('HandFanPrototype', {
            currentSessionId,
            prototype: prototypeKey,
            design: designNum,
            distance: distanceNum,
            material,
            stiffness: stiffnessNum,
        });
    };

    return (
        <>
            <Modal visible={showSetupModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Experiment Setup</Text>
                        
                        <Text style={styles.label}>Design #</Text>
                        <TextInput
                            value={design}
                            onChangeText={setDesign}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="1"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Text style={styles.label}>Distance (cm)</Text>
                        <TextInput
                            value={distance}
                            onChangeText={setDistance}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="15"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Text style={styles.label}>Material</Text>
                        <TextInput
                            value={material}
                            onChangeText={setMaterial}
                            keyboardType="default"
                            style={styles.input}
                            placeholder="paper"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Text style={styles.label}>Stiffness (N/rad)</Text>
                        <TextInput
                            value={stiffness}
                            onChangeText={setStiffness}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="0.05"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Pressable style={styles.confirmButton} onPress={handleSetupConfirm}>
                            <Text style={styles.confirmText}>Confirm & Start</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={[styles.confirmButton, { backgroundColor: '#666', marginTop: 10 }]} 
                            onPress={() => {
                                setShowSetupModal(false);
                                setDesign('');
                                setDistance('');
                                setMaterial('');
                                setStiffness('');
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
                    <Text style={styles.title}>Hand Fan Challenge</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session ID: {currentSessionId}</Text>
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