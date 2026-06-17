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

type Nav = StackNavigationProp<RootStackParamList, 'Act7Start'>;

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
    navigation.navigate('Act7Authentication');
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

        {/* Meteor / asteroid — center of screen */}
        <Image
          source={require('../../assets/act7/act7Meteor.png')}
          style={styles.meteor}
          resizeMode="contain"
        />

        {/* "Jupiter" label — on top of the meteor */}
        <Image
          source={require('../../assets/act7/jupiter.png')}
          style={styles.jupiterLabel}
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

        {/* Jupiter planet — bottom of the screen */}

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

  /* Meteor — centered in the middle area */
  meteor: {
    position: 'absolute',
    top: s(270),
    alignSelf: 'center',
    width: s(560),
    height: s(540),
    left: s(-50),
  },

  /* "Jupiter" label — positioned on top of the meteor */
  jupiterLabel: {
    position: 'absolute',
    top: s(700),
    alignSelf: 'center',
    width: s(440),
    height: s(335),
    left: s(0),
  },



  /* START button — below description on the meteor */
  startButton: {
    position: 'absolute',
    top: s(635),
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


});

export default StartPage;
