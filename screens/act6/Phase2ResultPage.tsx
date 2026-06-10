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
import { queryDocuments, where, orderBy, limit } from '../../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Act6Phase2Result'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const Phase2ResultPage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const [speed, setSpeed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = profile?.fullName || 'Alexander';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const results = await queryDocuments('experiments', [
          where('userId', '==', profile?.uid || 'anonymous'),
          where('act', '==', 6),
          where('phase', '==', 2), // Fetching Phase 2 result
          orderBy('createdAt', 'desc'),
          limit(1),
        ]);

        if (results.length > 0) {
          setSpeed(results[0].speed);
        }
      } catch (error) {
        console.error('Error fetching speed result:', error);
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
    // Navigate to next activity or phase
    navigation.navigate('Home'); 
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
            source={require('../../assets/act6PhaseResultAssets/phase2ResultBox.png')}
            style={styles.resultBox}
            resizeMode="contain"
          >
            {/* Player Name Overlay */}
            <View style={styles.nameOverlay}>
              <Text style={styles.playerNameText}>
                Player 1: {userName}
              </Text>
            </View>

            {/* Speed Result Overlay */}
            <View style={styles.speedOverlay}>
              {loading ? (
                <ActivityIndicator color="#07181f" />
              ) : (
                <Text style={styles.speedText}>
                  {speed !== null ? speed.toFixed(2) : '0.00'} m/s
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
    top: s(62),
    width: s(280),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNameText: {
    fontFamily: FONTS.title, // ShortStack
    fontSize: s(22),
    color: '#07181f',
  },

  speedOverlay: {
    position: 'absolute',
    top: s(245),
    width: s(150),
    height: s(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    fontFamily: FONTS.heading, // DynaPuff
    fontSize: s(24),
    color: '#07181f',
    fontWeight: '400',
  },

  /* Continue Button */
  continueBtn: {
    position: 'absolute',
    bottom: s(60),
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

export default Phase2ResultPage;
