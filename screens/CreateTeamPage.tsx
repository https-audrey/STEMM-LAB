import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { queryDocuments, where, addDocument } from '../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'CreateTeam'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const generateTeamCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '#';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const CreateTeamPage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  
  const [teamName, setTeamName] = useState('');
  const [grade, setGrade] = useState('');
  const [teamCode] = useState(generateTeamCode());
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setTeamMembers([{ ...profile, id: profile.uid, isYou: true }]);
    }
  }, [profile]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // Find user by username or fullname
      const results = await queryDocuments('users', [
        where('displayUsername', '==', searchQuery.trim())
      ]);
      
      if (results.length > 0) {
        const userFound = results[0];
        if (teamMembers.find(m => m.id === userFound.id)) {
          Alert.alert('Information', 'User is already in the team.');
          return;
        }
        setTeamMembers([...teamMembers, { ...userFound }]);
        setSearchQuery('');
      } else {
        Alert.alert('Not Found', 'Could not find a user with that name.');
      }
    } catch (error) {
      console.error('[Search] Error:', error);
      Alert.alert('Error', 'An error occurred during search.');
    }
  };

  const handleRemoveMember = (uid: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== uid));
  };

  const handleMakeTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Required', 'Please enter a team name.');
      return;
    }
    if (!grade.trim()) {
      Alert.alert('Required', 'Please enter your grade.');
      return;
    }
    
    try {
      await addDocument('teams', {
        name: teamName,
        grade: grade,
        code: teamCode,
        memberIds: teamMembers.map(m => m.id),
        creatorId: profile?.uid,
        createdAt: new Date(),
      });
      navigation.navigate('TeamPageChem');
    } catch (error) {
      console.error('[CreateTeam] Error:', error);
      Alert.alert('Error', 'Failed to create team. Please try again.');
    }
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
            style={styles.nameBoxTeamContainer}
            resizeMode="stretch"
          >
            <TextInput
              style={styles.teamNameInput}
              placeholder="enter your team name"
              placeholderTextColor={COLORS.placeholderText}
              value={teamName}
              onChangeText={setTeamName}
            />

            <ImageBackground
              source={require('../assets/CreateTeamAssets/teamCode.png')}
              style={styles.teamCodeImage}
              resizeMode="contain"
            >
              <Text style={styles.teamCodeText}>{teamCode}</Text>
            </ImageBackground>
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
            style={styles.gradeBoxContainer}
            resizeMode="stretch"
          >
            <TextInput
              style={styles.gradeInput}
              placeholder="enter your grade here"
              placeholderTextColor={COLORS.placeholderText}
              value={grade}
              onChangeText={setGrade}
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
          <View style={styles.searchBarContainer}>
            <Image
              source={require('../assets/CreateTeamAssets/searchBar.png')}
              style={styles.searchBarBg}
              resizeMode="stretch"
            />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search user name..."
              placeholderTextColor={COLORS.placeholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchIconContainer}>
              <View style={styles.searchIconPlaceholder} />
            </TouchableOpacity>
          </View>

          {/* Writing: X Members Selected */}
          <Text style={styles.membersSelectedText}>
            {teamMembers.length} Members Selected
          </Text>

          {/* Render Members List */}
          <View style={styles.membersContainer}>
            {teamMembers.map((member, index) => (
              <View key={member.id} style={[styles.memberRow, { top: s(index * 46 + 130) }]}>
                <ImageBackground
                  source={require('../assets/CreateTeamAssets/nameBoxTeamMem.png')}
                  style={styles.memberCard}
                  resizeMode="stretch"
                >
                  <View style={styles.memberContent}>
                    {/* Number box on the left */}
                    <View style={styles.numberBox}>
                      <Text style={styles.numberText}>{index + 1}</Text>
                    </View>
                    
                    {/* User Name */}
                    <Text style={styles.memberNameText}>
                      {member.displayUsername || member.username} {member.isYou ? '(you)' : ''}
                    </Text>

                    {/* Remove button for others */}
                    {!member.isYou && (
                      <TouchableOpacity 
                        style={styles.crossButton} 
                        activeOpacity={0.7}
                        onPress={() => handleRemoveMember(member.id)}
                      >
                        <Image
                          source={require('../assets/CreateTeamAssets/cross.png')}
                          style={styles.crossIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </ImageBackground>
              </View>
            ))}
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
    top: s(-30),
    left: s(210),
    width: s(170),
    height: s(175),
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
    top: s(38),
    left: s(20),
    width: s(230),
    height: s(37),
    zIndex: 2,
  },
  nameBoxTeamContainer: {
    position: 'absolute',
    top: s(82),
    left: s(40),
    width: s(315),
    height: s(42),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  teamNameInput: {
    flex: 1,
    height: s(40),
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: COLORS.darkText,
    paddingHorizontal: s(10),
  },
  teamCodeText: {
    fontFamily: FONTS.ui,
    fontSize: s(14),
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop: s(4),
  },
  teamCodeImage: {
    width: s(85),
    height: s(28),
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  gradeTitle: {
    position: 'absolute',
    top: s(145),
    left: s(122),
    width: s(190),
    height: s(37),
  },
  gradeBoxContainer: {
    position: 'absolute',
    top: s(188),
    left: s(120),
    width: s(240),
    height: s(42),
    justifyContent: 'center',
    paddingHorizontal: s(10),
  },
  gradeInput: {
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: COLORS.darkText,
    textAlign: 'center',
  },
  searchBarContainer: {
    position: 'absolute',
    top: s(84),
    alignSelf: 'center',
    width: s(320),
    height: s(34),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  searchTextInput: {
    flex: 1,
    height: '100%',
    paddingLeft: s(15),
    fontFamily: FONTS.ui,
    fontSize: s(14),
    color: COLORS.darkText,
  },
  searchIconContainer: {
    width: s(40),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconPlaceholder: {
    width: s(20),
    height: s(20),
  },
  membersSelectedText: {
    position: 'absolute',
    top: s(130),
    left: s(40),
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: COLORS.darkText,
  },
  membersContainer: {
    marginTop: s(160),
    width: '100%',
    alignItems: 'center',
  },
  memberRow: {
    position: 'absolute',
    alignSelf: 'center',
    width: s(330),
    height: s(40),
    flexDirection: 'row',
    alignItems: 'center',
    left: s(25),
  },
  memberCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
  },
  numberBox: {
    width: s(28),
    height: s(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  numberText: {
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: COLORS.darkText,
    fontWeight: 'bold',
  },
  memberNameText: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: COLORS.darkText,
  },
  crossButton: {
    padding: s(5),
  },
  crossIcon: {
    width: s(22),
    height: s(22),
  },
  meteor: {
    position: 'absolute',
    top: s(195),
    left: s(0),
    width: s(175),
    height: s(125),
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
    top: s(18),
    alignSelf: 'center',
    width: s(200),
    height: s(36),
  },
  lineDivider: {
    position: 'absolute',
    top: s(68),
    alignSelf: 'center',
    width: s(340),
    height: s(2),
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
