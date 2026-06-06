import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'Act5Equipment'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const EquipmentPage: React.FC = () => {
    const navigation = useNavigation<Nav>();

    const handleClose = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        navigation.navigate('Act5Instruction');
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

                {/* Equipment box container and Continue Button */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/EquipmentAssets/act5equipmentBox.png')}
                        style={styles.equipmentBox}
                        resizeMode="contain"
                    />
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

                {/* Saturn planet — bottom of the screen */}
                <Image
                    source={require('../../assets/act5/saturnPlanet.png')}
                    style={styles.saturnPlanet}
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

    /* Title bubble — "Stretch Speed & Gracefulness" */
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
    },

    /* Equipment Box Container */
    boxContainer: {
        position: 'absolute',
        top: s(350),
        alignSelf: 'center',
        width: s(374),
        height: s(351),
        zIndex: 2,
    },
    equipmentBox: {
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
});

export default EquipmentPage;
