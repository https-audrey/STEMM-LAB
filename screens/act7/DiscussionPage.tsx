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

type Nav = StackNavigationProp<RootStackParamList, 'Act7Discussion'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Act7DiscussionPage: React.FC = () => {
    const navigation = useNavigation<Nav>();

    const handleClose = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        navigation.navigate('Act7Curriculum');
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

                {/* Title bubble */}
                <Image
                    source={require('../../assets/act7/act7Title.png')}
                    style={styles.titleBubble}
                    resizeMode="contain"
                />

                {/* Discussion box container and Continue Button */}
                <View style={styles.boxContainer}>
                    <Image
                        source={require('../../assets/DiscussionAssets/act7DiscussionBox.png')}
                        style={styles.discussionBox}
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

                {/* Jupiter planet — bottom of the screen */}
                <Image
                    source={require('../../assets/act7/jupiter.png')}
                    style={styles.jupiterPlanet}
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
    titleBubble: {
        position: 'absolute',
        top: s(140),
        alignSelf: 'center',
        width: s(390),
        height: s(180),
        left: s(30),
    },
    boxContainer: {
        position: 'absolute',
        top: s(320),
        alignSelf: 'center',
        width: s(374),
        height: s(583),
        zIndex: 2,
    },
    discussionBox: {
        width: '100%',
        height: '100%',
    },
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
    jupiterPlanet: {
        position: 'absolute',
        bottom: s(-30),
        right: s(-40),
        width: s(480),
        height: s(280),
        zIndex: 1,
    },
});

export default Act7DiscussionPage;