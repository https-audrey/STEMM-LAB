import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Logo vectors */}
      <Image
        source={require('../assets/vector-15.png')}
        style={styles.logoVector1}
        resizeMode="contain"
      />
      <Image
        source={require('../assets/vector-16.png')}
        style={styles.logoVector2}
        resizeMode="contain"
      />

      {/* STEMM LAB title */}
      <Text style={styles.title}>
        {'STEMM\nLAB'}
      </Text>

      {/* START button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <Image
          source={require('../assets/group-1.png')}
          style={styles.startButtonBg}
          resizeMode="contain"
        />
        <Text style={styles.startButtonText}>START</Text>
      </TouchableOpacity>

      {/* Description background */}
      <Image
        source={require('../assets/vector-17.png')}
        style={styles.descBg}
        resizeMode="contain"
      />

      {/* Description text */}
      <Text style={styles.descText}>
        {'real-world physical activities into\nengaging, game-based learning\nexperiences.'}
      </Text>

      {/* Decorative stars */}
      <Image
        source={require('../assets/image-12.png')}
        style={styles.star1}
        resizeMode="contain"
      />
      <Image
        source={require('../assets/image-13.png')}
        style={styles.star2}
        resizeMode="contain"
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(440),
    height: s(956),
  },
  logoVector1: {
    position: 'absolute',
    top: s(80),
    left: s(100),
    width: s(239),
    height: s(71),
  },
  logoVector2: {
    position: 'absolute',
    top: s(157),
    left: s(148),
    width: s(147),
    height: s(75),
  },
  title: {
    position: 'absolute',
    top: s(77),
    left: s(106),
    fontFamily: FONTS.title,
    fontSize: s(64),
    color: COLORS.darkText,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    top: s(397),
    left: s(91),
    width: s(259),
    height: s(216),
  },
  startButtonBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(259),
    height: s(216),
  },
  startButtonText: {
    position: 'absolute',
    top: s(69),
    left: s(33),
    fontFamily: FONTS.heading,
    fontSize: s(64),
    color: '#060f19',
  },
  descBg: {
    position: 'absolute',
    top: s(760),
    left: s(33),
    width: s(381),
    height: s(99),
  },
  descText: {
    position: 'absolute',
    top: s(768),
    left: s(19),
    width: s(401),
    fontFamily: FONTS.title,
    fontSize: s(18),
    color: COLORS.descText,
    textAlign: 'center',
    lineHeight: s(28.4),
  },
  star1: {
    position: 'absolute',
    top: s(567),
    left: s(38),
    width: s(37),
    height: s(34),
  },
  star2: {
    position: 'absolute',
    top: s(887),
    left: s(30),
    width: s(45),
    height: s(41),
  },
  bottomBar: {
    position: 'absolute',
    top: s(939),
    left: s(117),
    width: s(206),
    height: s(8),
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
