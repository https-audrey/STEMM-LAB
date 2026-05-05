import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FONTS, COLORS } from '../utils/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const SCALE = SCREEN_W / 440;
const s = (v: number) => v * SCALE;

// Subject tabs config
const subjectTabs = [
  { id: 'physics', label: 'Physics', src: require('../assets/vector-82.png'), left: s(38), textLeft: s(43) },
  { id: 'biology', label: 'Biology', src: require('../assets/vector-83.png'), left: s(132), textLeft: s(136), textWhite: true },
  { id: 'chemistry', label: 'Chemistry', src: require('../assets/vector-84.png'), left: s(226), textLeft: s(235), textWhite: true },
  { id: 'mathematics', label: 'Mathematics', src: require('../assets/vector-85.png'), left: s(320), textLeft: s(327), textWhite: true },
];

// Level labels
const levelLabels = [
  { id: 'level-1', label: 'Level 1', top: s(779), left: s(93) },
  { id: 'level-2', label: 'Level 2', top: s(744), left: s(265) },
  { id: 'level-3', label: 'Level 3', top: s(650), left: s(154) },
  { id: 'level-4', label: 'Level 4', top: s(531), left: s(58) },
  { id: 'level-5', label: 'Level 5', top: s(628), left: s(302) },
  { id: 'level-6', label: 'Level 6', top: s(454), left: s(245) },
];

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../assets/download-1-1.png')}
        style={styles.background}
        resizeMode="cover"
      />



      {/* Level map background */}
      <Image source={require('../assets/vector-31.png')} style={styles.levelMapBg} resizeMode="contain" />

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavBg} />

        {/* Home */}
        <TouchableOpacity style={styles.navHome} activeOpacity={0.7}>
          <Image source={require('../assets/group-22.png')} style={{ width: s(91), height: s(76) }} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Team */}
        <TouchableOpacity style={styles.navTeam} activeOpacity={0.7}>
          <Image source={require('../assets/group-16.png')} style={{ width: s(82), height: s(70) }} resizeMode="contain" />
          <Text style={[styles.navLabel, { marginTop: s(-14) }]}>Team</Text>
        </TouchableOpacity>

        {/* Levels */}
        <TouchableOpacity style={styles.navLevels} activeOpacity={0.7}>
          <Image source={require('../assets/planet-1.png')} style={{ width: s(63), height: s(57) }} resizeMode="contain" />
          <Text style={styles.navLabel}>Levels</Text>
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity style={styles.navLeaderboard} activeOpacity={0.7}>
          <Image source={require('../assets/group-11.png')} style={{ width: s(82), height: s(73) }} resizeMode="contain" />
          <Text style={[styles.navLabelSmall, { marginTop: s(-16) }]}>Leaderboard</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity style={styles.navProfile} activeOpacity={0.7}>
          <Image source={require('../assets/group-21.png')} style={{ width: s(64), height: s(71) }} resizeMode="contain" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Level map path decorations */}
      <Image source={require('../assets/vector-9.png')} style={{ position: 'absolute', top: s(480), left: s(156), width: s(141), height: s(68) }} resizeMode="contain" />
      <Image source={require('../assets/vector-6.png')} style={{ position: 'absolute', top: s(712), left: s(168), width: s(73), height: s(21) }} resizeMode="contain" />
      <Image source={require('../assets/vector-8.png')} style={{ position: 'absolute', top: s(533), left: s(124), width: s(18), height: s(33) }} resizeMode="contain" />
      <Image source={require('../assets/vector-7.png')} style={{ position: 'absolute', top: s(631), left: s(214), width: s(57), height: s(27) }} resizeMode="contain" />
      <Image source={require('../assets/vector-10.png')} style={{ position: 'absolute', top: s(469), left: s(318), width: s(24), height: s(68) }} resizeMode="contain" />

      {/* Level node: Planet 2 */}
      <Image source={require('../assets/planet-2.png')} style={{ position: 'absolute', top: s(656), left: s(249), width: s(88), height: s(85) }} resizeMode="contain" />

      {/* Level node: Planet 1 */}
      <Image source={require('../assets/planet-1.png')} style={{ position: 'absolute', top: s(688), left: s(77), width: s(87), height: s(85) }} resizeMode="contain" />

      {/* Level node: Planet 3 */}
      <Image source={require('../assets/planet-3.png')} style={{ position: 'absolute', top: s(560), left: s(133), width: s(89), height: s(84) }} resizeMode="contain" />

      {/* Level node: Planet 5 */}
      <Image source={require('../assets/planet-5.png')} style={{ position: 'absolute', top: s(547), left: s(291), width: s(77), height: s(74) }} resizeMode="contain" />

      {/* Level node: Planet 4 */}
      <Image source={require('../assets/planet-4.png')} style={{ position: 'absolute', top: s(445), left: s(67), width: s(80), height: s(80) }} resizeMode="contain" />

      {/* Level node: Planet 6 */}
      <Image source={require('../assets/planet-6.png')} style={{ position: 'absolute', top: s(375), left: s(283), width: s(89), height: s(84) }} resizeMode="contain" />

      {/* Level labels */}
      {levelLabels.map((item) => (
        <Text key={item.id} style={[styles.levelLabel, { top: item.top, left: item.left }]}>
          {item.label}
        </Text>
      ))}

      {/* Subject tabs */}
      {subjectTabs.map((tab) => (
        <View key={tab.id}>
          <TouchableOpacity
            style={[styles.subjectTab, { left: tab.left }]}
            activeOpacity={0.7}
          >
            <Image source={tab.src} style={styles.subjectTabImg} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.subjectTabText, { left: tab.textLeft }, tab.textWhite && { color: COLORS.white }]}>
            {tab.label}
          </Text>
        </View>
      ))}

      {/* Grade banner backgrounds */}
      <Image source={require('../assets/vector-86.png')} style={{ position: 'absolute', top: s(369), left: s(33), width: s(371), height: s(52) }} resizeMode="contain" />
      <Image source={require('../assets/vector-92.png')} style={{ position: 'absolute', top: s(370), left: s(34), width: s(369), height: s(50) }} resizeMode="contain" />

      {/* Grade title */}
      <Text style={styles.gradeTitle}>Grade 8 - Physics</Text>

      {/* Level map outline */}
      <Image source={require('../assets/vector-91.png')} style={{ position: 'absolute', top: s(370), left: s(34), width: s(372), height: s(436) }} resizeMode="contain" />

      {/* Header bar backgrounds */}
      <Image source={require('../assets/vector-88.png')} style={{ position: 'absolute', top: s(64), left: s(28), width: s(309), height: s(49) }} resizeMode="contain" />
      <Image source={require('../assets/vector-89.png')} style={{ position: 'absolute', top: s(65), left: s(29), width: s(307), height: s(47) }} resizeMode="contain" />

      {/* Greeting */}
      <Text style={styles.hiText}>Hi!</Text>
      <Text style={styles.nameText}>Alexander Isla</Text>

      {/* Profile card background */}
      <Image source={require('../assets/vector-87.png')} style={{ position: 'absolute', top: s(119), left: s(34), width: s(372), height: s(171) }} resizeMode="contain" />
      <Image source={require('../assets/vector-90.png')} style={{ position: 'absolute', top: s(120), left: s(35), width: s(370), height: s(169) }} resizeMode="contain" />

      {/* Astronaut */}
      <Image
        source={require('../assets/image-8.png')}
        style={styles.astronaut}
        resizeMode="cover"
      />

      {/* Bottom indicator bar */}
      <View style={styles.bottomBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(440),
    height: s(956),
  },

  levelMapBg: {
    position: 'absolute',
    top: s(369),
    left: s(33),
    width: s(374),
    height: s(438),
  },
  bottomNav: {
    position: 'absolute',
    top: s(831),
    left: s(-4),
    width: s(448),
    height: s(126),
  },
  bottomNavBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: s(448),
    height: s(126),
    backgroundColor: COLORS.navBg,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderColor: COLORS.white,
  },
  navHome: {
    position: 'absolute',
    top: s(18),
    left: s(15),
    alignItems: 'center',
  },
  navTeam: {
    position: 'absolute',
    top: s(22),
    left: s(109),
    alignItems: 'center',
  },
  navLevels: {
    position: 'absolute',
    top: s(19),
    left: s(203),
    alignItems: 'center',
  },
  navLeaderboard: {
    position: 'absolute',
    top: s(21),
    left: s(279),
    alignItems: 'center',
  },
  navProfile: {
    position: 'absolute',
    top: s(13),
    left: s(369),
    alignItems: 'center',
  },
  navLabel: {
    fontFamily: FONTS.ui,
    fontSize: s(12),
    color: COLORS.white,
    letterSpacing: s(2.64),
    marginTop: s(2),
  },
  navLabelSmall: {
    fontFamily: FONTS.ui,
    fontSize: s(7),
    color: COLORS.white,
    letterSpacing: s(1.54),
  },
  levelLabel: {
    position: 'absolute',
    fontFamily: FONTS.ui,
    fontSize: s(12),
    color: COLORS.white,
    letterSpacing: s(2.64),
  },
  subjectTab: {
    position: 'absolute',
    top: s(306),
    width: s(81),
    height: s(46),
  },
  subjectTabImg: {
    width: s(81),
    height: s(46),
  },
  subjectTabText: {
    position: 'absolute',
    top: s(313),
    fontFamily: FONTS.ui,
    fontSize: s(15),
    color: COLORS.darkText,
    letterSpacing: s(3.3),
  },
  gradeTitle: {
    position: 'absolute',
    top: s(385),
    left: s(97),
    fontFamily: FONTS.ui,
    fontSize: s(20),
    color: COLORS.darkText,
    letterSpacing: s(5.6),
  },
  hiText: {
    position: 'absolute',
    top: s(70),
    left: s(39),
    fontFamily: FONTS.title,
    fontSize: s(32),
    color: COLORS.darkText,
    letterSpacing: s(7.04),
  },
  nameText: {
    position: 'absolute',
    top: s(80),
    left: s(106),
    fontFamily: FONTS.title,
    fontSize: s(20),
    color: COLORS.darkText,
    letterSpacing: s(4.4),
  },
  astronaut: {
    position: 'absolute',
    top: s(23),
    left: s(318),
    width: s(105),
    height: s(105),
  },
  bottomBar: {
    position: 'absolute',
    top: s(939),
    left: s(117),
    width: s(206),
    height: s(8),
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
});

export default HomePage;
