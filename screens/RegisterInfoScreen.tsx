import React, { useState, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS } from '../utils/theme';
import ProfanityFilter from '../utils/profanityFilter';
import { signUp } from '../services/authService';
import { setDocument, queryDocuments, where } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

type Nav = StackNavigationProp<RootStackParamList, 'RegisterInfo'>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const wp = (percent: number) => (SCREEN_W * percent) / 100;
const hp = (percent: number) => (SCREEN_H * percent) / 100;

type FormData = {
  fullName: string;
  dateOfBirth: string;
  usernameOrEmail: string;
  password: string;
  passwordConfirmation: string;
};

const RegisterInfoScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegisterInfo'>>();
  const role = route.params?.role || 'student';
  const { refreshProfile } = useAuth();
  const filter = useMemo(() => new ProfanityFilter(), []);

  const [profanityError, setProfanityError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    usernameOrEmail: '',
    password: '',
    passwordConfirmation: '',
  });

  // Dynamic scrolling state
  const [isInputFocused, setIsInputFocused] = useState(false);

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

  const handleRegister = async () => {
    // Profanity check
    const hasProfanity = filter.isProfane(formData.usernameOrEmail);
    if (hasProfanity) {
      setProfanityError('Please choose a different username.');
      return;
    }

    // Basic validation
    if (!formData.fullName.trim() || !formData.usernameOrEmail.trim() || !formData.password) {
      setRegisterError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.passwordConfirmation) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setRegisterError('');

    try {
      // 1. Create Firebase Auth account
      const user = await signUp(formData.usernameOrEmail.trim(), formData.password);

      // 2. Generate a unique display username from full name + 2 random digits
      const nameParts = formData.fullName.trim().split(/\s+/);
      const baseUsername = nameParts.length > 1
        ? `${nameParts[0]}.${nameParts[nameParts.length - 1]}`
        : nameParts[0];

      let displayUsername = '';
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        displayUsername = `${baseUsername}${randomNum}`;

        // Check if this username already exists in Firestore
        const existing = await queryDocuments('users', [
          where('displayUsername', '==', displayUsername),
        ]);
        if (existing.length === 0) {
          isUnique = true;
        }
        attempts++;
      }

      // 3. Save user profile to Firestore (using UID as doc ID)
      await setDocument('users', user.uid, {
        uid: user.uid,
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        username: formData.usernameOrEmail.trim(),
        displayUsername: displayUsername,
        role: role,
        createdAt: new Date().toISOString(),
      });

      console.log('[Register] Success! UID:', user.uid, 'Username:', displayUsername);

      // 4. Refresh AuthContext so all screens show the new user's profile
      await refreshProfile();

      // Navigate to loading/home
      navigation.navigate('Loading');
    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      }
      setRegisterError(message);
      console.log('[Register] Error:', error.code, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={isInputFocused} // Only scrollable when filling a text box
        >
          {/* STEMM LAB title logo */}
          <Image
            source={require('../assets/OnBoardingAssets/STEMMLAB.png')}
            style={styles.titleLogo}
            resizeMode="contain"
          />

          {/* ── PHONE CONTAINER ── Register form container */}
          <View style={styles.phoneContainer}>
            <Image
              source={require('../assets/RegisterAssets/phone.png')}
              style={styles.phoneBg}
              resizeMode="stretch"
            />

            <View style={styles.phoneInner}>
              {/* Register Title */}
              <Image
                source={require('../assets/RegisterAssets/Register.png')}
                style={styles.registerTitleImage}
                resizeMode="contain"
              />

              {/* 1. Full Name */}
              <Image
                source={require('../assets/RegisterAssets/Full Name.png')}
                style={styles.fullNameLabel}
                resizeMode="contain"
              />
              <View style={styles.fullNameBox}>
                <Image
                  source={require('../assets/RegisterAssets/nameBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.fullNameInput}
                  value={formData.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter your full name here"
                  placeholderTextColor="#7F8C8D"
                  autoCapitalize="words"
                  textAlign="left"
                />
              </View>

              {/* 2. Date of Birth */}
              <Image
                source={require('../assets/RegisterAssets/Date of Birth.png')}
                style={styles.dobLabel}
                resizeMode="contain"
              />
              <View style={styles.dobBox}>
                <Image
                  source={require('../assets/RegisterAssets/dobBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.dobInput}
                  value={formData.dateOfBirth}
                  onChangeText={(text) => handleChange('dateOfBirth', text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#7F8C8D"
                  keyboardType="numeric"
                  textAlign="left"
                />
              </View>

              {/* 3. Username/Email (Same as LoginScreen layout) */}
              <Image
                source={require('../assets/LoginAssets/username.png')}
                style={styles.usernameLabel}
                resizeMode="contain"
              />
              <View style={styles.usernameBox}>
                <Image
                  source={require('../assets/LoginAssets/usernameBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.usernameInput}
                  value={formData.usernameOrEmail}
                  onChangeText={(text) => handleChange('usernameOrEmail', text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter your username here"
                  placeholderTextColor="#7F8C8D"
                  autoCapitalize="none"
                  textAlign="left"
                />
              </View>
              {profanityError !== '' && (
                <Text style={styles.errorText}>{profanityError}</Text>
              )}

              {/* 4. Password (Same as LoginScreen layout) */}
              <Image
                source={require('../assets/LoginAssets/Password.png')}
                style={styles.passwordLabel}
                resizeMode="contain"
              />
              <View style={styles.passwordBox}>
                <Image
                  source={require('../assets/LoginAssets/passwordBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.passwordInput}
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter your password here"
                  placeholderTextColor="#7F8C8D"
                  secureTextEntry
                  textAlign="left"
                />
              </View>

              {/* 5. Password Confirmation */}
              <Image
                source={require('../assets/RegisterAssets/Password Confirmation.png')}
                style={styles.passwordConfirmLabel}
                resizeMode="contain"
              />
              <View style={styles.passwordConfirmBox}>
                <Image
                  source={require('../assets/RegisterAssets/passwordBox2.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.passwordConfirmInput}
                  value={formData.passwordConfirmation}
                  onChangeText={(text) => handleChange('passwordConfirmation', text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Re-enter your password here"
                  placeholderTextColor="#7F8C8D"
                  secureTextEntry
                  textAlign="left"
                />
              </View>

              {/* Register error message */}
              {registerError !== '' && (
                <Text style={styles.errorText}>{registerError}</Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#08121E" />
                ) : (
                  <Image
                    source={require('../assets/RegisterAssets/registerBtn.png')}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: hp(4),
  },

  /* ── Title logo (same as LoginScreen) ── */
  titleLogo: {
    width: wp(55),
    height: hp(15),
    marginTop: hp(8),
  },

  /* ── Phone Layout Container ── */
  phoneContainer: {
    width: wp(92),
    height: hp(74),
    marginTop: hp(3),
    alignSelf: 'center',
  },
  phoneBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  phoneInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(14),
    paddingTop: hp(4),
    paddingBottom: hp(4),
    gap: hp(0.2), // Tighter gap to keep everything inside the phone container
  },

  registerTitleImage: {
    width: wp(35),
    height: hp(5.5),
    marginBottom: hp(2),
    marginTop: -hp(5),
  },

  /* ── Individual Field Labels ── */
  fullNameLabel: {
    width: wp(20),
    height: hp(1.5),
    alignSelf: 'flex-start',
    marginLeft: wp(-9),
    marginTop: hp(0.6),
  },
  dobLabel: {
    width: wp(28),
    height: hp(3.6),
    alignSelf: 'flex-start',
    marginLeft: wp(-9),
    marginTop: hp(0.6),
    marginBottom: -9,
  },
  usernameLabel: {
    width: wp(33),
    height: hp(3.6),
    alignSelf: 'flex-start',
    marginLeft: wp(-9),
    marginTop: hp(0.6),
    marginBottom: -9,
  },
  passwordLabel: {
    width: wp(21),
    height: hp(3.6),
    alignSelf: 'flex-start',
    marginLeft: wp(-9),
    marginTop: hp(0.6),
    marginBottom: -9,
  },
  passwordConfirmLabel: {
    width: wp(51),
    height: hp(3.6),
    alignSelf: 'flex-start',
    marginLeft: wp(-9),
    marginTop: hp(0.6),
    marginBottom: -9,
  },

  /* ── Individual Input Boxes ── */
  fullNameBox: {
    width: wp(70),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.4),
  },
  dobBox: {
    width: wp(70),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.4),
  },
  usernameBox: {
    width: wp(70),
    height: hp(5.2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.4),
  },
  passwordBox: {
    width: wp(70),
    height: hp(5.2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.4),
  },
  passwordConfirmBox: {
    width: wp(70),
    height: hp(5.2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.4),
  },

  boxImageBackground: {
    position: 'absolute',
    width: '120%',
    height: '100%',
  },

  /* ── Individual Text Inputs ── */
  fullNameInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: wp(0),
    paddingRight: wp(-13),
    paddingHorizontal: 20,
    marginTop: 2,
    zIndex: 2,
    left: -10
  },
  dobInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: wp(0),
    paddingRight: wp(-13),
    paddingHorizontal: 20,
    marginTop: 2,
    zIndex: 2,
    left: -10
  },
  usernameInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: wp(0),
    paddingRight: wp(-13),
    paddingHorizontal: 20,
    marginTop: 2,
    zIndex: 2,
    left: -10
  },
  passwordInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: wp(0),
    paddingRight: wp(-13),
    paddingHorizontal: 20,
    marginTop: 2,
    zIndex: 2,
    left: -10
  },
  passwordConfirmInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: wp(0),
    paddingRight: wp(-13),
    paddingHorizontal: 20,
    marginTop: 2,
    zIndex: 2,
    left: -10
  },

  registerButton: {
    width: wp(38),
    height: hp(4.5),
    marginTop: hp(3),
    marginBottom: hp(0.5),
  },

  fullImage: {
    width: '100%',
    height: '100%',
  },

  errorText: {
    fontFamily: FONTS.title,
    fontSize: 9,
    color: '#ff4d4d',
    alignSelf: 'flex-start',
    marginLeft: wp(-8),
    marginTop: hp(0.2),
    marginBottom: -6,
  },
});

export default RegisterInfoScreen;
