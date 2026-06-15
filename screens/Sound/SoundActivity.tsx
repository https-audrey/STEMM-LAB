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
    Dimensions,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { RootStackParamList } from '../../types/navigation';
import { getSoundTrialsBySession, markSessionSubmitted, saveSessionReflection, SoundMapRecord } from '../../services/db';
import { addDocument } from '../../services/firestoreService';
import { sendNotification } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

type SoundActivityRouteProp = RouteProp<RootStackParamList, 'SoundActivity'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'SoundActivity'>;

export default function SoundActivity() {
    const route = useRoute<SoundActivityRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { currentSessionId } = route.params;
    const { user } = useAuth();

    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [locationDescription, setLocationDescription] = useState('');
    const [action, setAction] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [reflection, setReflection] = useState('');
    const [trials, setTrials] = useState<SoundMapRecord[]>([]);
    const [isNewSession, setIsNewSession] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState<SoundMapRecord | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // Request location permission on mount
    useEffect(() => {
        requestLocationPermission();
    }, []);

    // Get current location for map center
    useEffect(() => {
        if (hasLocationPermission) {
            getCurrentLocation();
        }
    }, [hasLocationPermission]);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setHasLocationPermission(true);
            } else {
                Alert.alert(
                    'Permission Required',
                    'Location access is needed to map sound pollution zones. Please grant permission in settings.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (error) {
            console.error('Location permission error:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error('Get location error:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const sessionTrials = getSoundTrialsBySession(currentSessionId);
            setTrials(sessionTrials);
            setIsNewSession(sessionTrials.length === 0);
        }, [currentSessionId])
    );

    const getDotColor = (db: number): string => {
        if (db < 30) return '#2ed573';      // Green - Very Quiet
        if (db < 60) return '#7bed9f';      // Light Green - Normal
        if (db < 85) return '#ffa502';      // Orange - Loud
        if (db < 100) return '#ff4757';     // Red - Harmful
        else return '#341f97';               // Purple - Dangerous
    };

    const handleRecordSound = async () => {
        if (!hasLocationPermission) {
            Alert.alert('Permission Required', 'Location access is needed to record sound zones.');
            return;
        }

        setShowSetupModal(true);
    };

    const handleSetupConfirm = async () => {
        if (!locationDescription.trim()) {
            Alert.alert('Invalid Input', 'Please enter a location description.');
            return;
        }
        if (!action.trim()) {
            Alert.alert('Invalid Input', 'Please enter the action being performed.');
            return;
        }

        setShowSetupModal(false);

        // Get current location before navigating
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            navigation.navigate('SoundRecord', {
                currentSessionId,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy ?? 10,
                location_description: locationDescription,
                action: action,
            });
        } catch (error) {
            console.error('Get location error:', error);
            Alert.alert('Error', 'Failed to get your current location. Please try again.');
        }

        setLocationDescription('');
        setAction('');
    };

    const handleMarkerPress = (trial: SoundMapRecord) => {
        setSelectedMarker(trial);
        setShowDetailsModal(true);
    };

    const handleBack = () => {
        // Direct navigation back without confirmation
        navigation.replace('Sound', { 
            currentSessionId: currentSessionId 
        });
    };

    const handleSubmit = async () => {
        if (!trials.length) {
            Alert.alert('Incomplete Activity', 'Please add at least one sound recording.');
            return;
        }

        if (!reflection.trim()) {
            Alert.alert('Reflection Required', 'Please complete your team reflection.');
            return;
        }

        try {
            saveSessionReflection(currentSessionId, 'sound', reflection);
            markSessionSubmitted(currentSessionId);

            const readings = getSoundTrialsBySession(currentSessionId);
            
            await Promise.all([
                addDocument('sound_submissions', {
                    sessionId: currentSessionId,
                    userID: user?.uid || 'anonymous',
                    readings,
                    reflection,
                    submittedAt: new Date().toISOString(),
                }),
                sendNotification(
                    'Activity Submitted',
                    'Your Sound Pollution Hunter report has been saved!'
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

    return (
        <>
            {/* Setup Modal */}
            <Modal visible={showSetupModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Record Sound</Text>
                        
                        <Text style={styles.label}>Location Description</Text>
                        <TextInput
                            value={locationDescription}
                            onChangeText={setLocationDescription}
                            style={styles.input}
                            placeholder="e.g., Near window, Front of class, By the door"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Text style={styles.label}>Action</Text>
                        <TextInput
                            value={action}
                            onChangeText={setAction}
                            style={styles.input}
                            placeholder="e.g., Dropping book, Talking, Stamping feet"
                            placeholderTextColor="#bbb"
                        />
                        
                        <Pressable style={styles.confirmButton} onPress={handleSetupConfirm}>
                            <Text style={styles.confirmText}>Start Recording</Text>
                        </Pressable>
                        
                        <Pressable style={styles.cancelButton} onPress={() => setShowSetupModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Sound Details Modal */}
            <Modal visible={showDetailsModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Sound Reading Details</Text>
                        
                        {selectedMarker && (
                            <>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Action:</Text>
                                    <Text style={styles.detailValue}>{selectedMarker.action}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Location:</Text>
                                    <Text style={styles.detailValue}>{selectedMarker.location_description}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Sound Level:</Text>
                                    <Text style={[styles.detailValue, { color: getDotColor(selectedMarker.sound_level_db), fontWeight: 'bold' }]}>
                                        {selectedMarker.sound_level_db.toFixed(1)} dB
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Average Sound:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedMarker.avg_db?.toFixed(1) ?? 'N/A'} dB
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Time:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedMarker.timestamp ? new Date(selectedMarker.timestamp).toLocaleTimeString() : 'Unknown'}
                                    </Text>
                                </View>
                                <View style={styles.colorIndicator}>
                                    <View style={[styles.colorBox, { backgroundColor: getDotColor(selectedMarker.sound_level_db) }]} />
                                    <Text style={styles.colorText}>
                                    {
                                        selectedMarker.sound_level_db < 30
                                            ? 'Quiet (Whisper)'
                                        : selectedMarker.sound_level_db < 60
                                            ? 'Normal (Classroom)'
                                        : selectedMarker.sound_level_db < 85
                                            ? 'Loud Environment'
                                        : selectedMarker.sound_level_db < 100
                                            ? 'Potential Hearing Risk'
                                        : 'Dangerous'
                                    }
                                    </Text>
                                </View>
                            </>
                        )}
                        
                        <Pressable style={styles.confirmButton} onPress={() => setShowDetailsModal(false)}>
                            <Text style={styles.confirmText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Reflection Modal */}
            <Modal visible={showReflectionModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Team Reflection</Text>
                        <TextInput
                            multiline
                            scrollEnabled
                            value={reflection}
                            onChangeText={setReflection}
                            placeholder="Describe your findings: Which actions were loudest? Where are the quiet/loud zones? Were your predictions correct? What surprised you?"
                            placeholderTextColor="#AAA"
                            style={styles.reflectionInput}
                        />
                        <Pressable style={styles.confirmButton} onPress={() => setShowReflectionModal(false)}>
                            <Text style={styles.confirmText}>Save Reflection</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView
                style={styles.container}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Sound Pollution Hunter</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Map View */}
                <View style={styles.mapContainer}>
                    {hasLocationPermission && currentLocation ? (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            {trials.map((trial, index) => (
                                <Marker
                                    key={trial.id || index}
                                    coordinate={{
                                        latitude: trial.latitude,
                                        longitude: trial.longitude,
                                    }}
                                    onPress={() => handleMarkerPress(trial)}
                                >
                                    <View style={[styles.markerDot, { backgroundColor: getDotColor(trial.sound_level_db) }]} />
                                </Marker>
                            ))}
                        </MapView>
                    ) : (
                        <View style={styles.mapPlaceholder}>
                            <Text style={styles.mapPlaceholderText}>Loading map...</Text>
                        </View>
                    )}
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Sound Level Legend</Text>
                    <View style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: '#2ed573' }]} />
                        <Text style={styles.legendText}>0–30 dB - Quiet</Text>
                    </View>

                    <View style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: '#7bed9f' }]} />
                        <Text style={styles.legendText}>30–60 dB - Normal</Text>
                    </View>

                    <View style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: '#ffa502' }]} />
                        <Text style={styles.legendText}>60–85 dB - Loud</Text>
                    </View>

                    <View style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: '#ff6b81' }]} />
                        <Text style={styles.legendText}>85–100 dB - Harmful</Text>
                    </View>

                    <View style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: '#341f97' }]} />
                        <Text style={styles.legendText}>100-120 - Dangerous</Text>
                    </View>
                </View>

                {/* Session Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Session ID: {currentSessionId}</Text>
                    <Text style={styles.infoText}>Recordings: {trials.length}</Text>
                    {!isNewSession && trials.length > 0 && (
                        <Text style={styles.infoText}>✅ {trials.length} recording(s) completed</Text>
                    )}
                </View>

                {/* Record Button */}
                <Pressable style={styles.recordButton} onPress={handleRecordSound}>
                    <Ionicons name="mic" size={24} color="white" />
                    <Text style={styles.recordButtonText}>Record Sound</Text>
                </Pressable>

                {/* Reflection Section */}
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

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit Activity</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#071A3D' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, marginBottom: 15 },
    backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.5)' },
    title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' },
    headerSpacer: { width: 44 },
    
    mapContainer: { height: Dimensions.get('window').height * 0.4, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 15 },
    map: { flex: 1 },
    mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
    mapPlaceholderText: { color: '#888', fontSize: 14 },
    
    markerDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
    
    legendContainer: { backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 20, padding: 12, borderRadius: 12, marginBottom: 15 },
    legendTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    legendColor: { width: 20, height: 20, borderRadius: 10, marginRight: 10 },
    legendText: { color: '#ddd', fontSize: 12 },
    
    infoCard: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 16, padding: 15, marginHorizontal: 20, marginBottom: 15 },
    infoText: { color: '#fff', fontSize: 13, marginBottom: 4 },
    
    recordButton: { flexDirection: 'row', backgroundColor: '#4A90E2', marginHorizontal: 20, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
    recordButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    
    card: { backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 20, padding: 18, marginHorizontal: 20, marginBottom: 15 },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    actionButton: { backgroundColor: '#4A90E2', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    actionText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    reflectionPreview: { color: '#aaa', fontSize: 12, marginTop: 10, fontStyle: 'italic' },
    
    buttonContainer: { marginHorizontal: 20, marginBottom: 30 },
    submitButton: { backgroundColor: '#2ECC71', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalCard: { width: '85%', backgroundColor: '#102654', borderRadius: 24, padding: 25 },
    modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { color: '#fff', marginBottom: 8, fontSize: 14 },
    input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, padding: 12, marginBottom: 18 },
    confirmButton: { backgroundColor: '#4A90E2', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
    confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
    cancelText: { color: '#ffa502', fontWeight: 'bold', fontSize: 16 },
    
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    detailLabel: { color: '#aaa', fontSize: 14 },
    detailValue: { color: '#fff', fontSize: 14, flex: 1, textAlign: 'right' },
    
    colorIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    colorBox: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
    colorText: { color: '#fff', fontSize: 14 },
    
    reflectionInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: 12, padding: 14, minHeight: 150, maxHeight: 250, textAlignVertical: 'top' },
});