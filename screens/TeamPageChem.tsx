import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { queryDocuments, where, limit, orderBy, arrayUnion, updateDocument } from '../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'TeamPageChem'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const TeamPageChem: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user) return;
      try {
        const teams = await queryDocuments('teams', [
          where('memberIds', 'array-contains', user.uid)
        ]);
        if (teams.length > 0) {
          // Sort in memory to avoid needing a Firestore composite index
          const sorted = teams.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setTeamData(sorted[0]);
        }
      } catch (error) {
        console.error('[TeamPage] Error fetching team:', error);
      }
    };
    fetchTeam();
  }, [user]);

  const getWeekRange = (createdAt: any) => {
    if (!createdAt) return 'Loading...';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    
    // Set to Monday
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    // Set to Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const startDay = startOfWeek.getDate();
    const startMonth = months[startOfWeek.getMonth()];
    const endDay = endOfWeek.getDate();
    const endMonth = months[endOfWeek.getMonth()];
    const year = endOfWeek.getFullYear();

    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  };

  const handleCreateTeam = () => {
    navigation.navigate('CreateTeam');
  };

  const handleJoinTeam = async () => {
    if (!code.trim()) {
      Alert.alert('Empty Code', 'Please enter a team code to join.');
      return;
    }

    try {
      const teams = await queryDocuments('teams', [
        where('code', '==', code.trim().toUpperCase())
      ]);

      if (teams.length > 0) {
        const team = teams[0];
        if (user) {
          await updateDocument('teams', team.id, {
            memberIds: arrayUnion(user.uid)
          });
          Alert.alert('Success', `You have joined the team: ${team.name}`);
          // Refresh the page data
          const updatedTeams = await queryDocuments('teams', [
            where('memberIds', 'array-contains', user.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
          ]);
          if (updatedTeams.length > 0) {
            setTeamData(updatedTeams[0]);
          }
          setCode('');
        }
      } else {
        Alert.alert('Invalid Code', 'The code you entered does not match any team.');
      }
    } catch (error) {
      console.error('[JoinTeam] Error:', error);
      Alert.alert('Error', 'Failed to join team. Please try again.');
    }
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
          {/* Team Name Title and Arrow */}
          <View style={styles.topHeaderRow}>
            <ImageBackground
              source={require('../assets/TeamPageChemAssets/title.png')}
              style={styles.gradeTitleContainer}
              resizeMode="contain"
            >
              <Text style={styles.gradeTitleText}>
                {teamData?.name || 'Loading...'}
              </Text>
            </ImageBackground>
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
            <View style={styles.weekTextContainer}>
              <Text style={styles.weekTextContent}>
                {getWeekRange(teamData?.createdAt)}
              </Text>
            </View>

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
    top: s(100),
    alignSelf: 'center',
    width: s(380),
    height: s(160),
    padding: s(15),
    zIndex: 10,
  },
  boxTopBg: {
    position: 'absolute',
    top: s(99),
    alignSelf: 'center',
    width: s(383),
    height: s(162),
    zIndex: 9,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeTitleContainer: {
    width: s(220),
    height: s(35),
    top: s(0),
    left: s(-15),
    justifyContent: 'center',
    paddingLeft: s(15),
  },
  gradeTitleText: {
    fontFamily: FONTS.ui,
    fontSize: s(13),
    color: '#08121e',
    top: s(1)
  },
  arrowButton: {
    width: s(25),
    height: s(25),
    marginLeft: s(-20),
    top: s(0)
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
    top: s(8)
  },
  percentIndicator: {
    width: s(50),
    height: s(25),
    top: s(8)
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
    bottom: s(-7),
    width: s(90),
    height: s(60),
  },
  act2Planet: {
    position: 'absolute',
    left: s(170),
    bottom: s(3),
    width: s(72),
    height: s(72),
  },
  act3Planet: {
    position: 'absolute',
    left: s(280),
    bottom: s(3),
    width: s(72),
    height: s(72),
  },
  analysisBox: {
    position: 'absolute',
    top: s(295),
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
    marginTop: s(23),
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
  weekTextContainer: {
    width: s(170),
    height: s(20),
    top: s(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekTextContent: {
    fontFamily: FONTS.ui,
    fontSize: s(11),
    color: '#08121e',
  },
  createButton: {
    position: 'absolute',
    top: s(605),
    left: s(40),
    width: s(210),
    height: s(50),
    zIndex: 10,
  },
  inputRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: s(665),
    left: s(40),
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
    top: s(585),
    right: s(-5),
    width: s(250),
    height: s(250),
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

export default TeamPageChem;
