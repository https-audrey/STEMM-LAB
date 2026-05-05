import React, { useState, useMemo } from 'react';
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
import ProfanityFilter from '../utils/profanityFilter';

type Nav = StackNavigationProp<RootStackParamList, 'RegisterInfo'>;

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

type FormData = {
  fullName: string;
  dateOfBirth: string;
  usernameOrEmail: string;
  password: string;
  passwordConfirmation: string;
};

const fieldDefinitions = [
  {
    key: 'fullName' as keyof FormData,
    label: 'Full Name',
    placeholder: 'Enter your full name here',
    labelTop: 372,
    inputTop: 397,
    type: 'text',
    image: require('../assets/vector-22.png'),
    keyboardType: 'default' as const,
  },
  {
    key: 'dateOfBirth' as keyof FormData,
    label: 'Date of Birth',
    placeholder: 'DD/MM/YYYY',
    labelTop: 456,
    inputTop: 480,
    type: 'text',
    image: require('../assets/vector-23.png'),
    keyboardType: 'numeric' as const,
  },
  {
    key: 'usernameOrEmail' as keyof FormData,
    label: 'Username/Email',
    placeholder: 'Enter your username/email here',
    labelTop: 539,
    inputTop: 564,
    type: 'text',
    image: require('../assets/vector-32.png'),
    keyboardType: 'email-address' as const,
  },
  {
    key: 'password' as keyof FormData,
    label: 'Password',
    placeholder: 'Enter your password here',
    labelTop: 623,
    inputTop: 647,
    type: 'password',
    image: require('../assets/vector-33.png'),
    keyboardType: 'default' as const,
  },
  {
    key: 'passwordConfirmation' as keyof FormData,
    label: 'Password Confirmation',
    placeholder: 'Re-enter your password here',
    labelTop: 706,
    inputTop: 730,
    type: 'password',
    image: require('../assets/vector-34.png'),
    keyboardType: 'default' as const,
  },
];

const RegisterInfoScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const filter = useMemo(() => new ProfanityFilter(), []);
  const [profanityError, setProfanityError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    usernameOrEmail: '',
    password: '',
    passwordConfirmation: '',
  });

  const handleChange = (key: keyof FormData, value: string) => {
    if (key === 'dateOfBirth') {
      const numeric = value.replace(/\D/g, '').slice(0, 8);
      const parts = [
        numeric.slice(0, 2),
        numeric.slice(2, 4),
        numeric.slice(4, 8),
      ].filter(Boolean);
      setFormData((prev) => ({
        ...prev,
        [key]: parts.join('/'),
      }));
      return;
    }

    // Check for profanity in the username/email field
    if (key === 'usernameOrEmail') {
      const hasProfanity = value.length > 0 && filter.isProfane(value);
      console.log('[ProfanityFilter] Checking:', value, '| isProfane:', hasProfanity);
      if (hasProfanity) {
        setProfanityError('Username contains inappropriate language.');
      } else {
        setProfanityError('');
      }
    }

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = () => {
    // Block registration if username contains profanity
    const hasProfanity = filter.isProfane(formData.usernameOrEmail);
    console.log('[ProfanityFilter] Register check:', formData.usernameOrEmail, '| isProfane:', hasProfanity);
    if (hasProfanity) {
      setProfanityError('Please choose a different username.');
      return;
    }
    navigation.navigate('Loading');
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Form card background */}
      <Image
        source={require('../assets/vector-31.png')}
        style={styles.formCardBg}
        resizeMode="contain"
      />
      <Image
        source={require('../assets/vector-36.png')}
        style={styles.formCardOverlay}
        resizeMode="contain"
      />

      {/* Logo shapes */}
      <Image source={require('../assets/vector-15.png')} style={styles.logoVector1} resizeMode="contain" />
      <Image source={require('../assets/vector-16.png')} style={styles.logoVector2} resizeMode="contain" />

      {/* STEMM LAB title */}
      <Text style={styles.title}>{'STEMM\nLAB'}</Text>

      {/* Register subtitle */}
      <Text style={styles.registerTitle}>Register</Text>

      {/* Form fields */}
      {fieldDefinitions.map((field) => (
        <View key={field.key}>
          <Text style={[styles.fieldLabel, { top: s(field.labelTop) }]}>
            {field.label}
          </Text>
          <Image
            source={field.image}
            style={[styles.fieldBg, { top: s(field.inputTop) }]}
            resizeMode="contain"
          />
          <TextInput
            style={[styles.fieldInput, { top: s(field.inputTop + 4) }]}
            value={formData[field.key]}
            onChangeText={(text) => handleChange(field.key, text)}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.placeholderText}
            secureTextEntry={field.type === 'password'}
            keyboardType={field.keyboardType || 'default'}
            autoCapitalize="none"
          />
          {/* Show profanity error below the username field */}
          {field.key === 'usernameOrEmail' && profanityError !== '' && (
            <Text style={[styles.errorText, { top: s(field.inputTop + 52) }]}>
              {profanityError}
            </Text>
          )}
        </View>
      ))}

      {/* Register button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
        <Image source={require('../assets/vector-24.png')} style={styles.registerButtonBg} resizeMode="contain" />
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Decorative star */}
      <Image source={require('../assets/vector-35.png')} style={styles.decorStar} resizeMode="contain" />

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
  formCardBg: {
    position: 'absolute',
    top: s(267),
    left: s(32),
    width: s(376),
    height: s(649),
  },
  formCardOverlay: {
    position: 'absolute',
    top: s(269),
    left: s(34),
    width: s(373),
    height: s(646),
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
  registerTitle: {
    position: 'absolute',
    top: s(305),
    left: s(148),
    fontFamily: FONTS.heading,
    fontSize: s(26),
    color: COLORS.darkText,
    letterSpacing: s(4.16),
  },
  fieldLabel: {
    position: 'absolute',
    left: s(60),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  fieldBg: {
    position: 'absolute',
    left: s(51),
    width: s(339),
    height: s(49),
  },
  fieldInput: {
    position: 'absolute',
    left: s(66),
    width: s(311),
    height: s(36),
    fontFamily: FONTS.title,
    fontSize: s(14),
    color: COLORS.bodyText,
  },
  registerButton: {
    position: 'absolute',
    top: s(803),
    left: s(155),
    width: s(130),
    height: s(41),
  },
  registerButtonBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(130),
    height: s(41),
  },
  registerButtonText: {
    position: 'absolute',
    top: s(11),
    left: s(27),
    fontFamily: FONTS.title,
    fontSize: s(16),
    color: COLORS.bodyText,
  },
  decorStar: {
    position: 'absolute',
    top: s(861),
    left: s(198),
    width: s(33),
    height: s(34),
  },
  errorText: {
    position: 'absolute',
    left: s(60),
    fontFamily: FONTS.title,
    fontSize: s(12),
    color: '#ff4d4d',
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

export default RegisterInfoScreen;
