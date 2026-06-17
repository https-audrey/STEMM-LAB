import React, { useState } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { FONTS } from '../../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Act7Authentication'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const AuthenticationPage: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [isChecked, setIsChecked] = useState(false);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleStart = () => {
        navigation.navigate('Act7Equipment'); 
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

                {/* Title bubble — "Breathing Pace Trainer" */}
                <Image
                    source={require('../../assets/act7/act7Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* UFO with cow and beam — centered in middle */}
                <Image
                    source={require('../../assets/AuthenticationAssets/ufo2.png')}
                    style={styles.ufo}
                    resizeMode="contain"
                />

                {/* Jupiter planet — bottom of the screen */}
                <Image
                    source={require('../../assets/AuthenticationAssets/bigJupiter.png')}
                    style={styles.jupiterPlanet}
                    resizeMode="contain"
                />

                {/* Description box — "To ensure your experiment data is accurate..." */}
                <Image
                    source={require('../../assets/AuthenticationAssets/authentication.png')}
                    style={styles.authDescBox}
                    resizeMode="contain"
                />

                {/* Agreement Tickbox Overlay */}
                <TouchableOpacity
                    style={styles.agreementOverlay}
                    onPress={() => setIsChecked(!isChecked)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={
                            isChecked
                                ? require('../../assets/AuthenticationAssets/tickBox2.png')
                                : require('../../assets/AuthenticationAssets/tickBox1.png')
                        }
                        style={styles.checkboxIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* START button — below the agreement checkbox */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStart}
                    activeOpacity={0.8}
                >
                    <Image
                        source={require('../../assets/AuthenticationAssets/startBtnWhite.png')}
                        style={styles.startImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
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

    /* Close button — top left corner */
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

    /* Title bubble — "Breathing Pace Trainer" */
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
    },

    /* UFO with cow and beam */
    ufo: {
        position: 'absolute',
        top: s(340),
        alignSelf: 'center',
        width: s(330),
        height: s(405),
        zIndex: 2,
        left: s(45),
    },

    /* Jupiter planet — bottom of screen, partially cut off */
    jupiterPlanet: {
        position: 'absolute',
        bottom: s(0),
        alignSelf: 'center',
        width: s(440),
        height: s(378),
        zIndex: 1,
    },

    /* Description box */
    authDescBox: {
        position: 'absolute',
        top: s(690),
        alignSelf: 'center',
        width: s(374),
        height: s(154),
        zIndex: 2,
    },

    /* Agreement Tickbox Overlay */
    agreementOverlay: {
        position: 'absolute',
        top: s(790),
        left: s(45),
        width: s(344),
        height: s(55),
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    checkboxIcon: {
        width: s(35),
        height: s(22),
    },

    /* START button */
    startButton: {
        position: 'absolute',
        top: s(870),
        alignSelf: 'center',
        width: s(130),
        height: s(41),
        zIndex: 10,
    },
    startImage: {
        width: '100%',
        height: '100%',
    },
});

export default AuthenticationPage;
