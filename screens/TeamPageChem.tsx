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

type Nav = StackNavigationProp<RootStackParamList, 'TeamPageChem'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const TeamPageChem: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCreateTeam = () => {
    navigation.navigate('CreateTeam');
  };

  const handleJoinTeam = () => {
    console.log('Join Team with code:', code);
  };

  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top Progress Box Background */}
        <Image
          source={require('../assets/TeamPageChemAssets/boxTopWhite.png')}
          style={styles.boxTopBg}
          resizeMode="stretch"
        />

        {/* Top Progress Box */}
        <ImageBackground
          source={require('../assets/TeamPageChemAssets/boxTopOutline.png')}
          style={styles.topBox}
          resizeMode="stretch"
        >
          {/* Grade 8 Chemistry Title and Arrow */}
          <View style={styles.topHeaderRow}>
            <Image
              source={require('../assets/TeamPageChemAssets/littleEinstein.png')}
              style={styles.gradeTitle}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7}>
              <Image
                source={require('../assets/TeamPageChemAssets/arrowBtn.png')}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Earth & 80% indicators */}
          <View style={styles.indicatorsRow}>
            <Image
              source={require('../assets/TeamPageChemAssets/earth.png')}
              style={styles.earthIndicator}
              resizeMode="contain"
            />
            <Image
              source={require('../assets/TeamPageChemAssets/80%.png')}
              style={styles.percentIndicator}
              resizeMode="contain"
            />
          </View>

          {/* Dotted path planets */}
          <View style={styles.planetsContainer}>
            {/* Small Earth planet (left) */}
            <Image
              source={require('../assets/TeamPageChemAssets/smallEarth.png')}
              style={styles.smallEarthPlanet}
              resizeMode="contain"
            />
            {/* Act 2 planet (middle) */}
            <Image
              source={require('../assets/TeamPageChemAssets/act2.png')}
              style={styles.act2Planet}
              resizeMode="contain"
            />
            {/* Act 3 planet (right) */}
            <Image
              source={require('../assets/TeamPageChemAssets/act3.png')}
              style={styles.act3Planet}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>

        {/* Weekly Team Analysis Box */}
        <ImageBackground
          source={require('../assets/TeamPageChemAssets/teamAnalysis.png')}
          style={styles.analysisBox}
          resizeMode="stretch"
        >
          {/* Analysis Title */}
          <Image
            source={require('../assets/TeamPageChemAssets/teamAnalysisTitle.png')}
            style={styles.analysisTitle}
            resizeMode="contain"
          />

          {/* Week Selector row */}
          <View style={styles.weekSelectorRow}>
            {/* Week Arrow Background */}
            <Image
              source={require('../assets/TeamPageChemAssets/arrowBtnWeek.png')}
              style={styles.weekArrowsBg}
              resizeMode="contain"
            />

            {/* Left arrow touchable area */}
            <TouchableOpacity style={styles.arrowTouchLeft} activeOpacity={0.7}>
              <View style={styles.fullImage} />
            </TouchableOpacity>

            {/* Date range label */}
            <Image
              source={require('../assets/TeamPageChemAssets/20 April - 25 April 2026.png')}
              style={styles.weekText}
              resizeMode="contain"
            />

            {/* Right arrow touchable area */}
            <TouchableOpacity style={styles.arrowTouchRight} activeOpacity={0.7}>
              <View style={styles.fullImage} />
            </TouchableOpacity>
          </View>
        </ImageBackground>



        {/* Create New Team Button */}
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

        {/* Enter Code Box & Enter button */}
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
            {/* Placeholder text overlay */}
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

        {/* Astronaut standing on Big Earth */}
        <Image
          source={require('../assets/TeamPageChemAssets/astronaut4.png')}
          style={styles.astronaut}
          resizeMode="contain"
        />

        {/* Big Earth Planet at bottom base */}
        <Image
          source={require('../assets/HomescreenAssets/bigEarth.png')}
          style={styles.bigEarth}
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
          onPress={handleNavigateHome}
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

        {/* Levels Button */}
        <TouchableOpacity
          style={styles.levelsButton}
          onPress={() => navigation.navigate('Activity')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/activity.png')}
            style={styles.levelsImage}
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
  topBox: {
    position: 'absolute',
    top: s(80),
    alignSelf: 'center',
    width: s(380),
    height: s(160),
    padding: s(15),
    zIndex: 10,
  },
  boxTopBg: {
    position: 'absolute',
    top: s(79),
    alignSelf: 'center',
    width: s(383),
    height: s(162),
    zIndex: 9,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeTitle: {
    width: s(220),
    height: s(30),
  },
  arrowButton: {
    width: s(25),
    height: s(25),
    marginLeft: s(5),
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: s(5),
  },
  earthIndicator: {
    width: s(75),
    height: s(25),
    marginRight: s(5),
  },
  percentIndicator: {
    width: s(50),
    height: s(25),
  },
  planetsContainer: {
    position: 'absolute',
    left: s(15),
    right: s(15),
    bottom: s(10),
    height: s(60),
  },
  smallEarthPlanet: {
    position: 'absolute',
    left: s(0),
    bottom: s(0),
    width: s(90),
    height: s(60),
  },
  act2Planet: {
    position: 'absolute',
    left: s(170),
    bottom: s(10),
    width: s(42),
    height: s(42),
  },
  act3Planet: {
    position: 'absolute',
    left: s(290),
    bottom: s(10),
    width: s(42),
    height: s(42),
  },
  analysisBox: {
    position: 'absolute',
    top: s(255),
    alignSelf: 'center',
    width: s(380),
    height: s(275),
    paddingTop: s(15),
    zIndex: 10,
  },
  analysisTitle: {
    width: s(260),
    height: s(28),
    alignSelf: 'center',
  },
  weekSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(12),
    width: s(229),
    height: s(24),
    alignSelf: 'center',
  },
  weekArrowsBg: {
    position: 'absolute',
    width: s(229),
    height: s(19),
  },
  arrowTouchLeft: {
    position: 'absolute',
    left: 0,
    width: s(40),
    height: s(24),
    zIndex: 5,
  },
  arrowTouchRight: {
    position: 'absolute',
    right: 0,
    width: s(40),
    height: s(24),
    zIndex: 5,
  },
  weekText: {
    width: s(170),
    height: s(20),
  },
  createButton: {
    position: 'absolute',
    top: s(545),
    left: s(30),
    width: s(230),
    height: s(50),
    zIndex: 10,
  },
  inputRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: s(605),
    left: s(30),
    zIndex: 10,
  },
  codeBoxBackground: {
    width: s(125),
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
    width: s(80),
    height: s(18),
  },
  enterButton: {
    width: s(80),
    height: s(40),
  },
  astronaut: {
    position: 'absolute',
    top: s(485),
    right: s(5),
    width: s(160),
    height: s(160),
    zIndex: 15,
  },
  bigEarth: {
    position: 'absolute',
    top: s(730),
    left: s(-60),
    width: s(600),
    height: s(250),
    zIndex: 1,
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
    left: s(12),
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
    left: s(95),
    zIndex: 21,
  },
  teamImage: {
    width: s(90),
    height: s(70),
  },
  levelsButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(880),
    left: s(188),
    zIndex: 21,
  },
  levelsImage: {
    width: s(80),
    height: s(80),
  },
  leaderboardButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(880),
    left: s(275),
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
    left: s(353),
    zIndex: 21,
  },
  profileImage: {
    width: s(83),
    height: s(83),
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default TeamPageChem;
