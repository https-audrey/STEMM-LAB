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

type Nav = StackNavigationProp<RootStackParamList, 'Act6Phase1And2Result'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Phase1And2ResultPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { profile } = useAuth();
    const [phase1Speed, setPhase1Speed] = useState<number | null>(null);
    const [phase2Speed, setPhase2Speed] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const userName = profile?.fullName || 'Alexander';

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const getMs = (val: any) => {
                    if (!val) return 0;
                    if (typeof val.toDate === 'function') return val.toDate().getTime();
                    if (val.seconds) return val.seconds * 1000;
                    return new Date(val).getTime();
                };

                const userId = profile?.uid || 'anonymous';

                // Query Phase 1
                const results1 = await queryDocuments('experiments', [
                    where('userId', '==', userId),
                    where('act', '==', 6),
                    where('phase', '==', 1),
                ]);

                if (results1.length > 0) {
                    results1.sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));
                    setPhase1Speed(results1[0].speed);
                }

                // Query Phase 2
                const results2 = await queryDocuments('experiments', [
                    where('userId', '==', userId),
                    where('act', '==', 6),
                    where('phase', '==', 2),
                ]);

                if (results2.length > 0) {
                    results2.sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));
                    setPhase2Speed(results2[0].speed);
                }
            } catch (error) {
                console.error('Error fetching speed results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [profile]);

    const handleClose = () => {
        navigation.navigate('Home');
    };

    const handleContinue = () => {
        navigation.navigate('Act6Instruction2');
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

                {/* Comparison Result Box */}
                <View style={styles.boxContainer}>
                    <ImageBackground
                        source={require('../../assets/act6PhaseResultAssets/phase1&2resultComp.png')}
                        style={styles.resultBox}
                        resizeMode="contain"
                    >
                        {/* Player Row Container */}
                        <View style={styles.rowsContainer}>
                            {loading ? (
                                <ActivityIndicator color="#07181f" size="large" />
                            ) : (
                                <ImageBackground
                                    source={require('../../assets/act6PhaseResultAssets/playerBox.png')}
                                    style={styles.playerBox}
                                    resizeMode="contain"
                                >
                                    <View style={styles.playerRowContent}>
                                        <Text style={styles.rankText}>1</Text>
                                        <Text style={styles.nameText} numberOfLines={1}>
                                            {userName}
                                        </Text>
                                        <View style={styles.resultBubble}>
                                            <Text style={styles.resultText}>
                                                {phase1Speed !== null ? `${phase1Speed.toFixed(2)}m/s` : '0.00m/s'}
                                            </Text>
                                        </View>
                                        <View style={styles.resultBubble}>
                                            <Text style={styles.resultText}>
                                                {phase2Speed !== null ? `${phase2Speed.toFixed(2)}m/s` : '0.00m/s'}
                                            </Text>
                                        </View>
                                    </View>
                                </ImageBackground>
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

                {/* Astronaut (in front of the box) */}
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

    /* Rows overlay inside the box */
    rowsContainer: {
        position: 'absolute',
        top: s(160),
        width: s(320),
        alignItems: 'center',
    },
    playerBox: {
        width: s(310),
        height: s(46),
        justifyContent: 'center',
    },
    playerRowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: s(10),
    },
    rankText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(14),
        color: '#07181f',
        width: s(15),
        textAlign: 'center',
    },
    nameText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(14),
        color: '#07181f',
        marginLeft: s(10),
        flex: 1,
    },
    resultBubble: {
        borderWidth: s(1.5),
        borderColor: 'transparent',
        borderRadius: s(12),
        paddingHorizontal: s(6),
        paddingVertical: s(2),
        marginLeft: s(30),
        minWidth: s(68),
        alignItems: 'center',
        left: -10
    },
    resultText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(11),
        color: '#07181f',
    },

    /* Continue Button */
    continueBtn: {
        position: 'absolute',
        bottom: s(40),
        width: s(160),
        height: s(60),
        left: 95,
    },
    continueImg: {
        width: '90%',
        height: '90%',
    },

    /* Astronaut */
    astronaut: {
        position: 'absolute',
        bottom: s(170),
        right: s(35),
        width: s(110),
        height: s(145),
        zIndex: 10, // Renders in front of boxContainer (zIndex: 5)
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

export default Phase1And2ResultPage;
