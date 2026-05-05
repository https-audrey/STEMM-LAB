import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Login'>;

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

// Crater images for the planet decoration
const craterImages = [
  { src: require('../assets/vector-15.png'), style: { top: s(40), left: s(147), width: s(109), height: s(111) } },
  { src: require('../assets/vector-16.png'), style: { top: s(116), left: s(45), width: s(55), height: s(92) } },
  { src: require('../assets/vector-17.png'), style: { top: s(143), left: s(289), width: s(83), height: s(56) } },
  { src: require('../assets/vector-18.png'), style: { top: s(196), left: s(229), width: s(42), height: s(41) } },
  { src: require('../assets/vector-19.png'), style: { top: s(229), left: s(128), width: s(102), height: s(107) } },
  { src: require('../assets/vector-20.png'), style: { top: s(260), left: s(317), width: s(47), height: s(59) } },
  { src: require('../assets/vector-21.png'), style: { top: s(34), left: s(260), width: s(50), height: s(57) } },
];





const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />



      {/* Planet decoration */}
      <View style={styles.planetWrapper}>
        <Image
          source={require('../assets/vector-14.png')}
          style={{ position: 'absolute', top: s(10), left: s(1), width: s(410), height: s(380) }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/image.png')}
          style={{ position: 'absolute', top: s(11), left: s(1), width: s(408), height: s(378) }}
          resizeMode="contain"
        />
        {craterImages.map((item, index) => (
          <Image
            key={`crater-${index}`}
            source={item.src}
            style={[styles.absImage, item.style, { tintColor: '#6b6b6b' }]}
            resizeMode="contain"
          />
        ))}
      </View>



      {/* STEMM LAB title */}
      <Text style={styles.title}>{'STEMM\nLAB'}</Text>

      {/* LOGIN subtitle */}
      <Image
        source={require('../assets/vector-18.png')}
        style={styles.loginBg}
        resizeMode="contain"
      />
      <Text style={styles.loginTitle}>LOGIN</Text>

      {/* Username field */}
      <Text style={styles.usernameLabel}>Username/Email</Text>
      <Image
        source={require('../assets/vector-22.png')}
        style={styles.usernameFieldBg}
        resizeMode="contain"
      />
      <TextInput
        style={styles.usernameInput}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username/email here"
        placeholderTextColor={COLORS.placeholderText}
        autoCapitalize="none"
        autoComplete="username"
        textAlign="center"
      />

      {/* Password field */}
      <Text style={styles.passwordLabel}>Password</Text>
      <Image
        source={require('../assets/vector-23.png')}
        style={styles.passwordFieldBg}
        resizeMode="contain"
      />
      <TextInput
        style={styles.passwordInput}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password here"
        placeholderTextColor={COLORS.placeholderText}
        secureTextEntry
        autoComplete="password"
        textAlign="center"
      />

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
        <Image
          source={require('../assets/vector-24.png')}
          style={styles.loginButtonBg}
          resizeMode="contain"
        />
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Lower crater decoration */}
      <Image
        source={require('../assets/vector-21.png')}
        style={styles.lowerCrater}
        resizeMode="contain"
      />

      {/* Google sign-in rectangle background */}
      <Image
        source={require('../assets/vector-26.png')}
        style={styles.googleRectBg}
        resizeMode="contain"
      />

      {/* Google logo */}
      <Image
        source={require('../assets/google.png')}
        style={styles.googleLogo}
        resizeMode="contain"
      />

      {/* Continue with Google text */}
      <Image
        source={require('../assets/continue-with-google.png')}
        style={styles.continueWithGoogle}
        resizeMode="contain"
      />

      {/* Divider line */}
      <Image
        source={require('../assets/vector-2.png')}
        style={styles.dividerLine}
        resizeMode="contain"
      />

      {/* Sign up link */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterRole')}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>


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

  planetWrapper: {
    position: 'absolute',
    top: s(258),
    left: s(16),
    width: s(420),
    height: s(376),
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
  loginBg: {
    position: 'absolute',
    top: s(298),
    left: s(150),
    width: s(133),
    height: s(48),
  },
  loginTitle: {
    position: 'absolute',
    top: s(302),
    left: s(162),
    fontFamily: FONTS.heading,
    fontSize: s(32),
    color: COLORS.darkText,
    letterSpacing: s(5.12),
  },
  usernameLabel: {
    position: 'absolute',
    top: s(372),
    left: s(60),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  usernameFieldBg: {
    position: 'absolute',
    top: s(397),
    left: s(51),
    width: s(339),
    height: s(49),
  },
  usernameInput: {
    position: 'absolute',
    top: s(399),
    left: s(55),
    width: s(330),
    height: s(44),
    fontFamily: FONTS.title,
    fontSize: s(14),
    color: COLORS.bodyText,
    textAlignVertical: 'center',
  },
  passwordLabel: {
    position: 'absolute',
    top: s(456),
    left: s(60),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  passwordFieldBg: {
    position: 'absolute',
    top: s(480),
    left: s(51),
    width: s(339),
    height: s(49),
  },
  passwordInput: {
    position: 'absolute',
    top: s(482),
    left: s(55),
    width: s(330),
    height: s(44),
    fontFamily: FONTS.title,
    fontSize: s(14),
    color: COLORS.bodyText,
    textAlignVertical: 'center',
  },
  loginButton: {
    position: 'absolute',
    top: s(547),
    left: s(155),
    width: s(130),
    height: s(41),
  },
  loginButtonBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(130),
    height: s(41),
  },
  loginButtonText: {
    position: 'absolute',
    top: s(11),
    left: s(36),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },

  lowerCrater: {
    position: 'absolute',
    top: s(640),
    left: s(30),
    width: s(380),
    height: s(300),
    tintColor: '#6b6b6b',
  },
  googleRectBg: {
    position: 'absolute',
    top: s(700),
    left: s(70),
    width: s(300),
    height: s(50),
  },
  googleLogo: {
    position: 'absolute',
    top: s(706),
    left: s(90),
    width: s(38),
    height: s(38),
  },
  continueWithGoogle: {
    position: 'absolute',
    top: s(710),
    left: s(140),
    width: s(200),
    height: s(30),
  },
  dividerLine: {
    position: 'absolute',
    top: s(770),
    left: s(70),
    width: s(300),
    height: s(3),
  },
  signUpRow: {
    position: 'absolute',
    top: s(795),
    left: s(57),
    flexDirection: 'row',
  },
  signUpText: {
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  signUpLink: {
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: '#fefeff',
  },

});

export default LoginScreen;
