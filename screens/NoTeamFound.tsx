import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS } from '../utils/theme';

type Nav = StackNavigationProp<RootStackParamList, 'NoTeam'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const NoTeamFound: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCreateTeam = () => {
    navigation.navigate('CreateTeam');
  };

  const handleJoinTeam = () => {
    // Action when user taps "Enter" to join a team with code
    console.log('Join Team with code:', code);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top Title Banner */}
        <Image
          source={require('../assets/NoTeamFoundAssets/welcome.png')}
          style={styles.welcomeBanner}
          resizeMode="contain"
        />


        {/* Central Gray Box */}
        <ImageBackground
          source={require('../assets/NoTeamFoundAssets/box1.png')}
          style={styles.grayBox}
          resizeMode="stretch"
        >
          {/* Title: No Team Found : ( */}
          <Image
            source={require('../assets/NoTeamFoundAssets/no team.png')}
            style={styles.noTeamTitle}
            resizeMode="contain"
          />

          {/* Subtitle: You're not part of a team yet! */}
          <Image
            source={require('../assets/NoTeamFoundAssets/You’re not part of a team yet!.png')}
            style={styles.subtitleText}
            resizeMode="contain"
          />

          {/* Step 1 Title */}
          <Image
            source={require('../assets/NoTeamFoundAssets/Step 1_ Create a new team.png')}
            style={styles.step1Title}
            resizeMode="contain"
          />

          {/* Create Button & Curved Arrow */}
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTeam}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/NoTeamFoundAssets/create.png')}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Image
              source={require('../assets/NoTeamFoundAssets/arrow.png')}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </View>

          {/* Dashed OR Divider */}
          <Image
            source={require('../assets/NoTeamFoundAssets/or.png')}
            style={styles.orDivider}
            resizeMode="contain"
          />

          {/* Step 2 Section (Astronaut and Join Team controls) */}
          <View style={styles.step2Container}>
            {/* Waving Astronaut */}
            <Image
              source={require('../assets/NoTeamFoundAssets/astronaut2.png')}
              style={styles.astronaut}
              resizeMode="contain"
            />

            {/* Step 2 Controls Column */}
            <View style={styles.joinControlsColumn}>
              {/* Step 2 Join a team Title */}
              <Image
                source={require('../assets/NoTeamFoundAssets/Step 2_ Join a team.png')}
                style={styles.step2Title}
                resizeMode="contain"
              />

              {/* Input box and Enter Button row */}
              <View style={styles.inputRow}>
                {/* Code Input container */}
                <ImageBackground
                  source={require('../assets/NoTeamFoundAssets/codeBox.png')}
                  style={styles.codeBoxBackground}
                  resizeMode="stretch"
                >
                  <TextInput
                    style={styles.codeInput}
                    value={code}
                    onChangeText={setCode}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="characters"
                    maxLength={10}
                    underlineColorAndroid="transparent"
                  />
                  {/* Absolute overlay of "Enter Code.png" text if no text entered and not focused */}
                  {!code && !isFocused && (
                    <View style={styles.enterCodePlaceholderContainer} pointerEvents="none">
                      <Image
                        source={require('../assets/NoTeamFoundAssets/Enter Code.png')}
                        style={styles.enterCodePlaceholderImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </ImageBackground>

                {/* Enter Button */}
                <TouchableOpacity
                  style={styles.enterButton}
                  onPress={handleJoinTeam}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../assets/NoTeamFoundAssets/enterBtn.png')}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Big Earth Planet at bottom base */}
        <Image
          source={require('../assets/HomescreenAssets/bigEarth.png')}
          style={styles.bigEarth}
          resizeMode="contain"
        />

        {/* UFO flying over Earth */}
        <Image
          source={require('../assets/NoTeamFoundAssets/ufo.png')}
          style={styles.ufo}
          resizeMode="contain"
        />

        {/* Left Decorative Star */}
        <Image
          source={require('../assets/OnBoardingAssets/star6.png')}
          style={styles.leftStar}
          resizeMode="contain"
        />

        {/* Bottom Navigation Bar */}
        <Image
          source={require('../assets/HomescreenAssets/navbarBox.png')}
          style={styles.navbarBox}
          resizeMode="contain"
        />

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/home.png')}
            style={styles.homeImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Team Button (Current Active Page) */}
        <TouchableOpacity style={styles.teamButton} activeOpacity={1.0}>
          <Image
            source={require('../assets/HomescreenAssets/team.png')}
            style={styles.teamImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Leaderboard Button */}
        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/leaderboard.png')}
            style={styles.leaderboardImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/profile.png')}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
  welcomeBanner: {
    position: 'absolute',
    top: s(55),
    left: s(35),
    width: s(390),
    height: s(93),
    alignSelf: 'center',
    zIndex: 10,
  },
  grayBox: {
    position: 'absolute',
    top: s(195),
    alignSelf: 'center',
    width: s(380),
    height: s(440),
    paddingHorizontal: s(20),
    zIndex: 5,
  },
  noTeamTitle: {
    width: s(300),
    height: s(50),
    alignSelf: 'center',
    marginTop: s(40),
  },
  subtitleText: {
    width: s(320),
    height: s(24),
    alignSelf: 'center',
    marginTop: s(15),
  },
  step1Title: {
    width: s(280),
    height: s(32),
    alignSelf: 'center',
    left: s(-20),
    marginTop: s(10),
  },
  createButtonContainer: {
    width: '100%',
    height: s(60),
    marginTop: s(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: s(-35),
  },
  createButton: {
    width: s(210),
    height: s(66),
    left: s(-20),
  },
  arrowIcon: {
    width: s(80),
    height: s(60),
    position: 'absolute',
    left: s(270),
    top: s(-10),
  },
  orDivider: {
    width: s(355),
    height: s(40),
    alignSelf: 'center',
    marginTop: s(10),
  },
  step2Container: {
    flexDirection: 'row',
    width: '100%',
    height: s(110),
    marginTop: s(12),
    alignItems: 'center',
    left: s(-10),
  },
  astronaut: {
    width: s(160),
    height: s(180),
    marginRight: s(-50),
    left: s(-25),
  },
  joinControlsColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  step2Title: {
    width: s(220),
    height: s(22),
    alignSelf: 'flex-start',
    marginBottom: s(15),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  codeBoxBackground: {
    width: s(140),
    height: s(40),
    justifyContent: 'center',
    marginRight: s(10),
  },
  codeInput: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: '#08121e',
    textAlign: 'center',
    paddingHorizontal: s(5),
  },
  enterCodePlaceholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterCodePlaceholderImage: {
    width: s(100),
    height: s(20),
  },
  enterButton: {
    width: s(75),
    height: s(40),
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  bigEarth: {
    position: 'absolute',
    top: s(730),
    left: s(-60),
    width: s(600),
    height: s(250),
    zIndex: 1,
  },
  ufo: {
    position: 'absolute',
    top: s(640),
    left: s(260),
    width: s(220),
    height: s(200),
    zIndex: 2,
  },
  leftStar: {
    position: 'absolute',
    top: s(700),
    left: s(25),
    width: s(75),
    height: s(75),
    zIndex: 3,
  },
  navbarBox: {
    position: 'absolute',
    top: s(790),
    left: s(1),
    width: s(440),
    height: s(250),
    zIndex: 20,
  },
  homeButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(870),
    left: s(30),
    zIndex: 21,
  },
  homeImage: {
    width: s(90),
    height: s(90),
  },
  teamButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(884),
    left: s(130),
    zIndex: 21,
  },
  teamImage: {
    width: s(90),
    height: s(70),
  },
  leaderboardButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(880),
    left: s(230),
    zIndex: 21,
  },
  leaderboardImage: {
    width: s(82),
    height: s(72),
  },
  profileButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(873),
    left: s(325),
    zIndex: 21,
  },
  profileImage: {
    width: s(83),
    height: s(83),
  },
});

export default NoTeamFound;
