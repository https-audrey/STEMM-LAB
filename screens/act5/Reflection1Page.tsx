import React, { useState } from 'react';
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { addDocument } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act5Reflection1'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Reflection1Page: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>();
    const docIds: string[] = route.params?.docIds || [];

    const [answer, setAnswer] = useState('');
    const [saving, setSaving] = useState(false);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleNext = async () => {
        if (!answer.trim()) {
            Alert.alert('Please write your answer', 'You need to write your answer before proceeding.');
            return;
        }

        setSaving(true);
        try {
            await addDocument('reflections', {
                activityId: 'act5',
                reflectionNumber: 1,
                question: 'Which movement was the hardest to keep the vibration low?',
                answer: answer.trim(),
                docIds,
                createdAt: new Date().toISOString(),
            });

            // Navigate to Reflection 2
            navigation.navigate('Act5Reflection2', { docIds });
        } catch (error) {
            console.error('[Reflection1] Error saving answer:', error);
            Alert.alert('Error', 'Failed to save your answer. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                    {/* Reflection box container */}
                    <View style={styles.boxContainer}>
                        <Image
                            source={require('../../assets/Act5ReflectionAssets/reflectionBox1.png')}
                            style={styles.reflectionBox}
                            resizeMode="contain"
                        />

                        {/* Text input area overlaid inside the dashed box */}
                        <View style={styles.inputArea}>
                            <TextInput
                                style={styles.textInput}
                                placeholder=""
                                placeholderTextColor="#999"
                                multiline
                                textAlignVertical="top"
                                value={answer}
                                onChangeText={setAnswer}
                                scrollEnabled={true}
                            />
                            {/* Placeholder image — only show when input is empty */}
                            {answer.length === 0 && (
                                <View style={styles.placeholderContainer} pointerEvents="none">
                                    <Image
                                        source={require('../../assets/Act5ReflectionAssets/Write your answers here.png')}
                                        style={styles.placeholderImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        </View>

                        {/* Next button — bottom right inside the container */}
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNext}
                            activeOpacity={0.8}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#08121E" />
                            ) : (
                                <Image
                                    source={require('../../assets/Act5ReflectionAssets/nextBtn.png')}
                                    style={styles.nextImage}
                                    resizeMode="contain"
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Saturn planet — bottom of the screen */}
                    <Image
                        source={require('../../assets/act5/saturnPlanet.png')}
                        style={styles.saturnPlanet}
                        resizeMode="contain"
                    />
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
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

    /* Reflection Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(340),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 5,
    },
    reflectionBox: {
        width: '100%',
        height: '100%',
    },

    /* Text input area — overlaid on the reflection box inside the dashed border */
    inputArea: {
        position: 'absolute',
        top: s(190),
        alignSelf: 'center',
        width: s(310),
        height: s(340),
        zIndex: 10,
        left: s(40),
    },
    textInput: {
        width: '100%',
        height: '100%',
        fontSize: s(14),
        color: '#08121E',
        fontFamily: 'ShortStack_400Regular',
        padding: s(12),
        paddingTop: s(12),
    },
    placeholderContainer: {
        position: 'absolute',
        top: s(10),
        left: s(10),
    },
    placeholderImage: {
        width: s(180),
        height: s(20),
    },

    /* Next button — bottom right inside the container */
    nextButton: {
        position: 'absolute',
        bottom: s(16),
        right: s(22),
        width: s(120),
        height: s(51),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextImage: {
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
});

export default Reflection1Page;
