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
import { RootStackParamList } from './types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'Act5Start'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const StartPage: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const handleClose = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    // Navigate to the next act5 screen (to be implemented)
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

        {/* Meteor / asteroid — center of screen */}
        <Image
          source={require('../../assets/act5/meteor.png')}
          style={styles.meteor}
          resizeMode="contain"
        />

        {/* "Saturn" label — on top of the meteor */}
        <Image
          source={require('../../assets/act5/saturn.png')}
          style={styles.saturnLabel}
          resizeMode="contain"
        />

        {/* Description bubble — overlaid on the meteor */}
        <Image
          source={require('../../assets/act5/desc.png')}
          style={styles.descBubble}
          resizeMode="contain"
        />

        {/* START button — on the meteor */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/act5/startBtn.png')}
            style={styles.startImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

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
    top: s(50),
    left: s(25),
    width: s(45),
    height: s(45),
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: s(35),
    height: s(35),
  },

  /* Title bubble — "Stretch Speed & Gracefulness" */
  titleBubble: {
    position: 'absolute',
    top: s(90),
    alignSelf: 'center',
    width: s(340),
    height: s(130),
    left: s(50),
  },

  /* Meteor — centered in the middle area */
  meteor: {
    position: 'absolute',
    top: s(210),
    alignSelf: 'center',
    width: s(500),
    height: s(480),
    left: s(-30),
  },

  /* "Saturn" label — positioned on top of the meteor */
  saturnLabel: {
    position: 'absolute',
    top: s(290),
    alignSelf: 'center',
    width: s(150),
    height: s(45),
    left: s(145),
  },

  /* Description bubble — overlaid on the meteor area */
  descBubble: {
    position: 'absolute',
    top: s(380),
    alignSelf: 'center',
    width: s(300),
    height: s(140),
    left: s(70),
  },

  /* START button — below description on the meteor */
  startButton: {
    position: 'absolute',
    top: s(530),
    alignSelf: 'center',
    left: s(155),
    width: s(130),
    height: s(45),
    zIndex: 10,
  },
  startImage: {
    width: '100%',
    height: '100%',
  },

  /* Saturn planet — bottom of screen, partially cut off */
  saturnPlanet: {
    position: 'absolute',
    bottom: s(-50),
    right: s(-40),
    width: s(480),
    height: s(280),
  },
});

export default StartPage;
