import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { FONTS } from '../../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Act6Phase1Start'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Phase1StartPage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const userName = profile?.fullName || 'Alexander';

  const handleClose = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    navigation.navigate('Act6Experiment1');
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

        {/* Title — "Reaction Board Challenge" */}
        <Image
          source={require('../../assets/act6/act6Title.png')}
          style={styles.titleBubble}
          resizeMode="contain"
        />

        {/* "Phase 1" bubble */}
        <Image
          source={require('../../assets/PhaseStartPageAssets/phase1.png')}
          style={styles.phaseIndicator}
          resizeMode="contain"
        />

        {/* Player Selection Area */}
        <View style={styles.playerSelectionRow}>
          <ImageBackground
            source={require('../../assets/PhaseStartPageAssets/playerName.png')}
            style={styles.playerNameBox}
            resizeMode="contain"
          >
            <Text style={styles.playerNameText}>
              Player 1: {userName}
            </Text>
          </ImageBackground>

          <TouchableOpacity style={styles.dropDownBtn} activeOpacity={0.7}>
            <Image
              source={require('../../assets/PhaseStartPageAssets/dropDownBtn.png')}
              style={styles.dropDownImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Big START Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/PhaseStartPageAssets/Act6startBtn.png')}
            style={styles.startBtnImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Astronaut - slightly above/on the planet */}
        <Image
          source={require('../../assets/PhaseStartPageAssets/astronaut5.png')}
          style={styles.astronaut}
          resizeMode="contain"
        />

        {/* Mars planet — bottom of the screen */}
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
    top: s(140),
    alignSelf: 'center',
    width: s(390),
    height: s(180),
  },

  /* Phase indicator */
  phaseIndicator: {
    position: 'absolute',
    top: s(325),
    alignSelf: 'center',
    width: s(180),
    height: s(50),
  },

  /* Player Selection Row */
  playerSelectionRow: {
    position: 'absolute',
    top: s(400),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerNameBox: {
    width: s(300),
    height: s(48),
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  playerNameText: {
    fontFamily: FONTS.title, // ShortStack
    fontSize: s(21),
    color: '#07181f',
    textAlign: 'center',
  },
  dropDownBtn: {
    marginLeft: s(10),
    width: s(25),
    height: s(25),
  },
  dropDownImg: {
    width: '100%',
    height: '100%',
  },

  /* Start Button */
  startButton: {
    position: 'absolute',
    top: s(520),
    alignSelf: 'center',
    width: s(270),
    height: s(130),
    zIndex: 5,
  },
  startBtnImg: {
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
    zIndex: 3,
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

export default Phase1StartPage;
