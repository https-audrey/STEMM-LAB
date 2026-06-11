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

type Nav = StackNavigationProp<RootStackParamList, 'Profile'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
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
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Profile Box with profile pic, name, and username */}
        <ImageBackground
          source={require('../assets/ProfileAssets/profileBox.png')}
          style={styles.profileBox}
          resizeMode="stretch"
        >
          <Image
            source={require('../assets/ProfileAssets/pp.png')}
            style={styles.profilePic}
            resizeMode="contain"
          />
          <View style={styles.namesColumn}>
            <Text style={styles.nameBigText} numberOfLines={1}>
              {profile?.fullName || 'Explorer'}
            </Text>
            <Text style={styles.usnTextDynamic} numberOfLines={1}>
              {profile?.displayUsername || 'user'}
            </Text>
          </View>
        </ImageBackground>

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
            activeOpacity={0.1}
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

          {/* Dynamic text overlays on top of hardcoded image values */}
          {/* Full Name value */}
          <Text style={[styles.infoFieldValue, { top: s(144) }]} numberOfLines={1}>
            {profile?.fullName || 'N/A'}
          </Text>

          {/* Date of Birth value */}
          <Text style={[styles.infoFieldValue, { top: s(227) }]} numberOfLines={1}>
            {profile?.dateOfBirth || 'N/A'}
          </Text>

          {/* Email value */}
          <Text style={[styles.infoFieldValue, { top: s(308) }]} numberOfLines={1}>
            {profile?.username || 'N/A'}
          </Text>

          {/* Username value */}
          <Text style={[styles.infoFieldValue, { top: s(390) }]} numberOfLines={1}>
            {profile?.displayUsername || 'N/A'}
          </Text>

          {/* Password value (masked) */}
          <Text style={[styles.infoFieldValue, { top: s(476) }]} numberOfLines={1}>
            {'* * * * * * * *'}
          </Text>
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
  profileBox: {
    position: 'absolute',
    top: s(55),
    alignSelf: 'center',
    width: s(390),
    height: s(150),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(26),
    paddingVertical: s(15),
    left: s(35),
  },
  profilePic: {
    width: s(110),
    height: s(105),
    marginLeft: s(5),
    top: s(9),
    left: s(-5),
  },
  namesColumn: {
    flex: 1,
    marginLeft: s(15),
    justifyContent: 'center',
  },
  nameBigText: {
    fontFamily: FONTS.title,
    fontSize: s(20),
    color: '#FFFFFF',
    textShadowColor: '#08121E',
    textShadowOffset: { width: s(1.5), height: s(1.5) },
    textShadowRadius: s(1),
    top: s(5),
  },
  usnTextDynamic: {
    fontFamily: FONTS.title,
    fontSize: s(14),
    color: '#FFFFFF',
    textShadowColor: '#08121E',
    textShadowOffset: { width: s(1), height: s(1) },
    textShadowRadius: s(1),
    top: s(9),
  },
  infoBox: {
    position: 'absolute',
    top: s(230),
    alignSelf: 'center',
    width: s(376),
    height: s(580),
    zIndex: 10,
  },
  infoFieldValue: {
    position: 'absolute',
    left: s(30),
    right: s(30),
    height: s(35),
    fontFamily: FONTS.title,
    fontSize: s(12),
    color: '#333333',
    paddingHorizontal: s(12),
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
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProfilePage;
