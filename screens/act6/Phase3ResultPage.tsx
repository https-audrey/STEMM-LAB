import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { FONTS } from '../../utils/theme';
import { queryDocuments, where } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act6Phase3Result'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Phase3ResultPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { profile } = useAuth();
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const userName = profile?.fullName || 'Alexander';

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const results = await queryDocuments('experiments', [
                    where('userId', '==', profile?.uid || 'anonymous'),
                    where('act', '==', 6),
                    where('phase', '==', 3),
                ]);

                if (results.length > 0) {
                    // Sort in memory by createdAt descending to avoid composite index requirements
                    results.sort((a, b) => {
                        const getMs = (val: any) => {
                            if (!val) return 0;
                            if (typeof val.toDate === 'function') return val.toDate().getTime();
                            if (val.seconds) return val.seconds * 1000;
                            return new Date(val).getTime();
                        };
                        return getMs(b.createdAt) - getMs(a.createdAt);
                    });
                    setAccuracy(results[0].accuracy);
                }
            } catch (error) {
                console.error('Error fetching accuracy result:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [profile]);

    const handleClose = () => {
        navigation.navigate('Home');
    };

    const handleContinue = () => {
        navigation.navigate('Act6Reflection');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/OnBoardingAssets/bgImg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Close (X) button */}
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

                {/* Title — "Reaction Board Challenge" */}
                <Image
                    source={require('../../assets/act6/act6Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* Result Box */}
                <View style={styles.boxContainer}>
                    <ImageBackground
                        source={require('../../assets/act6PhaseResultAssets/phase3ResultBox.png')}
                        style={styles.resultBox}
                        resizeMode="contain"
                    >
                        {/* Player Name Overlay */}
                        <View style={styles.nameOverlay}>
                            <Text style={styles.playerNameText}>
                                Player 1: {userName}
                            </Text>
                        </View>

                        {/* Accuracy Result Overlay */}
                        <View style={styles.accuracyOverlay}>
                            {loading ? (
                                <ActivityIndicator color="#07181f" />
                            ) : (
                                <Text style={styles.accuracyText}>
                                    {accuracy !== null ? `${accuracy.toFixed(0)} %` : '0 %'}
                                </Text>
                            )}
                        </View>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={styles.continueBtn}
                            onPress={handleContinue}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={require('../../assets/EquipmentAssets/continueBtn.png')}
                                style={styles.continueImg}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                {/* Astronaut */}
                <Image
                    source={require('../../assets/PhaseStartPageAssets/astronaut5.png')}
                    style={styles.astronaut}
                    resizeMode="contain"
                />

                {/* Mars planet */}
                <Image
                    source={require('../../assets/act6/mars.png')}
                    style={styles.marsPlanet}
                    resizeMode="contain"
                />
            </ImageBackground>
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

    /* Close button */
    closeButton: {
        position: 'absolute',
        top: s(70),
        left: s(28),
        width: s(55),
        height: s(55),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: s(45),
        height: s(45),
    },

    /* Title */
    titleBubble: {
        position: 'absolute',
        top: s(130),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
    },

    /* Result Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(310),
        alignSelf: 'center',
        width: s(360),
        height: s(450),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    resultBox: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    /* Text Overlays inside the box */
    nameOverlay: {
        position: 'absolute',
        top: s(97),
        width: s(280),
        height: s(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerNameText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(20),
        color: '#07181f',
    },

    accuracyOverlay: {
        position: 'absolute',
        top: s(238),
        width: s(150),
        height: s(60),
        justifyContent: 'center',
        alignItems: 'center',
    },
    accuracyText: {
        fontFamily: FONTS.heading, // DynaPuff
        fontSize: s(20),
        color: '#07181f',
        fontWeight: '400',
    },

    /* Continue Button */
    continueBtn: {
        position: 'absolute',
        bottom: s(80),
        width: s(160),
        height: s(60),
    },
    continueImg: {
        width: '100%',
        height: '100%',
    },

    /* Astronaut */
    astronaut: {
        position: 'absolute',
        bottom: s(170),
        right: s(35),
        width: s(110),
        height: s(145),
        zIndex: 10,
    },

    /* Mars planet */
    marsPlanet: {
        position: 'absolute',
        bottom: s(-30),
        alignSelf: 'center',
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

export default Phase3ResultPage;
