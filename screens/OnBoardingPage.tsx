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
import { RootStackParamList } from '../types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const OnBoardingPage: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const handleStart = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* STEMM LAB title logo */}
        <Image
          source={require('../assets/OnBoardingAssets/STEMMLAB.png')}
          style={styles.titleLogo}
          resizeMode="contain"
        />

        {/* Decorative stars — numbered top to bottom */}
        <Image
          source={require('../assets/OnBoardingAssets/star1.png')}
          style={styles.star1}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/OnBoardingAssets/star2.png')}
          style={styles.star2}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/OnBoardingAssets/star3.png')}
          style={styles.star3}
          resizeMode="contain"
        />

        {/* START button — meteor + START text overlaid, navigates to Login */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/OnBoardingAssets/meteor.png')}
            style={styles.meteorImage}
            resizeMode="contain"
          />
          <Image
            source={require('../assets/OnBoardingAssets/START.png')}
            style={styles.startText}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/OnBoardingAssets/star4.png')}
          style={styles.star4}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/OnBoardingAssets/star5.png')}
          style={styles.star5}
          resizeMode="contain"
        />

        {/* Description comment bubble */}
        <Image
          source={require('../assets/OnBoardingAssets/comment.png')}
          style={styles.commentImage}
          resizeMode="contain"
        />

        <Image
          source={require('../assets/OnBoardingAssets/star6.png')}
          style={styles.star6}
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

  /* STEMM LAB title — positioned near top center */
  titleLogo: {
    position: 'absolute',
    top: s(105),
    alignSelf: 'center',
    width: s(280),
    height: s(160),
    left: s(80),
  },

  /* Decorative stars — ordered top to bottom by vertical position */
  star1: {
    position: 'absolute',
    top: s(70),
    left: s(350),
    width: s(58),
    height: s(58),
  },
  star2: {
    position: 'absolute',
    top: s(220),
    right: s(330),
    width: s(80),
    height: s(80),
  },
  star3: {
    position: 'absolute',
    top: s(360),
    right: s(90),
    width: s(50),
    height: s(50),
  },

  /* START button area — centered horizontally, middle of screen */
  startButton: {
    position: 'absolute',
    top: s(420),
    left: s(90),
    width: s(260),
    height: s(220),
    justifyContent: 'center',
    alignItems: 'center',
  },
  meteorImage: {
    width: '100%',
    height: '100%',
  },
  startText: {
    position: 'absolute',
    width: s(160),
    height: s(55),
    top: s(80),
  },

  star4: {
    position: 'absolute',
    top: s(610),
    left: s(35),
    width: s(40),
    height: s(38),
  },
  star5: {
    position: 'absolute',
    top: s(720),
    right: s(70),
    width: s(30),
    height: s(30),
  },

  /* Comment / description bubble — near bottom */
  commentImage: {
    position: 'absolute',
    top: s(760),
    left: s(20),
    width: s(400),
    height: s(110),
  },

  star6: {
    position: 'absolute',
    top: s(880),
    left: s(40),
    width: s(50),
    height: s(48),
  },


});

export default OnBoardingPage;
