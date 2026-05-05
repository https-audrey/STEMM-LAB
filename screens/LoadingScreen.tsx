import React, { useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Loading'>;

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

const decorativeImages = [
  { src: require('../assets/image-15.png'), style: { top: s(887), left: s(30), width: s(45), height: s(41) } },
  { src: require('../assets/image-13.png'), style: { top: s(40), left: s(347), width: s(56), height: s(51) } },
  { src: require('../assets/image-12.png'), style: { top: s(195), left: s(38), width: s(83), height: s(76) } },
  { src: require('../assets/image-14.png'), style: { top: s(716), left: s(333), width: s(29), height: s(27) } },
  { src: require('../assets/image-16.png'), style: { top: s(567), left: s(38), width: s(37), height: s(34) } },
  { src: require('../assets/image-17.png'), style: { top: s(327), left: s(302), width: s(56), height: s(51) } },
];

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  // Auto-navigate to Home after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Logo shapes */}
      <Image source={require('../assets/vector-15.png')} style={styles.logoVector1} resizeMode="contain" />
      <Image source={require('../assets/vector-16.png')} style={styles.logoVector2} resizeMode="contain" />

      {/* STEMM LAB title */}
      <Text style={styles.title}>{'STEMM\nLAB'}</Text>

      {/* Loading illustration */}
      <Image
        source={require('../assets/group-5.png')}
        style={styles.loadingImage}
        resizeMode="contain"
      />

      {/* 100% text */}
      <Text style={styles.percentText}>100%</Text>

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

      {/* Decorative star images */}
      {decorativeImages.map((img, index) => (
        <Image
          key={`decor-${index}`}
          source={img.src}
          style={[styles.absImage, img.style]}
          resizeMode="cover"
        />
      ))}

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
  absImage: {
    position: 'absolute',
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
  loadingImage: {
    position: 'absolute',
    top: s(344),
    left: s(15),
    width: s(389),
    height: s(284),
  },
  percentText: {
    position: 'absolute',
    top: s(496),
    left: s(244),
    fontFamily: FONTS.ui,
    fontSize: s(30),
    color: COLORS.darkText,
    letterSpacing: s(4.8),
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

export default LoadingScreen;
