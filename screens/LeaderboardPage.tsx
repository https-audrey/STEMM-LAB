import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FONTS, COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { getAllDocuments, queryDocuments, where, limit, orderBy } from '../services/firestoreService';

type Nav = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

const { width: SCREEN_W } = Dimensions.get('window');
const DESIGN_W = 440;
const SCALE = SCREEN_W / DESIGN_W;
const s = (v: number) => v * SCALE;

const LeaderboardPage: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [tabMode, setTabMode] = useState<'individual' | 'team'>('team'); // Defaulting to team for this feature
  const [teams, setTeams] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all teams
        const allTeams = await getAllDocuments('teams');
        // Sort by points desc (handling missing points with 0)
        const sortedTeams = allTeams.sort((a, b) => (b.points || 0) - (a.points || 0));
        setTeams(sortedTeams);

        // Find user's team
        if (user) {
          const uTeam = sortedTeams.find(t => t.memberIds && t.memberIds.includes(user.uid));
          if (uTeam) {
            setUserTeam({
              ...uTeam,
              rank: sortedTeams.indexOf(uTeam) + 1
            });
          }
        }
      } catch (error) {
        console.error('[Leaderboard] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

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
            {/* <Image
              source={
                tabMode === 'individual'
                  ? require('../assets/LeaderboardAssets/individu1.png')
                  : require('../assets/LeaderboardAssets/individu2.png')
              }
              style={styles.tabButton}
              resizeMode="contain"
            /> */}
          </TouchableOpacity>

          {/* Team Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTabMode('team')}
          >
            {/* <Image
              source={
                tabMode === 'individual'
                  ? require('../assets/LeaderboardAssets/team1.png')
                  : require('../assets/LeaderboardAssets/team2.png')
              }
              style={styles.tabButton}
              resizeMode="contain"
            /> */}
          </TouchableOpacity>
        </View>

        {/* Leaderboard Card Box */}
        <ImageBackground
          source={require('../assets/LeaderboardAssets/leaderboardBox.png')}
          style={styles.leaderboardBox}
          resizeMode="stretch"
        >
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: s(100) }} />
          ) : (
            <ScrollView 
              style={styles.scrollArea} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {teams.map((item, index) => (
                <ImageBackground
                  key={item.id}
                  source={require('../assets/LeaderboardAssets/teamLeaderboardBox.png')}
                  style={styles.teamRow}
                  resizeMode="stretch"
                >
                  <View style={styles.rankCircle}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.teamNameLabel} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.teamScoreLabel}>
                    {item.points || 0}
                  </Text>
                </ImageBackground>
              ))}
            </ScrollView>
          )}

          {/* Scrollbar on the right */}
          <Image
            source={require('../assets/LeaderboardAssets/scrollBar.png')}
            style={styles.scrollBar}
            resizeMode="contain"
          />
        </ImageBackground>

        {/* User Summary Bar (at the bottom of the list) */}
        {userTeam && (
          <View style={styles.userSummaryFooter}>
             <View style={styles.footerRank}>
                <Text style={styles.footerTextSmall}>RANK</Text>
                <Text style={styles.footerTextLarge}>#{userTeam.rank}</Text>
             </View>
             <View style={styles.footerName}>
                <Text style={styles.footerTextSmall}>TEAM NAME</Text>
                <Text style={styles.footerTextLarge} numberOfLines={1}>{userTeam.name}</Text>
             </View>
             <View style={styles.footerPoints}>
                <Text style={styles.footerTextSmall}>POINTS</Text>
                <Text style={styles.footerTextLarge}>{userTeam.points || 0}</Text>
             </View>
          </View>
        )}

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
  weeklyProgress: {
    position: 'absolute',
    top: s(100),
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
    top: s(245),
    alignSelf: 'center',
    width: s(376),
    height: s(480),
    zIndex: 10,
    paddingTop: s(60),
    paddingHorizontal: s(20),
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: s(20),
  },
  teamRow: {
    width: s(325),
    height: s(50),
    alignSelf: 'center',
    marginBottom: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
  },
  rankCircle: {
     width: s(25),
     height: s(25),
     justifyContent: 'center',
     alignItems: 'center',
  },
  rankText: {
    fontFamily: FONTS.ui,
    fontSize: s(14),
    color: COLORS.darkText,
    fontWeight: 'bold',
  },
  teamNameLabel: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: s(14),
    color: '#ffffff',
    marginLeft: s(15),
  },
  teamScoreLabel: {
    fontFamily: FONTS.ui,
    fontSize: s(16),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollBar: {
    position: 'absolute',
    right: s(7),
    top: s(170),
    width: s(5),
    height: s(59),
  },
  userSummaryFooter: {
    position: 'absolute',
    top: s(735),
    alignSelf: 'center',
    width: s(360),
    height: s(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    zIndex: 15,
  },
  footerRank: { alignItems: 'center' },
  footerName: { alignItems: 'center', flex: 1, marginHorizontal: s(10) },
  footerPoints: { alignItems: 'center' },
  footerTextSmall: {
     fontFamily: FONTS.ui,
     fontSize: s(10),
     color: '#8ab4f8',
  },
  footerTextLarge: {
     fontFamily: FONTS.ui,
     fontSize: s(16),
     color: '#ffffff',
     fontWeight: 'bold',
  },
  pointsText: {
    position: 'absolute',
    top: s(775),
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

export default LeaderboardPage;
