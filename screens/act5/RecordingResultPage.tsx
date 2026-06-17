import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { getDocument, updateDocument } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act5RecordingResult'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const RecordingResultPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const docIds = route.params?.docIds || [];

    const [recordings, setRecordings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal Edit Name states
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [newName, setNewName] = useState('');

    const fetchRecordings = async () => {
        setLoading(true);
        try {
            const fetchedList: any[] = [];
            for (let i = 0; i < docIds.length; i++) {
                const id = docIds[i];
                const docData = await getDocument('experiments', id);
                if (docData) {
                    fetchedList.push({
                        id,
                        name: docData.recordingName || `Recording ${i + 1}`,
                        duration: docData.duration || 0,
                        ...docData,
                    });
                }
            }
            setRecordings(fetchedList);
        } catch (error) {
            console.error('[Result] Error fetching recordings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (docIds.length > 0) {
            fetchRecordings();
        } else {
            setLoading(false);
        }
    }, [docIds]);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        // Navigate forward to the comparison result chart
        navigation.navigate('Act5ResultComp', { docIds });
    };

    const handleAddRecording = () => {
        // Navigate back to ExperimentPage to add another recording, carrying over current docIds list
        navigation.navigate('Act5Experiment', { docIds });
    };

    const openEditModal = (item: any) => {
        setEditingItem(item);
        setNewName(item.name);
        setModalVisible(true);
    };

    const handleSaveName = async () => {
        if (!newName.trim() || !editingItem) return;

        try {
            const updatedList = recordings.map((rec) =>
                rec.id === editingItem.id ? { ...rec, name: newName.trim() } : rec
            );
            setRecordings(updatedList);
            setModalVisible(false);

            // Update recordingName in Firestore
            await updateDocument('experiments', editingItem.id, {
                recordingName: newName.trim(),
            });
            console.log('[Result] Firestore updated successfully for doc:', editingItem.id);
        } catch (error) {
            console.error('[Result] Firestore update failed:', error);
            Alert.alert('Database Sync Failed', 'Could not update name in database.');
        }
    };

    const formatDuration = (seconds: number) => {
        const secs = Math.round(seconds);
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const remainingSecs = secs % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
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

                {/* Result box container */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/RecordingResultAssets/resultBox.png')}
                        style={styles.resultBox}
                        resizeMode="contain"
                    />

                    {/* Scrollable listing box of recording files inside dashed area */}
                    <View style={styles.listContainer}>
                        {loading ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#FFFFFF" />
                            </View>
                        ) : recordings.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No recordings yet.</Text>
                            </View>
                        ) : (
                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                                {recordings.map((item, index) => (
                                    <ImageBackground
                                        key={item.id}
                                        source={require('../../assets/RecordingResultAssets/recording.png')}
                                        style={styles.recordingItem}
                                        resizeMode="stretch"
                                    >
                                        <View style={styles.recordingInfoContainer}>
                                            <View style={styles.nameRow}>
                                                {item.name === 'Recording 1' && index === 0 ? (
                                                    <Image
                                                        source={require('../../assets/RecordingResultAssets/rec1.png')}
                                                        style={styles.rec1Image}
                                                        resizeMode="contain"
                                                    />
                                                ) : (
                                                    <Text style={styles.recordingNameText} numberOfLines={1}>
                                                        {item.name}
                                                    </Text>
                                                )}
                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => openEditModal(item)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Image
                                                        source={require('../../assets/RecordingResultAssets/editName.png')}
                                                        style={styles.editIcon}
                                                        resizeMode="contain"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.durationText}>
                                                {formatDuration(item.duration)}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                ))}

                                {/* Add New Recording Button */}
                                <TouchableOpacity
                                    style={styles.addRecButton}
                                    onPress={handleAddRecording}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../../assets/RecordingResultAssets/addRecBtn.png')}
                                        style={styles.addRecImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>

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

                {/* Saturn planet — bottom of screen */}
                <Image
                    source={require('../../assets/act5/saturnPlanet.png')}
                    style={styles.saturnPlanet}
                    resizeMode="contain"
                />
            </ImageBackground>

            {/* Custom Modal for Renaming Recording */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rename Recording</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Enter recording name"
                            placeholderTextColor="#64748B"
                            autoFocus={true}
                        />
                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={handleSaveName}
                            >
                                <Text style={styles.modalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        zIndex: 15,
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
        zIndex: 2,
    },

    /* Result Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(340),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 5,
    },
    resultBox: {
        width: '100%',
        height: '100%',
    },

    /* List Container for records inside dashed border */
    listContainer: {
        position: 'absolute',
        top: s(170),
        alignSelf: 'center',
        width: s(335),
        height: s(280),
        zIndex: 10,
    },
    scrollContent: {
        paddingVertical: s(10),
        alignItems: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: FONTS.title,
        fontSize: s(14),
        color: '#FFFFFF',
    },

    /* Single recording list item */
    recordingItem: {
        width: s(309),
        height: s(76),
        marginBottom: s(12),
        justifyContent: 'center',
    },
    recordingInfoContainer: {
        marginLeft: s(76),
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: s(24),
    },
    rec1Image: {
        width: s(100),
        height: s(22),
    },
    recordingNameText: {
        fontFamily: FONTS.title,
        fontSize: s(13),
        color: '#08121E',
        maxWidth: s(170),
    },
    editButton: {
        marginLeft: s(8),
        padding: s(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        width: s(15),
        height: s(13),
    },
    durationText: {
        fontFamily: FONTS.title,
        fontSize: s(11),
        color: '#666666',
        marginTop: s(2),
    },

    /* Add new recording button inside scroll view */
    addRecButton: {
        width: s(307),
        height: s(46),
        marginTop: s(6),
        marginBottom: s(20),
    },
    addRecImage: {
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

    /* Custom Rename Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(8, 18, 30, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: s(320),
        backgroundColor: '#1E293B',
        borderRadius: s(16),
        padding: s(24),
        borderWidth: s(1),
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: FONTS.title,
        fontSize: s(16),
        color: '#FFFFFF',
        marginBottom: s(16),
    },
    modalInput: {
        width: '100%',
        height: s(46),
        backgroundColor: '#0F172A',
        borderRadius: s(8),
        paddingHorizontal: s(12),
        fontFamily: FONTS.title,
        fontSize: s(14),
        color: '#FFFFFF',
        borderWidth: s(1),
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: s(24),
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        height: s(40),
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: s(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(8),
    },
    modalCancelText: {
        fontFamily: FONTS.title,
        fontSize: s(13),
        color: '#CCCCCC',
    },
    modalSaveButton: {
        flex: 1,
        height: s(40),
        backgroundColor: '#E8C96D',
        borderRadius: s(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: s(8),
    },
    modalSaveText: {
        fontFamily: FONTS.title,
        fontSize: s(13),
        color: '#08121E',
    },
});

export default RecordingResultPage;
