import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type Nav = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const LeaderboardPage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [tabMode, setTabMode] = useState<'individual' | 'team'>('individual');

  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };

  const handleNavigateTeam = () => {
    navigation.navigate('NoTeam');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Weekly Progress Chart Box */}
        <Image
          source={require('../assets/LeaderboardAssets/weeklyProgress.png')}
          style={styles.weeklyProgress}
          resizeMode="contain"
        />

        {/* Tab Buttons Row */}
        <View style={styles.tabsRow}>
          {/* Individual Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTabMode('individual')}
          >
            <Image
              source={
                tabMode === 'individual'
                  ? require('../assets/LeaderboardAssets/individu1.png')
                  : require('../assets/LeaderboardAssets/individu2.png')
              }
              style={styles.tabButton}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Team Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTabMode('team')}
          >
            <Image
              source={
                tabMode === 'individual'
                  ? require('../assets/LeaderboardAssets/team1.png')
                  : require('../assets/LeaderboardAssets/team2.png')
              }
              style={styles.tabButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Leaderboard Card Box */}
        <ImageBackground
          source={require('../assets/LeaderboardAssets/leaderboardBox.png')}
          style={styles.leaderboardBox}
          resizeMode="stretch"
        >
          {/* Scrollbar on the right */}
          <Image
            source={require('../assets/LeaderboardAssets/scrollBar.png')}
            style={styles.scrollBar}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* 14 more points text */}
        <Image
          source={require('../assets/LeaderboardAssets/14 more points.png')}
          style={styles.pointsText}
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

        {/* Team Button */}
        <TouchableOpacity
          style={styles.teamButton}
          onPress={handleNavigateTeam}
          activeOpacity={0.7}
        >
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

        {/* Leaderboard Button (Active) */}
        <TouchableOpacity style={styles.leaderboardButton} activeOpacity={1.0}>
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
  weeklyProgress: {
    position: 'absolute',
    top: s(80),
    alignSelf: 'center',
    width: s(372),
    height: s(125),
  },
  tabsRow: {
    position: 'absolute',
    top: s(220),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: s(364),
  },
  tabButton: {
    width: s(177),
    height: s(31),
  },
  leaderboardBox: {
    position: 'absolute',
    top: s(265),
    alignSelf: 'center',
    width: s(376),
    height: s(520),
    zIndex: 10,
  },
  scrollBar: {
    position: 'absolute',
    right: s(7),
    top: s(170),
    width: s(5),
    height: s(59),
  },
  pointsText: {
    position: 'absolute',
    top: s(795),
    alignSelf: 'center',
    width: s(353),
    height: s(30),
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
});

export default LeaderboardPage;
