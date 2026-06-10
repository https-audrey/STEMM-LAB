import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { addDocument } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act6Experiment1'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ExperimentPage1: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { profile } = useAuth();

    const [cats, setCats] = useState([
        { id: 1, img: require('../../assets/act6ExperimentAssets/cat1.png'), visible: true, top: s(310), left: s(130) },
        { id: 2, img: require('../../assets/act6ExperimentAssets/cat2.png'), visible: true, top: s(450), left: s(300) },
        { id: 3, img: require('../../assets/act6ExperimentAssets/cat3.png'), visible: true, top: s(620), left: s(160) },
    ]);

    const [speed, setSpeed] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const [timer, setTimer] = useState(0);

    // Timer effect
    useEffect(() => {
        let interval: any;
        if (isStarted && cats.some(c => c.visible)) {
            interval = setInterval(() => {
                const now = Date.now();
                const totalTime = (now - (startTimeRef.current || now)) / 1000;
                setTimer(totalTime);
                
                // Calculate speed: We'll assume a "distance" of 1.0 meters for the whole task
                // Speed = distance / time
                const currentSpeed = 1.0 / Math.max(totalTime, 0.1);
                setSpeed(currentSpeed);
            }, 50);
        } else if (!cats.some(c => c.visible) && isStarted) {
            // All cats cleared
            handleFinish();
        }
        return () => clearInterval(interval);
    }, [isStarted, cats]);

    const handleCatPress = (id: number) => {
        if (!isStarted) {
            setIsStarted(true);
            startTimeRef.current = Date.now();
        }

        setCats(prev => prev.map(cat => 
            cat.id === id ? { ...cat, visible: false } : cat
        ));
    };

    const handleFinish = async () => {
        setIsStarted(false);
        const finalTime = timer;
        const finalSpeed = 1.0 / Math.max(finalTime, 0.1);

        try {
            const resultData = {
                userId: profile?.uid || 'anonymous',
                fullName: profile?.fullName || 'Anonymous',
                speed: parseFloat(finalSpeed.toFixed(2)),
                duration: parseFloat(finalTime.toFixed(2)),
                act: 6,
                phase: 1,
                createdAt: new Date(),
            };

            await addDocument('experiments', resultData);

            Alert.alert(
                'Success!',
                `Experiment complete!\n\nSpeed: ${finalSpeed.toFixed(2)} m/s\nTime: ${finalTime.toFixed(2)}s\n\nYour result has been saved.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to save your result.');
        }
    };

    const handleClose = () => {
        navigation.goBack();
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

                {/* Instruction on top */}
                <Image
                    source={require('../../assets/act6ExperimentAssets/Phase1instruction.png')}
                    style={styles.instruction}
                    resizeMode="contain"
                />

                {/* Cats to tap */}
                {cats.map(cat => cat.visible && (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.catContainer, { top: cat.top, left: cat.left }]}
                        onPress={() => handleCatPress(cat.id)}
                        activeOpacity={0.6}
                    >
                        <Image source={cat.img} style={styles.catImg} resizeMode="contain" />
                    </TouchableOpacity>
                ))}

                {/* Mars planet bottom */}
                <Image
                    source={require('../../assets/act6/mars.png')}
                    style={styles.marsPlanet}
                    resizeMode="contain"
                />

                {/* Speed parameter box */}
                <View style={styles.parameterContainer}>
                    <Image
                        source={require('../../assets/act6ExperimentAssets/speed.png')}
                        style={styles.parameterBox}
                        resizeMode="contain"
                    />
                    <Text style={styles.speedText}>
                        Speed  {speed.toFixed(2)} m/s
                    </Text>
                </View>
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

    /* Instruction */
    instruction: {
        position: 'absolute',
        top: s(150),
        alignSelf: 'center',
        width: s(390),
        height: s(90),
    },

    /* Cats */
    catContainer: {
        position: 'absolute',
        width: s(100),
        height: s(100),
        padding: s(5),
    },
    catImg: {
        width: '100%',
        height: '100%',
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

    /* Speed parameter */
    parameterContainer: {
        position: 'absolute',
        bottom: s(100),
        left: s(50),
        width: s(160),
        height: s(50),
        zIndex: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    parameterBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    speedText: {
        fontFamily: FONTS.title, // ShortStack
        fontSize: s(15),
        color: '#07181f',
        marginLeft: s(15),
        marginTop: s(2),
    },
});

export default ExperimentPage1;
