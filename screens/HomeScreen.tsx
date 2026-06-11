import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;



const HomePage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
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


  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header Section: "Hi!" text + dynamic user name */}
        <View style={styles.greetingRow}>
          <Text style={styles.hiText}>Hi! </Text>
          <Text style={styles.nameText} numberOfLines={1}>
            {profile?.fullName || 'Explorer'}
          </Text>
        </View>
        <Image
          source={require('../assets/HomescreenAssets/astronaut1.png')}
          style={styles.astronaut}
          resizeMode="contain"
        />

        {/* Info Box */}
        <Image
          source={require('../assets/HomescreenAssets/boxTopLvl.png')}
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
            style={[styles.categoryTab, { left: s(220) }]}
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

          </TouchableOpacity>

          {/* Mathematics Tab */}
          <TouchableOpacity
            style={[styles.categoryTab, { left: s(320) }]}
            onPress={() => setSelectedSubject(prev => prev === 'mathematics' ? null : 'mathematics')}
            activeOpacity={0.8}
          >

          </TouchableOpacity>
        </View>

        {/* Big Earth Planet at the Base of the map (rendered behind the map container) */}
        <Image
          source={require('../assets/HomescreenAssets/bigEarth.png')}
          style={styles.bigEarth}
          resizeMode="contain"
        />

        {/* Levels Box Map Section */}
        <ImageBackground
          source={require('../assets/ActivityAssets/levelBox.png')}
          style={styles.levelsBox}
          resizeMode="stretch"
        >
          {/* Level Title Header Banner */}
          <View pointerEvents="none" style={styles.levelTitleBanner}>
            <Image
              source={require('../assets/HomescreenAssets/levelTitle.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
          <View pointerEvents="none" style={styles.gradeTitleText}>
            <Image
              source={require('../assets/HomescreenAssets/Grade 8 - Physics.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {/* Planet 1 */}
          <TouchableOpacity
            style={[styles.planetNode, { top: s(430), left: s(33), width: s(100), height: s(100), zIndex: 5 }]}
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
            style={[styles.planetNode, { top: s(400), left: s(210), width: s(100), height: s(100), zIndex: 5 }]}
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
            style={[styles.planetNode, { top: s(310), left: s(88), width: s(100), height: s(100), zIndex: 5 }]}
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
            style={[styles.planetNode, { top: s(190), left: s(25), width: s(100), height: s(100), zIndex: 5 }]}
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
            style={[styles.planetNode, { top: s(290), left: s(240), width: s(100), height: s(100), zIndex: 5 }]}
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
            style={[styles.planetNode, { top: s(115), left: s(210), width: s(110), height: s(110), zIndex: 5 }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Act6Start')}
          >
            <Image
              source={require('../assets/HomescreenAssets/planet 6.png')}
              style={styles.planetImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Planet 7 */}
          <TouchableOpacity
            style={[styles.planetNode, { top: s(60), left: s(65), width: s(105), height: s(105), zIndex: 5 }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Act7Start')}
          >
            <Image
              source={require('../assets/ActivityAssets/planet 7.png')}
              style={styles.planetImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ImageBackground>

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
  greetingRow: {
    position: 'absolute',
    top: s(70),
    left: s(38),
    width: s(280),
    height: s(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiText: {
    fontFamily: FONTS.title,
    fontSize: s(32),
    color: '#FFFFFF',
  },
  nameText: {
    fontFamily: FONTS.ui,
    fontSize: s(22),
    color: '#FFFFFF',
    flexShrink: 1,
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
    top: s(85),
    alignSelf: 'center',
    width: s(370),
    height: s(170),
  },
  categoriesRow: {
    position: 'absolute',
    top: s(235),
    width: '100%',
    height: s(50),
  },
  categoryTab: {
    position: 'absolute',
    width: s(85),
    height: s(48),
  },
  categoryImage: {
    width: '200%',
    height: '160%',
  },
  levelsBox: {
    position: 'absolute',
    top: s(285),
    alignSelf: 'center',
    width: s(374),
    height: s(553),
    zIndex: 10,
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
    top: s(0),
    alignSelf: 'center',
    width: s(374),
    height: s(54),
    zIndex: 3,
  },
  gradeTitleText: {
    position: 'absolute',
    top: s(13),
    alignSelf: 'center',
    width: s(250),
    height: s(28),
    zIndex: 3,
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
    left: s(30),
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
  },
  profileImage: {
    width: s(83),
    height: s(83),
  },
});

export default HomePage;
