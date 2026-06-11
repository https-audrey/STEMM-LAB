import React from 'react';
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

type Nav = StackNavigationProp<RootStackParamList, 'CreateTeam'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const CreateTeamPage: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const handleMakeTeam = () => {
    navigation.navigate('TeamPageChem');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen space background */}
      <ImageBackground
        source={require('../assets/OnBoardingAssets/bgImg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top Box Container */}
        <ImageBackground
          source={require('../assets/CreateTeamAssets/boxTop.png')}
          style={styles.boxTop}
          resizeMode="stretch"
        >
          {/* Astronaut peeking in front of boxTop but behind nameBoxTeam */}
          <Image
            source={require('../assets/CreateTeamAssets/astronaut3.png')}
            style={styles.astronaut}
            resizeMode="contain"
          />
          {/* Title: Enter Team Name */}
          <Image
            source={require('../assets/CreateTeamAssets/teamNameTitle.png')}
            style={styles.teamNameTitle}
            resizeMode="contain"
          />

          {/* Name Box (Row containing name writing and code tag) */}
          <ImageBackground
            source={require('../assets/CreateTeamAssets/nameBoxTeam.png')}
            style={styles.nameBoxTeam}
            resizeMode="stretch"
          >
            <Image
              source={require('../assets/CreateTeamAssets/Little Einstein.png')}
              style={styles.littleEinsteinText}
              resizeMode="contain"
            />

            <Image
              source={require('../assets/CreateTeamAssets/teamCode.png')}
              style={styles.teamCodeImage}
              resizeMode="contain"
            />
          </ImageBackground>

          {/* Title: Grade & Subject */}
          <Image
            source={require('../assets/CreateTeamAssets/gradeTitle.png')}
            style={styles.gradeTitle}
            resizeMode="contain"
          />

          {/* Grade Box */}
          <ImageBackground
            source={require('../assets/CreateTeamAssets/gradeBox.png')}
            style={styles.gradeBox}
            resizeMode="stretch"
          >
            <Image
              source={require('../assets/CreateTeamAssets/Grade 8 - Chemistry.png')}
              style={styles.gradeChemistryText}
              resizeMode="contain"
            />
          </ImageBackground>
        </ImageBackground>

        {/* Meteor overlapping the top box on the left */}
        <Image
          source={require('../assets/LoadingAssets/meteorFalling.png')}
          style={styles.meteor}
          resizeMode="contain"
        />

        {/* Bottom Box Container: Team Members */}
        <ImageBackground
          source={require('../assets/CreateTeamAssets/memberBox.png')}
          style={styles.memberBox}
          resizeMode="stretch"
        >
          {/* Title: Team Members */}
          <Image
            source={require('../assets/CreateTeamAssets/teamMemTitle.png')}
            style={styles.teamMemTitle}
            resizeMode="contain"
          />

          {/* Line divider */}
          <Image
            source={require('../assets/LoginAssets/line2.png')}
            style={styles.lineDivider}
            resizeMode="stretch"
          />

          {/* Search bar */}
          <Image
            source={require('../assets/CreateTeamAssets/searchBar.png')}
            style={styles.searchBar}
            resizeMode="contain"
          />

          {/* Writing: 4 Members Selected */}
          <Image
            source={require('../assets/CreateTeamAssets/4 Members Selected.png')}
            style={styles.membersSelectedText}
            resizeMode="contain"
          />

          {/* Selected Member 1: Alexander */}
          <View style={[styles.memberRow, { top: s(130) }]}>
            <Image
              source={require('../assets/CreateTeamAssets/alex.png')}
              style={styles.memberCard}
              resizeMode="contain"
            />
          </View>

          {/* Selected Member 2: Aoi */}
          <View style={[styles.memberRow, { top: s(176) }]}>
            <Image
              source={require('../assets/CreateTeamAssets/aoi.png')}
              style={styles.memberCard}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.crossButton} activeOpacity={0.7}>
              <Image
                source={require('../assets/CreateTeamAssets/cross.png')}
                style={styles.crossIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Selected Member 3: Angel */}
          <View style={[styles.memberRow, { top: s(222) }]}>
            <Image
              source={require('../assets/CreateTeamAssets/angel.png')}
              style={styles.memberCard}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.crossButton} activeOpacity={0.7}>
              <Image
                source={require('../assets/CreateTeamAssets/cross.png')}
                style={styles.crossIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Selected Member 4: Vina */}
          <View style={[styles.memberRow, { top: s(268) }]}>
            <Image
              source={require('../assets/CreateTeamAssets/vina.png')}
              style={styles.memberCard}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.crossButton} activeOpacity={0.7}>
              <Image
                source={require('../assets/CreateTeamAssets/cross.png')}
                style={styles.crossIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Big Earth Planet at bottom base */}
        <Image
          source={require('../assets/HomescreenAssets/bigEarth.png')}
          style={styles.bigEarth}
          resizeMode="contain"
        />

        {/* Make Team Button */}
        <TouchableOpacity
          style={styles.makeTeamButton}
          onPress={handleMakeTeam}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/CreateTeamAssets/makeTeamBtn.png')}
            style={styles.makeTeamImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

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
          onPress={() => navigation.navigate('NoTeam')}
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
  astronaut: {
    position: 'absolute',
    top: s(-35),
    left: s(260),
    width: s(100),
    height: s(105),
    zIndex: 1,
  },
  boxTop: {
    position: 'absolute',
    top: s(75),
    alignSelf: 'center',
    width: s(390),
    height: s(265),
    zIndex: 2,
  },
  teamNameTitle: {
    position: 'absolute',
    top: s(22),
    left: s(20),
    width: s(210),
    height: s(32),
    zIndex: 2,
  },
  nameBoxTeam: {
    position: 'absolute',
    top: s(62),
    left: s(20),
    width: s(315),
    height: s(42),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: s(15),
    paddingRight: s(10),
    zIndex: 2,
  },
  littleEinsteinText: {
    width: s(120),
    height: s(20),
  },
  teamCodeImage: {
    width: s(85),
    height: s(28),
    alignSelf: 'center',
  },
  gradeTitle: {
    position: 'absolute',
    top: s(120),
    left: s(122),
    width: s(190),
    height: s(32),
  },
  gradeBox: {
    position: 'absolute',
    top: s(158),
    left: s(120),
    width: s(240),
    height: s(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeChemistryText: {
    width: s(165),
    height: s(20),
  },
  meteor: {
    position: 'absolute',
    top: s(195),
    left: s(-5),
    width: s(165),
    height: s(115),
    zIndex: 10,
  },
  memberBox: {
    position: 'absolute',
    top: s(360),
    alignSelf: 'center',
    width: s(380),
    height: s(365),
    zIndex: 5,
  },
  teamMemTitle: {
    position: 'absolute',
    top: s(12),
    alignSelf: 'center',
    width: s(190),
    height: s(26),
  },
  lineDivider: {
    position: 'absolute',
    top: s(48),
    alignSelf: 'center',
    width: s(340),
    height: s(4),
  },
  searchBar: {
    position: 'absolute',
    top: s(64),
    alignSelf: 'center',
    width: s(320),
    height: s(34),
  },
  membersSelectedText: {
    position: 'absolute',
    top: s(106),
    left: s(25),
    width: s(200),
    height: s(18),
  },
  memberRow: {
    position: 'absolute',
    alignSelf: 'center',
    width: s(315),
    height: s(36),
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCard: {
    width: '100%',
    height: '100%',
  },
  crossButton: {
    position: 'absolute',
    right: s(12),
    top: s(7),
  },
  crossIcon: {
    width: s(22),
    height: s(22),
  },
  bigEarth: {
    position: 'absolute',
    top: s(730),
    left: s(-60),
    width: s(600),
    height: s(250),
    zIndex: 3,
  },
  makeTeamButton: {
    position: 'absolute',
    top: s(740),
    alignSelf: 'center',
    width: s(145),
    height: s(38),
    zIndex: 15,
  },
  makeTeamImage: {
    width: '100%',
    height: '100%',
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

export default CreateTeamPage;
