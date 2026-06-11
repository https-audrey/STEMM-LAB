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

type Nav = StackNavigationProp<RootStackParamList, 'Act7Result2'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Act7ResultPage2: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const docIds = route.params?.docIds || [];

    const [recordings, setRecordings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            console.error('[Act7Result2] Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (docIds.length > 0) fetchRecordings();
        else setLoading(false);
    }, [docIds]);

    const handleClose = () => navigation.goBack();

    const handleContinue = () => {
        // Navigate forward to experiment 3
        navigation.navigate('Act7Experiment3', { docIds }); 
    };

    const handleAddRecording = () => {
        // Navigate back to ExperimentPage2
        navigation.navigate('Act7Experiment2');
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
            await updateDocument('experiments', editingItem.id, { recordingName: newName.trim() });
        } catch (error) {
            Alert.alert('Error', 'Update failed');
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
            <ImageBackground source={require('../../assets/OnBoardingAssets/bgImg.png')} style={styles.background} resizeMode="cover">
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Image source={require('../../assets/act5/crossBtn.png')} style={styles.closeIcon} resizeMode="contain" />
                </TouchableOpacity>

                <Image source={require('../../assets/act7/act7Title.png')} style={styles.titleBubble} resizeMode="contain" />

                <View style={styles.boxContainer}>
                    <Image source={require('../../assets/RecordingResultAssets/act7ResultBox2.png')} style={styles.resultBox} resizeMode="contain" />
                    
                    <View style={styles.listContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        ) : (
                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                                {recordings.map((item) => (
                                    <ImageBackground key={item.id} source={require('../../assets/RecordingResultAssets/recording.png')} style={styles.recordingItem} resizeMode="stretch">
                                        <View style={styles.recordingInfoContainer}>
                                            <View style={styles.nameRow}>
                                                <Text style={styles.recordingNameText} numberOfLines={1}>{item.name}</Text>
                                                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                                                    <Image source={require('../../assets/RecordingResultAssets/editName.png')} style={styles.editIcon} resizeMode="contain" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
                                        </View>
                                    </ImageBackground>
                                ))}
                                <TouchableOpacity style={styles.addRecButton} onPress={handleAddRecording}>
                                    <Image source={require('../../assets/RecordingResultAssets/addRecBtn.png')} style={styles.addRecImage} resizeMode="contain" />
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <Image source={require('../../assets/EquipmentAssets/continueBtn.png')} style={styles.continueImage} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <Image source={require('../../assets/act7/jupiter.png')} style={styles.jupiterPlanet} resizeMode="contain" />
            </ImageBackground>

            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rename Recording</Text>
                        <TextInput style={styles.modalInput} value={newName} onChangeText={setNewName} autoFocus />
                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveName}><Text style={styles.modalSaveText}>Save</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08121E' },
    background: { flex: 1, width: '100%', height: '100%' },
    closeButton: { position: 'absolute', top: s(70), left: s(28), width: s(55), height: s(55), zIndex: 15 },
    closeIcon: { width: s(45), height: s(45) },
    titleBubble: { position: 'absolute', top: s(140), alignSelf: 'center', width: s(390), height: s(180), left: s(30), zIndex: 2 },
    boxContainer: { position: 'absolute', top: s(320), alignSelf: 'center', width: s(374), height: s(583), zIndex: 5 },
    resultBox: { width: '100%', height: '100%' },
    listContainer: { position: 'absolute', top: s(170), alignSelf: 'center', width: s(335), height: s(280), zIndex: 10 },
    scrollContent: { paddingVertical: s(10), alignItems: 'center' },
    recordingItem: { width: s(309), height: s(76), marginBottom: s(12), justifyContent: 'center' },
    recordingInfoContainer: { marginLeft: s(76), justifyContent: 'center' },
    nameRow: { flexDirection: 'row', alignItems: 'center', height: s(24) },
    recordingNameText: { fontFamily: FONTS.title, fontSize: s(13), color: '#08121E', maxWidth: s(170) },
    editButton: { marginLeft: s(8), padding: s(4) },
    editIcon: { width: s(15), height: s(13) },
    durationText: { fontFamily: FONTS.title, fontSize: s(11), color: '#666666', marginTop: s(2) },
    addRecButton: { width: s(307), height: s(46), marginTop: s(6), marginBottom: s(20) },
    addRecImage: { width: '100%', height: '100%' },
    continueButton: { position: 'absolute', bottom: s(28), right: s(22), width: s(141), height: s(41), zIndex: 10 },
    continueImage: { width: '100%', height: '100%' },
    jupiterPlanet: { position: 'absolute', bottom: s(-30), right: s(-40), width: s(480), height: s(280), zIndex: 1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(8, 18, 30, 0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: s(320), backgroundColor: '#1E293B', borderRadius: s(16), padding: s(24), alignItems: 'center' },
    modalTitle: { fontFamily: FONTS.title, fontSize: s(16), color: '#FFFFFF', marginBottom: s(16) },
    modalInput: { width: '100%', height: s(46), backgroundColor: '#0F172A', borderRadius: s(8), paddingHorizontal: s(12), color: '#FFFFFF', marginBottom: s(24) },
    modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    modalCancelButton: { flex: 1, height: s(40), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: s(8), justifyContent: 'center', alignItems: 'center', marginRight: s(8) },
    modalCancelText: { color: '#CCCCCC' },
    modalSaveButton: { flex: 1, height: s(40), backgroundColor: '#E8C96D', borderRadius: s(8), justifyContent: 'center', alignItems: 'center', marginLeft: s(8) },
    modalSaveText: { color: '#08121E' },
});

export default Act7ResultPage2;
