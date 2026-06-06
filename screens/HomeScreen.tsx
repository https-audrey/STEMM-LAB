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

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;



const HomePage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selectedSubject, setSelectedSubject] = useState<'physics' | 'biology' | 'chemistry' | 'mathematics' | null>(null);

  const getPhysicsAsset = () => {
    // When no subject is selected (default state), show the unpressed 'phy.png'.
    // Once any category is selected, it changes to 'phy2.png'.
    return selectedSubject === null
      ? require('../assets/HomescreenAssets/phy.png')
      : require('../assets/HomescreenAssets/phy2.png');
  };

  const getBiologyAsset = () => {
    return selectedSubject === 'biology'
      ? require('../assets/HomescreenAssets/bio2.png')
      : require('../assets/HomescreenAssets/bio.png');
  };

  const getChemistryAsset = () => {
    return selectedSubject === 'chemistry'
      ? require('../assets/HomescreenAssets/chem2.png')
      : require('../assets/HomescreenAssets/chem.png');
  };

  const getMathematicsAsset = () => {
    return selectedSubject === 'mathematics'
      ? require('../assets/HomescreenAssets/math2.png')
      : require('../assets/HomescreenAssets/math.png');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header Section: "Hi! Alexander Isla" greeting & Astronaut */}
        <Image
          source={require('../assets/HomescreenAssets/hi.png')}
          style={styles.hiGreeting}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/HomescreenAssets/astronaut1.png')}
          style={styles.astronaut}
          resizeMode="contain"
        />

        {/* Info Box */}
        <Image
          source={require('../assets/HomescreenAssets/box.png')}
          style={styles.infoBox}
          resizeMode="contain"
        />

        {/* Category Buttons Row */}
        <View style={styles.categoriesRow}>
          {/* Physics Tab */}
          <TouchableOpacity
            style={[styles.categoryTab, { left: s(38) }]}
            onPress={() => setSelectedSubject(null)}
            activeOpacity={0.8}
          >
            <Image
              source={getPhysicsAsset()}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Biology Tab */}
          <TouchableOpacity
            style={[styles.categoryTab, { left: s(132) }]}
            onPress={() => setSelectedSubject(prev => prev === 'biology' ? null : 'biology')}
            activeOpacity={0.8}
          >
            <Image
              source={getBiologyAsset()}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Chemistry Tab */}
          <TouchableOpacity
            style={[styles.categoryTab, { left: s(226) }]}
            onPress={() => setSelectedSubject(prev => prev === 'chemistry' ? null : 'chemistry')}
            activeOpacity={0.8}
          >
            <Image
              source={getChemistryAsset()}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Mathematics Tab */}
          <TouchableOpacity
            style={[styles.categoryTab, { left: s(320) }]}
            onPress={() => setSelectedSubject(prev => prev === 'mathematics' ? null : 'mathematics')}
            activeOpacity={0.8}
          >
            <Image
              source={getMathematicsAsset()}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Big Earth Planet at the Base of the map (rendered behind the map container) */}
        <Image
          source={require('../assets/HomescreenAssets/bigEarth.png')}
          style={styles.bigEarth}
          resizeMode="contain"
        />

        {/* Levels Box Map Section */}
        <View pointerEvents="none" style={styles.levelsBox}>
          <Image
            source={require('../assets/HomescreenAssets/levelsBox.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

        {/* Planet 1 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(703), left: s(68), width: s(100), height: s(100), zIndex: 5 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 1.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Planet 2 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(670), left: s(240), width: s(100), height: s(100), zIndex: 5 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 2.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Planet 3 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(573), left: s(123), width: s(100), height: s(100), zIndex: 5 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 3.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Planet 4 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(455), left: s(56), width: s(100), height: s(100), zIndex: 5 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 4.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Planet 5 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(553), left: s(277), width: s(100), height: s(100), zIndex: 5 }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Act5Start')}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 5.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Planet 6 */}
        <TouchableOpacity
          style={[styles.planetNode, { top: s(390), left: s(277), width: s(100), height: s(100), zIndex: 1 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/planet 6.png')}
            style={styles.planetImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Level Title Header Banner (rendered on top of Planet 6 visually) */}
        <View pointerEvents="none" style={[styles.levelTitleBanner, { zIndex: 3 }]}>
          <Image
            source={require('../assets/HomescreenAssets/levelTitle.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
        <View pointerEvents="none" style={[styles.gradeTitleText, { zIndex: 3 }]}>
          <Image
            source={require('../assets/HomescreenAssets/Grade 8 - Physics.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

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

        {/* Team Button */}
        <TouchableOpacity
          style={styles.teamButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('NoTeam')}
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
  hiGreeting: {
    position: 'absolute',
    top: s(70),
    left: s(38),
    width: s(300),
    height: s(60),
  },
  astronaut: {
    position: 'absolute',
    top: s(28),
    left: s(320),
    width: s(110),
    height: s(120),
  },
  infoBox: {
    position: 'absolute',
    top: s(135),
    alignSelf: 'center',
    width: s(370),
    height: s(170),
  },
  categoriesRow: {
    position: 'absolute',
    top: s(318),
    width: '100%',
    height: s(50),
  },
  categoryTab: {
    position: 'absolute',
    width: s(85),
    height: s(48),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  levelsBox: {
    position: 'absolute',
    top: s(378),
    left: s(32),
    width: s(376),
    height: s(440),
  },
  planetNode: {
    position: 'absolute',
  },
  planetImage: {
    width: '100%',
    height: '100%',
  },
  levelTitleBanner: {
    position: 'absolute',
    top: s(377),
    left: s(32),
    width: s(374),
    height: s(54),
  },
  gradeTitleText: {
    position: 'absolute',
    top: s(390),
    left: s(95),
    width: s(250),
    height: s(28),
  },
  bigEarth: {
    position: 'absolute',
    top: s(730),
    left: s(-60),
    width: s(600),
    height: s(250),
  },
  navbarBox: {
    position: 'absolute',
    top: s(790),
    left: s(1),
    width: s(440),
    height: s(250),
  },
  homeButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: s(870),
    left: s(12),
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
  },
  profileImage: {
    width: s(83),
    height: s(83),
  },
});

export default HomePage;
