import React, { useState } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS } from '../utils/theme';
import { signIn } from '../services/authService';
import { queryDocuments, where } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

type Nav = StackNavigationProp<RootStackParamList, 'Login'>;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const wp = (percent: number) => (SCREEN_W * percent) / 100;
const hp = (percent: number) => (SCREEN_H * percent) / 100;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { refreshProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter your email/username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let emailToUse = username.trim();

      // If input doesn't look like an email, treat it as a username
      if (!emailToUse.includes('@')) {
        // Look up the user's email by their displayUsername
        const users = await queryDocuments('users', [
          where('displayUsername', '==', emailToUse),
        ]);

        if (users.length === 0) {
          // Also try matching the username field (email stored as username)
          const usersByUsername = await queryDocuments('users', [
            where('username', '==', emailToUse),
          ]);
          if (usersByUsername.length === 0) {
            setErrorMsg('No account found with this username.');
            setLoading(false);
            return;
          }
          emailToUse = usersByUsername[0].username as string;
        } else {
          emailToUse = users[0].username as string;
        }
      }

      // Sign in with the resolved email
      await signIn(emailToUse, password);

      // Refresh profile so all screens show the correct user data
      await refreshProfile();

      // Navigate to Loading (matches register flow)
      navigation.navigate('Loading');
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email/username or password.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }
      setErrorMsg(message);
      console.log('[Login] Error:', error.code, error.message);
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
        >
          {/* STEMM LAB title logo */}
          <Image
            source={require('../assets/OnBoardingAssets/STEMMLAB.png')}
            style={styles.titleLogo}
            resizeMode="contain"
          />

          {/* ── METEOR 1 ── Login form */}
          <View style={styles.meteor1Container}>
            <Image
              source={require('../assets/LoginAssets/meteor1.png')}
              style={styles.meteorBg}
              resizeMode="contain"
            />

            {/* Content sits inside the meteor with padding so nothing bleeds out */}
            <View style={styles.meteor1Inner}>

              {/* Login title image */}
              <Image
                source={require('../assets/LoginAssets/login.png')}
                style={styles.loginTitleImage}
                resizeMode="contain"
              />

              {/* Username label */}
              <Text style={styles.labelText}>Username/Email</Text>

              {/* Username input */}
              <View style={styles.inputBox}>
                <Image
                  source={require('../assets/LoginAssets/usernameBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username here"
                  placeholderTextColor="#7F8C8D"
                  autoCapitalize="none"
                  autoComplete="username"
                  textAlign="left"
                />
              </View>

              {/* Password label */}
              <Text style={styles.labelText}>Password</Text>

              {/* Password input */}
              <View style={styles.inputBox}>
                <Image
                  source={require('../assets/LoginAssets/passwordBox.png')}
                  style={styles.boxImageBackground}
                  resizeMode="stretch"
                />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password here"
                  placeholderTextColor="#7F8C8D"
                  secureTextEntry
                  autoComplete="password"
                  textAlign="left"
                />
              </View>

              {/* Error message */}
              {errorMsg !== '' && (
                <Text style={styles.errorText}>{errorMsg}</Text>
              )}

              {/* Login button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#08121E" />
                ) : (
                  <Image
                    source={require('../assets/LoginAssets/loginBtn.png')}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

            </View>
          </View>

          {/* Divider */}
          <Image
            source={require('../assets/LoginAssets/line.png')}
            style={styles.dividerLine}
            resizeMode="contain"
          />

          {/* ── METEOR 2 ── Google + Sign up */}
          <View style={styles.meteor2Container}>
            <Image
              source={require('../assets/LoginAssets/meteor2.png')}
              style={styles.meteorBg}
              resizeMode="contain"
            />

            <View style={styles.meteor2Inner}>

              {/* Google button */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={() => console.log('[Login] Google sign-in not configured yet')}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../assets/LoginAssets/google.png')}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Thin divider */}
              <Image
                source={require('../assets/LoginAssets/line2.png')}
                style={styles.googleDivider}
                resizeMode="contain"
              />

              {/* Sign up row */}
              <View style={styles.signUpRow}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterRole')}>
                  <Text style={styles.signUpLink}>Sign up</Text>
                </TouchableOpacity>
              </View>

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
    paddingBottom: hp(3),
  },

  /* ── Title logo ── */
  titleLogo: {
    width: wp(55),
    height: hp(15),
    marginTop: hp(9),
  },

  /* ── Shared meteor background ── */
  meteorBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },


  meteor1Container: {
    width: wp(104),
    height: hp(60),
    marginTop: hp(-5),
    alignSelf: 'center',
    left: 6,
    zIndex: 2,
  },

  meteor1Inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(14),  // same as meteor2Inner
    paddingTop: hp(3),
    paddingBottom: hp(5),
    gap: hp(0.5),
  },

  loginTitleImage: {
    width: wp(60),
    height: hp(5),
    marginBottom: hp(0.8),
    marginTop: hp(3)
  },

  labelText: {
    fontFamily: FONTS.title,
    fontSize: 12,              // reduced further
    color: '#08121E',
    alignSelf: 'flex-start',
    marginTop: hp(1.2),
    left: 15

  },

  boxImageBackground: {
    position: 'absolute',
    width: '120%',         // Adjust this percentage down (e.g. 75% or 80%) to make it shorter horizontally
    height: '100%',        // Keeps the vertical height matching the text input container
  },


  inputBox: {
    width: wp(60),             // same as googleButton
    height: hp(5.5),             // same as googleButton
    justifyContent: 'center',
    alignItems: 'center',
    left: -wp(-1),
    marginTop: hp(1)
  },

  textInput: {
    width: '100%',
    height: '100%',
    fontFamily: FONTS.title,
    fontSize: 11,              // smaller placeholder text
    color: '#08121E',
    textAlign: 'left',
    paddingLeft: -5,
    paddingRight: 10,
    paddingHorizontal: 20,
    marginTop: 2
  },

  loginButton: {
    width: wp(35),
    height: hp(4.5),
    marginTop: hp(2),
    marginBottom: hp(0.5),
  },

  fullImage: {
    width: '100%',
    height: '100%',
  },

  /* ── Divider ── */
  dividerLine: {
    width: wp(85),
    height: 4,
    marginTop: hp(-6),
  },

  /* ── Meteor 2 — significantly taller ── */
  meteor2Container: {
    width: wp(140),
    height: hp(44),             // was hp(32) — much taller to contain all content
    marginTop: hp(-11),
    alignSelf: 'center',
  },

  meteor2Inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(14),
    paddingVertical: hp(5),     // more vertical breathing room
    gap: hp(1.5),
  },

  googleButton: {
    width: '100%',
    height: hp(6.8),
    marginTop: hp(5),
  },

  googleDivider: {
    width: '63%',
    height: 2,
    marginTop: hp(0),
  },

  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  signUpText: {
    fontFamily: FONTS.title,
    fontSize: 11,               // reduced
    color: '#08121E',
    marginTop: hp(0.5),
  },

  signUpLink: {
    fontFamily: FONTS.title,
    fontSize: 11,               // reduced
    color: '#ffffff',
    marginTop: hp(0.5),
  },

  errorText: {
    fontFamily: FONTS.title,
    fontSize: 8,
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: hp(0.5),
  },
});

export default LoginScreen;