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

type Nav = StackNavigationProp<RootStackParamList, 'Profile'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [isEditPressed, setIsEditPressed] = useState(false);

  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };

  const handleNavigateTeam = () => {
    navigation.navigate('NoTeam');
  };

  const handleNavigateLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const handleEditPress = () => {
    setIsEditPressed(true);
    setTimeout(() => {
      setIsEditPressed(false);
    }, 500); // 0.5 seconds
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header Section: Profile Picture and Info */}
        <View style={styles.headerRow}>
          <Image
            source={require('../assets/ProfileAssets/pp.png')}
            style={styles.profilePic}
            resizeMode="contain"
          />
          <View style={styles.namesColumn}>
            <Image
              source={require('../assets/ProfileAssets/nameBig.png')}
              style={styles.nameBig}
              resizeMode="contain"
            />
            <Image
              source={require('../assets/ProfileAssets/usn.png')}
              style={styles.usnText}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Profile Info Card Box */}
        <ImageBackground
          source={require('../assets/ProfileAssets/infoBox.png')}
          style={styles.infoBox}
          resizeMode="stretch"
        >
          {/* Edit Button inside Card */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <Image
              source={
                isEditPressed
                  ? require('../assets/ProfileAssets/editBtn1.png')
                  : require('../assets/ProfileAssets/editBtn.png')
              }
              style={styles.fullImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ImageBackground>

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

        {/* Leaderboard Button */}
        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={handleNavigateLeaderboard}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/HomescreenAssets/leaderboard.png')}
            style={styles.leaderboardImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Profile Button (Active) */}
        <TouchableOpacity style={styles.profileButton} activeOpacity={1.0}>
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
  headerRow: {
    position: 'absolute',
    top: s(70),
    left: s(30),
    right: s(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: s(117),
    height: s(112),
  },
  namesColumn: {
    flex: 1,
    marginLeft: s(15),
    justifyContent: 'center',
  },
  nameBig: {
    width: s(262),
    height: s(44),
    alignSelf: 'flex-start',
  },
  usnText: {
    width: s(195),
    height: s(32),
    alignSelf: 'flex-start',
    marginTop: s(5),
  },
  infoBox: {
    position: 'absolute',
    top: s(200),
    alignSelf: 'center',
    width: s(376),
    height: s(580),
    zIndex: 10,
  },
  editButton: {
    position: 'absolute',
    top: s(24),
    right: s(24),
    width: s(78),
    height: s(43),
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

export default ProfilePage;
